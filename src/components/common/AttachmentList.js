// components/common/AttachmentList.js
import React from 'react';
import { Image, FileText, Paperclip, Download, Trash2 } from 'lucide-react';

const API_BASE = 'https://edusoft.top/api/repair';

export const AttachmentList = ({ attachments, onDelete, canDelete = false }) => {
  const downloadFile = async (attachment) => {
    try {
      const fileUrl = `${API_BASE}/${attachment.file_path}`;
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      const fileUrl = `${API_BASE}/${attachment.file_path}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = attachment.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image className="w-4 h-4" />;
    if (ext === 'pdf') return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        ไม่มีไฟล์แนบ
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="text-gray-400 flex-shrink-0">
              {getFileIcon(attachment.file_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{attachment.file_name}</p>
              <p className="text-xs text-gray-500 truncate">
                {formatFileSize(attachment.file_size)} • 
                <span className="hidden sm:inline"> อัปโหลดโดย {attachment.uploader_name} • </span>
                {new Date(attachment.created_at).toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => downloadFile(attachment)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="ดาวน์โหลด"
            >
              <Download className="w-4 h-4" />
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(attachment.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="ลบ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};