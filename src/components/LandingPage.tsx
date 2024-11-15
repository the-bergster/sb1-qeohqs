import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function LandingPage() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const analyzeProfile = async (url: string) => {
    try {
      const response = await fetch('https://hook.us2.make.com/4325skng8mp66vl3hrjfj1xpsi68es8r', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          linkedinUrl: url,
          userId: user?.uid,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze profile');
      }

      const data = await response.json();
      
      if (!data || !data.personalInfo) {
        throw new Error('Invalid profile data received');
      }

      if (user) {
        await addDoc(collection(db, 'preps'), {
          userId: user.uid,
          linkedinUrl: url,
          profileName: data.personalInfo.name,
          analyzedAt: new Date().toISOString(),
          profileData: data
        });
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl) {
      toast.error('Please enter a LinkedIn URL');
      return;
    }

    if (!user) {
      sessionStorage.setItem('pendingLinkedinUrl', linkedinUrl);
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Login error:', error);
        return;
      }
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading('Analyzing profile...');

    try {
      const profileData = await analyzeProfile(linkedinUrl);
      toast.success('Profile analyzed successfully!');
      navigate('/analysis', { state: { profileData } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze profile. Please try again.');
    } finally {
      toast.dismiss(loadingToast);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-grow relative">
        {/* Main container with higher z-index */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 pt-40 pb-16 relative z-20">
          {/* Logo */}
          <img 
            src="https://media.ceros.com/ceros-master/images/2024/11/13/d1d9d84bd9bef7b3c611b8727c356b5f/prep-me.png"
            alt="Prep Me"
            className="w-48 mx-auto mb-8"
          />

          {/* Main Content */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="relative inline-block">
              <img 
                src="https://media.ceros.com/ceros-master/images/2024/11/13/df40ea6f1fcc92c4b353951045b317da/arrow.png"
                alt=""
                className="absolute -left-32 -top-8 w-24 transform rotate-[-15deg] hidden md:block"
              />
              <h1 className="text-3xl font-varela text-gray-900 mb-4">
                Get ready for your meeting.
              </h1>
            </div>
            <p className="text-gray-600 mb-8">
              Enter a LinkedIn profile URL to get started
            </p>

            <form onSubmit={handleSubmit} className="relative max-w-[500px] mx-auto mb-4 px-4 sm:px-0">
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                disabled={isAnalyzing}
                className="w-full px-6 py-4 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-32"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="absolute right-6 sm:right-2 top-2 bg-[#E86C1F] text-white px-6 py-2 rounded-md hover:bg-[#D65A0D] transition-colors disabled:bg-orange-300"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin" size={20} />
                    Prepping...
                  </span>
                ) : (
                  'Prep Me!'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Decorative Images Container - lower z-index */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Woman at desk */}
          <img 
            src="https://media.ceros.com/ceros-master/images/2024/11/13/d26d4d54dc45c351b48390cb2540b5eb/woman2.png"
            alt=""
            className="absolute left-16 top-[calc(50%+150px)] -translate-y-1/2 w-64 hidden md:block"
          />
          
          {/* Jumping woman */}
          <img 
            src="https://media.ceros.com/ceros-master/images/2024/11/13/dfef850a924424d46be9f545a7c6b6c6/woman.png"
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-48"
          />
          
          {/* Business man */}
          <img 
            src="https://media.ceros.com/ceros-master/images/2024/11/13/707657d7901acba0f372b0d9a11dbcfa/man.png"
            alt=""
            className="absolute right-16 top-1/2 -translate-y-1/2 w-32 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}