import React from 'react';

interface EducationRecommendation {
  title: string;
  type: 'Degree' | 'Certification' | 'Bootcamp' | 'Online Course';
  institution: string;
  duration: string;
  cost: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  skillsGained: string[];
  careerAlignment: number;
  description: string;
}

interface EducationPathway {
  institution: string;
  alignment: string;
  jobTitle?: string;
  currentDemand?: number;
  // ... other fields from JobDemandForecaster (e.g., year1Growth, etc.)
}

interface EducationRecommendationsProps {
  industry: string;
  experience: string;
}

const EducationRecommendations: React.FC<EducationRecommendationsProps> = ({ industry, experience }) => {
  const generateEducationRecommendations = (): EducationRecommendation[] => {
    const baseRecommendations: Record<string, EducationRecommendation[]> = {
      technology: [
        {
          title: 'BSc Computer Science',
          type: 'Degree',
          institution: 'University of Colombo',
          duration: '4 years',
          cost: 'LKR 800,000 - 1,200,000',
          format: 'In-Person',
          skillsGained: ['Programming', 'Algorithms', 'Database Design', 'Software Engineering'],
          careerAlignment: 95,
          description: 'Comprehensive computer science degree with strong industry connections.'
        },
        {
          title: 'AWS Cloud Practitioner',
          type: 'Certification',
          institution: 'Amazon Web Services',
          duration: '3-6 months',
          cost: 'LKR 50,000 - 100,000',
          format: 'Online',
          skillsGained: ['Cloud Computing', 'AWS Services', 'DevOps', 'Infrastructure'],
          careerAlignment: 88,
          description: 'Industry-recognized cloud certification for modern infrastructure skills.'
        },
        {
          title: 'Full Stack Web Development',
          type: 'Bootcamp',
          institution: 'SLIIT Academy',
          duration: '6-9 months',
          cost: 'LKR 150,000 - 250,000',
          format: 'Hybrid',
          skillsGained: ['React', 'Node.js', 'JavaScript', 'Database Management'],
          careerAlignment: 92,
          description: 'Intensive practical training for modern web development roles.'
        }
      ],
      healthcare: [
        {
          title: 'Healthcare Data Analytics',
          type: 'Certification',
          institution: 'University of Moratuwa',
          duration: '6-12 months',
          cost: 'LKR 120,000 - 200,000',
          format: 'Hybrid',
          skillsGained: ['Healthcare Analytics', 'Medical Data', 'Statistical Analysis', 'Compliance'],
          careerAlignment: 90,
          description: 'Specialized certification in healthcare data and analytics.'
        },
        {
          title: 'Digital Health Management',
          type: 'Online Course',
          institution: 'Harvard Medical School (Online)',
          duration: '4-6 months',
          cost: 'USD 2,000 - 3,500',
          format: 'Online',
          skillsGained: ['Digital Health', 'Telemedicine', 'Health Technology', 'Patient Care'],
          careerAlignment: 85,
          description: 'Leading-edge digital health management from global experts.'
        }
      ],
      finance: [
        {
          title: 'FinTech and Digital Banking',
          type: 'Certification',
          institution: 'Institute of Bankers Sri Lanka',
          duration: '6-9 months',
          cost: 'LKR 100,000 - 180,000',
          format: 'Hybrid',
          skillsGained: ['FinTech', 'Digital Banking', 'Blockchain', 'Financial Analytics'],
          careerAlignment: 93,
          description: 'Comprehensive fintech education tailored for Sri Lankan market.'
        },
        {
          title: 'CFA Charter',
          type: 'Certification',
          institution: 'CFA Institute',
          duration: '2-4 years',
          cost: 'USD 3,000 - 5,000',
          format: 'Online',
          skillsGained: ['Investment Analysis', 'Portfolio Management', 'Ethics', 'Financial Reporting'],
          careerAlignment: 96,
          description: 'Globally recognized finance qualification for investment professionals.'
        }
      ]
    };

    return baseRecommendations[industry.toLowerCase()] || baseRecommendations.technology;
  };

  const recommendations = generateEducationRecommendations();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Degree': return 'text-blue-600 bg-blue-100';
      case 'Certification': return 'text-green-600 bg-green-100';
      case 'Bootcamp': return 'text-purple-600 bg-purple-100';
      case 'Online Course': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(recommendation.type)}`}>
                  {recommendation.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium">{recommendation.careerAlignment}%</p>
                <p className="text-xs text-gray-500">Career alignment</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <span className="mr-2">○ {recommendation.institution}</span>
              <span className="mr-2">○ {recommendation.duration}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {recommendation.format}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-4">{recommendation.description}</p>

            <p className="text-sm text-gray-700 mb-4">
              $ Investment: {recommendation.cost} , {recommendation.format === 'Online' ? 'Self-paced' : 'Class-based'}
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills You'll Gain:</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.skillsGained.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Career Alignment with Market Demand</p>
              <div className="bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                  style={{ width: `${recommendation.careerAlignment}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-700">{recommendation.careerAlignment}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationRecommendations;