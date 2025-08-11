import React from 'react';
import { Building2, Code, Heart, GraduationCap, Factory, ShoppingBag, DollarSign, Briefcase, Zap, Film, Radio, Truck } from 'lucide-react';

interface IndustrySelectorProps {
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
}

const industries = [
  { id: 'technology', name: 'Technology', icon: Code, color: 'blue' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'red' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'green' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'purple' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, color: 'orange' },
  { id: 'retail', name: 'Retail', icon: ShoppingBag, color: 'pink' },
  { id: 'energy', name: 'Energy', icon: Zap, color: 'yellow' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: 'indigo' },
  { id: 'telecommunications', name: 'Telecom', icon: Radio, color: 'cyan' },
  { id: 'transportation', name: 'Transport', icon: Truck, color: 'emerald' },
];

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustry,
  onIndustryChange,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {industries.map((industry) => {
          const Icon = industry.icon;
          const isSelected = selectedIndustry === industry.id;
          
          return (
            <button
              key={industry.id}
              onClick={() => onIndustryChange(industry.id)}
              className={`p-3 text-left border rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                isSelected
                  ? `border-${industry.color}-500 bg-${industry.color}-50 text-${industry.color}-700`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? `text-${industry.color}-600` : 'text-gray-500'}`} />
              <span className="text-sm">{industry.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IndustrySelector;