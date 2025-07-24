// App.js
import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { apiCall } from './utils/api';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/layout/Header';
import { NavigationTabs } from './components/layout/NavigationTabs';
import { MobileMenu } from './components/layout/MobileMenu';
import { Dashboard } from './components/dashboard/Dashboard';
import { Notification } from './components/common/Notification';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall('/auth/me');
      setUser(response);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบการยืนยันตัวตน...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} 
          onLogout={logout} 
          onMenuToggle={() => setShowMobileMenu(true)} 
        />

        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          user={user} 
        />
        
        <MobileMenu 
          isOpen={showMobileMenu} 
          onClose={() => setShowMobileMenu(false)} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          user={user} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Dashboard 
            onNotification={showNotification} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
}