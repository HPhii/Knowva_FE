import React from "react";
import { useTranslation } from "react-i18next";

const InputFrame = ({
  activeTab,
  textareaContent,
  onTextareaChange,
  fileInputKey,
  onFileChange,
  selectedFile,
  onImageChange,
  selectedImages,
  onRemoveImage,
  characterCount,
  maxCharacters,
  minCharacters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#f5f7ff] rounded-2xl p-6 mb-6">
      {activeTab === "Text" && (
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nhập nội dung để tạo flashcard
            </h3>
            <p className="text-sm text-gray-600">
              Dán nội dung ghi chú, tài liệu hoặc văn bản của bạn vào ô bên
              dưới. Hệ thống sẽ tự động tạo các câu hỏi và câu trả lời từ nội
              dung này.
            </p>
          </div>
          <textarea
            value={textareaContent}
            onChange={onTextareaChange}
            placeholder={t("flashcard.textInput.placeholder")}
            className="w-full h-[250px] bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 text-base leading-relaxed"
          />
        </div>
      )}
      {activeTab === "Document" && (
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tải lên tài liệu PDF
            </h3>
            <p className="text-sm text-gray-600">
              Chọn file PDF chứa nội dung bạn muốn tạo flashcard. Hệ thống sẽ
              trích xuất thông tin và tạo các câu hỏi phù hợp.
            </p>
          </div>
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
                {t("flashcard.documentInput.fileSelected")} {selectedFile.name}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {t("flashcard.documentInput.selectFile")}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "Image" && (
        <div>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tải lên hình ảnh
            </h3>
            <p className="text-sm text-gray-600">
              Chọn các hình ảnh chứa nội dung bạn muốn tạo flashcard. Hệ thống
              sẽ trích xuất thông tin và tạo các câu hỏi phù hợp.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
            />
            {selectedImages.length > 0 ? (
              <div className="space-y-2">
                <div className="text-gray-700 text-sm">
                  Đã chọn {selectedImages.length} hình ảnh:
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        onClick={() => onRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Chưa chọn hình ảnh nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputFrame;
