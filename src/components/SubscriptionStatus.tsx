import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { Crown, Loader } from 'lucide-react';
import { createCheckoutSession, STRIPE_PRICES } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SubscriptionStatus() {
  const { subscription, loading, isActive, isPro } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.email) {
      toast.error('Please update your email address before upgrading');
      return;
    }

    try {
      setIsUpgrading(true);
      const loadingToast = toast.loading('Preparing upgrade process...');

      const priceId = !subscription || !isActive ? 
        STRIPE_PRICES.INDIVIDUAL : 
        STRIPE_PRICES.PRO;

      await createCheckoutSession(priceId, user.email);
      toast.success('Redirecting to checkout...');
      toast.dismiss(loadingToast);
    } catch (error: any) {
      console.error('Error starting upgrade:', error);
      toast.error(error.message || 'Failed to start upgrade process');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 px-4 py-2">
        <Loader className="animate-spin" size={20} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!subscription || !isActive) {
    return (
      <button
        onClick={handleUpgrade}
        disabled={isUpgrading}
        className="w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
      >
        {isUpgrading ? (
          <>
            <Loader className="animate-spin inline-block mr-2" size={20} />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Crown size={20} className="inline-block mr-2" />
            <span>Upgrade Now</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="w-full text-center text-green-600 bg-green-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
        <Crown size={20} />
        <span>{isPro ? 'Pro Plan' : 'Individual Plan'}</span>
      </div>
      {!isPro && (
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full text-center text-orange-600 hover:text-orange-700 underline flex items-center justify-center gap-1"
        >
          {isUpgrading ? (
            <>
              <Loader className="animate-spin" size={16} />
              <span>Processing...</span>
            </>
          ) : (
            'Upgrade to Pro'
          )}
        </button>
      )}
    </div>
  );
}