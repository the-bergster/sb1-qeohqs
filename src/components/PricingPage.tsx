import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession, STRIPE_PRICES } from '../lib/stripe';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      // Store the selected plan in session storage
      sessionStorage.setItem('selectedPlan', plan.priceId || '');
      navigate('/login');
      return;
    }

    if (!plan.priceId) {
      // Handle free plan signup
      navigate('/search');
      return;
    }

    try {
      setLoading(plan.name);
      console.log('Starting checkout process...', {
        priceId: plan.priceId,
        userId: user.uid,
        stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY // Debug only
      });
      
      const result = await createCheckoutSession(plan.priceId, user.uid);
      console.log('Checkout session created:', result);
      
      toast.success('Redirecting to checkout...');
    } catch (error: any) {
      console.error('Error starting upgrade:', error);
      toast.error(error.message || 'Failed to start upgrade process');
    } finally {
      setLoading(null);
    }
  };

  // Rest of your component code remains the same...
  const plans = [
    {
      name: 'Free',
      price: '0',
      priceId: null,
      features: [
        { text: '1 full prep sheet per month', included: true },
        { text: 'Basic profile insights', included: true },
        { text: 'Limited conversation starters', included: true },
        { text: 'Voice assistant', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Team collaboration', included: false },
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Individual',
      price: '12.99',
      priceId: STRIPE_PRICES.INDIVIDUAL,
      features: [
        { text: '10 full prep sheets per month', included: true },
        { text: 'Comprehensive profile insights', included: true },
        { text: 'All conversation starters', included: true },
        { text: 'Voice assistant', included: false },
        { text: 'Advanced analytics', included: true },
        { text: 'Team collaboration', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Pro',
      price: '29.99',
      priceId: STRIPE_PRICES.PRO,
      features: [
        { text: '30 full prep sheets per month', included: true },
        { text: 'Comprehensive profile insights', included: true },
        { text: 'All conversation starters', included: true },
        { text: 'Voice assistant', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Team collaboration', included: true },
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-varela text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for you
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
              <p className="text-blue-800">
                Sign in to start your free trial
              </p>
            </div>
          )}
        </div>

        {/* Test Mode Notice */}
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <p className="text-sm text-yellow-700">
              🔔 Test Mode: Use card number <code className="bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</code> with any future date and CVC
            </p>
          </div>
        </div>

        {/* Debug Info - Only in development */}
        {import.meta.env.DEV && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-700">
                Debug: Stripe Key Available: {Boolean(import.meta.env.VITE_STRIPE_PUBLIC_KEY).toString()}
              </p>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                plan.popular ? 'border-[#E86C1F]' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#E86C1F] text-white px-4 py-1 rounded-bl-lg text-sm">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="text-green-500 mr-2" size={20} />
                      ) : (
                        <X className="text-gray-300 mr-2" size={20} />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 px-6 rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-[#E86C1F] text-white hover:bg-[#D65A0D]'
                      : 'border-2 border-[#E86C1F] text-[#E86C1F] hover:bg-[#E86C1F] hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-varela text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens when I reach my monthly prep limit?</h3>
              <p className="text-gray-600">You can purchase additional prep sheets or upgrade your plan at any time. Unused preps don't roll over to the next month.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What's included in the voice assistant feature?</h3>
              <p className="text-gray-600">The voice assistant helps you practice conversations and provides real-time feedback based on your prep sheet. It's exclusively available in the Pro plan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}