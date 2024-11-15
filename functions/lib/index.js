"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubscriptionChange = exports.createCheckoutSession = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
admin.initializeApp();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
// Initialize CORS middleware
const corsHandler = (0, cors_1.default)({
    origin: true,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
    maxAge: 86400 // 24 hours
});
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            const { priceId, userId, successUrl, cancelUrl } = req.body;
            if (!priceId || !userId || !successUrl || !cancelUrl) {
                throw new Error('Missing required parameters');
            }
            // Get or create customer
            const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
            const userData = userSnapshot.data();
            let customerId = userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId;
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
        }
        catch (error) {
            console.error('Error:', error);
            res.status(400).json({
                error: true,
                message: error.message || 'Failed to create checkout session'
            });
        }
    });
});
exports.handleSubscriptionChange = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        const signature = req.headers['stripe-signature'];
        try {
            const event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
            if (event.type === 'customer.subscription.updated' ||
                event.type === 'customer.subscription.deleted') {
                const subscription = event.data.object;
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
        }
        catch (error) {
            console.error('Error:', error);
            res.status(400).json({
                error: true,
                message: error.message || 'Failed to handle subscription change'
            });
        }
    });
});
//# sourceMappingURL=index.js.map