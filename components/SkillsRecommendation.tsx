import React from 'react';
import { Target, TrendingUp, Clock, Star } from 'lucide-react';

interface PredictionData {
  jobTitle: string;
  currentDemand: number;
  predictedGrowth: number;
  confidenceScore: number;
  salaryRange: string;
  skillsRequired: string[];
}

interface SkillsRecommendationProps {
  predictions: PredictionData[];
  industry: string;
}

interface SkillRecommendation {
  skill: string;
  demandGrowth: number;
  currentDemand: number;
  learningTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedJobs: string[];
}

const SkillsRecommendation: React.FC<SkillsRecommendationProps> = ({ predictions, industry }) => {
  // Generate skill recommendations based on predictions
  const generateSkillRecommendations = (): SkillRecommendation[] => {
    const allSkills = predictions.flatMap(pred => pred.skillsRequired);
    const skillFrequency = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSkills = Object.entries(skillFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([skill]) => skill);

    return topSkills.map(skill => ({
      skill,
      demandGrowth: Math.floor(Math.random() * 30) + 15,
      currentDemand: Math.floor(Math.random() * 40) + 60,
      learningTime: getLearningTime(skill),
      difficulty: getDifficulty(skill),
      relatedJobs: predictions
        .filter(pred => pred.skillsRequired.includes(skill))
        .map(pred => pred.jobTitle)
        .slice(0, 3)
    }));
  };

  const getLearningTime = (skill: string): string => {
    const timeMap: Record<string, string> = {
      'Python': '3-6 months',
      'JavaScript': '2-4 months',
      'React': '2-3 months',
      'AWS': '4-6 months',
      'Machine Learning': '6-12 months',
      'SQL': '1-3 months',
      'Docker': '1-2 months',
      'Node.js': '2-4 months',
      'Data Analysis': '3-6 months',
      'Project Management': '2-4 months'
    };
    return timeMap[skill] || '3-6 months';
  };

  const getDifficulty = (skill: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const advancedSkills = ['Machine Learning', 'AWS', 'Docker', 'Kubernetes'];
    const intermediateSkills = ['React', 'Node.js', 'Data Analysis', 'Python'];
    
    if (advancedSkills.includes(skill)) return 'Advanced';
    if (intermediateSkills.includes(skill)) return 'Intermediate';
    return 'Beginner';
  };

  const skillRecommendations = generateSkillRecommendations();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Target className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Skills Recommendations</h2>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <p className="text-sm text-gray-700">
          Based on the job market analysis for <strong>{industry}</strong>, here are the most in-demand skills 
          that will drive career growth over the next 2 years.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillRecommendations.map((recommendation, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{recommendation.skill}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                    {recommendation.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{recommendation.learningTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">+{recommendation.demandGrowth}%</span>
                </div>
                <p className="text-xs text-gray-500">Demand growth</p>
              </div>
            </div>

            {/* Current Demand Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Current Market Demand</span>
                <span>{recommendation.currentDemand}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${recommendation.currentDemand}%` }}
                ></div>
              </div>
            </div>

            {/* Related Jobs */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">High-demand roles:</p>
              <div className="space-y-1">
                {recommendation.relatedJobs.map((job, jobIndex) => (
                  <div key={jobIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{job}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Priority */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Learning Priority</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-2">
              <span className="text-green-700 font-bold">1st</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{skillRecommendations[0]?.skill || 'Core Skills'}</p>
            <p className="text-xs text-gray-600">Foundation building</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-2">
              <span className="text-yellow-700 font-bold">2nd</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{skillRecommendations[1]?.skill || 'Specialization'}</p>
            <p className="text-xs text-gray-600">Skill expansion</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
              <span className="text-purple-700 font-bold">3rd</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{skillRecommendations[2]?.skill || 'Advanced Skills'}</p>
            <p className="text-xs text-gray-600">Expert level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsRecommendation;