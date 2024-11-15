import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-varela text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Account information (name, email, profile picture)</li>
            <li>LinkedIn profile URLs you submit for analysis</li>
            <li>Usage data and analytics</li>
            <li>Payment information (processed securely by Stripe)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the collected information to:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Process your payments</li>
            <li>Send you updates and marketing communications</li>
            <li>Analyze and optimize our service</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
          <p className="mb-4">
            We use industry-standard security measures to protect your data. Your information is stored securely on Firebase and other trusted cloud providers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Service providers (payment processing, hosting)</li>
            <li>Analytics partners</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Access your personal data</li>
            <li>Request data correction or deletion</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4">
            For privacy-related questions, please contact our Data Protection Officer at privacy@prepme.com.
          </p>
        </div>
      </div>
    </div>
  );
}