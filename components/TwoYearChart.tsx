import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TwoYearChart = ({ predictions, industry }) => {
  // Prepare data from the dataset
  const prepareChartData = () => {
    const industryData = {};
    predictions.forEach(job => {
      if (!industryData[job.Industry]) {
        industryData[job.Industry] = { Industry: job.Industry, totalSalary: 0, count: 0, growthCount: 0 };
      }
      industryData[job.Industry].totalSalary += job.Salary_USD;
      industryData[job.Industry].count += 1;
      if (job.Job_Growth_Projection === 'Growth') {
        industryData[job.Industry].growthCount += 1;
      }
    });

    return Object.values(industryData).map(data => ({
      Industry: data.Industry,
      AvgSalary: Number((data.totalSalary / data.count).toFixed(2)),
      GrowthPercentage: Number(((data.growthCount / data.count) * 100).toFixed(2)),
    }));
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Job Market Insights - {industry.charAt(0).toUpperCase() + industry.slice(1)}
        </h2>
        <p className="text-sm text-gray-600">
          Average salary and growth percentage by industry
        </p>
      </div>

      {/* Bar Chart for Average Salary and Growth Percentage */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Industry Insights</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="Industry" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 'Avg Salary (USD)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'Growth %', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="AvgSalary" fill="#3B82F6" name="Avg Salary (USD)" />
              <Bar yAxisId="right" dataKey="GrowthPercentage" fill="#10B981" name="Growth %"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TwoYearChart;