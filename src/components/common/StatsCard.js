// components/common/StatsCard.js
import React from 'react';
import { TrendingUp } from 'lucide-react';

export const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
        <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
        {trend && (
          <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
            <span className="text-green-600 truncate">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-2 sm:p-3 rounded-full ${color} flex-shrink-0`}>
        <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </div>
    </div>
  </div>
);