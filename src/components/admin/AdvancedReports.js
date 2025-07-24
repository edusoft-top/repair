// components/admin/AdvancedReports.js
import React, { useState } from 'react';
import { 
  Download, DollarSign, PieChart, Star, FileText, 
  CheckSquare, TrendingUp, Clock 
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { STATUS, ROLES } from '../../constants';

export const AdvancedReports = ({ requests, users }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredRequests = requests.filter(req => {
    const reqDate = new Date(req.created_at);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return reqDate >= startDate && reqDate <= endDate;
  });

  const stats = {
    total: filteredRequests.length,
    completed: filteredRequests.filter(r => r.status === STATUS.COMPLETED).length,
    pending: filteredRequests.filter(r => r.status === STATUS.PENDING).length,
    inProgress: filteredRequests.filter(r => r.status === STATUS.IN_PROGRESS).length,
    cancelled: filteredRequests.filter(r => r.status === STATUS.CANCELLED).length,
    totalCost: filteredRequests.reduce((sum, r) => sum + (r.actual_cost || 0), 0),
    estimatedCost: filteredRequests.reduce((sum, r) => sum + (r.estimated_cost || 0), 0)
  };

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
  const avgResolutionTime = stats.completed > 0 ? '2.5 วัน' : 'N/A'; // Mock data

  const exportReport = () => {
    const csvContent = [
      ['เลขที่', 'หัวข้อ', 'สถานะ', 'ความสำคัญ', 'ผู้แจ้ง', 'วันที่สร้าง', 'ค่าใช้จ่าย'],
      ...filteredRequests.map(req => [
        req.ticket_number,
        req.title,
        req.status,
        req.priority,
        req.requester_name,
        new Date(req.created_at).toLocaleDateString('th-TH'),
        req.actual_cost || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repair_report_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">รายงานและสถิติ</h2>
          <p className="text-gray-600 mt-1">รายงานการใช้งานระบบแจ้งซ่อม</p>
        </div>
        <button
          onClick={exportReport}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          ส่งออก CSV
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">ช่วงเวลา</h3>
        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatsCard title="คำขอทั้งหมด" value={stats.total} icon={FileText} color="bg-blue-500" />
        <StatsCard title="เสร็จสิ้น" value={stats.completed} icon={CheckSquare} color="bg-green-500" />
        <StatsCard title="อัตราความสำเร็จ" value={`${completionRate}%`} icon={TrendingUp} color="bg-purple-500" />
        <StatsCard title="เวลาเฉลี่ย" value={avgResolutionTime} icon={Clock} color="bg-orange-500" />
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          การวิเคราะห์ค่าใช้จ่าย
        </h3>
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
          <div>
            <p className="text-sm text-gray-600">ค่าใช้จ่ายประเมิน</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">฿{stats.estimatedCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">ค่าใช้จ่ายจริง</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">฿{stats.totalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">ผลต่าง</p>
            <p className={`text-xl sm:text-2xl font-bold ${stats.totalCost > stats.estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
              ฿{Math.abs(stats.totalCost - stats.estimatedCost).toLocaleString()}
              {stats.totalCost > stats.estimatedCost ? ' เกิน' : ' ประหยัด'}
            </p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2" />
          สถิติตามสถานะ
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-gray-600">รอดำเนินการ</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs sm:text-sm text-gray-600">กำลังดำเนินการ</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs sm:text-sm text-gray-600">เสร็จสิ้น</p>
          </div>
          <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs sm:text-sm text-gray-600">ยกเลิก</p>
          </div>
        </div>
      </div>

      {/* Top Technicians */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          ช่างที่ทำงานมากที่สุด
        </h3>
        <div className="space-y-3">
          {users.filter(u => u.role === ROLES.TECHNICIAN).slice(0, 5).map((tech, index) => {
            const techRequests = filteredRequests.filter(r => r.assigned_to == tech.id);
            return (
              <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base truncate">{tech.full_name}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">{techRequests.length} งาน</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};