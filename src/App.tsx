import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import SearchPage from './components/SearchPage';
import ProfileAnalysis from './components/ProfileAnalysis';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import MyPrepsPage from './components/MyPrepsPage';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import WebhookTest from './components/WebhookTest';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import CookiesPage from './components/CookiesPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/webhook-test" element={<WebhookTest />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route 
                path="/search" 
                element={
                  <PrivateRoute>
                    <SearchPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/analysis" 
                element={
                  <PrivateRoute>
                    <ProfileAnalysis />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-preps" 
                element={
                  <PrivateRoute>
                    <MyPrepsPage />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="bottom-left"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}