"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Calendar, TrendingUp, Building2, Target, BookOpen } from 'lucide-react';
import IndustrySelector from '@/components/IndustrySelector';
import PredictionDashboard from '@/components/PredictionDashboard';
import TwoYearChart from '@/components/TwoYearChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface User {
  name: string;
  email: string;
}

interface AuthData {
  user: User;
  token: string;
}

interface PredictionData {
  jobTitle: string;
  salaryRange: string;
  currentDemand: number;
  year1Growth: number;
  year2Growth: number;
  totalGrowth: number;
  confidenceScore: number;
  skills: string[];
  educationPathways: {
    title: string;
    institution: string;
    duration: string;
    alignment: number;
  }[];
  monthlyPredictions: {
    month: string;
    demand: number;
  }[];
}

// Mock Auth Functions
const getCurrentAuth = (): AuthData | null => {
  const stored = localStorage.getItem("auth");
  return stored ? JSON.parse(stored) : null;
};

const login = async (email: string, password: string): Promise<AuthData | null> => {
  if (email === "demo@example.com" && password === "demo") {
    const authData = {
      user: { name: "Demo User", email },
      token: "mock-jwt-token",
    };
    localStorage.setItem("auth", JSON.stringify(authData));
    return authData;
  }
  return null;
};

const signup = async (name: string, email: string, password: string): Promise<AuthData | null> => {
  const authData = {
    user: { name, email },
    token: "mock-jwt-token",
  };
  localStorage.setItem("auth", JSON.stringify(authData));
  return authData;
};

const logout = () => {
  localStorage.removeItem("auth");
};

// Mock toast notifications
const toast = {
  success: (message: string) => console.log("Success:", message),
  error: (message: string) => console.log("Error:", message),
  info: (message: string) => console.log("Info:", message),
};

// Job Predictor Class
class JobPredictor {
  async predictJobDemand(industry: string, experience: string): Promise<{ predictions: PredictionData[], metadata?: any }> {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, experience }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch predictions');
      }

      const data = await response.json();
      
      // Check if the response has the new structure with metadata
      if (data.predictions && data.metadata) {
        // Log whether we're using actual models or simulated data
        console.log(`📊 Prediction Source: ${data.metadata.modelSource}`);
        console.log(`🎯 Using Actual Model: ${data.metadata.usingActualModel ? 'Yes' : 'No'}`);
        console.log(`🏭 Industry: ${data.metadata.industry}, Experience: ${data.metadata.experience}`);
        
        return { predictions: data.predictions, metadata: data.metadata };
      } else {
        // Handle legacy response format
        return { predictions: Array.isArray(data) ? data : [] };
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      // Fallback to mock data if API fails
      const fallbackPredictions = this.generateFallbackPredictions(industry, experience);
      return { 
        predictions: fallbackPredictions, 
        metadata: { usingActualModel: false, modelSource: 'Fallback Simulated Data' }
      };
    }
  }

  private generateFallbackPredictions(industry: string, experience: string): PredictionData[] {
    // Fallback mock data in case API fails
    const industryJobs: Record<string, string[]> = {
      technology: ['Product Manager', 'Machine Learning Engineer', 'Cloud Architect'],
      healthcare: ['Healthcare Manager', 'Medical Data Analyst', 'Healthcare IT Specialist'],
      finance: ['Financial Analyst', 'Risk Manager', 'Investment Advisor'],
      education: ['Education Technology Specialist', 'Curriculum Developer', 'Learning Analytics Specialist'],
      manufacturing: ['Production Manager', 'Quality Assurance Engineer', 'Supply Chain Analyst'],
      retail: ['E-commerce Manager', 'Retail Analyst', 'Customer Experience Manager']
    };

    const industrySkills: Record<string, string[][]> = {
      technology: [
        ['JavaScript', 'Python', 'SQL', 'React'], 
        ['Python', 'TensorFlow', 'Docker', 'AWS'], 
        ['AWS', 'Azure', 'Kubernetes', 'Terraform']
      ],
      healthcare: [
        ['Healthcare Management', 'Leadership', 'Communication', 'Analytics'], 
        ['Data Analysis', 'SQL', 'Healthcare IT', 'Python'], 
        ['Healthcare Systems', 'HIPAA Compliance', 'Network Security']
      ],
      finance: [
        ['Financial Analysis', 'Excel', 'SQL', 'Risk Assessment'], 
        ['Risk Management', 'Financial Modeling', 'Compliance'], 
        ['Investment Analysis', 'Portfolio Management', 'Client Relations']
      ]
    };

    const jobTitles = industryJobs[industry] || industryJobs.technology;
    const skills = industrySkills[industry] || industrySkills.technology;

    return jobTitles.map((title, index) => ({
      jobTitle: title,
      salaryRange: `LKR ${80000 + index * 10000} - ${150000 + index * 10000}`,
      currentDemand: Math.round((85 + Math.random() * 15) * 100) / 100,
      year1Growth: Math.round((15 + Math.random() * 15) * 100) / 100,
      year2Growth: Math.round((5 + Math.random() * 10) * 100) / 100,
      totalGrowth: Math.round((20 + Math.random() * 20) * 100) / 100,
      confidenceScore: Math.round((85 + Math.random() * 15) * 100) / 100,
      skills: skills[index] || skills[0],
      educationPathways: [
        {
          title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Professional Certificate`,
          institution: 'University of Colombo',
          duration: '6-12 months',
          alignment: Math.round((85 + Math.random() * 15) * 100) / 100
        },
        {
          title: `Advanced ${industry.charAt(0).toUpperCase() + industry.slice(1)} Specialization`,
          institution: 'SLIIT',
          duration: '1-2 years',
          alignment: Math.round((80 + Math.random() * 15) * 100) / 100
        }
      ],
      monthlyPredictions: Array.from({ length: 24 }, (_, i) => ({
        month: `Month ${i + 1}`,
        demand: Math.round((75 + Math.random() * 25) * 100) / 100
      }))
    }));
  }
}

// AuthModal Component
const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (name: string, email: string, password: string) => Promise<boolean>;
}> = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        await onLogin(email, password);
      } else {
        await onSignup(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>
        {!isLoginMode && (
          <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
            Demo: Use email "demo@example.com" and password "demo" to login
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLoginMode ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionMetadata, setPredictionMetadata] = useState<any>(null);
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
        toast.success("Logged in successfully!");
        return true;
      }
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
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
        toast.success("Signed up successfully!");
        return true;
      }
      toast.error("Signup failed. Email may already be in use.");
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPredictions([]);
    setSelectedIndustry("");
    setSelectedExperience("");
    toast.info("Logged out successfully.");
  }, []);

  const handlePredict = useCallback(async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedIndustry || !selectedExperience) {
      toast.error("Please select both an industry and experience level.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await jobPredictor.predictJobDemand(selectedIndustry, selectedExperience);
      if (result.predictions.length === 0) {
        setError("No predictions available for this combination. Please try a different selection.");
      } else {
        setPredictions(result.predictions);
        setPredictionMetadata(result.metadata);
        
        const modelType = result.metadata?.usingActualModel ? "ARIMA model" : "simulated data";
        toast.success(`Generated predictions using ${modelType} for ${result.predictions.length} jobs in ${selectedIndustry}`);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate predictions";
      setError(`Prediction failed: ${errorMessage}. Please try again.`);
      toast.error("Failed to generate predictions.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedIndustry, selectedExperience, jobPredictor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
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
                  <span className="text-gray-600">Welcome, {currentUser?.name}</span>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-200"
                >
                  Login / Sign Up
                </Button>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>2-Year Forecast</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CareerNexus</h2>
              <p className="text-gray-600 mb-4">
                Please login or create an account to access job demand predictions and personalized recommendations.
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Demand Forecasting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced AI models predict job demand trends for the next 24 months with high accuracy.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Skills Required</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get skill recommendations based on industry trends and experience level.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Education Pathways</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Discover relevant courses, certifications, and degree programs to boost your career.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Selection Form */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Industry Sector
                    </label>
                    <IndustrySelector
                      selectedIndustry={selectedIndustry}
                      onIndustryChange={setSelectedIndustry}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Experience Level
                    </label>
                    <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Entry Level (0-2 years)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                        <SelectItem value="expert">Expert Level (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={!selectedIndustry || !selectedExperience || loading}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Generating Predictions..." : "Generate Predictions"}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {predictions.length > 0 && (
              <div className="space-y-8">
                <PredictionDashboard
                  predictions={predictions}
                  industry={selectedIndustry}
                  experience={selectedExperience}
                />
                
                <TwoYearChart
                  predictions={predictions}
                  industry={selectedIndustry}
                />
              </div>
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
}