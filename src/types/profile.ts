export interface ProfileResponse {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    avatar: string;
  };
  sections: {
    careerHistory: Array<{
      title: string;
      period: string;
      description: string;
    }>;
    communicationStyle: {
      preferredStyle: string;
      bestApproach: string;
      avoid: string;
      keyTraits: string;
    };
    companyInfo: {
      name: string;
      industry: string;
      size: string;
      revenue: string;
      keyFocusAreas: string;
      digitalInitiatives: string;
    };
    personalInterests: string[];
    recentNews: Array<{
      title: string;
      date: string;
      description: string;
    }>;
    conversationStarters: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    discoveryQuestions: Array<{
      title: string;
      question: string;
    }>;
  };
}