// components/layout/NavigationTabs.js
import React from 'react';
import { Home, FileText, Users, Tag, BarChart3, Cog } from 'lucide-react';
import { ROLES } from '../../constants';

export const NavigationTabs = ({ activeTab, onTabChange, user }) => {
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

  return (
    <div className="bg-white border-b border-gray-200 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};