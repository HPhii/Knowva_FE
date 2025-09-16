import React from "react";
import TextInput from "./TextInput";
import DocumentInput from "./DocumentInput";
import ImageInput from "./ImageInput";

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
  return (
    <div className="bg-[#f5f7ff] rounded-2xl p-6 mb-6">
      {activeTab === "Text" && (
        <TextInput
          value={textareaContent}
          onChange={onTextareaChange}
          characterCount={characterCount}
          maxCharacters={maxCharacters}
          minCharacters={minCharacters}
        />
      )}
      {activeTab === "Document" && (
        <DocumentInput
          fileInputKey={fileInputKey}
          onFileChange={onFileChange}
          selectedFile={selectedFile}
        />
      )}
      {activeTab === "Image" && (
        <ImageInput
          fileInputKey={fileInputKey}
          onImageChange={onImageChange}
          selectedImages={selectedImages}
          onRemoveImage={onRemoveImage}
        />
      )}
    </div>
  );
};

export default InputFrame;
