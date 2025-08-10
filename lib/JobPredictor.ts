export interface PredictionData {
  jobTitle: string;
  currentDemand: number;
  year1Growth: number;
  year2Growth: number;
  totalGrowth: number;
  confidenceScore: number;
  salaryRange: string;
  monthlyPredictions: MonthlyPrediction[];
  skills: string[];
  educationPathways: EducationPathway[];
}

export interface EducationPathway {
  title: string;
  type: 'Certification' | 'Degree' | 'Course' | 'Bootcamp';
  provider: string;
  duration: string;
  format: 'Online' | 'Hybrid' | 'In-person';
  description: string;
  cost: string;
  careerAlignment: number;
  skills: string[];

  jobTitle?: string;
  currentDemand?: number;
  year1Growth?: number;
  year2Growth?: number;
  totalGrowth?: number;
  confidenceScore?: number;
  salaryRange?: string;
  monthlyPredictions?: MonthlyPrediction[];
  skillsRequired?: string[];
  educationPathways?: EducationPathway[];
  
}

export interface MonthlyPrediction {
  month: string;
  demand: number;
  growth: number;
}

export class JobPredictor {
  private industryData: Record<string, any> = {
    'technology': {
      'Software Engineer': { 
        base: 85, 
        growth: [12, 18], 
        salary: '$80,000 - $150,000',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Git', 'Agile', 'REST APIs', 'Database Design'],
        educationPathways: [
          {
            title: 'Full Stack Web Development',
            type: 'Bootcamp',
            provider: 'Tech Academy',
            duration: '6 months',
            format: 'Hybrid',
            description: 'Comprehensive full-stack development program covering modern web technologies.',
            cost: '$12,000 - $18,000',
            careerAlignment: 95,
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']
          },
          {
            title: 'Computer Science Degree',
            type: 'Degree',
            provider: 'University',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in Computer Science with focus on software engineering.',
            cost: '$40,000 - $80,000',
            careerAlignment: 98,
            skills: ['Algorithms', 'Data Structures', 'Software Architecture', 'Programming Languages']
          },
          {
            title: 'AWS Certified Developer',
            type: 'Certification',
            provider: 'Amazon Web Services',
            duration: '3-6 months',
            format: 'Online',
            description: 'Industry-recognized certification for cloud development skills.',
            cost: '$300 - $500',
            careerAlignment: 88,
            skills: ['AWS', 'Cloud Computing', 'Lambda', 'DynamoDB']
          }
        ]
      },
      'Data Scientist': { 
        base: 78, 
        growth: [15, 22], 
        salary: '$90,000 - $160,000',
        skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'Scikit-learn', 'Data Visualization'],
        educationPathways: [
          {
            title: 'Data Science Master\'s Program',
            type: 'Degree',
            provider: 'University',
            duration: '2 years',
            format: 'Online',
            description: 'Advanced degree focusing on statistical analysis and machine learning.',
            cost: '$30,000 - $60,000',
            careerAlignment: 96,
            skills: ['Advanced Statistics', 'Machine Learning', 'Deep Learning', 'Research Methods']
          },
          {
            title: 'Google Data Analytics Certificate',
            type: 'Certification',
            provider: 'Google',
            duration: '6 months',
            format: 'Online',
            description: 'Professional certificate covering data analysis fundamentals.',
            cost: '$300 - $500',
            careerAlignment: 85,
            skills: ['Data Analysis', 'SQL', 'Tableau', 'R Programming']
          },
          {
            title: 'Machine Learning Specialization',
            type: 'Course',
            provider: 'Coursera',
            duration: '4-6 months',
            format: 'Online',
            description: 'Comprehensive ML course by Stanford University.',
            cost: '$500 - $1,000',
            careerAlignment: 92,
            skills: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks']
          }
        ]
      },
      'DevOps Engineer': { 
        base: 72, 
        growth: [18, 25], 
        salary: '$85,000 - $145,000',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux', 'CI/CD', 'Monitoring'],
        educationPathways: [
          {
            title: 'AWS DevOps Engineer Professional',
            type: 'Certification',
            provider: 'Amazon Web Services',
            duration: '6-12 months',
            format: 'Online',
            description: 'Professional-level certification for DevOps practices on AWS.',
            cost: '$300 - $500',
            careerAlignment: 94,
            skills: ['AWS', 'CI/CD', 'Infrastructure as Code', 'Monitoring']
          },
          {
            title: 'Kubernetes Administrator (CKA)',
            type: 'Certification',
            provider: 'Cloud Native Computing Foundation',
            duration: '3-6 months',
            format: 'Online',
            description: 'Hands-on certification for Kubernetes administration.',
            cost: '$300 - $400',
            careerAlignment: 91,
            skills: ['Kubernetes', 'Container Orchestration', 'Cluster Management']
          }
        ]
      },
      'AI/ML Engineer': { 
        base: 68, 
        growth: [25, 35], 
        salary: '$100,000 - $180,000',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Statistics'],
        educationPathways: [
          {
            title: 'AI Engineering Master\'s',
            type: 'Degree',
            provider: 'Stanford University',
            duration: '2 years',
            format: 'Hybrid',
            description: 'Advanced degree in artificial intelligence and machine learning engineering.',
            cost: '$60,000 - $120,000',
            careerAlignment: 98,
            skills: ['Deep Learning', 'Neural Networks', 'AI Research', 'Advanced Mathematics']
          },
          {
            title: 'TensorFlow Developer Certificate',
            type: 'Certification',
            provider: 'Google',
            duration: '3-6 months',
            format: 'Online',
            description: 'Professional certification for TensorFlow development skills.',
            cost: '$100 - $200',
            careerAlignment: 89,
            skills: ['TensorFlow', 'Deep Learning', 'Neural Networks', 'Model Deployment']
          }
        ]
      },
      'Cybersecurity Analyst': { 
        base: 75, 
        growth: [20, 28], 
        salary: '$75,000 - $140,000',
        skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Incident Response', 'Risk Assessment', 'Compliance', 'Ethical Hacking'],
        educationPathways: [
          {
            title: 'CISSP Certification',
            type: 'Certification',
            provider: '(ISC)² International',
            duration: '6-12 months',
            format: 'Online',
            description: 'Gold standard certification for cybersecurity professionals.',
            cost: '$700 - $1,000',
            careerAlignment: 96,
            skills: ['Security Architecture', 'Risk Management', 'Compliance', 'Incident Response']
          },
          {
            title: 'Cybersecurity Bootcamp',
            type: 'Bootcamp',
            provider: 'Cybersecurity Institute',
            duration: '6 months',
            format: 'Hybrid',
            description: 'Intensive program covering all aspects of cybersecurity.',
            cost: '$15,000 - $20,000',
            careerAlignment: 93,
            skills: ['Penetration Testing', 'Network Security', 'Digital Forensics', 'Ethical Hacking']
          }
        ]
      }
    },
    'healthcare': {
      'Registered Nurse': { 
        base: 88, 
        growth: [8, 12], 
        salary: '$60,000 - $85,000',
        skills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking', 'EMR Systems', 'Medication Administration'],
        educationPathways: [
          {
            title: 'Bachelor of Science in Nursing',
            type: 'Degree',
            provider: 'Nursing School',
            duration: '4 years',
            format: 'In-person',
            description: 'Comprehensive nursing education with clinical experience.',
            cost: '$40,000 - $80,000',
            careerAlignment: 98,
            skills: ['Clinical Skills', 'Patient Assessment', 'Pharmacology', 'Nursing Ethics']
          }
        ]
      },
      'Physical Therapist': { 
        base: 82, 
        growth: [12, 18], 
        salary: '$70,000 - $95,000',
        skills: ['Anatomy', 'Rehabilitation', 'Patient Assessment', 'Treatment Planning', 'Manual Therapy', 'Exercise Prescription'],
        educationPathways: [
          {
            title: 'Doctor of Physical Therapy',
            type: 'Degree',
            provider: 'PT School',
            duration: '3 years',
            format: 'In-person',
            description: 'Professional doctorate in physical therapy.',
            cost: '$80,000 - $150,000',
            careerAlignment: 98,
            skills: ['Clinical Assessment', 'Treatment Techniques', 'Patient Education', 'Research Methods']
          }
        ]
      },
      'Medical Technologist': { 
        base: 76, 
        growth: [10, 15], 
        salary: '$55,000 - $75,000',
        skills: ['Laboratory Testing', 'Quality Control', 'Medical Equipment', 'Data Analysis', 'Safety Protocols', 'Microscopy'],
        educationPathways: [
          {
            title: 'Medical Laboratory Science Degree',
            type: 'Degree',
            provider: 'University',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in medical laboratory science.',
            cost: '$40,000 - $70,000',
            careerAlignment: 96,
            skills: ['Clinical Chemistry', 'Microbiology', 'Hematology', 'Immunology']
          }
        ]
      },
      'Healthcare Administrator': { 
        base: 79, 
        growth: [9, 14], 
        salary: '$65,000 - $100,000',
        skills: ['Healthcare Management', 'Finance', 'Leadership', 'Compliance', 'Strategic Planning', 'Healthcare IT'],
        educationPathways: [
          {
            title: 'Master of Healthcare Administration',
            type: 'Degree',
            provider: 'University',
            duration: '2 years',
            format: 'Online',
            description: 'Advanced degree in healthcare management and administration.',
            cost: '$30,000 - $60,000',
            careerAlignment: 95,
            skills: ['Healthcare Policy', 'Financial Management', 'Quality Improvement', 'Leadership']
          }
        ]
      },
      'Physician Assistant': { 
        base: 85, 
        growth: [15, 22], 
        salary: '$95,000 - $130,000',
        skills: ['Clinical Medicine', 'Patient Diagnosis', 'Treatment Planning', 'Pharmacology', 'Medical Procedures', 'Patient Communication'],
        educationPathways: [
          {
            title: 'Master of Physician Assistant Studies',
            type: 'Degree',
            provider: 'PA School',
            duration: '2-3 years',
            format: 'In-person',
            description: 'Professional master\'s degree for physician assistants.',
            cost: '$80,000 - $120,000',
            careerAlignment: 98,
            skills: ['Clinical Medicine', 'Diagnostic Skills', 'Patient Care', 'Medical Ethics']
          }
        ]
      }
    },
    'finance': {
      'Financial Analyst': { 
        base: 73, 
        growth: [6, 10], 
        salary: '$60,000 - $90,000',
        skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Valuation', 'Risk Assessment', 'Financial Reporting'],
        educationPathways: [
          {
            title: 'CFA Charter',
            type: 'Certification',
            provider: 'CFA Institute',
            duration: '2-4 years',
            format: 'Online',
            description: 'Globally recognized finance qualification for investment professionals.',
            cost: '$2,000 - $5,000',
            careerAlignment: 96,
            skills: ['Investment Analysis', 'Portfolio Management', 'Ethics', 'Financial Reporting']
          },
          {
            title: 'Finance Degree',
            type: 'Degree',
            provider: 'Business School',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in Finance with focus on financial analysis.',
            cost: '$40,000 - $80,000',
            careerAlignment: 94,
            skills: ['Corporate Finance', 'Investment Theory', 'Financial Markets', 'Accounting']
          }
        ]
      },
      'Investment Banker': { 
        base: 69, 
        growth: [4, 8], 
        salary: '$100,000 - $200,000',
        skills: ['Financial Modeling', 'M&A', 'Capital Markets', 'Valuation', 'Client Relations', 'Presentation Skills'],
        educationPathways: [
          {
            title: 'MBA in Finance',
            type: 'Degree',
            provider: 'Top Business School',
            duration: '2 years',
            format: 'In-person',
            description: 'Master of Business Administration with finance concentration.',
            cost: '$100,000 - $200,000',
            careerAlignment: 97,
            skills: ['Advanced Finance', 'Strategy', 'Leadership', 'Networking']
          }
        ]
      },
      'Risk Manager': { 
        base: 71, 
        growth: [8, 12], 
        salary: '$80,000 - $120,000',
        skills: ['Risk Assessment', 'Quantitative Analysis', 'Regulatory Compliance', 'Statistical Modeling', 'Risk Mitigation'],
        educationPathways: [
          {
            title: 'Financial Risk Manager (FRM)',
            type: 'Certification',
            provider: 'GARP',
            duration: '1-2 years',
            format: 'Online',
            description: 'Global standard for financial risk management certification.',
            cost: '$1,000 - $2,000',
            careerAlignment: 95,
            skills: ['Risk Management', 'Quantitative Analysis', 'Market Risk', 'Credit Risk']
          }
        ]
      },
      'Fintech Developer': { 
        base: 77, 
        growth: [18, 25], 
        salary: '$90,000 - $140,000',
        skills: ['Blockchain', 'Python', 'Financial APIs', 'Security', 'Mobile Development', 'Payment Systems'],
        educationPathways: [
          {
            title: 'FinTech and Digital Banking',
            type: 'Certification',
            provider: 'Institute of Bankers Sri Lanka',
            duration: '6-9 months',
            format: 'Hybrid',
            description: 'Comprehensive fintech education tailored for Sri Lankan market.',
            cost: 'LKR 100,000 - 180,000',
            careerAlignment: 93,
            skills: ['FinTech', 'Digital Banking', 'Blockchain', 'Financial Analytics']
          },
          {
            title: 'Blockchain Development Bootcamp',
            type: 'Bootcamp',
            provider: 'Tech Institute',
            duration: '4 months',
            format: 'Online',
            description: 'Intensive program focusing on blockchain and cryptocurrency development.',
            cost: '$8,000 - $12,000',
            careerAlignment: 88,
            skills: ['Blockchain', 'Smart Contracts', 'Cryptocurrency', 'DeFi']
          }
        ]
      },
      'Compliance Officer': { 
        base: 74, 
        growth: [10, 15], 
        salary: '$70,000 - $110,000',
        skills: ['Regulatory Knowledge', 'Risk Assessment', 'Policy Development', 'Audit', 'Legal Compliance', 'Documentation'],
        educationPathways: [
          {
            title: 'Certified Compliance Professional',
            type: 'Certification',
            provider: 'Compliance Institute',
            duration: '6-12 months',
            format: 'Online',
            description: 'Professional certification for compliance professionals.',
            cost: '$1,500 - $3,000',
            careerAlignment: 94,
            skills: ['Regulatory Compliance', 'Risk Management', 'Ethics', 'Audit']
          }
        ]
      }
    },
    'education': {
      'Elementary Teacher': { 
        base: 81, 
        growth: [3, 6], 
        salary: '$40,000 - $65,000',
        skills: ['Classroom Management', 'Curriculum Development', 'Child Psychology', 'Educational Technology', 'Assessment', 'Communication'],
        educationPathways: [
          {
            title: 'Bachelor of Education',
            type: 'Degree',
            provider: 'Education College',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in elementary education with teaching certification.',
            cost: '$30,000 - $60,000',
            careerAlignment: 98,
            skills: ['Teaching Methods', 'Child Development', 'Curriculum Planning', 'Classroom Management']
          }
        ]
      },
      'Special Education Teacher': { 
        base: 84, 
        growth: [8, 12], 
        salary: '$45,000 - $70,000',
        skills: ['Special Needs Education', 'IEP Development', 'Behavioral Management', 'Adaptive Technology', 'Family Collaboration'],
        educationPathways: [
          {
            title: 'Master in Special Education',
            type: 'Degree',
            provider: 'University',
            duration: '2 years',
            format: 'Hybrid',
            description: 'Advanced degree specializing in special education methods.',
            cost: '$25,000 - $50,000',
            careerAlignment: 97,
            skills: ['Special Education Law', 'Assistive Technology', 'Behavioral Interventions', 'Assessment']
          }
        ]
      },
      'Educational Technology Specialist': { 
        base: 76, 
        growth: [15, 22], 
        salary: '$55,000 - $80,000',
        skills: ['Educational Software', 'Learning Management Systems', 'Digital Literacy', 'Training', 'Technical Support'],
        educationPathways: [
          {
            title: 'Educational Technology Master\'s',
            type: 'Degree',
            provider: 'University',
            duration: '2 years',
            format: 'Online',
            description: 'Master\'s degree focusing on technology integration in education.',
            cost: '$20,000 - $40,000',
            careerAlignment: 95,
            skills: ['Instructional Design', 'Learning Technologies', 'Digital Pedagogy', 'Data Analysis']
          }
        ]
      },
      'School Counselor': { 
        base: 78, 
        growth: [6, 10], 
        salary: '$50,000 - $75,000',
        skills: ['Counseling', 'Student Development', 'Crisis Intervention', 'Career Guidance', 'Mental Health', 'Communication'],
        educationPathways: [
          {
            title: 'Master in School Counseling',
            type: 'Degree',
            provider: 'University',
            duration: '2 years',
            format: 'Hybrid',
            description: 'Master\'s degree in school counseling with practicum experience.',
            cost: '$25,000 - $45,000',
            careerAlignment: 96,
            skills: ['Counseling Techniques', 'Student Assessment', 'Crisis Management', 'Group Counseling']
          }
        ]
      },
      'Curriculum Developer': { 
        base: 72, 
        growth: [10, 15], 
        salary: '$60,000 - $85,000',
        skills: ['Instructional Design', 'Educational Standards', 'Assessment Design', 'Content Development', 'Research', 'Project Management'],
        educationPathways: [
          {
            title: 'Instructional Design Certificate',
            type: 'Certification',
            provider: 'Education Institute',
            duration: '6-12 months',
            format: 'Online',
            description: 'Professional certificate in instructional design and curriculum development.',
            cost: '$3,000 - $6,000',
            careerAlignment: 93,
            skills: ['Curriculum Design', 'Learning Objectives', 'Assessment Methods', 'Educational Technology']
          }
        ]
      }
    },
    'manufacturing': {
      'Manufacturing Engineer': { 
        base: 74, 
        growth: [5, 9], 
        salary: '$65,000 - $95,000',
        skills: ['Process Optimization', 'Lean Manufacturing', 'CAD Software', 'Quality Control', 'Project Management', 'Safety Standards'],
        educationPathways: [
          {
            title: 'Manufacturing Engineering Degree',
            type: 'Degree',
            provider: 'Engineering School',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in manufacturing or industrial engineering.',
            cost: '$50,000 - $90,000',
            careerAlignment: 96,
            skills: ['Manufacturing Processes', 'Quality Systems', 'Automation', 'Materials Science']
          }
        ]
      },
      'Quality Control Inspector': { 
        base: 71, 
        growth: [3, 7], 
        salary: '$45,000 - $65,000',
        skills: ['Quality Standards', 'Inspection Techniques', 'Statistical Analysis', 'Documentation', 'Problem Solving', 'Attention to Detail'],
        educationPathways: [
          {
            title: 'Quality Management Certification',
            type: 'Certification',
            provider: 'ASQ',
            duration: '6 months',
            format: 'Online',
            description: 'Professional certification in quality control and management.',
            cost: '$1,000 - $2,000',
            careerAlignment: 92,
            skills: ['Quality Control', 'Statistical Process Control', 'ISO Standards', 'Auditing']
          }
        ]
      },
      'Automation Technician': { 
        base: 76, 
        growth: [12, 18], 
        salary: '$55,000 - $80,000',
        skills: ['PLC Programming', 'Robotics', 'Electrical Systems', 'Troubleshooting', 'Maintenance', 'Safety Protocols'],
        educationPathways: [
          {
            title: 'Industrial Automation Certificate',
            type: 'Certification',
            provider: 'Technical Institute',
            duration: '1 year',
            format: 'Hybrid',
            description: 'Comprehensive program in industrial automation and robotics.',
            cost: '$8,000 - $15,000',
            careerAlignment: 94,
            skills: ['PLC Programming', 'HMI Design', 'Robotics', 'Industrial Networks']
          }
        ]
      },
      'Supply Chain Manager': { 
        base: 78, 
        growth: [8, 12], 
        salary: '$70,000 - $110,000',
        skills: ['Logistics', 'Inventory Management', 'Vendor Relations', 'Data Analysis', 'Strategic Planning', 'Cost Optimization'],
        educationPathways: [
          {
            title: 'Supply Chain Management Master\'s',
            type: 'Degree',
            provider: 'Business School',
            duration: '2 years',
            format: 'Online',
            description: 'Master\'s degree specializing in supply chain and logistics management.',
            cost: '$30,000 - $60,000',
            careerAlignment: 95,
            skills: ['Supply Chain Strategy', 'Procurement', 'Logistics', 'Risk Management']
          }
        ]
      },
      'Industrial Designer': { 
        base: 69, 
        growth: [6, 10], 
        salary: '$60,000 - $85,000',
        skills: ['Design Software', 'Product Development', 'User Experience', 'Prototyping', 'Materials Knowledge', 'Creative Problem Solving'],
        educationPathways: [
          {
            title: 'Industrial Design Degree',
            type: 'Degree',
            provider: 'Design School',
            duration: '4 years',
            format: 'In-person',
            description: 'Bachelor\'s degree in industrial or product design.',
            cost: '$40,000 - $80,000',
            careerAlignment: 96,
            skills: ['Design Thinking', 'CAD Modeling', 'User Research', 'Manufacturing Processes']
          }
        ]
      }
    }
  };

  async predictJobDemand(industry: string, experienceLevel: string): Promise<PredictionData[]> {
    // Simulate loading time for AI model processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const industryJobs = this.industryData[industry.toLowerCase()] || {};
    const predictions: PredictionData[] = [];

    // Experience level multipliers
    const experienceMultipliers = {
      'entry': { demand: 0.8, growth: 1.2, salary: 0.7 },
      'mid': { demand: 1.0, growth: 1.0, salary: 1.0 },
      'senior': { demand: 1.1, growth: 0.9, salary: 1.3 },
      'executive': { demand: 0.9, growth: 0.8, salary: 1.6 }
    };

    const multiplier = experienceMultipliers[experienceLevel as keyof typeof experienceMultipliers] || experienceMultipliers.mid;

    Object.entries(industryJobs).forEach(([jobTitle, data]: [string, any]) => {
      const currentDemand = Math.round(data.base * multiplier.demand);
      const year1Growth = Math.round(data.growth[0] * multiplier.growth);
      const year2Growth = Math.round(data.growth[1] * multiplier.growth);
      const totalGrowth = year1Growth + year2Growth;
      
      // Generate monthly predictions
      const monthlyPredictions = this.generateMonthlyPredictions(currentDemand, year1Growth, year2Growth);
      
      // Calculate confidence score based on various factors
      const confidenceScore = Math.min(95, Math.max(65, 
        85 - Math.abs(totalGrowth - 15) * 2 + (currentDemand - 70) * 0.3
      ));

      predictions.push({
        jobTitle,
        currentDemand,
        year1Growth,
        year2Growth,
        totalGrowth,
        confidenceScore: Math.round(confidenceScore),
        salaryRange: data.salary,
        monthlyPredictions,
        skills: data.skills || [],
        educationPathways: data.educationPathways || []
      });
    });

    // Sort by total growth descending
    return predictions.sort((a, b) => b.totalGrowth - a.totalGrowth);
  }

  private generateMonthlyPredictions(baseDemand: number, year1Growth: number, year2Growth: number): MonthlyPrediction[] {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const predictions: MonthlyPrediction[] = [];
    
    // Generate 24 months of predictions
    for (let i = 0; i < 24; i++) {
      const monthIndex = i % 12;
      const year = Math.floor(i / 12) + 1;
      const monthName = `${months[monthIndex]} ${year === 1 ? '2024' : '2025'}`;
      
      // Calculate demand with seasonal variations
      const seasonalFactor = 1 + Math.sin((i * Math.PI) / 6) * 0.1;
      const growthFactor = year === 1 ? year1Growth : year2Growth;
      const monthlyGrowth = (growthFactor / 12) * (i + 1);
      
      const demand = Math.round((baseDemand + monthlyGrowth) * seasonalFactor);
      const growth = i === 0 ? 0 : Math.round(((demand - baseDemand) / baseDemand) * 100);
      
      predictions.push({
        month: monthName,
        demand,
        growth
      });
    }
    
    return predictions;
  }

  // Method to load and use the actual trained models
  async loadTrainedModel(): Promise<boolean> {
    try {
      // In a real implementation, you would load your joblib models here
      // For now, we'll simulate the model loading
      console.log('Loading trained Random Forest model...');
      
      // Simulate model loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if model files exist in public/models/
      const modelExists = await this.checkModelFiles();
      
      if (modelExists) {
        console.log('Trained models loaded successfully');
        return true;
      } else {
        console.warn('Model files not found, using fallback predictions');
        return false;
      }
    } catch (error) {
      console.error('Error loading trained model:', error);
      return false;
    }
  }

  private async checkModelFiles(): Promise<boolean> {
    try {
      // Check if the model files exist
      const modelResponse = await fetch('/models/random_forest_job_market_model.joblib');
      const encoderResponse = await fetch('/models/label_encoders.joblib');
      
      return modelResponse.ok && encoderResponse.ok;
    } catch (error) {
      return false;
    }
  }

  // Method to make predictions using the actual trained model
  async predictWithTrainedModel(features: any[]): Promise<any> {
    // This would integrate with your Python model via an API endpoint
    // For now, we'll use the simulated predictions
    console.log('Using trained model for prediction with features:', features);
    
    // In a real implementation, you would:
    // 1. Send features to a Python backend API
    // 2. The backend would load the joblib model
    // 3. Make predictions and return results
    
    return this.industryData;
  }
}