// components/dashboard/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  Filter, Plus, FileText, Search, Clock, Timer, 
  CheckSquare, AlertTriangle, DollarSign 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { StatsCard } from '../common/StatsCard';
import { RepairRequestCard } from '../requests/RepairRequestCard';
import { NewRequestForm } from '../requests/NewRequestForm';
import { RequestDetailModal } from '../requests/RequestDetailModal';
import { UserManagement } from '../admin/UserManagement';
import { CategoryManagement } from '../admin/CategoryManagement';
import { SystemSettings } from '../admin/SystemSettings';
import { AdvancedReports } from '../admin/AdvancedReports';
import { ROLES, STATUS, PRIORITY } from '../../constants';

export const Dashboard = ({ onNotification, activeTab = 'dashboard', onTabChange }) => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, categoriesRes, usersRes] = await Promise.all([
        apiCall('/repair-requests'),
        apiCall('/categories'),
        user.role === ROLES.ADMIN ? apiCall('/users') : Promise.resolve({ success: true, data: [] })
      ]);

      if (requestsRes.success) {
        // กรองข้อมูลตามบทบาท
        let filteredRequestsData = requestsRes.data;
        
        if (user.role === ROLES.USER) {
          // user เห็นเฉพาะคำขอของตัวเอง
          filteredRequestsData = requestsRes.data.filter(req => req.requester_id == user.id);
        } else if (user.role === ROLES.TECHNICIAN) {
          // technician เห็นเฉพาะคำขอที่ได้รับมอบหมาย
          filteredRequestsData = requestsRes.data.filter(req => req.assigned_to == user.id);
        }
        // admin เห็นคำขอทั้งหมด (ไม่ต้องกรอง)
        
        setRequests(filteredRequestsData);
        calculateStats(filteredRequestsData);
      }
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (usersRes.success) {
        setAllUsers(usersRes.data);
        setTechnicians(usersRes.data.filter(u => u.role === ROLES.TECHNICIAN));
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const getFilterMessage = () => {
    switch (user.role) {
      case ROLES.USER:
        return 'แสดงคำขอของคุณ';
      case ROLES.TECHNICIAN:
        return 'แสดงคำขอที่มอบหมายให้คุณ';
      case ROLES.ADMIN:
        return 'แสดงคำขอทั้งหมด';
      default:
        return '';
    }
  };

  const calculateStats = (requestsData) => {
    const total = requestsData.length;
    const pending = requestsData.filter(r => r.status === STATUS.PENDING).length;
    const inProgress = requestsData.filter(r => r.status === STATUS.IN_PROGRESS).length;
    const completed = requestsData.filter(r => r.status === STATUS.COMPLETED).length;
    const urgent = requestsData.filter(r => r.priority === PRIORITY.URGENT).length;
    const totalCost = requestsData.reduce((sum, r) => sum + (r.actual_cost || 0), 0);

    setStats({ total, pending, inProgress, completed, urgent, totalCost });
  };

  const handleNewRequest = async (formData) => {
    try {
      const response = await apiCall('/repair-requests', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response && response.success) {
        setShowNewForm(false);
        // Force reload all data
        await loadData();
        onNotification('ส่งคำขอซ่อมเรียบร้อยแล้ว', 'success');
      } else {
        onNotification(response?.message || 'เกิดข้อผิดพลาดในการส่งคำขอ', 'error');
        throw new Error(response?.message || 'Request failed');
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการส่งคำขอ', 'error');
      throw error;
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบคำขอนี้?')) return;

    try {
      const response = await apiCall(`/repair-requests/${id}`, { method: 'DELETE' });
      if (response && response.success) {
        // Force reload all data
        await loadData();
        onNotification('ลบคำขอเรียบร้อยแล้ว', 'success');
      } else {
        onNotification(response?.message || 'เกิดข้อผิดพลาดในการลบคำขอ', 'error');
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการลบคำขอ', 'error');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return user.role === ROLES.ADMIN ? (
          <UserManagement onNotification={onNotification} />
        ) : null;
      case 'categories':
        return user.role === ROLES.ADMIN ? (
          <CategoryManagement onNotification={onNotification} />
        ) : null;
      case 'settings':
        return user.role === ROLES.ADMIN ? (
          <SystemSettings onNotification={onNotification} />
        ) : null;
      case 'reports':
        return user.role === ROLES.ADMIN ? (
          <AdvancedReports requests={requests} users={allUsers} />
        ) : null;
      case 'requests':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Filter Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{getFilterMessage()}</span>
                    {user.role === ROLES.TECHNICIAN && requests.length === 0 && 
                      ' - ยังไม่มีงานที่ได้รับมอบหมาย'
                    }
                  </p>
                </div>
              </div>
            </div>
      
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ค้นหาคำขอ, เลขที่, หรือสถานที่..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* ปุ่มแจ้งซ่อมใหม่ แสดงเฉพาะ user และ admin */}
                  {(user.role === ROLES.USER || user.role === ROLES.ADMIN) && (
                    <button
                      onClick={() => setShowNewForm(true)}
                      className="w-full lg:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      แจ้งซ่อมใหม่
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">ทุกสถานะ</option>
                    <option value={STATUS.PENDING}>รอดำเนินการ</option>
                    <option value={STATUS.ASSIGNED}>มอบหมายแล้ว</option>
                    <option value={STATUS.IN_PROGRESS}>กำลังดำเนินการ</option>
                    <option value={STATUS.COMPLETED}>เสร็จสิ้น</option>
                    <option value={STATUS.CANCELLED}>ยกเลิก</option>
                  </select>
      
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">ทุกระดับ</option>
                    <option value={PRIORITY.NORMAL}>ปกติ</option>
                    <option value={PRIORITY.HIGH}>สูง</option>
                    <option value={PRIORITY.URGENT}>เร่งด่วน</option>
                  </select>
                </div>
      
                <div className="flex items-center text-sm text-gray-600">
                  <Filter className="w-4 h-4 mr-2" />
                  <span>แสดง {filteredRequests.length} รายการจากทั้งหมด {requests.length} รายการ</span>
                </div>
              </div>
            </div>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRequests.map(request => (
                <RepairRequestCard 
                  key={request.id} 
                  request={request} 
                  onClick={() => setSelectedRequest(request)}
                  onDelete={handleDeleteRequest}
                  user={user}
                />
              ))}
            </div>
      
            {/* Empty State Messages */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                {requests.length === 0 ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {user.role === ROLES.USER && 'คุณยังไม่มีคำขอซ่อม'}
                      {user.role === ROLES.TECHNICIAN && 'ยังไม่มีงานที่ได้รับมอบหมาย'}
                      {user.role === ROLES.ADMIN && 'ยังไม่มีคำขอซ่อมในระบบ'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user.role === ROLES.USER && 'เริ่มต้นสร้างคำขอซ่อมแรกของคุณ'}
                      {user.role === ROLES.TECHNICIAN && 'รอการมอบหมายงานจากผู้ดูแลระบบ'}
                      {user.role === ROLES.ADMIN && 'เริ่มต้นใช้งานระบบแจ้งซ่อม'}
                    </p>
                    {(user.role === ROLES.USER || user.role === ROLES.ADMIN) && (
                      <button
                        onClick={() => setShowNewForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        แจ้งซ่อมใหม่
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลที่ค้นหา</h3>
                    <p className="text-gray-600">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
                  </>
                )}
              </div>
            )}
          </div>
        );        
      default: // dashboard
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              <StatsCard 
                title="คำขอทั้งหมด" 
                value={stats.total || 0} 
                icon={FileText} 
                color="bg-blue-500" 
              />
              <StatsCard 
                title="รอดำเนินการ" 
                value={stats.pending || 0} 
                icon={Clock} 
                color="bg-yellow-500" 
              />
              <StatsCard 
                title="กำลังดำเนินการ" 
                value={stats.inProgress || 0} 
                icon={Timer} 
                color="bg-indigo-500" 
              />
              <StatsCard 
                title="เสร็จสิ้นแล้ว" 
                value={stats.completed || 0} 
                icon={CheckSquare} 
                color="bg-green-500" 
              />
              <StatsCard 
                title="เร่งด่วน" 
                value={stats.urgent || 0} 
                icon={AlertTriangle} 
                color="bg-red-500" 
              />
            </div>

            {user.role !== ROLES.USER && stats.totalCost > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  ค่าใช้จ่ายรวม
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ฿{stats.totalCost.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">ค่าใช้จ่ายจริงทั้งหมด</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">คำขอล่าสุด</h3>
                <button
                  onClick={() => onTabChange('requests')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ดูทั้งหมด →
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.slice(0, 6).map(request => (
                  <RepairRequestCard 
                    key={request.id} 
                    request={request} 
                    onClick={() => setSelectedRequest(request)}
                    onDelete={handleDeleteRequest}
                    user={user}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}

      {showNewForm && (
        <NewRequestForm
          categories={categories}
          onSubmit={handleNewRequest}
          onCancel={() => setShowNewForm(false)}
        />
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={loadData}
          user={user}
          categories={categories}
          technicians={technicians}
        />
      )}
    </>
  );
};