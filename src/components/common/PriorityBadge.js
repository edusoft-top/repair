// components/common/PriorityBadge.js
import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { PRIORITY, PRIORITY_LABELS } from '../../constants';

export const PriorityBadge = ({ priority }) => {
  const getConfig = () => {
    switch (priority) {
      case PRIORITY.URGENT: 
        return { bg: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case PRIORITY.HIGH: 
        return { bg: 'bg-orange-100 text-orange-800', icon: Clock };
      default: 
        return { bg: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const { bg, icon: Icon } = getConfig();
  const text = PRIORITY_LABELS[priority] || priority;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg}`}>
      <Icon className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">{text}</span>
      <span className="sm:hidden">{text.charAt(0)}</span>
    </span>
  );
};