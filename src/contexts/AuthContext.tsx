import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DEMO_PROFILE } from '../lib/demoData';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dev mode mock user
const MOCK_USER = {
  uid: 'dev-123',
  email: 'bergymail+prep@gmail.com',
  displayName: 'Dev User',
  photoURL: 'https://via.placeholder.com/150'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDemoPrep = async () => {
      if (user) {
        try {
          // Add demo profile
          await addDoc(collection(db, 'preps'), {
            userId: user.uid,
            profileData: DEMO_PROFILE,
            createdAt: new Date().toISOString(),
            notes: '',
            lastUpdated: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error creating demo prep:', error);
        }
      }
    };

    if (user) {
      initializeDemoPrep();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    setUser(MOCK_USER);
    toast.success('Signed in as dev user');
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (email === 'bergymail+prep@gmail.com' && password === '12345678') {
      setUser(MOCK_USER);
      toast.success('Signed in as dev user');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const createAccount = async () => {
    toast.error('Account creation disabled in dev mode');
  };

  const signOut = async () => {
    setUser(null);
    toast.success('Signed out');
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail, 
    createAccount,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}