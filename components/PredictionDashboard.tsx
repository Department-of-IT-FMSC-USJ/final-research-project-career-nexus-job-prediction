'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Star, BarChart, Clock } from 'lucide-react';

interface PredictionDashboardProps {
  predictions: PredictionData[];
  industry: string;
  experience: string;
}

interface EducationPathway {
  title: string;
  institution: string;
  duration: string;
  alignment: number;
}

interface PredictionData {
  jobTitle: string;
  currentDemand: number;
  year1Growth: number;
  year2Growth: number;
  totalGrowth: number;
  confidenceScore: number;
  salaryRange: string;
  monthlyPredictions: any[];
  skills: string[];
  educationPathways: EducationPathway[];
}

interface PredictionDashboardProps {
  predictions: PredictionData[];
  industry: string;
  experience: string;
}

const PredictionDashboard: React.FC<PredictionDashboardProps> = ({
  predictions,
  industry,
  experience
}) => {
  const getGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-green-600';
    if (growth >= 8) return 'text-blue-600';
    if (growth >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const average2YearGrowth = predictions.length > 0 
    ? (predictions.reduce((acc, curr) => acc + curr.totalGrowth, 0) / predictions.length).toFixed(2) 
    : '0.00';

  const highGrowthJobs = predictions.filter(p => p.totalGrowth >= 10).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Job Market Predictions
        </h2>
        <p className="text-gray-600">
          {industry.charAt(0).toUpperCase() + industry.slice(1)} industry •{' '}
          {experience.charAt(0).toUpperCase() + experience.slice(1)} level
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">2-Year Growth</p>
              <p className="text-2xl font-bold text-blue-800">+{average2YearGrowth}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">High Growth Jobs</p>
              <p className="text-2xl font-bold text-green-800">{highGrowthJobs}</p>
            </div>
            <Star className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Jobs Analyzed</p>
              <p className="text-2xl font-bold text-purple-800">{predictions.length}</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Prediction Period</p>
              <p className="text-2xl font-bold text-orange-800">24 Months</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Most Demanding Jobs - Next 2 Years</h3>
        {predictions.map((prediction, index) => {
          const GrowthIcon = getGrowthIcon(prediction.totalGrowth);
          const Year1Icon = getGrowthIcon(prediction.year1Growth);
          const Year2Icon = getGrowthIcon(prediction.year2Growth);

          return (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">{prediction.jobTitle}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{prediction.salaryRange}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Confidence: {prediction.confidenceScore.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end space-x-1 ${getGrowthColor(prediction.totalGrowth)}`}>
                    <GrowthIcon className="h-5 w-5" />
                    <span className="font-bold text-lg">
                      {prediction.totalGrowth >= 0 ? '+' : ''}{prediction.totalGrowth.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">2-year total growth</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 mb-4">
                <div className="flex justify-between space-x-4 mb-1">
                  <div className={`flex items-center space-x-1 ${getGrowthColor(prediction.year1Growth)}`}>
                    <Year1Icon className="h-4 w-4" />
                    <span className="font-medium">
                      {prediction.year1Growth >= 0 ? '+' : ''}{prediction.year1Growth.toFixed(2)}%
                    </span>
                  </div>
                  <div className={`flex items-center space-x-1 ${getGrowthColor(prediction.year2Growth)}`}>
                    <Year2Icon className="h-4 w-4" />
                    <span className="font-medium">
                      {prediction.year2Growth >= 0 ? '+' : ''}{prediction.year2Growth.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <p>Year 1 Growth</p>
                  <p>Year 2 Growth</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Demand</p>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2" 
                    style={{ width: `${prediction.currentDemand}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">{prediction.currentDemand.toFixed(2)}/100</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Recommended Education:</p>
                <div className="space-y-2">
                  {prediction.educationPathways.map((edu, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between items-center bg-blue-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{edu.title}</p>
                        <p className="text-sm text-gray-600">{edu.institution} - {edu.duration}</p>
                      </div>
                      <p className="text-blue-600 font-medium">{edu.alignment}% match</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* No Predictions State */}
        {predictions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Predictions Available
            </h3>
            <p className="text-gray-600">
              Select an industry and experience level to generate job market predictions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDashboard;