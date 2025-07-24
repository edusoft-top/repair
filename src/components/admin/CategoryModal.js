// components/admin/CategoryModal.js
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export const CategoryModal = ({ category, onClose, onSave, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    }
  }, [category, isEdit]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อหมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น คอมพิวเตอร์, เครื่องปรับอากาศ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="อธิบายรายละเอียดของหมวดหมู่"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 order-2 sm:order-1"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};