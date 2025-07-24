// components/admin/CategoryManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { CategoryModal } from './CategoryModal';

export const CategoryManagement = ({ onNotification }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiCall('/categories');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการโหลดหมวดหมู่', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      let response;
      if (editingCategory) {
        response = await apiCall(`/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(categoryData)
        });
        onNotification('แก้ไขหมวดหมู่เรียบร้อยแล้ว', 'success');
      } else {
        response = await apiCall('/categories', {
          method: 'POST',
          body: JSON.stringify(categoryData)
        });
        onNotification('เพิ่มหมวดหมู่ใหม่เรียบร้อยแล้ว', 'success');
      }
      
      // Force reload data
      await loadCategories();
      setShowModal(false);
      setEditingCategory(null);
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการบันทึก', 'error');
      throw error;
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) return;

    try {
      const response = await apiCall(`/categories/${id}`, { method: 'DELETE' });
      if (response && response.success) {
        onNotification('ลบหมวดหมู่เรียบร้อยแล้ว', 'success');
        // Force reload data
        await loadCategories();
      } else {
        onNotification(response?.message || 'เกิดข้อผิดพลาดในการลบ', 'error');
      }
    } catch (error) {
      onNotification('เกิดข้อผิดพลาดในการลบ', 'error');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">จัดการหมวดหมู่</h2>
          <p className="text-gray-600 mt-1">จัดการหมวดหมู่การแจ้งซ่อม</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              สร้างเมื่อ: {new Date(category.created_at).toLocaleDateString('th-TH')}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          isEdit={!!editingCategory}
        />
      )}
    </div>
  );
};