import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import api from "../../config/axios";
import { useTranslation } from "react-i18next";

const ScratchFlashcard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Dữ liệu flashcard trống ban đầu
  const [flashcardSet, setFlashcardSet] = useState({
    title: "",
    description: "",
    sourceType: "TEXT",
    language: "vi",
    cardType: "STANDARD",
    visibility: "PRIVATE",
    category: "OTHER",
    flashcards: [{ front: "", back: "", order: 1 }],
  });

  const handleUpdateField = (field, value) => {
    setFlashcardSet((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateCard = (index, field, value) => {
    setFlashcardSet((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleAddCard = (index) => {
    const newCard = { front: "", back: "", order: index + 2 };
    setFlashcardSet((prev) => ({
      ...prev,
      flashcards: [
        ...prev.flashcards.slice(0, index + 1),
        newCard,
        ...prev.flashcards.slice(index + 1).map((c, i) => ({
          ...c,
          order: index + i + 3,
        })),
      ],
    }));
  };

  const handleDeleteCard = (index) => {
    setFlashcardSet((prev) => ({
      ...prev,
      flashcards: prev.flashcards
        .filter((_, i) => i !== index)
        .map((c, i) => ({ ...c, order: i + 1 })),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.post("/flashcard-sets/save", flashcardSet);
      toast.success("Tạo flashcard thành công!");
      navigate("/my-library");
      setTimeout(() => {
        navigate("/my-library");
      }, 2000); // chuyển trang sau 2 giây
    } catch (error) {
      toast.error("Không thể tạo flashcard. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  const CATEGORY_OPTIONS = [
    "MATHEMATICS",
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "COMPUTER_SCIENCE",
    "HISTORY",
    "GEOGRAPHY",
    "LITERATURE",
    "LANGUAGE",
    "BUSINESS",
    "ECONOMICS",
    "PSYCHOLOGY",
    "MEDICINE",
    "LAW",
    "ENGINEERING",
    "ARTS",
    "MUSIC",
    "OTHER",
  ];

  const formatDisplayValue = (value) =>
    value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            {t("createFlashcard.title", "Tạo Flashcard Mới")}
          </h2>

          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item label={t("flashcard.generatedFlashcard.fields.title")}>
                <Input
                  value={flashcardSet.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label={t("flashcard.generatedFlashcard.fields.category")}
              >
                <Select
                  value={flashcardSet.category}
                  onChange={(v) => handleUpdateField("category", v)}
                  options={CATEGORY_OPTIONS.map((c) => ({
                    value: c,
                    label: formatDisplayValue(c),
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={t("flashcard.generatedFlashcard.fields.cardType")}
              >
                <Select
                  value={flashcardSet.cardType}
                  onChange={(v) => handleUpdateField("cardType", v)}
                  options={[
                    { value: "STANDARD", label: "Standard" },
                    { value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={t("flashcard.generatedFlashcard.fields.visibility")}
              >
                <Select
                  value={flashcardSet.visibility}
                  onChange={(v) => handleUpdateField("visibility", v)}
                  options={[
                    { value: "PUBLIC", label: "Public" },
                    { value: "PRIVATE", label: "Private" },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={t("flashcard.generatedFlashcard.fields.description")}
            >
              <Input.TextArea
                value={flashcardSet.description}
                onChange={(e) =>
                  handleUpdateField("description", e.target.value)
                }
                rows={3}
                placeholder="Nhập mô tả..."
              />
            </Form.Item>

            {/* Flashcards */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                {t("flashcard.generatedFlashcard.fields.cards")}
              </h3>

              {flashcardSet.flashcards.map((card, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-600">
                      {t("flashcard.generatedFlashcard.card.label")} {idx + 1}
                    </span>
                    <Button
                      danger
                      onClick={() => handleDeleteCard(idx)}
                      size="small"
                    >
                      Xóa
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input.TextArea
                      placeholder="Mặt trước"
                      value={card.front}
                      onChange={(e) =>
                        handleUpdateCard(idx, "front", e.target.value)
                      }
                      rows={3}
                    />
                    <Input.TextArea
                      placeholder="Mặt sau"
                      value={card.back}
                      onChange={(e) =>
                        handleUpdateCard(idx, "back", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() =>
                  handleAddCard(flashcardSet.flashcards.length - 1)
                }
                block
              >
                + Thêm thẻ mới
              </Button>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                loading={isSaving}
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? "Đang lưu..." : "Tạo mới"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScratchFlashcard;
