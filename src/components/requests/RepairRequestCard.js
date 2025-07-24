// components/requests/RepairRequestCard.js
import React from 'react';
import { MapPin, User, Trash2 } from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ROLES } from '../../constants';

export const RepairRequestCard = ({ request, onClick, onDelete, user }) => {
  const canDelete = user.role === ROLES.ADMIN;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0" onClick={onClick}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {request.title}
          </h3>
          <p className="text-sm text-gray-600">#{request.ticket_number}</p>
        </div>
        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
          <PriorityBadge priority={request.priority} />
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(request.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div onClick={onClick}>
        <p className="text-gray-700 mb-4 line-clamp-2 text-sm sm:text-base">{request.description}</p>

        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={request.status} />
          <span className="text-xs sm:text-sm text-gray-500 truncate ml-2">{request.category_name}</span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{request.location}</span>
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{request.requester_name}</span>
            </div>
          </div>
          <div className="text-right space-y-1 ml-2 flex-shrink-0">
            <div>{new Date(request.created_at).toLocaleDateString('th-TH')}</div>
            {request.technician_name && (
              <div className="text-blue-600 font-medium truncate">{request.technician_name}</div>
            )}
            {user.role !== ROLES.USER && (request.estimated_cost > 0 || request.actual_cost > 0) && (
              <div className="text-xs text-gray-500">
                ฿{(request.actual_cost || request.estimated_cost).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};