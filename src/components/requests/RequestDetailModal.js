// components/requests/RequestDetailModal.js
import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Settings, MapPin, Phone, Calendar, Paperclip 
} from 'lucide-react';
import { apiCall } from '../../utils/api';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { FileUpload } from '../common/FileUpload';
import { AttachmentList } from '../common/AttachmentList';
import { CostManagement } from './CostManagement';
import { ROLES } from '../../constants';

export const RequestDetailModal = ({ request, onClose, onUpdate, user, categories, technicians }) => {
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState(request?.status || '');
  const [assignedTo, setAssignedTo] = useState(request?.assigned_to || '');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // กำหนดสิทธิ์ตามบทบาท
  const permissions = {
    [ROLES.USER]: {
      canEditStatus: false,
      canAssign: false,
      canUploadFile: false,
      canDeleteFile: false,
      showCost: false,
      showFileSection: false
    },
    [ROLES.TECHNICIAN]: {
      canEditStatus: true,
      canAssign: false,
      canUploadFile: true,
      canDeleteFile: true,
      showCost: true,
      showFileSection: true
    },
    [ROLES.ADMIN]: {
      canEditStatus: true,
      canAssign: true,
      canUploadFile: false,
      canDeleteFile: true,
      showCost: true,
      showFileSection: true
    }
  };

  const userPermissions = permissions[user.role] || permissions[ROLES.USER];

  useEffect(() => {
    if (request) {
      loadComments();
      loadAttachments();
      setStatus(request.status);
      setAssignedTo(request.assigned_to || '');
    }
  }, [request]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadComments = async () => {
    try {
      const response = await apiCall(`/repair-requests/${request.id}`);
      if (response.success) {
        setComments(response.data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadAttachments = async () => {
    try {
      const response = await apiCall(`/attachments/${request.id}`);
      if (response.success) {
        setAttachments(response.data || []);
      }
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!request) return;
    
    setLoading(true);
    try {
      const updateData = { status };

      // เฉพาะ admin เท่านั้นที่สามารถมอบหมายได้
      if (userPermissions.canAssign) {
        const assignedToValue = assignedTo && assignedTo !== '' ? parseInt(assignedTo) : null;
        updateData.assigned_to = assignedToValue;
      }

      const response = await apiCall(`/repair-requests/${request.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (!response || (!response.success && response.success !== 'true' && response.status !== 'success')) {
        throw new Error(response?.message || 'Failed to update request');
      }

      if (newComment.trim()) {
        try {
          const commentResponse = await apiCall(`/repair-requests/${request.id}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment: newComment.trim() })
          });

          if (commentResponse && (commentResponse.success === true || commentResponse.success === 'true')) {
            setNewComment('');
          }
        } catch (commentError) {
          console.error('Comment addition failed:', commentError);
          showNotification('บันทึกการเปลี่ยนแปลงเรียบร้อย แต่ไม่สามารถเพิ่มความคิดเห็นได้', 'info');
        }
      }

      showNotification('บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว', 'success');
      
      await Promise.all([
        loadComments(),
        onUpdate && onUpdate()
      ]);
      
    } catch (error) {
      console.error('Error updating request:', error);
      
      if (error.message && (error.message.includes('trigger') || error.message.includes('1442'))) {
        showNotification('ระบบไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณารีเฟรชหน้าและลองใหม่อีกครั้ง', 'error');
      } else {
        showNotification(`เกิดข้อผิดพลาด: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบไฟล์นี้?')) return;

    try {
      const response = await apiCall(`/attachments/${attachmentId}`, { method: 'DELETE' });
      if (response && (response.success === true || response.success === 'true')) {
        showNotification('ลบไฟล์เรียบร้อยแล้ว', 'success');
        loadAttachments();
      } else {
        showNotification('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
      showNotification('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
    }
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Notification */}
        {notification && (
          <div className={`absolute top-4 right-4 left-4 md:left-auto z-10 px-4 py-3 rounded-lg shadow-lg border flex items-center justify-between ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 
            notification.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' : 
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            <span className="text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 line-clamp-2">{request.title}</h2>
              <p className="text-gray-600 mt-1">#{request.ticket_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Info */}
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                    {userPermissions.canEditStatus ? (
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="assigned">มอบหมายแล้ว</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="completed">เสร็จสิ้น</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    ) : (
                      <StatusBadge status={request.status} />
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ความสำคัญ</label>
                    <PriorityBadge priority={request.priority} />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                    <p className="text-gray-900">{request.category_name}</p>
                  </div>

                  {/* Assignment - เฉพาะ Admin */}
                  {userPermissions.canAssign && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">มอบหมายให้</label>
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">ยังไม่มอบหมาย</option>
                        {technicians.filter(tech => tech.role === ROLES.TECHNICIAN).map(tech => (
                          <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Requester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ผู้แจ้ง</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{request.requester_name}</span>
                    </div>
                  </div>

                  {/* Assigned Technician - แสดงให้ Technician และ Admin */}
                  {user.role !== ROLES.USER && request.assigned_to && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ผู้รับผิดชอบ</label>
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>{request.technician_name || 'ไม่พบข้อมูล'}</span>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{request.location}</span>
                    </div>
                  </div>

                  {/* Contact Phone */}
                  {request.contact_phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์ติดต่อ</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{request.contact_phone}</span>
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่แจ้ง</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(request.created_at).toLocaleString('th-TH')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียด</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                </div>
              </div>

              {/* Cost Management - เฉพาะ Technician และ Admin */}
              {userPermissions.showCost && (
                <CostManagement 
                  request={request} 
                  onUpdate={onUpdate} 
                  user={user} 
                />
              )}

              {/* File Attachments - เฉพาะ Technician และ Admin */}
              {userPermissions.showFileSection && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Paperclip className="w-4 h-4 mr-2" />
                    ไฟล์แนบ
                  </h4>
                  
                  {userPermissions.canUploadFile && (
                    <div className="mb-4">
                      <FileUpload 
                        repairRequestId={request.id}
                        onUploadComplete={loadAttachments}
                      />
                    </div>
                  )}

                  <AttachmentList 
                    attachments={attachments}
                    onDelete={handleDeleteAttachment}
                    canDelete={userPermissions.canDeleteFile}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Comments */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">การดำเนินงาน</h3>
                <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900 text-sm">{comment.user_name}</span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleString('th-TH')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment - เฉพาะ Technician และ Admin */}
                {user.role !== ROLES.USER && (
                  <div className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="เพิ่มความคิดเห็น..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {(userPermissions.canEditStatus || userPermissions.canAssign) && (
                  <button
                    onClick={handleStatusUpdate}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        บันทึกการเปลี่ยนแปลง
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-full text-gray-700 bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};