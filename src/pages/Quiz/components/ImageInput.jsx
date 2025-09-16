import React from "react";

const ImageInput = ({
  fileInputKey,
  onImageChange,
  selectedImages,
  onRemoveImage,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <input
        key={fileInputKey}
        type="file"
        accept="image/*"
        multiple
        onChange={onImageChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
      />

      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className="text-gray-700 text-sm font-medium">
            Đã chọn {selectedImages.length}/5 hình ảnh:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors duration-200"
                  title="Xóa hình ảnh"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-8">
          Chọn tối đa 5 hình ảnh để tạo quiz
        </div>
      )}
    </div>
  );
};

export default ImageInput;
