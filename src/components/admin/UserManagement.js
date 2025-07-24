// components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { 
  Search, Users, UserPlus, Edit3, UserCheck, UserX, 
  Shield, Settings, User, Building 
} from 'lucide-react';
import { apiCall } from '../../utils/api';
import { StatsCard } from '../common/StatsCard';
import { UserModal } from './UserModal';
import { ROLES, ROLE_LABELS } from '../../constants';

export const UserManagement = ({ onNotification }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiCall('/users');
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      let response;
      if (editingUser) {
        response = await apiCall(`/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(userData)
        });
        if (response && response.success) {
          onNotification('แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว', 'success');
        } else {
          onNotification(response?.message || 'เกิดข้อผิดพลาดในการแก้ไข', 'error');
          throw new Error(response?.message || 'Update failed');
        }
      } else {
        response = await apiCall('/users', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
        if (response && response.success) {
          onNotification('เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว', 'success');
        } else {
          onNotification(response?.message || 'เกิดข้อผิดพลาดในการเพิ่ม', 'error');
          throw new Error(response?.message || 'Create failed');
        }
      }
      
      // Force reload data
      await loadUsers();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
      throw error;
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: currentStatus ? 0 : 1 })
      });
      
      if (response && response.success) {
        onNotification(
          `${currentStatus ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}บัญชีเรียบร้อยแล้ว`, 
          'success'
        );
        // Force reload data
        await loadUsers();
      } else {
        onNotification(response?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ', 'error');
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ', 'error');
    }
  };

  const getRoleBadge = (role) => {
    const configs = {
      [ROLES.ADMIN]: { bg: 'bg-red-100 text-red-800', icon: Shield, text: ROLE_LABELS[ROLES.ADMIN] },
      [ROLES.TECHNICIAN]: { bg: 'bg-blue-100 text-blue-800', icon: Settings, text: ROLE_LABELS[ROLES.TECHNICIAN] },
      [ROLES.USER]: { bg: 'bg-green-100 text-green-800', icon: User, text: ROLE_LABELS[ROLES.USER] }
    };
    
    const config = configs[role] || configs[ROLES.USER];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">{config.text}</span>
        <span className="sm:hidden">{config.text.charAt(0)}</span>
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h2>
          <p className="text-gray-600 mt-1">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowUserModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="ผู้ใช้ทั้งหมด"
          value={users.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatsCard
          title="ผู้ดูแลระบบ"
          value={users.filter(u => u.role === ROLES.ADMIN).length}
          icon={Shield}
          color="bg-red-500"
        />
        <StatsCard
          title="ช่างเทคนิค"
          value={users.filter(u => u.role === ROLES.TECHNICIAN).length}
          icon={Settings}
          color="bg-blue-500"
        />
        <StatsCard
          title="บัญชีที่เปิดใช้งาน"
          value={users.filter(u => u.is_active).length}
          icon={UserCheck}
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกบทบาท</option>
              <option value={ROLES.ADMIN}>ผู้ดูแลระบบ</option>
              <option value={ROLES.TECHNICIAN}>ช่างเทคนิค</option>
              <option value={ROLES.USER}>ผู้ใช้ทั่วไป</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="active">เปิดใช้งาน</option>
              <option value="inactive">ปิดใช้งาน</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>แสดง {filteredUsers.length} คนจากทั้งหมด {users.length} คน</span>
          </div>
        </div>
      </div>

      {/* Mobile-friendly user list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ใช้
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  บทบาท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  แผนก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.full_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="w-4 h-4 mr-1 text-gray-400" />
                      {user.department || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          เปิดใช้งาน
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          ปิดใช้งาน
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                        className={`transition-colors ${
                          user.is_active 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                      >
                        {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{user.full_name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowUserModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                    className={`p-1 ${
                      user.is_active 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {getRoleBadge(user.role)}
                <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </span>
                {user.department && (
                  <span className="text-gray-500">
                    <Building className="w-3 h-3 inline mr-1" />
                    {user.department}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                สร้างเมื่อ: {new Date(user.created_at).toLocaleDateString('th-TH')}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบผู้ใช้งาน</h3>
            <p className="text-gray-600">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>

      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          isEdit={!!editingUser}
        />
      )}
    </div>
  );
};