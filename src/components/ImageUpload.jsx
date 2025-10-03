import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onImageUpload, onUploadStart, isUploading = false, disabled = false, compact = false }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      showToast(t("imageTypeError") || "Bạn chỉ có thể upload file JPG/PNG!", 'error');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      showToast(t("imageSizeError") || "Ảnh phải nhỏ hơn 2MB!", 'error');
      return false;
    }

    // Notify parent component that upload is starting
    if (onUploadStart) {
      onUploadStart();
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "SDN_Blog");
      formData.append("cloud_name", "dejilsup7");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dejilsup7/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      onImageUpload(result.secure_url);
      showToast(t("imageUploadSuccess") || "Upload ảnh thành công!", 'success');
    } catch (err) {
      console.error("Upload error:", err);
      showToast(t("imageUploadError") || "Không thể upload ảnh", 'error');
    }
    return false; // Prevent default upload behavior
  };

  const handleFileSelect = async (selectedFiles) => {
    const file = selectedFiles[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Simple toast function
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`;
    
    if (type === 'success') {
      toast.className += ' bg-green-500';
    } else if (type === 'error') {
      toast.className += ' bg-red-500';
    } else {
      toast.className += ' bg-blue-500';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200
        ${compact ? 'p-2 h-full' : 'p-4'}
        ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        ${isUploading ? 'pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleFileSelect([file]);
            e.target.value = ""; // reset input so same file can be selected again
          }
        }}
        disabled={disabled}
      />
      
      {isUploading ? (
        <div className={`flex flex-col items-center justify-center h-full ${compact ? 'space-y-1' : 'space-y-2'}`}>
          <div className={`animate-spin border-2 border-blue-500 border-t-transparent rounded-full ${compact ? 'w-4 h-4' : 'w-6 h-6'}`}></div>
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>Đang upload...</p>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-full ${compact ? 'space-y-1' : 'space-y-2'}`}>
          <div className={`bg-gray-100 rounded-full flex items-center justify-center ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
            <svg className={`text-gray-500 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {!compact && (
            <div>
              <p className="text-sm text-gray-600">
                {t('comments.uploadImage') || 'Click để upload ảnh'}
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG tối đa 2MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
