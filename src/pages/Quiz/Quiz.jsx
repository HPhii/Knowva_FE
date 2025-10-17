import React, { useState, useEffect } from "react";
import { Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import ReactGA from "react-ga4";
import api from "../../config/axios";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import components
import TabBar from "./components/TabBar";
import InputFrame from "./components/InputFrame";
import BottomSection from "./components/BottomSection";
import QuizModal from "./components/QuizModal";
import GeneratedQuiz from "./components/GeneratedQuiz";
import RequireEmailVerificationModal from "../../components/RequireEmailVerificationModal";
import RequireVipModal from "../../components/RequireVipModal";
import tabBarIcon from "../../assets/images/tabBarIcon.png";

const Quiz = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Text");
  const [textareaContent, setTextareaContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [form] = Form.useForm();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

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

      // Clear generated quiz and editing states when switching tabs
      setGeneratedQuiz(null);
      setIsEditing(false);
      setEditingQuiz(null);

      // Reset form
      form.resetFields();

      // Reset file input by changing key
      setFileInputKey((prev) => prev + 1);
    } catch {
      toast.error(
        t("quiz.errors.switchTab", "Có lỗi khi chuyển tab. Vui lòng thử lại.")
      );
    }
  };

  const handleTextareaChange = (e) => {
    try {
      setTextareaContent(e.target.value);
    } catch {
      toast.error(
        t(
          "quiz.errors.textareaChange",
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
        t("quiz.errors.fileChange", "Có lỗi khi chọn file. Vui lòng thử lại.")
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
          "quiz.errors.imageChange",
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
          "quiz.errors.removeImage",
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
          "quiz.errors.openModal",
          "Không thể mở cửa sổ tạo quiz. Vui lòng thử lại."
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
          "quiz.errors.cancelModal",
          "Không thể đóng cửa sổ tạo quiz. Vui lòng thử lại."
        )
      );
    }
  };

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) {
      toast.warning(t("quiz.generatedQuiz.messages.noQuizToSave"));
      return;
    }

    try {
      setIsSaving(true);

      await api.post("/quiz-sets/save", generatedQuiz);

      toast.success(t("quiz.generatedQuiz.messages.saveSuccess"));

      // Track quiz creation event
      ReactGA.event({
        category: "Content Creation",
        action: "Created a new Quiz Set",
        label: generatedQuiz.sourceType || "Unknown Source",
      });

      // Reset generated quiz sau khi lưu thành công
      setGeneratedQuiz(null);
      setIsEditing(false);
      setEditingQuiz(null);

      // Reset file input
      setFileInputKey((prev) => prev + 1);
      setSelectedImages([]);
    } catch (err) {
      console.error("Save quiz error: ", err);
      toast.error(t("quiz.generatedQuiz.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuiz = () => {
    try {
      setIsEditing(true);
      setEditingQuiz({ ...generatedQuiz });
    } catch {
      toast.error(
        t("quiz.errors.editQuiz", "Không thể chỉnh sửa quiz. Vui lòng thử lại.")
      );
    }
  };

  const handleCancelEdit = () => {
    try {
      setIsEditing(false);
      setEditingQuiz(null);
    } catch {
      toast.error(
        t(
          "quiz.errors.cancelEdit",
          "Không thể hủy chỉnh sửa quiz. Vui lòng thử lại."
        )
      );
    }
  };

  const handleSaveEdit = () => {
    try {
      setGeneratedQuiz({ ...editingQuiz });
      setIsEditing(false);
      setEditingQuiz(null);
      toast.success(t("quiz.generatedQuiz.messages.updateSuccess"));
    } catch {
      toast.error(
        t(
          "quiz.errors.saveEdit",
          "Không thể lưu chỉnh sửa quiz. Vui lòng thử lại."
        )
      );
    }
  };

  const handleUpdateField = (field, value) => {
    try {
      setEditingQuiz((prev) => ({
        ...prev,
        [field]: value,
      }));
    } catch {
      toast.error(
        t(
          "quiz.errors.updateField",
          "Không thể cập nhật trường dữ liệu. Vui lòng thử lại."
        )
      );
    }
  };

  const handleUpdateQuestion = (questionIndex, field, value) => {
    try {
      setEditingQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q, index) =>
          index === questionIndex ? { ...q, [field]: value } : q
        ),
      }));
    } catch {
      toast.error(
        t(
          "quiz.errors.updateQuestion",
          "Không thể cập nhật câu hỏi. Vui lòng thử lại."
        )
      );
    }
  };

  const handleUpdateAnswer = (questionIndex, answerIndex, field, value) => {
    try {
      setEditingQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q, qIndex) =>
          qIndex === questionIndex
            ? {
                ...q,
                answers: q.answers.map((a, aIndex) =>
                  aIndex === answerIndex ? { ...a, [field]: value } : a
                ),
              }
            : q
        ),
      }));
    } catch {
      toast.error(
        t(
          "quiz.errors.updateAnswer",
          "Không thể cập nhật đáp án. Vui lòng thử lại."
        )
      );
    }
  };

  const handleAddQuestion = (insertIndex) => {
    try {
      const newQuestion = {
        questionText: "",
        answers: [
          { answerText: "", isCorrect: true },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
        order: insertIndex + 1,
        timeLimit: 30,
        imageUrl: null,
        questionHtml: null,
      };

      setEditingQuiz((prev) => ({
        ...prev,
        questions: [
          ...prev.questions.slice(0, insertIndex),
          newQuestion,
          ...prev.questions.slice(insertIndex).map((q, index) => ({
            ...q,
            order: insertIndex + index + 2,
          })),
        ],
        maxQuestions: prev.questions.length + 1,
      }));
    } catch {
      toast.error(
        t(
          "quiz.errors.addQuestion",
          "Không thể thêm câu hỏi mới. Vui lòng thử lại."
        )
      );
    }
  };

  const handleDeleteQuestion = (questionIndex) => {
    try {
      setEditingQuiz((prev) => ({
        ...prev,
        questions: prev.questions
          .filter((_, index) => index !== questionIndex)
          .map((q, index) => ({
            ...q,
            order: index + 1,
          })),
        maxQuestions: prev.questions.length - 1,
      }));
    } catch {
      toast.error(
        t(
          "quiz.errors.deleteQuestion",
          "Không thể xóa câu hỏi. Vui lòng thử lại."
        )
      );
    }
  };

  const handleGenerate = async (values) => {
    try {
      if (activeTab === "Text") {
        if (!textareaContent?.trim()) {
          toast.warning(t("quiz.generatedQuiz.messages.textRequired"));
          return;
        }
      } else if (activeTab === "Document") {
        if (!selectedFile) {
          toast.warning(t("quiz.generatedQuiz.messages.fileRequired"));
          return;
        }
        const isPdf =
          selectedFile.type === "application/pdf" ||
          /\.pdf$/i.test(selectedFile.name || "");
        if (!isPdf) {
          toast.warning(t("quiz.generatedQuiz.messages.pdfOnly"));
          return;
        }
      } else if (activeTab === "Image") {
        if (selectedImages.length === 0) {
          toast.warning("Vui lòng chọn ít nhất một hình ảnh");
          return;
        }
      }

      setIsGenerating(true);

      const quizSet = {
        title: values.title,
        description: values.description || "",
        sourceType:
          activeTab === "Document"
            ? "PDF"
            : activeTab === "Image"
            ? "IMAGE"
            : "TEXT",
        language: values.language || "vi",
        questionType: values.questionType,
        maxQuestions: values.maxQuestions,
        visibility: values.visibility,
        category:
          Array.isArray(values.category) && values.category.length
            ? values.category[0]
            : values.category || "OTHER",
        timeLimit: values.timeLimit,
      };

      const formData = new FormData();
      formData.append(
        "quizSet",
        new Blob([JSON.stringify(quizSet)], { type: "application/json" })
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

      const res = await api.post("/quiz-sets/generate", formData); // không set headers

      console.log("res: ", res);

      // Lưu quiz đã tạo vào state
      const newQuiz = {
        ...quizSet,
        questions: res.data?.questions || [],
        id: res.data?.id || null,
        createdAt: new Date().toISOString(),
      };

      setGeneratedQuiz(newQuiz);
      // Tự động chuyển sang chế độ edit sau khi tạo quiz
      setIsEditing(true);
      setEditingQuiz({ ...newQuiz });

      toast.success(t("quiz.generatedQuiz.messages.generateSuccess"));
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.log("Generate quiz error: ", err.response?.data);

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
        toast.error(t("quiz.generatedQuiz.messages.generateError"));
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

          {/* Generated Quiz Display */}
          <GeneratedQuiz
            generatedQuiz={generatedQuiz}
            isEditing={isEditing}
            editingQuiz={editingQuiz}
            isSaving={isSaving}
            onEditQuiz={handleEditQuiz}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onUpdateField={handleUpdateField}
            onUpdateQuestion={handleUpdateQuestion}
            onUpdateAnswer={handleUpdateAnswer}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onSaveQuiz={handleSaveQuiz}
            onCancelQuiz={() => setGeneratedQuiz(null)}
          />
        </div>
      </div>

      {/* Modal */}
      <QuizModal
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

export default Quiz;
