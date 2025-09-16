import React from "react";
import { useTranslation } from "react-i18next";

const BottomSection = ({
  canProceed,
  onNextClick,
  activeTab,
  characterCount,
  maxCharacters,
  minCharacters,
  selectedFile,
  selectedImages,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      {/* Next Button */}
      <button
        onClick={onNextClick}
        disabled={!canProceed}
        className={`px-6 py-3 rounded-full border-2 font-medium transition-colors duration-200 ${
          canProceed
            ? "border-blue-600 text-blue-600 hover:bg-blue-50"
            : "border-gray-300 text-gray-300 cursor-not-allowed"
        }`}
      >
        {t("flashcard.buttons.next")}
      </button>

      {/* Character Count / Hint */}
      <div
        className={`text-sm ${canProceed ? "text-gray-600" : "text-red-600"}`}
      >
        {activeTab === "Text" ? (
          <>
            {characterCount} / {maxCharacters.toLocaleString()}{" "}
            {t("flashcard.textInput.characterCount")}{" "}
            {!canProceed && `- ${t("flashcard.textInput.minCharacters")}`}
          </>
        ) : activeTab === "Document" ? (
          <>
            {selectedFile
              ? t("flashcard.documentInput.readyToCreate")
              : t("flashcard.documentInput.noFileSelected")}
          </>
        ) : activeTab === "Image" ? (
          <>
            {selectedImages.length > 0
              ? `Đã chọn ${selectedImages.length} hình ảnh - Sẵn sàng tạo flashcard`
              : "Chưa chọn hình ảnh nào"}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BottomSection;
