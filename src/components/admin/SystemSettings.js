// components/admin/SystemSettings.js
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { apiCall } from '../../utils/api';

export const SystemSettings = ({ onNotification }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiCall('/settings');
      if (response.success) {
        const settingsObj = {};
        response.data.forEach(setting => {
          settingsObj[setting.setting_key] = setting.setting_value;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการโหลดการตั้งค่า', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      if (response && response.success) {
        onNotification('บันทึกการตั้งค่าเรียบร้อยแล้ว', 'success');
        // Force reload settings
        await loadSettings();
      } else {
        onNotification(response?.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h2>
        <p className="text-gray-600 mt-1">จัดการการตั้งค่าระบบแจ้งซ่อม</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อหน่วยงาน
            </label>
            <input
              type="text"
              value={settings.company_name || ''}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ชื่อบริษัทหรือหน่วยงาน"
            />
          </div>

          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำนำหน้าเลขที่งาน
              </label>
              <input
                type="text"
                value={settings.ticket_prefix || ''}
                onChange={(e) => setSettings({ ...settings, ticket_prefix: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="REQ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ขนาดไฟล์สูงสุด (ไบต์)
              </label>
              <input
                type="number"
                value={settings.max_file_size || ''}
                onChange={(e) => setSettings({ ...settings, max_file_size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="5242880"
              />
              <p className="text-xs text-gray-500 mt-1">
                ปัจจุบัน: {((settings.max_file_size || 0) / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชนิดไฟล์ที่อนุญาต
            </label>
            <input
              type="text"
              value={settings.allowed_file_types || ''}
              onChange={(e) => setSettings({ ...settings, allowed_file_types: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="jpg,jpeg,png,pdf,doc,docx"
            />
            <p className="text-xs text-gray-500 mt-1">
              คั่นด้วยเครื่องหมายจุลภาค (,)
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกการตั้งค่า
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};