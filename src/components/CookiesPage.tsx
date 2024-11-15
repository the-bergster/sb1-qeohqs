import React from 'react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-varela text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
          <p className="mb-4">
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and understand how you use our service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
          <p className="mb-4">
            These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
          <p className="mb-4">
            We use analytics cookies to understand how visitors interact with our website, helping us improve our service.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Functionality Cookies</h3>
          <p className="mb-4">
            These cookies enable enhanced functionality and personalization, such as remembering your preferences.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
          <p className="mb-4">
            We use services from these third parties that may set cookies:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Google Analytics (analytics)</li>
            <li>Stripe (payment processing)</li>
            <li>Firebase (authentication)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
          <p className="mb-4">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookie Consent</h2>
          <p className="mb-4">
            When you first visit our website, we'll ask for your consent to set cookies. You can change your preferences at any time.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time. We encourage you to periodically review this page for the latest information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies, please email us at privacy@prepme.com.
          </p>
        </div>
      </div>
    </div>
  );
}