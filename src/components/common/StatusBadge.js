// components/common/StatusBadge.js
import React from 'react';
import { STATUS, STATUS_LABELS } from '../../constants';

export const StatusBadge = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case STATUS.PENDING: 
        return { bg: 'bg-yellow-100 text-yellow-800', text: STATUS_LABELS[STATUS.PENDING] };
      case STATUS.ASSIGNED: 
        return { bg: 'bg-blue-100 text-blue-800', text: STATUS_LABELS[STATUS.ASSIGNED] };
      case STATUS.IN_PROGRESS: 
        return { bg: 'bg-indigo-100 text-indigo-800', text: STATUS_LABELS[STATUS.IN_PROGRESS] };
      case STATUS.COMPLETED: 
        return { bg: 'bg-green-100 text-green-800', text: STATUS_LABELS[STATUS.COMPLETED] };
      case STATUS.CANCELLED: 
        return { bg: 'bg-red-100 text-red-800', text: STATUS_LABELS[STATUS.CANCELLED] };
      default: 
        return { bg: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  const { bg, text } = getConfig();
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg}`}>{text}</span>;
};