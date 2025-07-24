// components/requests/CostManagement.js
import React, { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { ROLES } from '../../constants';

export const CostManagement = ({ request, onUpdate, user }) => {
  const [estimatedCost, setEstimatedCost] = useState(request?.estimated_cost || 0);
  const [actualCost, setActualCost] = useState(request?.actual_cost || 0);
  const [loading, setLoading] = useState(false);

  // กำหนดสิทธิ์ตามบทบาท
  const canEditEstimated = user.role === ROLES.ADMIN;
  const canEditActual = user.role === ROLES.TECHNICIAN;

  const handleSaveCosts = async () => {
    setLoading(true);
    try {
      const updateData = {};
      
      // Admin สามารถแก้ไขค่าใช้จ่ายประเมินได้
      if (canEditEstimated) {
        updateData.estimated_cost = estimatedCost;
      }
      
      // Technician สามารถแก้ไขค่าใช้จ่ายจริงได้
      if (canEditActual) {
        updateData.actual_cost = actualCost;
      }

      const response = await apiCall(`/repair-requests/${request.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (response && response.success) {
        // Force callback to reload parent data
        if (onUpdate) {
          await onUpdate();
        }
      } else {
        console.error('Cost update failed:', response?.message);
      }
    } catch (error) {
      console.error('Error updating costs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <DollarSign className="w-4 h-4 mr-2" />
        ค่าใช้จ่าย
      </h4>
      
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ค่าใช้จ่ายประเมิน (บาท)
            {canEditEstimated && <span className="text-blue-600 ml-1">(แก้ไขได้)</span>}
          </label>
          {canEditEstimated ? (
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              ฿{estimatedCost?.toLocaleString() || '0'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ค่าใช้จ่ายจริง (บาท)
            {canEditActual && <span className="text-blue-600 ml-1">(แก้ไขได้)</span>}
          </label>
          {canEditActual ? (
            <input
              type="number"
              value={actualCost}
              onChange={(e) => setActualCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              ฿{actualCost?.toLocaleString() || '0'}
            </p>
          )}
        </div>
      </div>

      {(canEditEstimated || canEditActual) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveCosts}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></div>
                บันทึก...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1" />
                บันทึกค่าใช้จ่าย
              </>
            )}
          </button>
        </div>
      )}

      {/* Cost Summary */}
      {(estimatedCost > 0 || actualCost > 0) && Math.abs(parseFloat(actualCost) - parseFloat(estimatedCost)) > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">ผลต่างค่าใช้จ่าย:</span>
            <span className={`font-semibold ${
              parseFloat(actualCost) > parseFloat(estimatedCost) ? 'text-red-600' : 'text-green-600'
            }`}>
              ฿{Math.abs(parseFloat(actualCost) - parseFloat(estimatedCost)).toLocaleString()}
              {parseFloat(actualCost) > parseFloat(estimatedCost) ? ' เกิน' : ' ประหยัด'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};