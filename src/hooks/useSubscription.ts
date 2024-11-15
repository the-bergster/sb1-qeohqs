import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Subscription {
  id: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (userData?.subscription) {
          setSubscription({
            ...userData.subscription,
            currentPeriodEnd: userData.subscription.currentPeriodEnd.toDate()
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    isActive: subscription?.status === 'active',
    isPro: subscription?.priceId === 'price_pro_monthly',
    isIndividual: subscription?.priceId === 'price_individual_monthly',
    hasActiveSubscription: subscription?.status === 'active',
  };
}