import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { List, User, Menu, X } from 'lucide-react';
import SubscriptionStatus from './SubscriptionStatus';

export default function Navigation() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <img 
              src="https://media.ceros.com/ceros-master/images/2024/11/13/d1d9d84bd9bef7b3c611b8727c356b5f/prep-me.png"
              alt="Prep Me"
              className="h-8 cursor-pointer"
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
            />
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center ml-6 space-x-4">
              {!user && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-gray-600 hover:text-[#E86C1F] transition-colors"
                >
                  Pricing
                </button>
              )}
              {user && (
                <button
                  onClick={() => navigate('/my-preps')}
                  className={`nav-link ${location.pathname === '/my-preps' ? 'active' : ''}`}
                >
                  <List size={20} />
                  My Preps
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <SubscriptionStatus />
                <button
                  onClick={() => navigate('/profile')}
                  className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  <User size={20} />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-white text-[#E86C1F] border-2 border-[#E86C1F] rounded-lg px-6 py-2 hover:bg-[#E86C1F] hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-[#E86C1F] border-2 border-[#E86C1F] rounded-lg px-6 py-2 hover:bg-[#E86C1F] hover:text-white transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#E86C1F] transition-colors p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {!user && (
              <button
                onClick={() => {
                  navigate('/pricing');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#E86C1F] transition-colors"
              >
                Pricing
              </button>
            )}
            
            {user && (
              <>
                <button
                  onClick={() => {
                    navigate('/my-preps');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#E86C1F] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <List size={20} />
                    My Preps
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#E86C1F] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User size={20} />
                    Profile
                  </div>
                </button>

                <div className="px-4 py-2">
                  <SubscriptionStatus />
                </div>

                <div className="px-4">
                  <button
                    onClick={handleSignOut}
                    className="w-full md:w-auto text-[#E86C1F] border-2 border-[#E86C1F] rounded-lg py-2 hover:bg-[#E86C1F] hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="px-4">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full md:w-auto text-[#E86C1F] border-2 border-[#E86C1F] rounded-lg py-2 hover:bg-[#E86C1F] hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}