import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import cors from 'cors';

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize CORS middleware
const corsHandler = cors({
  origin: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  maxAge: 86400 // 24 hours
});

export const createCheckoutSession = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { priceId, userId, successUrl, cancelUrl } = req.body;

      if (!priceId || !userId || !successUrl || !cancelUrl) {
        throw new Error('Missing required parameters');
      }

      // Get or create customer
      const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
      const userData = userSnapshot.data();
      
      let customerId = userData?.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: {
            firebaseUID: userId
          }
        });
        customerId = customer.id;
        
        // Save customer ID to user document
        await admin.firestore().collection('users').doc(userId).update({
          stripeCustomerId: customerId
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          firebaseUID: userId
        }
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(400).json({ 
        error: true,
        message: error.message || 'Failed to create checkout session'
      });
    }
  });
});

export const handleSubscriptionChange = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    const signature = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      if (event.type === 'customer.subscription.updated' || 
          event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUID = subscription.metadata.firebaseUID;

        if (firebaseUID) {
          await admin.firestore().collection('users').doc(firebaseUID).update({
            subscription: {
              id: subscription.id,
              status: subscription.status,
              priceId: subscription.items.data[0].price.id,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
          });
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(400).json({ 
        error: true,
        message: error.message || 'Failed to handle subscription change'
      });
    }
  });
});