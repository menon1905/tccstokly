import React from 'react';
import { Divide as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-gray-600',
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 break-all leading-tight">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};