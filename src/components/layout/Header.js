// components/layout/Header.js
import React from 'react';
import { Settings, User, LogOut, Menu } from 'lucide-react';

export const Header = ({ user, onLogout, onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">ระบบแจ้งซ่อม</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">จัดการคำขอซ่อมและบำรุงรักษา</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium truncate max-w-24 lg:max-w-none">{user.full_name}</span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="capitalize">{user.role}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};