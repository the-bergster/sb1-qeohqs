import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-varela text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Prep Me ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Prep Me is a professional meeting preparation tool that analyzes LinkedIn profiles and provides insights to help users prepare for meetings.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            You must create an account to use certain features of the Service. You are responsible for maintaining the confidentiality of your account information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
          <p className="mb-4">
            Some features of the Service require a paid subscription. Payments are processed securely through Stripe. Subscriptions automatically renew unless cancelled.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Usage</h2>
          <p className="mb-4">
            We collect and analyze publicly available LinkedIn profile data. By using the Service, you confirm that you have the right to analyze the profiles you submit.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitations of Liability</h2>
          <p className="mb-4">
            The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Information</h2>
          <p className="mb-4">
            For questions about these terms, please contact us at support@prepme.com.
          </p>
        </div>
      </div>
    </div>
  );
}