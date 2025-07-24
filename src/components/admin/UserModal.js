// components/admin/UserModal.js
import React, { useState, useEffect } from 'react';
import { X, Save, Eye, User, Settings, Shield } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../constants';

export const UserModal = ({ user: editUser, onClose, onSave, isEdit = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: ROLES.USER,
    department: '',
    is_active: 1
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editUser && isEdit) {
      setFormData({
        username: editUser.username || '',
        email: editUser.email || '',
        password: '',
        full_name: editUser.full_name || '',
        phone: editUser.phone || '',
        role: editUser.role || ROLES.USER,
        department: editUser.department || '',
        is_active: editUser.is_active || 1
      });
    }
  }, [editUser, isEdit]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: ROLES.USER, label: ROLE_LABELS[ROLES.USER], icon: User },
    { value: ROLES.TECHNICIAN, label: ROLE_LABELS[ROLES.TECHNICIAN], icon: Settings },
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN], icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            {isEdit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="username"
                disabled={isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="นาย สมชาย ใจดี"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="02-123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">แผนก</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="IT, HR, Finance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บทบาท <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน {!isEdit && <span className="text-red-500">*</span>}
                {isEdit && <span className="text-gray-500">(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isEdit ? "กรอกหากต้องการเปลี่ยนรหัสผ่าน" : "รหัสผ่าน"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">เปิดใช้งานบัญชี</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 order-2 sm:order-1"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.username || !formData.email || !formData.full_name || (!isEdit && !formData.password)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 flex items-center justify-center order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};