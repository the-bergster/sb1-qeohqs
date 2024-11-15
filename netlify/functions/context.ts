import { Handler } from '@netlify/functions';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

const db = getFirestore();

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    // Log the incoming request
    console.log('Received request:', {
      method: event.httpMethod,
      path: event.path,
      params: event.queryStringParameters,
    });

    // Get meetingId from query parameters
    const meetingId = event.queryStringParameters?.meetingId;
    
    if (!meetingId) {
      console.error('Meeting ID is missing');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Meeting ID is required',
          timestamp: new Date().toISOString()
        }),
      };
    }

    console.log('Fetching prep data for meeting ID:', meetingId);

    // Get meeting data from Firestore
    const prepDoc = await db.collection('preps').doc(meetingId).get();
    
    if (!prepDoc.exists) {
      console.error('Meeting not found:', meetingId);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Meeting not found',
          meetingId,
          timestamp: new Date().toISOString()
        }),
      };
    }

    const prepData = prepDoc.data();
    const profileData = prepData?.profileData;

    if (!profileData) {
      console.error('Profile data not found for meeting:', meetingId);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Profile data not found',
          meetingId,
          timestamp: new Date().toISOString()
        }),
      };
    }

    // Construct the context string
    const contextString = `
You are an AI assistant helping prepare for a meeting with ${profileData.personalInfo.name}. 
Here is the key information about them:

Name: ${profileData.personalInfo.name}
Current Role: ${profileData.personalInfo.title}
Location: ${profileData.personalInfo.location}

Company Information:
- Company: ${profileData.sections.companyInfo.name}
- Industry: ${profileData.sections.companyInfo.industry}
- Company Size: ${profileData.sections.companyInfo.size}
- Key Focus Areas: ${profileData.sections.companyInfo.keyFocusAreas}
- Recent Initiatives: ${profileData.sections.companyInfo.digitalInitiatives}

Communication Style:
- Preferred Style: ${profileData.sections.communicationStyle.preferredStyle}
- Best Approach: ${profileData.sections.communicationStyle.bestApproach}
- Key Traits: ${profileData.sections.communicationStyle.keyTraits}
- Things to Avoid: ${profileData.sections.communicationStyle.avoid}

Career History:
${profileData.sections.careerHistory.map((exp: any) => 
  `- ${exp.title} (${exp.period}): ${exp.description}`
).join('\n')}

Personal Interests: ${profileData.sections.personalInterests.join(', ')}

Recent News:
${profileData.sections.recentNews.map((news: any) => 
  `- ${news.title} (${news.date}): ${news.description}`
).join('\n')}

Conversation Starters:
${profileData.sections.conversationStarters.map((starter: any) => 
  `- ${starter.title}: ${starter.description}`
).join('\n')}

Instructions:
1. You are a helpful AI assistant preparing them for a meeting with ${profileData.personalInfo.name}
2. Use the above information to provide relevant, contextual responses
3. Help them prepare for the meeting by suggesting talking points and conversation starters
4. Share insights about the person's background, company, and industry when relevant
5. Maintain a professional and helpful tone while being conversational

Remember to:
- Be specific and reference actual details from their profile
- Suggest relevant conversation topics based on their interests and background
- Offer meeting preparation advice considering their communication style
- Share insights about their company and industry when appropriate
`;

    console.log('Successfully generated context for meeting:', meetingId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        context: contextString,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error: any) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString()
      }),
    };
  }
};