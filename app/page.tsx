import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  User, 
  LogOut, 
  Calendar, 
  TrendingUp, 
  Target, 
  BookOpen, 
  BarChart3,
  Building2,
  Search
} from 'lucide-react';

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
  month: string;
  demand: number;
  growth: number;
  jobCount: number;
  skills: string[];
  education: string[];
  salaryRange: {
    min: number;
    max: number;
  };
}

interface MonthlyPrediction {
  month: string;
  demand: number;
  growth: number;
}

// Mock Auth Functions
const getCurrentAuth = (): AuthData | null => {
  const stored = localStorage.getItem('auth');
  return stored ? JSON.parse(stored) : null;
};

const login = async (email: string, password: string): Promise<AuthData | null> => {
  // Mock login - in reality, this would call your API
  if (email === 'demo@example.com' && password === 'demo') {
    const authData = {
      user: { name: 'Demo User', email },
      token: 'mock-jwt-token'
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    return authData;
  }
  return null;
};

const signup = async (name: string, email: string, password: string): Promise<AuthData | null> => {
  // Mock signup
  const authData = {
    user: { name, email },
    token: 'mock-jwt-token'
  };
  localStorage.setItem('auth', JSON.stringify(authData));
  return authData;
};

const logout = () => {
  localStorage.removeItem('auth');
};

// Mock toast notifications
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message),
  info: (message: string) => console.log('Info:', message),
};

// Job Predictor Class
class JobPredictor {
  async predictJobDemand(industry: string, experience: string): Promise<PredictionData[]> {
    // Mock prediction logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const months = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];
    const skills = industry === 'technology' 
      ? ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'] 
      : ['Leadership', 'Communication', 'Project Management', 'Analytics'];
    
    const education = experience === 'entry' 
      ? ['Bachelor\'s Degree', 'Coding Bootcamp', 'Online Certifications']
      : ['Master\'s Degree', 'Industry Certifications', 'Leadership Training'];

    return months.map((month, index) => ({
      month,
      demand: 75 + Math.random() * 25,
      growth: (Math.random() * 20) - 5,
      jobCount: 1200 + Math.floor(Math.random() * 800),
      skills,
      education,
      salaryRange: {
        min: 60000 + (index * 5000),
        max: 90000 + (index * 8000)
      }
    }));
  }
}

// Components
const IndustrySelector: React.FC<{
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
}> = ({ selectedIndustry, onIndustryChange }) => {
  const industries = [
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💼' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { value: 'retail', label: 'Retail', icon: '🛍️' },
  ];

  return (
    <div>
      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-3">
        Industry
      </label>
      <div className="grid grid-cols-2 gap-3">
        {industries.map((industry) => (
          <button
            key={industry.value}
            onClick={() => onIndustryChange(industry.value)}
            className={`p-3 text-left border rounded-xl transition-all duration-200 ${
              selectedIndustry === industry.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{industry.icon}</span>
              <span className="font-medium">{industry.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PredictionDashboard: React.FC<{
  predictions: PredictionData[];
  industry: string;
  experience: string;
}> = ({ predictions, industry, experience }) => {
  if (!predictions.length) return null;

  const avgDemand = predictions.reduce((sum, p) => sum + p.demand, 0) / predictions.length;
  const totalJobs = predictions.reduce((sum, p) => sum + p.jobCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Demand</p>
              <p className="text-2xl font-bold text-blue-600">{avgDemand.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Job Openings</p>
              <p className="text-2xl font-bold text-green-600">{totalJobs.toLocaleString()}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Salary Range</p>
              <p className="text-2xl font-bold text-purple-600">
                ${predictions[0]?.salaryRange.min.toLocaleString()} - ${predictions[0]?.salaryRange.max.toLocaleString()}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Demand Forecast</h3>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-600">
                {prediction.month}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.demand}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-semibold text-gray-900">
                {prediction.demand.toFixed(1)}%
              </div>
              <div className={`text-sm font-medium ${
                prediction.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {prediction.growth >= 0 ? '+' : ''}{prediction.growth.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Required Skills</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {predictions[0]?.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span>Education Pathways</span>
          </h3>
          <div className="space-y-2">
            {predictions[0]?.education.map((edu, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{edu}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (name: string, email: string, password: string) => Promise<boolean>;
}> = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLoginMode ? 'Login' : 'Sign Up'}
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Login'}
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
      </div>
  )}