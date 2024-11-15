import React, { useState } from 'react';
import { Loader } from 'lucide-react';

export default function WebhookTest() {
  const [meetingId, setMeetingId] = useState('test');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const testWebhook = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch(`/.netlify/functions/context?meetingId=${meetingId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch webhook response');
      }
      
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while testing the webhook');
    } finally {
      setLoading(false);
    }
  };

  const testFirebase = async () => {
    setTestLoading(true);
    setTestError(null);
    setTestResponse(null);

    try {
      const response = await fetch('/.netlify/functions/test-firebase');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to test Firebase connection');
      }
      
      setTestResponse(data);
    } catch (err: any) {
      setTestError(err.message || 'An error occurred while testing Firebase');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Webhook Test Page</h1>
        
        <div className="space-y-8">
          {/* Firebase Test Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Firebase Connection</h2>
            <button
              onClick={testFirebase}
              disabled={testLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {testLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Testing Firebase...
                </>
              ) : (
                'Test Firebase Connection'
              )}
            </button>

            {testError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{testError}</p>
              </div>
            )}

            {testResponse && (
              <div className="space-y-2">
                <h3 className="font-semibold">Firebase Test Response:</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <hr />

          {/* Webhook Test Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Context Webhook</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Meeting ID
              </label>
              <input
                type="text"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E86C1F] focus:border-[#E86C1F]"
                placeholder="Enter meeting ID"
              />
            </div>

            <button
              onClick={testWebhook}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E86C1F] text-white px-6 py-3 rounded-md hover:bg-[#D65A0D] transition-colors disabled:bg-orange-300"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Testing Webhook...
                </>
              ) : (
                'Test Webhook'
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {response && (
              <div className="space-y-2">
                <h3 className="font-semibold">Webhook Response:</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}