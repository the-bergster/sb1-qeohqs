import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';

interface UpgradePromptProps {
  title: string;
  description: string;
  features?: string[];
}

export default function UpgradePrompt({ title, description, features }: UpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="text-[#E86C1F]" size={24} />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      {features && features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700">
              <span className="text-[#E86C1F]">•</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      
      <button
        onClick={() => navigate('/pricing')}
        className="w-full bg-[#E86C1F] text-white px-6 py-3 rounded-lg hover:bg-[#D65A0D] transition-colors flex items-center justify-center gap-2"
      >
        <Crown size={20} />
        Upgrade Now
      </button>
    </div>
  );
}