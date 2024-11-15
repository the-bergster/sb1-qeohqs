import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Building, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import NotesEditor from './NotesEditor';

export const ProfileAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profileData, prepId } = location.state || {};
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!profileData || !user) {
      navigate('/search');
      return;
    }

    const loadNotes = async () => {
      if (prepId) {
        try {
          const prepDoc = await getDoc(doc(db, 'preps', prepId));
          if (prepDoc.exists()) {
            setNotes(prepDoc.data().notes || '');
          }
        } catch (error) {
          console.error('Error loading notes:', error);
          toast.error('Failed to load notes');
        }
      }
    };

    loadNotes();
  }, [profileData, user, navigate, prepId]);

  if (!user || !profileData) {
    return null;
  }

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-[#E86C1F] text-white'
          : 'text-gray-600 hover:bg-orange-50'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/my-preps')}
          className="flex items-center gap-2 text-[#E86C1F] hover:text-[#D65A0D]"
        >
          <ArrowLeft size={20} />
          Back to My Preps
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 border-b">
          <div className="flex items-center gap-6">
            {profileData?.personalInfo?.avatar && (
              <img 
                src={profileData.personalInfo.avatar}
                alt={profileData.personalInfo.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-varela text-gray-900">{profileData?.personalInfo.name}</h1>
              <p className="text-xl text-gray-600 mt-2">{profileData?.personalInfo.title}</p>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin size={18} />
                <span>{profileData?.personalInfo.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b px-8 py-4">
          <div className="flex gap-4 overflow-x-auto">
            <TabButton id="overview" label="Overview" icon={Briefcase} />
            <TabButton id="company" label="Company Intel" icon={Building} />
            <TabButton id="notes" label="Meeting Notes" icon={MessageCircle} />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Experience Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-varela flex items-center gap-2">
                  <Briefcase className="text-[#E86C1F]" />
                  Experience
                </h2>
                {profileData?.sections.careerHistory.map((experience, index) => (
                  <div key={index} className="border-l-2 border-[#E86C1F] pl-4">
                    <h3 className="font-semibold text-lg">{experience.title}</h3>
                    <p className="text-gray-600">{experience.period}</p>
                    <p className="text-gray-700 mt-2">{experience.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg">
                <h2 className="text-2xl font-varela flex items-center gap-2 mb-4">
                  <Building className="text-[#E86C1F]" />
                  Company Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {profileData?.sections?.companyInfo && Object.entries(profileData.sections.companyInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</h4>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-varela flex items-center gap-2">
                <MessageCircle className="text-[#E86C1F]" />
                Meeting Notes
              </h2>
              {prepId && (
                <NotesEditor 
                  prepId={prepId} 
                  initialContent={notes}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAnalysis;