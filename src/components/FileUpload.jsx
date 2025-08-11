import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ onFilesChange, fileTypes = ['pdf', 'text', 'ppt', 'image'], maxFiles = 5 }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTab, setSelectedTab] = useState(fileTypes[0]); // Mặc định chọn tab đầu tiên
  const fileInputRef = useRef(null);

  const allowedTypes = {
    pdf: '.pdf',
    text: '.txt,.doc,.docx',
    ppt: '.ppt,.pptx',
    image: '.jpg,.jpeg,.png,.gif,.bmp'
  };

  const getAcceptedTypes = () => {
    return allowedTypes[selectedTab] || '';
  };

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).slice(0, maxFiles);
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileTypeLabel = (type) => {
    const labels = {
      pdf: 'PDFs',
      text: 'TEXT',
      ppt: 'PPT SLIDES',
      image: 'IMAGES'
    };
    return labels[type] || type.toUpperCase();
  };

  const handleTabClick = (tabType) => {
    setSelectedTab(tabType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Main heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('upload.createStudyMaterials')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('upload.description')}
        </p>
      </div>

      {/* File type tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {fileTypes.map((type, index) => (
            <button
              key={type}
              onClick={() => handleTabClick(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === type
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getFileTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-gray-600">
            <p className="text-lg font-medium">{t('upload.dragDrop')}</p>
            <p className="text-sm">{t('upload.orClick')}</p>
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            {t('upload.chooseFile')}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getAcceptedTypes()}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload progress */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t('upload.uploadingFiles')} ({uploadProgress}%)</span>
            <span>{files.length} {t('upload.of')} {maxFiles} {t('upload.filesUploaded')}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start creating button */}
      <div className="text-center mt-8">
        <button
          disabled={files.length === 0}
          className={`px-8 py-3 rounded-md font-medium transition-colors ${
            files.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('upload.startCreating')}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
