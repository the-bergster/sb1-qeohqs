import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t h-[200px] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-[90px]">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="https://media.ceros.com/ceros-master/images/2024/11/13/d1d9d84bd9bef7b3c611b8727c356b5f/prep-me.png"
              alt="Prep Me"
              className="h-6 mb-2"
            />
            <p className="text-gray-600 text-sm mb-2">
              Prep Me helps you prepare for important meetings by analyzing<br />
              LinkedIn profiles and providing personalized insights.
            </p>
            <div className="flex space-x-3">
              <a href="mailto:support@prepme.com" className="text-gray-400 hover:text-[#E86C1F]">
                <Mail size={18} />
              </a>
              <a href="https://twitter.com/prepme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E86C1F]">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com/company/prepme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E86C1F]">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/prepme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E86C1F]">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Product
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Features
                </Link>
              </li>
              <li>
                <a href="https://docs.prepme.com" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
              Legal
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-gray-600 hover:text-[#E86C1F]">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-gray-400 text-xs text-center">
            © {currentYear} Prep Me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}