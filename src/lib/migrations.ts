import { collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import toast from 'react-hot-toast';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const enhanceExistingPreps = async (userId: string) => {
  try {
    const prepsRef = collection(db, 'preps');
    const q = query(prepsRef);
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const prepData = doc.data();
      
      if (prepData.userId === userId) {
        const basicInfo = prepData.profileData?.personalInfo || {};
        const companyInfo = prepData.profileData?.sections?.companyInfo || {};
        
        const enhancedData = {
          personalInfo: {
            ...basicInfo,
            pronouns: "they/them",
            languages: ["English", "Spanish", "Mandarin"],
            timezone: "UTC-7",
            influenceScore: 85,
            reachability: "High",
            preferredContactMethod: "Email then follow-up call"
          },
          commonConnections: {
            mutual: Math.floor(Math.random() * 20) + 1,
            highlights: [
              { name: "Alex Thompson", role: "Former colleague at Oracle", connection: "Strong - 8+ years" },
              { name: "Jordan Lee", role: "Industry thought leader", connection: "Recent interaction at TechCon 2024" }
            ],
            sharedGroups: [
              "Bay Area Tech Leaders",
              "Women in Enterprise SaaS",
              "Future of Work Think Tank"
            ]
          },
          commonBackground: {
            locations: [
              { 
                city: "San Francisco",
                period: "2020-2024",
                connection: "You both worked here during the tech boom"
              },
              {
                city: "Boston",
                period: "2015-2019",
                connection: "You attended MIT while they were at Harvard"
              }
            ],
            education: [
              {
                institution: "Harvard Business School",
                degree: "MBA",
                year: "2015",
                commonConnections: 5
              }
            ],
            companies: [
              {
                name: "Oracle",
                period: "2015-2018",
                overlap: "You were both there in 2016",
                commonColleagues: 3
              }
            ]
          },
          digitalPresence: {
            recentActivity: {
              linkedin: [
                { 
                  type: "post",
                  date: generateRandomDate(new Date('2024-01-01'), new Date()),
                  content: "Thrilled to announce our latest AI integration that's revolutionizing how enterprises handle data processing. #Innovation #AI #Enterprise",
                  engagement: 1547,
                  sentiment: "Positive",
                  keywords: ["AI", "Innovation", "Enterprise"]
                },
                {
                  type: "article",
                  date: generateRandomDate(new Date('2024-01-01'), new Date()),
                  content: "The Future of Enterprise Software: Why Human-Centered Design Matters More Than Ever",
                  engagement: 2891,
                  sentiment: "Analytical",
                  keywords: ["Design", "Enterprise", "Future"]
                }
              ],
              twitter: [
                {
                  handle: "@techleader",
                  recentTweet: "Great discussion about the future of AI in enterprise software at #TechCon2024",
                  date: generateRandomDate(new Date('2024-01-01'), new Date()),
                  engagement: 234
                }
              ],
              youtube: [
                {
                  title: "Keynote: Transform Your Enterprise with AI",
                  event: "Enterprise Tech Summit 2024",
                  views: 15000,
                  date: generateRandomDate(new Date('2024-01-01'), new Date())
                }
              ]
            },
            publications: [
              {
                title: "The Evolution of Enterprise Software",
                publisher: "TechCrunch",
                date: "2024-01-15",
                impact: "Widely cited in industry"
              }
            ],
            speaking: [
              {
                event: "Enterprise World 2024",
                topic: "AI Integration in Modern Enterprises",
                date: "2024-03-15",
                audience: "2000+ C-level executives"
              }
            ]
          },
          professionalInsights: {
            leadership: {
              style: "Transformational and data-driven",
              strengths: ["Strategic thinking", "Team building", "Innovation management"],
              preferences: ["Early morning meetings", "Data-backed presentations", "Direct communication"],
              avoids: ["Lengthy email chains", "Unstructured discussions"]
            },
            achievements: [
              {
                title: "Led $50M digital transformation",
                year: "2023",
                impact: "30% efficiency increase"
              },
              {
                title: "Built AI division from scratch",
                year: "2022",
                impact: "Now generates 25% of revenue"
              }
            ],
            interests: {
              professional: ["AI/ML", "Digital Transformation", "Team Building"],
              personal: ["Marathon Running", "Angel Investing", "Mentoring"],
              causes: ["Tech Education", "Climate Tech", "Diversity in Tech"]
            }
          },
          meetingContext: {
            previousInteractions: [
              {
                type: "Conference",
                event: "TechCon 2024",
                date: "2024-02-15",
                notes: "Brief conversation about AI integration"
              }
            ],
            sharedContacts: [
              {
                name: "Sarah Chen",
                role: "VP Engineering at Oracle",
                relationship: "Strong advocate for both parties"
              }
            ],
            potentialTopics: [
              {
                topic: "AI Integration Strategy",
                relevance: "High",
                context: "Based on their recent publications and your company's focus"
              },
              {
                topic: "Enterprise Software Trends",
                relevance: "Medium",
                context: "Mutual interest area with recent developments"
              }
            ]
          },
          companyContext: {
            recentNews: [
              {
                title: "Acquired AI Startup for $100M",
                date: generateRandomDate(new Date('2024-01-01'), new Date()),
                source: "TechCrunch",
                summary: "Strategic acquisition to boost AI capabilities",
                impact: "Significant market position strengthening"
              },
              {
                title: "Launched Enterprise AI Platform",
                date: generateRandomDate(new Date('2024-01-01'), new Date()),
                source: "Forbes",
                summary: "New platform combines ML and automation",
                impact: "Positive market reception"
              }
            ],
            initiatives: [
              {
                name: "Project Aurora",
                description: "AI-powered enterprise transformation",
                status: "Active",
                timeline: "Q2 2024",
                team: "150+ engineers",
                investment: "$50M+"
              },
              {
                name: "Green Data Centers",
                description: "Sustainability initiative",
                status: "In Progress",
                timeline: "2024-2025",
                investment: "$30M"
              }
            ],
            competitors: [
              {
                name: "TechCorp Inc",
                relationship: "Direct competitor",
                marketShare: "15%",
                strengths: ["Legacy integrations", "Market presence"],
                weaknesses: ["Slower innovation", "Technical debt"]
              }
            ],
            marketPosition: {
              share: "23%",
              trend: "Growing",
              keyMetrics: {
                revenue: "$1.2B",
                growth: "28% YoY",
                employees: "5000+"
              }
            }
          }
        };

        await updateDoc(doc.ref, {
          profileData: {
            ...prepData.profileData,
            ...enhancedData
          },
          lastUpdated: new Date().toISOString()
        });
      }
    });

    await Promise.all(updatePromises);
    toast.success('Successfully enhanced all prep sheets with rich data');
  } catch (error) {
    console.error('Error enhancing prep sheets:', error);
    toast.error('Failed to enhance prep sheets');
    throw error;
  }
};