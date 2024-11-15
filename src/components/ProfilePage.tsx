import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Save, Building, MapPin, Briefcase, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProfileResponse } from '../types/profile';

interface UserProfile {
  name: string;
  email: string;
  linkedinProfile: string;
  photoURL: string;
  profileData?: ProfileResponse;
  lastAnalyzed?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          setLinkedinProfile(data.linkedinProfile || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const analyzeProfile = async (url: string) => {
    setAnalyzing(true);
    const loadingToast = toast.loading('Analyzing LinkedIn profile...');

    try {
      const response = await fetch('https://hook.us2.make.com/4325skng8mp66vl3hrjfj1xpsi68es8r', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze profile');
      }

      const data = await response.json();
      
      // Update user profile with the analyzed data
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, {
        profileData: data,
        lastAnalyzed: new Date().toISOString()
      });

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        profileData: data,
        lastAnalyzed: new Date().toISOString()
      } : null);

      toast.success('Profile analyzed successfully!');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze profile. Please try again.');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // If LinkedIn profile is new or has changed, analyze it
      if (linkedinProfile && (!profile?.linkedinProfile || profile.linkedinProfile !== linkedinProfile)) {
        await analyzeProfile(linkedinProfile);
      }

      await updateDoc(userRef, {
        linkedinProfile
      });

      setProfile(prev => prev ? {
        ...prev,
        linkedinProfile
      } : null);

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E86C1F]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        <h1 className="text-3xl font-varela text-gray-900 mb-8">Your Profile</h1>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {linkedinProfile ? (
              <img
                src={profile?.profileData?.personalInfo?.avatar || profile?.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = profile?.photoURL || '';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle size={64} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Your LinkedIn Profile URL</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={linkedinProfile}
                  onChange={(e) => setLinkedinProfile(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="input-primary"
                />
                <button
                  onClick={handleSave}
                  disabled={analyzing}
                  className="btn-primary whitespace-nowrap h-[42px]"
                >
                  <Save size={20} />
                  Save
                </button>
              </div>
            </label>
          </div>

          {profile?.profileData && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-2xl font-varela mb-6">LinkedIn Profile Analysis</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{profile.profileData.personalInfo.name}</h3>
                    <span className="text-sm text-gray-500">
                      Last analyzed: {new Date(profile.lastAnalyzed!).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase size={18} className="text-[#E86C1F]" />
                      <span>{profile.profileData.personalInfo.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} className="text-[#E86C1F]" />
                      <span>{profile.profileData.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={18} className="text-[#E86C1F]" />
                      <span>{profile.profileData.sections.companyInfo.name}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Industry</h4>
                    <p className="text-gray-600">{profile.profileData.sections.companyInfo.industry}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Company Size</h4>
                    <p className="text-gray-600">{profile.profileData.sections.companyInfo.size}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Personal Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.profileData.sections.personalInterests.map((interest: string, index: number) => (
                      <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-[#E86C1F] border border-[#E86C1F]">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}