import toast from 'react-hot-toast';

interface AnalyzeProfileResponse {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    avatar?: string;
  };
  sections: {
    careerHistory: Array<{
      title: string;
      period: string;
      description: string;
    }>;
    companyInfo: {
      name: string;
      industry: string;
      size: string;
    };
    personalInterests: string[];
  };
}

export const analyzeProfile = async (linkedinUrl: string, userId: string): Promise<AnalyzeProfileResponse> => {
  try {
    const data = {
      linkedinUrl,
      userId,
      timestamp: new Date().toISOString(),
      source: window.location.origin
    };

    const response = await fetch('https://hook.us2.make.com/4325skng8mp66vl3hrjfj1xpsi68es8r', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to analyze profile: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result || !result.personalInfo) {
      throw new Error('Invalid response format from analysis service');
    }

    return result;
  } catch (error: any) {
    console.error('Profile analysis error:', error);
    throw new Error(error.message || 'Failed to analyze profile');
  }
};