import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import toast from 'react-hot-toast';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { analyzeProfile } from '../lib/api';
import UpgradePrompt from './UpgradePrompt';

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkMonthlyLimit = async () => {
    if (!user) return false;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const prepsRef = collection(db, 'preps');
    const q = query(
      prepsRef,
      where('userId', '==', user.uid),
      where('createdAt', '>=', firstDayOfMonth.toISOString())
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl) {
      toast.error('Please enter a LinkedIn URL');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    // Check monthly limit for free users
    if (!hasActiveSubscription) {
      const monthlyCount = await checkMonthlyLimit();
      if (monthlyCount >= 1) {
        toast.error('Free plan limited to 1 analysis per month');
        return;
      }
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Analyzing profile...');

    try {
      const profileData = await analyzeProfile(linkedinUrl, user.uid);
      
      // Store the analysis in Firestore
      const prepDoc = await addDoc(collection(db, 'preps'), {
        userId: user.uid,
        linkedinUrl,
        profileName: profileData.personalInfo.name,
        analyzedAt: new Date().toISOString(),
        profileData
      });

      toast.success('Profile analyzed successfully!');
      navigate('/analysis', { 
        state: { 
          profileData,
          prepId: prepDoc.id
        } 
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to analyze profile. Please try again.');
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-varela text-gray-900 mb-4">
            Get ready for your meeting
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter a LinkedIn profile URL to get started
          </p>
          
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-6 py-4 text-lg rounded-lg border border-gray-200 focus:border-[#E86C1F] focus:ring-2 focus:ring-orange-100 outline-none transition-all pr-32"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bg-[#E86C1F] text-white px-6 py-2 rounded-md hover:bg-[#D65A0D] transition-colors disabled:bg-orange-300 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Prepping...
                  </>
                ) : (
                  'Prep Me!'
                )}
              </button>
            </div>
          </form>

          {!hasActiveSubscription && (
            <div className="mt-12">
              <UpgradePrompt
                title="Upgrade for Unlimited Access"
                description="Get unlimited profile analyses and advanced features with our paid plans."
                features={[
                  'Analyze up to 30 profiles per month',
                  'Access advanced insights and recommendations',
                  'Save and organize your prep sheets',
                  'Premium conversation starters'
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}