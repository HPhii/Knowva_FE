import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/axios";
import { useTranslation } from "react-i18next";

const EditFlashcard = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  console.log("editingFlashcard: ", editingFlashcard);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/flashcard-sets/${id}`);
        setEditingFlashcard({ ...res.data });
      } catch {
        toast.error(
          t("editFlashcard.errors.fetch", "Không thể tải flashcard.")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardSet();
  }, [id, t]);

  const handleUpdateField = (field, value) => {
    try {
      setEditingFlashcard((prev) => ({ ...prev, [field]: value }));
    } catch {
      toast.error(
        t(
          "editFlashcard.errors.updateField",
          "Không thể cập nhật trường dữ liệu."
        )
      );
    }
  };

  const handleUpdateCard = (cardIndex, field, value) => {
    try {
      setEditingFlashcard((prev) => ({
        ...prev,
        flashcards: prev.flashcards.map((card, index) =>
          index === cardIndex ? { ...card, [field]: value } : card
        ),
      }));
    } catch {
      toast.error(
        t("editFlashcard.errors.updateCard", "Không thể cập nhật thẻ ghi nhớ.")
      );
    }
  };

  const handleAddCard = (insertIndex) => {
    try {
      const newCard = { front: "", back: "", order: insertIndex + 1 };
      setEditingFlashcard((prev) => ({
        ...prev,
        flashcards: [
          ...prev.flashcards.slice(0, insertIndex),
          newCard,
          ...prev.flashcards.slice(insertIndex).map((card, index) => ({
            ...card,
            order: insertIndex + index + 2,
          })),
        ],
      }));
    } catch {
      toast.error(
        t("editFlashcard.errors.addCard", "Không thể thêm thẻ ghi nhớ mới.")
      );
    }
  };

  const handleDeleteCard = (cardIndex) => {
    try {
      setEditingFlashcard((prev) => ({
        ...prev,
        flashcards: prev.flashcards
          .filter((_, index) => index !== cardIndex)
          .map((card, index) => ({ ...card, order: index + 1 })),
      }));
    } catch {
      toast.error(
        t("editFlashcard.errors.deleteCard", "Không thể xóa thẻ ghi nhớ.")
      );
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      const saveData = {
        title: editingFlashcard.title,
        description: editingFlashcard.description,
        sourceType: editingFlashcard.sourceType,
        language: editingFlashcard.language,
        cardType: editingFlashcard.cardType,
        visibility: editingFlashcard.visibility,
        category: editingFlashcard.category,
        flashcards: editingFlashcard.flashcards || [],
      };
      await api.put(`/flashcard-sets/${id}`, saveData);
      toast.success(
        t("editFlashcard.messages.saveSuccess", "Lưu flashcard thành công!")
      );
      navigate(-1);
    } catch {
      toast.error(
        t("editFlashcard.messages.saveError", "Lưu flashcard thất bại!")
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !editingFlashcard) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

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

  const formatDisplayValue = (value, type) => {
    if (type === "cardType") {
      const mapping = {
        STANDARD: "Standard",
        FILL_IN_THE_BLANK: "Fill in the Blank",
      };
      return mapping[value] || value;
    }
    if (type === "visibility") {
      const mapping = {
        PUBLIC: "Public",
        HIDDEN: "Hidden",
        PRIVATE: "Private",
      };
      return mapping[value] || value;
    }
    if (type === "category") {
      return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">
            {t("editFlashcard.title", "Chỉnh sửa Flashcard")}
          </h2>
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item label={t("flashcard.generatedFlashcard.fields.title")}>
                <Input
                  value={editingFlashcard.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                  className="mt-1"
                />
              </Form.Item>
              <Form.Item
                label={t("flashcard.generatedFlashcard.fields.category")}
              >
                <Select
                  value={editingFlashcard.category || "OTHER"}
                  onChange={(value) => handleUpdateField("category", value)}
                  className="w-full mt-1"
                  options={CATEGORY_OPTIONS.map((c) => ({
                    value: c,
                    label: formatDisplayValue(c, "category"),
                  }))}
                />
              </Form.Item>
              <Form.Item
                label={t("flashcard.generatedFlashcard.fields.cardType")}
              >
                <Select
                  value={editingFlashcard.cardType || "STANDARD"}
                  onChange={(value) => handleUpdateField("cardType", value)}
                  className="w-full mt-1"
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
                  value={editingFlashcard.visibility || "PRIVATE"}
                  onChange={(value) => handleUpdateField("visibility", value)}
                  className="w-full mt-1"
                  options={[
                    { value: "PUBLIC", label: "Public" },
                    { value: "HIDDEN", label: "Hidden" },
                    { value: "PRIVATE", label: "Private" },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item
              label={t("flashcard.generatedFlashcard.fields.description")}
            >
              <Input.TextArea
                value={editingFlashcard.description}
                onChange={(e) =>
                  handleUpdateField("description", e.target.value)
                }
                rows={3}
                className="mt-1"
                placeholder="Nhập mô tả"
              />
            </Form.Item>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                {t("flashcard.generatedFlashcard.fields.cards")}
              </h3>
              <div className="space-y-3">
                {editingFlashcard.flashcards.map((card, idx) => (
                  <div
                    key={`card-${idx}-${card.order || idx}`}
                    className="relative group animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Add Card Button - appears on hover between cards */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 opacity-100 group-hover:opacity-100 transition-all duration-300 ease-out">
                      <button
                        onClick={() => handleAddCard(idx)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 !flex !items-center !justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                        title="Thêm thẻ mới"
                      >
                        <span className="text-center text-lg text-white font-bold">
                          +
                        </span>
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-600">
                          {t("flashcard.generatedFlashcard.card.label")}{" "}
                          {idx + 1}:
                        </label>
                        <button
                          onClick={() => handleDeleteCard(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-red-50 px-2 py-1 rounded"
                          title={t("flashcard.buttons.delete")}
                        >
                          {t("flashcard.buttons.delete")}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">
                            {t("flashcard.generatedFlashcard.card.front")}
                          </label>
                          <Input.TextArea
                            value={card.front || ""}
                            onChange={(e) =>
                              handleUpdateCard(idx, "front", e.target.value)
                            }
                            rows={3}
                            placeholder="Nhập nội dung mặt trước"
                            className="mb-3"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">
                            {t("flashcard.generatedFlashcard.card.back")}
                          </label>
                          <Input.TextArea
                            value={card.back || ""}
                            onChange={(e) =>
                              handleUpdateCard(idx, "back", e.target.value)
                            }
                            rows={3}
                            placeholder="Nhập nội dung mặt sau"
                            className="mb-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add Card Button at the end */}
                <div
                  className="flex justify-center pt-4 animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                  style={{
                    animationDelay: `${
                      (editingFlashcard.flashcards.length || 0) * 100
                    }ms`,
                    animationFillMode: "both",
                  }}
                >
                  <button
                    onClick={() =>
                      handleAddCard(editingFlashcard.flashcards.length || 0)
                    }
                    className="bg-blue-600 hover:bg-blue-700 !text-white rounded-full w-10 h-10 !flex !items-center !justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    title="Thêm thẻ mới"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="primary"
                onClick={handleSaveEdit}
                loading={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving
                  ? t("flashcard.buttons.saveChanges", "Đang lưu...")
                  : t("flashcard.buttons.saveChanges", "Lưu thay đổi")}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditFlashcard;
