import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from '../../components/FileUpload';

const Quiz = () => {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <div className="py-8">
        <FileUpload 
          onFilesChange={handleFilesChange}
          fileTypes={['pdf', 'text', 'ppt', 'image']}
          maxFiles={5}
        />
      </div>
    </div>
  );
};

export default Quiz;
