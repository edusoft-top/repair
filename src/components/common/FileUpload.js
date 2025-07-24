// components/common/FileUpload.js
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadFile } from '../../utils/api';

export const FileUpload = ({ repairRequestId, onUploadComplete, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0 || disabled) return;

    setUploading(true);
    try {
      for (const file of files) {
        await uploadFile(file, repairRequestId);
      }
      // Force callback to reload attachments
      if (onUploadComplete) {
        await onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
        dragOver 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => !disabled && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-xs sm:text-sm text-gray-600">กำลังอัปโหลด...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
          <p className="text-xs sm:text-sm text-gray-600">
            คลิกหรือลากไฟล์มาวางที่นี่
          </p>
          <p className="text-xs text-gray-500 mt-1">
            รองรับ: JPG, PNG, PDF, DOC, DOCX (สูงสุด 5MB)
          </p>
        </div>
      )}
    </div>
  );
};