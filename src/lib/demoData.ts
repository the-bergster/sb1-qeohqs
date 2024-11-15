import { generateRandomDate } from './utils';

export const DEMO_PROFILE = {
  personalInfo: {
    name: "Dave Demo",
    title: "VP of Innovation & AI Strategy",
    location: "San Francisco Bay Area",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    pronouns: "he/him",
    languages: ["English", "Mandarin", "Spanish"],
    timezone: "PST (UTC-8)",
    influenceScore: 92,
    reachability: "Very High",
    preferredContactMethod: "Email first, then schedule call"
  },
  sections: {
    careerHistory: [
      {
        title: "VP of Innovation & AI Strategy @ TechCorp",
        period: "2022 - Present",
        description: "Leading AI initiatives and digital transformation across enterprise products"
      },
      {
        title: "Director of Product Strategy @ Oracle",
        period: "2018 - 2022",
        description: "Led product strategy for cloud services division"
      }
    ],
    companyInfo: {
      name: "TechCorp",
      industry: "Enterprise Software",
      size: "5000+ employees",
      revenue: "$1.2B Annual"
    }
  },
  digitalPresence: {
    youtube: [
      {
        type: "keynote",
        title: "The Future of Enterprise AI",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        event: "TechCon 2024",
        views: 45000,
        date: "2024-01-15"
      },
      {
        type: "interview",
        title: "Innovation in Enterprise Software",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        publisher: "TechTalks",
        views: 28000,
        date: "2023-12-10"
      }
    ],
    podcasts: [
      {
        name: "The AI Enterprise",
        episode: "Episode 145: Transforming Enterprise with AI",
        platform: "Spotify",
        date: "2024-02-01",
        listens: 15000
      }
    ],
    articles: [
      {
        title: "Why AI is the Future of Enterprise Software",
        publication: "TechCrunch",
        url: "https://techcrunch.com/demo",
        date: "2024-01-20",
        engagement: 2500
      }
    ],
    socialMedia: {
      linkedin: {
        url: "https://linkedin.com/in/davedemo",
        followers: 25000,
        posts: [
          {
            content: "Excited to announce our latest AI breakthrough in enterprise software! #Innovation #AI",
            date: generateRandomDate(new Date('2024-01-01'), new Date()),
            likes: 1500,
            comments: 230
          }
        ]
      },
      twitter: {
        handle: "@DaveDemo",
        followers: 18500,
        tweets: [
          {
            content: "Just wrapped up an amazing keynote at #TechCon2024. The future of enterprise software is AI-first!",
            date: generateRandomDate(new Date('2024-01-01'), new Date()),
            likes: 850,
            retweets: 120
          }
        ]
      }
    }
  },
  commonBackground: {
    locations: [
      {
        city: "San Francisco",
        period: "2020-Present",
        connection: "You both currently work in SF's SOMA district"
      },
      {
        city: "Boston",
        period: "2015-2020",
        connection: "You were at MIT while Dave was at Harvard"
      }
    ],
    education: [
      {
        institution: "Harvard Business School",
        degree: "MBA",
        year: "2015",
        commonConnections: 8
      },
      {
        institution: "Stanford University",
        degree: "BS Computer Science",
        year: "2010",
        commonConnections: 5
      }
    ],
    companies: [
      {
        name: "Oracle",
        period: "2018-2022",
        overlap: "You were both there in 2019-2020",
        commonColleagues: 12
      }
    ],
    interests: [
      {
        category: "Sports",
        shared: ["Marathon Running", "Rock Climbing"],
        detail: "Both completed Boston Marathon 2023"
      },
      {
        category: "Technology",
        shared: ["AI Ethics", "Quantum Computing"],
        detail: "Both spoke at AI Ethics Conference 2023"
      }
    ]
  },
  insights: {
    communicationStyle: {
      preferred: "Direct and data-driven",
      bestPractices: [
        "Start with key metrics",
        "Use visual aids",
        "Keep meetings focused"
      ],
      avoid: [
        "Long email chains",
        "Unstructured discussions",
        "Late afternoon meetings"
      ]
    },
    decisionMaking: {
      style: "Analytical with quick execution",
      priorities: [
        "ROI metrics",
        "Scalability",
        "Team impact"
      ],
      influences: [
        "Market trends",
        "Customer feedback",
        "Technical feasibility"
      ]
    },
    currentFocus: {
      topics: [
        "AI Integration in Enterprise",
        "Team Scaling",
        "Market Expansion"
      ],
      challenges: [
        "Talent acquisition in AI",
        "Market competition",
        "Technical debt"
      ]
    }
  }
};