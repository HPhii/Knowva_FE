import React from "react";
import { useTranslation } from "react-i18next";

const DocumentInput = ({ fileInputKey, onFileChange, selectedFile }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <input
        key={fileInputKey}
        type="file"
        accept=".pdf,application/pdf"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
      />
      {selectedFile ? (
        <div className="text-gray-700 text-sm">
          {t("quiz.documentInput.fileSelected")} {selectedFile.name}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          {t("quiz.documentInput.selectFile")}
        </div>
      )}
    </div>
  );
};

export default DocumentInput;
