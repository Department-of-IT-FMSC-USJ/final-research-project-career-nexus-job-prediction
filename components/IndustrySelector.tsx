import React from 'react';
import { Building2, Code, Heart, GraduationCap, Factory, ShoppingBag, DollarSign, Briefcase } from 'lucide-react';

interface IndustrySelectorProps {
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
}

const industries = [
  { id: 'technology', name: 'IT', icon: Code, color: 'blue' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'red' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'green' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'purple' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, color: 'orange' },
  { id: 'retail', name: 'Retail', icon: ShoppingBag, color: 'pink' },
  { id: 'consulting', name: 'Consulting', icon: Briefcase, color: 'indigo' },
  { id: 'construction', name: 'Construction', icon: Building2, color: 'yellow' },
];

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ selectedIndustry, onIndustryChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Industry Sector
      </label>
      <div className="grid grid-cols-2 gap-3">
        {industries.map((industry) => {
          const Icon = industry.icon;
          const isSelected = selectedIndustry === industry.id;
          
          return (
            <button
              key={industry.id}
              onClick={() => onIndustryChange(industry.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 text-sm font-medium ${
                isSelected
                  ? `border-${industry.color}-500 bg-${industry.color}-50 text-${industry.color}-700`
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? `text-${industry.color}-600` : 'text-gray-500'}`} />
              <span>{industry.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IndustrySelector;