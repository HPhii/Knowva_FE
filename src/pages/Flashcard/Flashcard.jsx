import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import api from "../../config/axios";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import components
import TabBar from "./components/TabBar";
import InputFrame from "./components/InputFrame";
import BottomSection from "./components/BottomSection";
import FlashcardModal from "./components/FlashcardModal";
import GeneratedFlashcard from "./components/GeneratedFlashcard";
import RequireEmailVerificationModal from "../../components/RequireEmailVerificationModal";
import RequireVipModal from "../../components/RequireVipModal";

const Flashcard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Text");
  const [textareaContent, setTextareaContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedFlashcard, setGeneratedFlashcard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [form] = Form.useForm();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  // const navigate = useNavigate();

  console.log("activeTab: ", activeTab);
  console.log("selectedFile: ", selectedFile);
  console.log("generatedFlashcard: ", generatedFlashcard);

  // Kiểm tra trạng thái xác thực email khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.isVerified === false) {
      setShowVerifyModal(true);
    }
  }, []);

  const handleTabClick = (tabKey) => {
    try {
      setActiveTab(tabKey);
      // reset inputs when switching
      if (tabKey === "Text") {
        setSelectedFile(null);
        setSelectedImages([]);
        setTextareaContent("");
      } else if (tabKey === "Document") {
        setTextareaContent("");
        setSelectedFile(null);
        setSelectedImages([]);
      } else if (tabKey === "Image") {
        setTextareaContent("");
        setSelectedFile(null);
        setSelectedImages([]);
      }

      // Clear generated flashcard and editing states when switching tabs
      setGeneratedFlashcard(null);
      setIsEditing(false);
      setEditingFlashcard(null);

      // Reset form
      form.resetFields();

      // Reset file input by changing key
      setFileInputKey((prev) => prev + 1);
    } catch {
      toast.error(
        t(
          "flashcard.errors.switchTab",
          "Có lỗi khi chuyển tab. Vui lòng thử lại."
        )
      );
    }
  };

  const handleTextareaChange = (e) => {
    try {
      setTextareaContent(e.target.value);
    } catch {
      toast.error(
        t(
          "flashcard.errors.textareaChange",
          "Có lỗi khi nhập nội dung. Vui lòng thử lại."
        )
      );
    }
  };

  const handleFileChange = (e) => {
    try {
      const file =
        e.target.files && e.target.files[0] ? e.target.files[0] : null;
      setSelectedFile(file);
    } catch {
      toast.error(
        t(
          "flashcard.errors.fileChange",
          "Có lỗi khi chọn file. Vui lòng thử lại."
        )
      );
    }
  };

  const handleImageChange = (e) => {
    try {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      // Giới hạn tối đa 5 hình ảnh
      const limitedImages = imageFiles.slice(0, 5);
      setSelectedImages(limitedImages);
    } catch {
      toast.error(
        t(
          "flashcard.errors.imageChange",
          "Có lỗi khi chọn hình ảnh. Vui lòng thử lại."
        )
      );
    }
  };

  const removeImage = (index) => {
    try {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    } catch {
      toast.error(
        t(
          "flashcard.errors.removeImage",
          "Có lỗi khi xóa hình ảnh. Vui lòng thử lại."
        )
      );
    }
  };

  const characterCount = textareaContent.length;
  const maxCharacters = 25000;
  const minCharacters = 150;
  const canProceed =
    activeTab === "Text"
      ? characterCount >= minCharacters
      : activeTab === "Document"
      ? !!selectedFile
      : activeTab === "Image"
      ? selectedImages.length > 0
      : false;

  const handleOpenModal = () => {
    try {
      setIsModalOpen(true);
    } catch {
      toast.error(
        t(
          "flashcard.errors.openModal",
          "Không thể mở cửa sổ tạo flashcard. Vui lòng thử lại."
        )
      );
    }
  };

  const handleCancel = () => {
    try {
      setIsModalOpen(false);
    } catch {
      toast.error(
        t(
          "flashcard.errors.cancelModal",
          "Không thể đóng cửa sổ tạo flashcard. Vui lòng thử lại."
        )
      );
    }
  };

  const handleSaveFlashcard = async () => {
    if (!generatedFlashcard) {
      toast.warning(
        t("flashcard.generatedFlashcard.messages.noFlashcardToSave")
      );
      return;
    }

    try {
      setIsSaving(true);

      // Tạo object với cấu trúc đúng cho backend
      const saveData = {
        title: generatedFlashcard.title,
        description: generatedFlashcard.description,
        sourceType: generatedFlashcard.sourceType,
        language: generatedFlashcard.language,
        cardType: generatedFlashcard.cardType,
        visibility: generatedFlashcard.visibility,
        category: generatedFlashcard.category,
        flashcards: generatedFlashcard.cards || [], // Đổi từ cards thành flashcards
      };

      console.log("Save data: ", saveData);

      const res = await api.post("/flashcard-sets/save", saveData);

      console.log("Save flashcard response: ", res);
      toast.success(t("flashcard.generatedFlashcard.messages.saveSuccess"));

      // Reset generated flashcard sau khi lưu thành công
      setGeneratedFlashcard(null);
      setIsEditing(false);
      setEditingFlashcard(null);

      // Reset file input
      setFileInputKey((prev) => prev + 1);
      setSelectedImages([]);
    } catch (err) {
      console.error("Save flashcard error: ", err);
      toast.error(t("flashcard.generatedFlashcard.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditFlashcard = () => {
    try {
      setIsEditing(true);
      setEditingFlashcard({ ...generatedFlashcard });
    } catch {
      toast.error(
        t(
          "flashcard.errors.editFlashcard",
          "Không thể chỉnh sửa flashcard. Vui lòng thử lại."
        )
      );
    }
  };

  const handleCancelEdit = () => {
    try {
      setIsEditing(false);
      setEditingFlashcard(null);
    } catch {
      toast.error(
        t(
          "flashcard.errors.cancelEdit",
          "Không thể hủy chỉnh sửa flashcard. Vui lòng thử lại."
        )
      );
    }
  };

  const handleSaveEdit = () => {
    try {
      setGeneratedFlashcard({ ...editingFlashcard });
      setIsEditing(false);
      setEditingFlashcard(null);
      toast.success(t("flashcard.generatedFlashcard.messages.updateSuccess"));
    } catch {
      toast.error(
        t(
          "flashcard.errors.saveEdit",
          "Không thể lưu chỉnh sửa flashcard. Vui lòng thử lại."
        )
      );
    }
  };

  const handleUpdateField = (field, value) => {
    try {
      setEditingFlashcard((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch {
      toast.error(
        t(
          "flashcard.errors.updateField",
          "Không thể cập nhật trường dữ liệu. Vui lòng thử lại."
        )
      );
    }
  };

  const handleUpdateCard = (cardIndex, field, value) => {
    try {
      setEditingFlashcard((prev) => ({
        ...prev,
        cards: prev.cards.map((card, index) =>
          index === cardIndex ? { ...card, [field]: value } : card
        ),
      }));
    } catch {
      toast.error(
        t(
          "flashcard.errors.updateCard",
          "Không thể cập nhật thẻ ghi nhớ. Vui lòng thử lại."
        )
      );
    }
  };

  const handleAddCard = (insertIndex) => {
    try {
      const newCard = {
        front: "",
        back: "",
        order: insertIndex + 1,
      };

      setEditingFlashcard((prev) => ({
        ...prev,
        cards: [
          ...prev.cards.slice(0, insertIndex),
          newCard,
          ...prev.cards.slice(insertIndex).map((card, index) => ({
            ...card,
            order: insertIndex + index + 2,
          })),
        ],
        maxCards: prev.cards.length + 1,
      }));
    } catch {
      toast.error(
        t(
          "flashcard.errors.addCard",
          "Không thể thêm thẻ ghi nhớ mới. Vui lòng thử lại."
        )
      );
    }
  };

  const handleDeleteCard = (cardIndex) => {
    try {
      setEditingFlashcard((prev) => ({
        ...prev,
        cards: prev.cards
          .filter((_, index) => index !== cardIndex)
          .map((card, index) => ({
            ...card,
            order: index + 1,
          })),
        maxCards: prev.cards.length - 1,
      }));
    } catch {
      toast.error(
        t(
          "flashcard.errors.deleteCard",
          "Không thể xóa thẻ ghi nhớ. Vui lòng thử lại."
        )
      );
    }
  };

  const logFormData = async (formData) => {
    try {
      console.group("FormData Content");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Trường hợp là file
          console.log(`${key}: File`, {
            name: value.name,
            type: value.type,
            size: value.size,
            lastModified: value.lastModified,
          });
        } else if (value instanceof Blob) {
          // Trường hợp là blob (flashcardSet, text...)
          console.log(`${key}: Blob`, {
            type: value.type,
            size: value.size,
          });

          // Đọc nội dung blob
          const text = await value.text();
          try {
            if (value.type === "application/json") {
              console.log(`${key} (parsed JSON):`, JSON.parse(text));
            } else {
              console.log(`${key} (raw text):`, text);
            }
          } catch {
            console.log(`${key} (raw text):`, text);
          }
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.groupEnd();
    } catch {
      toast.error(
        t(
          "flashcard.errors.logFormData",
          "Có lỗi khi xử lý dữ liệu form. Vui lòng thử lại."
        )
      );
    }
  };

  const handleGenerate = async (values) => {
    try {
      if (activeTab === "Text") {
        if (!textareaContent?.trim()) {
          toast.warning(
            t("flashcard.generatedFlashcard.messages.textRequired")
          );
          return;
        }
      } else if (activeTab === "Document") {
        if (!selectedFile) {
          toast.warning(
            t("flashcard.generatedFlashcard.messages.fileRequired")
          );
          return;
        }
        const isPdf =
          selectedFile.type === "application/pdf" ||
          /\.pdf$/i.test(selectedFile.name || "");
        if (!isPdf) {
          toast.warning(t("flashcard.generatedFlashcard.messages.pdfOnly"));
          return;
        }
      } else if (activeTab === "Image") {
        if (selectedImages.length === 0) {
          toast.warning("Vui lòng chọn ít nhất một hình ảnh");
          return;
        }
      }

      setIsGenerating(true);

      const flashcardSet = {
        title: values.title,
        description: values.description || "",
        sourceType:
          activeTab === "Document"
            ? "PDF"
            : activeTab === "Image"
            ? "IMAGE"
            : "TEXT",
        language: values.language || "vi",
        cardType: values.cardType,
        maxFlashcards: values.maxCards,
        visibility: values.visibility,
        category:
          Array.isArray(values.category) && values.category.length
            ? values.category[0]
            : values.category || "OTHER",
      };

      // Log flashcardSet
      console.log("=== FLASHCARD SET ===");
      console.log(JSON.stringify(flashcardSet, null, 2));
      console.log("=== END FLASHCARD SET ===");

      const formData = new FormData();
      formData.append(
        "flashcardSet",
        new Blob([JSON.stringify(flashcardSet)], { type: "application/json" })
      );

      if (activeTab === "Document") {
        formData.append("files", selectedFile);
      } else if (activeTab === "Image") {
        selectedImages.forEach((image) => {
          formData.append("files", image);
        });
      } else {
        formData.append("text", textareaContent);
      }

      await logFormData(formData);

      const res = await api.post("/flashcard-sets/generate", formData); // không set headers

      console.log("res: ", res);

      // Lưu flashcard đã tạo vào state
      const newFlashcard = {
        ...flashcardSet,
        cards: res.data?.flashcards || [],
        id: res.data?.id || null,
        createdAt: new Date().toISOString(),
      };

      setGeneratedFlashcard(newFlashcard);
      // Tự động chuyển sang chế độ edit sau khi tạo flashcard
      setIsEditing(true);
      setEditingFlashcard({ ...newFlashcard });

      toast.success(t("flashcard.generatedFlashcard.messages.generateSuccess"));
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Generate flashcard error: ", err);

      // Kiểm tra nếu lỗi là do chưa xác thực email
      if (
        err.response?.data === "Email verification required for this action."
      ) {
        setIsModalOpen(false);
        setShowVerifyModal(true);
      } else if (
        err.response?.data ===
        "Only VIP users can upload files for quiz set generation."
      ) {
        setIsModalOpen(false);
        setShowVipModal(true);
      } else {
        toast.error(t("flashcard.generatedFlashcard.messages.generateError"));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Tab Bar */}
          <TabBar activeTab={activeTab} onTabClick={handleTabClick} />

          {/* Input Frame */}
          <InputFrame
            activeTab={activeTab}
            textareaContent={textareaContent}
            onTextareaChange={handleTextareaChange}
            fileInputKey={fileInputKey}
            onFileChange={handleFileChange}
            selectedFile={selectedFile}
            onImageChange={handleImageChange}
            selectedImages={selectedImages}
            onRemoveImage={removeImage}
            characterCount={characterCount}
            maxCharacters={maxCharacters}
            minCharacters={minCharacters}
          />

          {/* Bottom Section */}
          <BottomSection
            canProceed={canProceed}
            onNextClick={handleOpenModal}
            activeTab={activeTab}
            characterCount={characterCount}
            maxCharacters={maxCharacters}
            minCharacters={minCharacters}
            selectedFile={selectedFile}
            selectedImages={selectedImages}
          />

          {/* Generated Flashcard Display */}
          <GeneratedFlashcard
            generatedFlashcard={generatedFlashcard}
            isEditing={isEditing}
            editingFlashcard={editingFlashcard}
            isSaving={isSaving}
            onEditFlashcard={handleEditFlashcard}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onUpdateField={handleUpdateField}
            onUpdateCard={handleUpdateCard}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onSaveFlashcard={handleSaveFlashcard}
            onCancelFlashcard={() => setGeneratedFlashcard(null)}
          />
        </div>
      </div>

      {/* Modal */}
      <FlashcardModal
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleGenerate}
        form={form}
        isGenerating={isGenerating}
      />

      {/* Email Verification Modal */}
      <RequireEmailVerificationModal
        open={showVerifyModal}
        onCancel={() => setShowVerifyModal(false)}
      />

      {/* VIP Modal */}
      <RequireVipModal
        open={showVipModal}
        onCancel={() => setShowVipModal(false)}
      />

      <ToastContainer />
    </>
  );
};

export default Flashcard;
