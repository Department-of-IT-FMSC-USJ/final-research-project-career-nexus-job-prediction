'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, TrendingUp, Brain, BarChart3, User, LogOut, BookOpen, Target } from 'lucide-react';
import IndustrySelector from '@/components/IndustrySelector';
import PredictionDashboard from '@/components/PredictionDashboard';
import TwoYearChart from '@/components/TwoYearChart';
import EducationPathways from '@/components/EducationPathways';
import SkillsRecommendation from '@/components/SkillsRecommendation';
import AuthModal from '@/components/AuthModal';
import { JobPredictor, PredictionData, EducationPathway } from '@/lib/JobPredictor';
import { login, signup, logout, getCurrentAuth } from '@/lib/auth';
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and configured
import { MonthlyPrediction } from '../lib/JobPredictor';  

interface User {
  name: string;
  email: string;
}

interface AuthData {
  user: User;
  token: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPredictor] = useState<JobPredictor>(() => new JobPredictor());

  useEffect(() => {
    const auth = getCurrentAuth();
    if (auth) {
      setIsAuthenticated(true);
      setCurrentUser(auth.user);
    }
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const authData: AuthData | null = await login(email, password);
      if (authData) {
        setIsAuthenticated(true);
        setCurrentUser(authData.user);
        setShowAuthModal(false);
        toast.success('Logged in successfully!');
        return true;
      }
      toast.error('Invalid credentials');
      return false;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const authData: AuthData | null = await signup(name, email, password);
      if (authData) {
        setIsAuthenticated(true);
        setCurrentUser(authData.user);
        setShowAuthModal(false);
        toast.success('Signed up successfully!');
        return true;
      }
      toast.error('Signup failed. Email may already be in use.');
      return false;
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      return false;
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPredictions([]);
    setSelectedIndustry('');
    setSelectedExperience('');
    toast.info('Logged out successfully.');
  }, []);

  const handlePredict = useCallback(async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedIndustry || !selectedExperience) {
      toast.error('Please select both an industry and experience level.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await jobPredictor.predictJobDemand(selectedIndustry, selectedExperience);
      setPredictions(results);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to generate predictions. Please try again.');
      toast.error('Failed to generate predictions.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedIndustry, selectedExperience, jobPredictor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CareerNexus
                </h1>
                <p className="text-sm text-gray-600">Predict future job trends for the next 2 years</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Welcome, {currentUser?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-200"
                  aria-label="Login or Sign Up"
                >
                  Login / Sign Up
                </button>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>2-Year Forecast</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CareerNexus</h2>
              <p className="text-gray-600 mb-4">
                Please login or create an account to access job demand predictions and personalized recommendations.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                aria-label="Get Started"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Demand Forecasting</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI models predict job demand trends for the next 24 months with high accuracy.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Target className="h-6 w-6 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills Required</h3>
            <p className="text-gray-600 text-sm">
              Get skill recommendations based on industry trends and experience level.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <BookOpen className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Education Pathways</h3>
            <p className="text-gray-600 text-sm">
              Discover relevant courses, certifications, and degree programs to boost your career.
            </p>
          </div>
        </div>

        {/* Selection Panel */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <IndustrySelector
                selectedIndustry={selectedIndustry}
                onIndustryChange={setSelectedIndustry}
              />
              <div>
                <label htmlFor="experience-level" className="block text-sm font-medium text-gray-700 mb-3">
                  Experience Level
                </label>
                <select
                  id="experience-level"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  aria-required="true"
                >
                  <option value="">Select Experience Level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive Level (10+ years)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={!isAuthenticated || !selectedIndustry || !selectedExperience || loading}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              aria-label="Generate Predictions"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                  <span>Generate Predictions</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Results Dashboard */}
        {isAuthenticated && predictions.length > 0 && (
          <div className="space-y-8">
             

          {/* Prediction Results */}
            <PredictionDashboard 
              predictions={predictions}
              industry={selectedIndustry}
              experience={selectedExperience}
            />
          </div>
        )}

        {/* Empty State */}
        {isAuthenticated && predictions.length === 0 && !loading && !error && selectedIndustry && selectedExperience && (
          <div className="text-center text-gray-600">
            No predictions available. Try generating predictions with the button above.
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
}