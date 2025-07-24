// components/layout/MobileMenu.js
import React from 'react';
import { X, Settings, Home, FileText, Users, Tag, BarChart3, Cog } from 'lucide-react';
import { ROLES } from '../../constants';

export const MobileMenu = ({ isOpen, onClose, activeTab, onTabChange, user }) => {
  const tabs = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'requests', label: 'คำขอซ่อม', icon: FileText },
  ];

  if (user.role === ROLES.ADMIN) {
    tabs.push(
      { id: 'users', label: 'จัดการผู้ใช้', icon: Users },
      { id: 'categories', label: 'หมวดหมู่', icon: Tag },
      { id: 'reports', label: 'รายงาน', icon: BarChart3 },
      { id: 'settings', label: 'ตั้งค่าระบบ', icon: Cog }
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl transform transition-transform">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">ระบบแจ้งซ่อม</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-3 rounded-lg mb-2 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3 text-sm">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {user.full_name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
              <p className="text-gray-500 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};