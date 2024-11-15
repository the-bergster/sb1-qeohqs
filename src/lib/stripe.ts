import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export const STRIPE_PRICES = {
  INDIVIDUAL: import.meta.env.VITE_STRIPE_PRICE_INDIVIDUAL,
  PRO: import.meta.env.VITE_STRIPE_PRICE_PRO
};

let stripePromise: Promise<any>;
export const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLIC_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId: string, userEmail: string) => {
  try {
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userEmail,
        successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { id: sessionId } = await response.json();
    
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};