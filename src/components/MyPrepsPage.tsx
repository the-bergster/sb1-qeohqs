import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ExternalLink, Trash2, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface PrepItem {
  id: string;
  linkedinUrl: string;
  profileName: string;
  analyzedAt: string;
  profileData: any;
}

export default function MyPrepsPage() {
  const [preps, setPreps] = useState<PrepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loadPreps = async () => {
      try {
        const prepsRef = collection(db, 'preps');
        const q = query(prepsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const loadedPreps: PrepItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedPreps.push({
            id: doc.id,
            linkedinUrl: data.linkedinUrl || '',
            profileName: data.profileData?.personalInfo?.name || 'Unknown',
            analyzedAt: data.analyzedAt || new Date().toISOString(),
            profileData: data.profileData || {}
          });
        });
        
        setPreps(loadedPreps.sort((a, b) => 
          new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
        ));
      } catch (error) {
        console.error('Error loading preps:', error);
        toast.error('Failed to load prep sheets');
      } finally {
        setLoading(false);
      }
    };

    loadPreps();
  }, [user, navigate]);

  const handleDelete = async (prepId: string) => {
    if (!window.confirm('Are you sure you want to delete this prep sheet?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'preps', prepId));
      toast.success('Prep sheet deleted successfully');
      setPreps(preps.filter(prep => prep.id !== prepId));
    } catch (error) {
      console.error('Error deleting prep:', error);
      toast.error('Failed to delete prep sheet');
    }
  };

  const handleOpenPrep = (prep: PrepItem) => {
    navigate('/analysis', { 
      state: { 
        profileData: prep.profileData,
        prepId: prep.id
      } 
    });
  };

  const filteredPreps = preps.filter(prep => 
    prep.profileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prep.linkedinUrl?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="animate-spin text-[#E86C1F]" size={24} />
          <span className="text-gray-600">Loading prep sheets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-varela text-gray-900">My Prep Sheets</h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search preps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:border-[#E86C1F] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {preps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't analyzed any profiles yet.</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 text-[#E86C1F] hover:text-[#D65A0D]"
            >
              Start analyzing profiles
            </button>
          </div>
        ) : filteredPreps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No prep sheets match your search.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#E86C1F] hover:text-[#D65A0D]"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPreps.map((prep) => (
              <div
                key={prep.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{prep.profileName}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Analyzed on {new Date(prep.analyzedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{prep.linkedinUrl}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenPrep(prep)}
                    className="flex items-center justify-center gap-2 bg-[#E86C1F] text-white px-4 py-2 rounded-md hover:bg-[#D65A0D] transition-colors min-w-[100px]"
                  >
                    <ExternalLink size={18} />
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(prep.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete prep sheet"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}