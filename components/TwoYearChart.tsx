import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MonthlyPrediction {
  month: string;
  demand: number;
  year: number;
}

interface TwoYearChartProps {
  predictions: any[];
  industry: string;
}

const TwoYearChart: React.FC<TwoYearChartProps> = ({ predictions, industry }) => {
  // Prepare data for visualization
  const prepareChartData = () => {
    if (!predictions.length) return [];
    
    // Get the top 3 jobs for cleaner visualization
    const topJobs = predictions.slice(0, 3);
    
    // Create monthly data structure
    const monthlyData: any[] = [];
    
    for (let month = 0; month < 24; month++) {
      const monthData: any = {
        month: topJobs[0]?.monthlyPredictions[month]?.month || `Month ${month + 1}`,
        year: month < 12 ? 1 : 2
      };
      
      topJobs.forEach((job, index) => {
        const prediction = job.monthlyPredictions[month];
        monthData[`job${index + 1}`] = prediction?.demand || 0;
        monthData[`job${index + 1}Name`] = job.jobTitle;
      });
      
      monthlyData.push(monthData);
    }
    
    return monthlyData;
  };

  const chartData = prepareChartData();
  const topJobs = predictions.slice(0, 3);

  const colors = ['#3B82F6', '#8B5CF6', '#10B981'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          24-Month Demand Forecast - {industry.charAt(0).toUpperCase() + industry.slice(1)}
        </h2>
        <p className="text-sm text-gray-600">
          Monthly demand predictions for the top 3 most promising jobs
        </p>
      </div>

      {/* Line Chart for Monthly Trends */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Demand Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Demand Index', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {topJobs.map((job, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={`job${index + 1}`}
                  stroke={colors[index]}
                  strokeWidth={3}
                  dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                  name={job.jobTitle}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Year-over-Year Growth Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={predictions.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="jobTitle" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="year1Growth" fill="#3B82F6" name="Year 1 Growth %" />
              <Bar dataKey="year2Growth" fill="#8B5CF6" name="Year 2 Growth %" />
              <Bar dataKey="totalGrowth" fill="#10B981" name="Total 2-Year Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topJobs.map((job, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{job.jobTitle}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Year 1:</span>
                <span className={`font-medium ${job.year1Growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {job.year1Growth > 0 ? '+' : ''}{job.year1Growth}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Year 2:</span>
                <span className={`font-medium ${job.year2Growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {job.year2Growth > 0 ? '+' : ''}{job.year2Growth}%
                </span>
              </div>
              <div className="flex justify-between text-xs border-t pt-2">
                <span className="text-gray-800 font-medium">Total:</span>
                <span className={`font-bold ${job.totalGrowth > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {job.totalGrowth > 0 ? '+' : ''}{job.totalGrowth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwoYearChart;