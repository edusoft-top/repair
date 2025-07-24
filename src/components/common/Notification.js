// components/common/Notification.js
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 text-green-800' : 
                  type === 'error' ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800';

  return (
    <div className={`fixed top-4 right-4 left-4 md:left-auto z-50 ${bgColor} px-4 py-3 rounded-lg shadow-lg border flex items-center justify-between`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};