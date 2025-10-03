import React, { useState } from "react";
import { Form, message } from "antd";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import components
import TabBar from "./components/TabBar";
import InputFrame from "./components/InputFrame";
import BottomSection from "./components/BottomSection";
import QuizModal from "./components/QuizModal";
import GeneratedQuiz from "./components/GeneratedQuiz";

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
  const navigate = useNavigate();

  console.log("generatedQuiz: ", generatedQuiz);

  const handleTabClick = (tabKey) => {
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
  };

  const handleTextareaChange = (e) => {
    setTextareaContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // Giới hạn tối đa 5 hình ảnh
    const limitedImages = imageFiles.slice(0, 5);
    setSelectedImages(limitedImages);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) {
      message.warning(t("quiz.generatedQuiz.messages.noQuizToSave"));
      return;
    }

    try {
      setIsSaving(true);

      const res = await api.post("/quiz-sets/save", generatedQuiz);

      console.log("Save quiz response: ", res);
      message.success(t("quiz.generatedQuiz.messages.saveSuccess"));

      // Reset generated quiz sau khi lưu thành công
      setGeneratedQuiz(null);
      setIsEditing(false);
      setEditingQuiz(null);

      // Reset file input
      setFileInputKey((prev) => prev + 1);
      setSelectedImages([]);
    } catch (err) {
      console.error("Save quiz error: ", err);
      message.error(t("quiz.generatedQuiz.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuiz = () => {
    setIsEditing(true);
    setEditingQuiz({ ...generatedQuiz });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingQuiz(null);
  };

  const handleSaveEdit = () => {
    setGeneratedQuiz({ ...editingQuiz });
    setIsEditing(false);
    setEditingQuiz(null);
    message.success(t("quiz.generatedQuiz.messages.updateSuccess"));
  };

  const handleUpdateField = (field, value) => {
    setEditingQuiz((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateQuestion = (questionIndex, field, value) => {
    setEditingQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleUpdateAnswer = (questionIndex, answerIndex, field, value) => {
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
  };

  const handleAddQuestion = (insertIndex) => {
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
  };

  const handleDeleteQuestion = (questionIndex) => {
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
  };

  const logFormData = async (formData) => {
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
        // Trường hợp là blob (quizSet, text...)
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
        } catch (e) {
          console.log(`${key} (raw text):`, text);
        }
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.groupEnd();
  };

  const handleGenerate = async (values) => {
    try {
      if (activeTab === "Text") {
        if (!textareaContent?.trim()) {
          message.warning(t("quiz.generatedQuiz.messages.textRequired"));
          return;
        }
      } else if (activeTab === "Document") {
        if (!selectedFile) {
          message.warning(t("quiz.generatedQuiz.messages.fileRequired"));
          return;
        }
        const isPdf =
          selectedFile.type === "application/pdf" ||
          /\.pdf$/i.test(selectedFile.name || "");
        if (!isPdf) {
          message.warning(t("quiz.generatedQuiz.messages.pdfOnly"));
          return;
        }
      } else if (activeTab === "Image") {
        if (selectedImages.length === 0) {
          message.warning("Vui lòng chọn ít nhất một hình ảnh");
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

      // Log quizSet
      console.log("=== QUIZ SET ===");
      console.log(JSON.stringify(quizSet, null, 2));
      console.log("=== END QUIZ SET ===");

      const formData = new FormData();
      formData.append(
        "quizSet",
        new Blob([JSON.stringify(quizSet)], { type: "application/json" })
      );

      if (activeTab === "Document") {
        formData.append("files", selectedFile);
      } else if (activeTab === "Image") {
        selectedImages.forEach((image, index) => {
          formData.append("files", image);
        });
      } else {
        formData.append("text", textareaContent);
      }

      await logFormData(formData);

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

      message.success(t("quiz.generatedQuiz.messages.generateSuccess"));
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(t("quiz.generatedQuiz.messages.generateError"));
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
    </>
  );
};

export default Quiz;
