import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface PredictionRequest {
  industry: string;
  experience: string;
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

async function runPythonPrediction(industry: string, experience: string): Promise<PredictionData[]> {
  return new Promise((resolve, reject) => {
    const projectRoot = process.cwd();
    const pythonScript = path.join(projectRoot, 'predict_model.py');
    const modelsDir = path.join(projectRoot, 'models');

    // Check if Python script exists
    if (!fs.existsSync(pythonScript)) {
      console.error('Python script not found:', pythonScript);
      reject(new Error('Python script not found'));
      return;
    }

    // Check if models directory exists
    if (!fs.existsSync(modelsDir)) {
      console.error('Models directory not found:', modelsDir);
      reject(new Error('Models directory not found'));
      return;
    }

    // Map experience levels to match model files
    const experienceMapping: { [key: string]: string } = {
      'entry': 'Entry-level',
      'mid': 'Mid-level',
      'senior': 'Senior-level',
      'expert': 'Executive'
    };

    // Map industry names to match model files
    const industryMapping: { [key: string]: string } = {
      'technology': 'Technology',
      'healthcare': 'Healthcare',
      'finance': 'Finance',
      'education': 'Education',
      'manufacturing': 'Manufacturing',
      'retail': 'Retail',
      'energy': 'Energy',
      'entertainment': 'Entertainment',
      'telecommunications': 'Telecommunications',
      'transportation': 'Transportation'
    };

    const mappedIndustry = industryMapping[industry] || 'Technology';
    const mappedExperience = experienceMapping[experience] || 'Mid-level';

    // Check if specific model file exists
    const modelFile = `job_forecasting_arima_${mappedIndustry}_${mappedExperience}.pkl`;
    const modelPath = path.join(modelsDir, modelFile);

    if (!fs.existsSync(modelPath)) {
      console.error('Model file not found:', modelPath);
      reject(new Error(`Model file not found: ${modelFile}`));
      return;
    }

    console.log('Using Python script:', pythonScript);
    console.log('Using model:', modelFile);
    console.log('Project root:', projectRoot);

    // Try multiple Python executables including virtual environment
    const venvPython = path.join(projectRoot, 'venv', 'bin', 'python');
    const pythonExecutables = [venvPython, 'python3', 'python', '/usr/bin/python3', '/usr/local/bin/python3'];
    let pythonProcess: any = null;

    for (const pythonExe of pythonExecutables) {
      try {
        pythonProcess = spawn(pythonExe, [pythonScript, mappedIndustry, mappedExperience], {
          cwd: projectRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, PYTHONPATH: projectRoot }
        });
        console.log(`Successfully started Python process with: ${pythonExe}`);
        break;
      } catch (error) {
        console.log(`Failed to start with ${pythonExe}:`, error);
        continue;
      }
    }

    if (!pythonProcess) {
      reject(new Error('No Python executable found'));
      return;
    }

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', stderr);
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);

        if (result.error) {
          reject(new Error(result.error));
          return;
        }

        // Convert Python script output to our expected format
        const predictions = convertPythonOutputToPredictions(result, industry, experience);
        resolve(predictions);

      } catch (error) {
        console.error('Failed to parse Python output:', stdout);
        reject(new Error('Failed to parse Python script output'));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(new Error('Failed to start Python process'));
    });
  });
}

function convertPythonOutputToPredictions(pythonResult: any, industry: string, experience: string): PredictionData[] {
  // Industry-specific job mappings
  const industryJobs: { [key: string]: string[] } = {
    'technology': ['Software Engineer', 'Data Scientist', 'Product Manager'],
    'healthcare': ['Registered Nurse', 'Healthcare Administrator', 'Medical Technologist'],
    'finance': ['Financial Analyst', 'Risk Manager', 'Investment Advisor'],
    'education': ['Teacher', 'Education Coordinator', 'Curriculum Developer'],
    'manufacturing': ['Production Manager', 'Quality Engineer', 'Supply Chain Analyst'],
    'retail': ['Store Manager', 'Sales Analyst', 'Customer Experience Manager'],
    'energy': ['Energy Analyst', 'Project Engineer', 'Sustainability Coordinator'],
    'entertainment': ['Digital Content Manager', 'Media Analyst', 'Production Coordinator'],
    'telecommunications': ['Network Engineer', 'Telecom Analyst', 'Technical Support Manager'],
    'transportation': ['Logistics Coordinator', 'Fleet Manager', 'Transportation Analyst']
  };

  const jobs = industryJobs[industry] || industryJobs['technology'];

  return jobs.map((jobTitle, index) => ({
    jobTitle,
    salaryRange: getSalaryRange(jobTitle, industry, experience),
    currentDemand: pythonResult.current_demand || 75.0,
    year1Growth: pythonResult.year1_growth || 12.0,
    year2Growth: pythonResult.year2_growth || 8.0,
    totalGrowth: pythonResult.total_growth || 20.0,
    confidenceScore: pythonResult.confidence_score || 95.0,
    skills: getJobSkills(jobTitle),
    educationPathways: getEducationPathways(jobTitle, industry),
    monthlyPredictions: pythonResult.monthly_predictions || generateMonthlyPredictions(75.0, 12.0, 8.0)
  }));
}

function getSalaryRange(jobTitle: string, industry: string, experience: string): string {
  const salaryBases: { [key: string]: { min: number; max: number } } = {
    'technology': { min: 70000, max: 120000 },
    'healthcare': { min: 50000, max: 90000 },
    'finance': { min: 60000, max: 110000 },
    'education': { min: 40000, max: 70000 },
    'manufacturing': { min: 55000, max: 95000 },
    'retail': { min: 35000, max: 80000 },
    'energy': { min: 65000, max: 115000 },
    'entertainment': { min: 40000, max: 85000 },
    'telecommunications': { min: 60000, max: 105000 },
    'transportation': { min: 45000, max: 85000 }
  };

  const expMultipliers: { [key: string]: { min: number; max: number } } = {
    'entry': { min: 0.7, max: 0.8 },
    'mid': { min: 1.0, max: 1.0 },
    'senior': { min: 1.3, max: 1.4 },
    'expert': { min: 1.6, max: 1.8 }
  };

  const salaryBase = salaryBases[industry] || salaryBases['technology'];
  const multiplier = expMultipliers[experience] || expMultipliers['mid'];

  const minSalary = Math.round(salaryBase.min * multiplier.min);
  const maxSalary = Math.round(salaryBase.max * multiplier.max);

  return `LKR ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`;
}

function getJobSkills(jobTitle: string): string[] {
  const skillsMap: { [key: string]: string[] } = {
    'Software Engineer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL'],
    'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
    'Product Manager': ['Product Strategy', 'Analytics', 'Communication', 'Agile', 'Market Research'],
    'Registered Nurse': ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking'],
    'Financial Analyst': ['Financial Modeling', 'Excel', 'Data Analysis', 'Risk Assessment'],
    'Teacher': ['Curriculum Development', 'Classroom Management', 'Communication', 'Assessment'],
    'Production Manager': ['Lean Manufacturing', 'Quality Control', 'Project Management', 'Leadership'],
    'Energy Analyst': ['Energy Systems', 'Data Analysis', 'Renewable Energy'],
    'Network Engineer': ['Network Administration', 'Telecommunications', 'System Architecture']
  };

  return skillsMap[jobTitle] || ['Communication', 'Problem Solving', 'Leadership', 'Technical Skills'];
}

function getEducationPathways(jobTitle: string, industry: string): any[] {
  return [
    {
      title: `${jobTitle} Professional Certificate`,
      institution: 'Professional Institute',
      duration: '6-12 months',
      alignment: Math.round((Math.random() * 15 + 80) * 100) / 100
    },
    {
      title: `Advanced ${industry.charAt(0).toUpperCase() + industry.slice(1)} Program`,
      institution: 'University',
      duration: '1-2 years',
      alignment: Math.round((Math.random() * 13 + 85) * 100) / 100
    }
  ];
}

function generateMonthlyPredictions(baseDemand: number, year1Growth: number, year2Growth: number): any[] {
  const predictions = [];

  for (let i = 0; i < 24; i++) {
    const monthName = `Month ${i + 1}`;

    let growthFactor;
    if (i < 12) {
      growthFactor = (year1Growth / 12) * (i + 1) / 100;
    } else {
      growthFactor = (year1Growth + (year2Growth / 12) * (i - 11)) / 100;
    }

    const seasonalFactor = 1 + 0.1 * Math.sin(2 * Math.PI * i / 12);
    const demand = Math.max(0, Math.min(100, baseDemand * (1 + growthFactor) * seasonalFactor));

    predictions.push({
      month: monthName,
      demand: Math.round(demand * 100) / 100
    });
  }

  return predictions;
}

async function getFallbackPredictions(industry: string, experience: string): Promise<PredictionData[]> {
  // This fallback should NOT be used if models are available
  console.warn('Using fallback predictions - models should be available');

  const industryJobs: { [key: string]: string[] } = {
    'technology': ['Software Engineer', 'Data Scientist', 'Product Manager'],
    'healthcare': ['Registered Nurse', 'Healthcare Administrator', 'Medical Technologist'],
    'finance': ['Financial Analyst', 'Risk Manager', 'Investment Advisor'],
    'education': ['Teacher', 'Education Coordinator', 'Curriculum Developer'],
    'manufacturing': ['Production Manager', 'Quality Engineer', 'Supply Chain Analyst'],
    'retail': ['Store Manager', 'Sales Analyst', 'Customer Experience Manager'],
    'energy': ['Energy Analyst', 'Project Engineer', 'Sustainability Coordinator'],
    'entertainment': ['Digital Content Manager', 'Media Analyst', 'Production Coordinator'],
    'telecommunications': ['Network Engineer', 'Telecom Analyst', 'Technical Support Manager'],
    'transportation': ['Logistics Coordinator', 'Fleet Manager', 'Transportation Analyst']
  };

  const jobs = industryJobs[industry] || industryJobs['technology'];

  return jobs.map(jobTitle => ({
    jobTitle,
    salaryRange: getSalaryRange(jobTitle, industry, experience),
    currentDemand: Math.round((Math.random() * 30 + 60) * 100) / 100,
    year1Growth: Math.round((Math.random() * 10 + 8) * 100) / 100,
    year2Growth: Math.round((Math.random() * 8 + 5) * 100) / 100,
    totalGrowth: Math.round((Math.random() * 18 + 13) * 100) / 100,
    confidenceScore: Math.round((Math.random() * 20 + 70) * 100) / 100,
    skills: getJobSkills(jobTitle),
    educationPathways: getEducationPathways(jobTitle, industry),
    monthlyPredictions: generateMonthlyPredictions(75, 12, 8)
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    const { industry, experience } = body;

    console.log('=== API PREDICTION REQUEST ===');
    console.log(`Industry: ${industry}, Experience: ${experience}`);

    if (!industry || !experience) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: 'Industry and experience are required' },
        { status: 400 }
      );
    }

    console.log(`Predicting for industry: ${industry}, experience: ${experience}`);

    try {
      console.log('Attempting to use ML models from models directory...');
      // First try to use actual Python models from the models directory
      const predictions = await runPythonPrediction(industry, experience);

      console.log('✅ Successfully used ML models');
      return NextResponse.json({
        predictions,
        metadata: {
          source: 'ml_models',
          industry,
          experience,
          timestamp: new Date().toISOString(),
          modelUsed: true,
          pythonEnvironment: true
        }
      });

    } catch (error) {
      console.error('❌ ML model prediction failed:', error);

      // Only use fallback if models truly aren't available
      console.log('Using fallback predictions...');
      const fallbackPredictions = await getFallbackPredictions(industry, experience);

      return NextResponse.json({
        predictions: fallbackPredictions,
        metadata: {
          source: 'fallback_simulation',
          industry,
          experience,
          timestamp: new Date().toISOString(),
          modelUsed: false,
          pythonEnvironment: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
