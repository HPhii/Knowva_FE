import React from "react";
import { Button, Input, Select } from "antd";
import { useTranslation } from "react-i18next";

const GeneratedFlashcard = ({
  generatedFlashcard,
  isEditing,
  editingFlashcard,
  isSaving,
  onEditFlashcard,
  onCancelEdit,
  onSaveEdit,
  onUpdateField,
  onUpdateCard,
  onAddCard,
  onDeleteCard,
  onSaveFlashcard,
  onCancelFlashcard,
}) => {
  const { t } = useTranslation();

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

  if (!generatedFlashcard) return null;

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {t("flashcard.generatedFlashcard.title")}
        </h3>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <Button
                onClick={onEditFlashcard}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {t("flashcard.buttons.edit")}
              </Button>
              <Button
                onClick={onCancelFlashcard}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {t("flashcard.buttons.cancel")}
              </Button>
              <Button
                type="primary"
                loading={isSaving}
                onClick={onSaveFlashcard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving
                  ? t("flashcard.buttons.save") + "..."
                  : t("flashcard.buttons.save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onCancelEdit}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {t("flashcard.buttons.cancel")}
              </Button>
              <Button
                type="primary"
                onClick={onSaveEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                {t("flashcard.buttons.saveChanges")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("flashcard.generatedFlashcard.fields.title")}
            </label>
            {isEditing ? (
              <Input
                value={editingFlashcard?.title || ""}
                onChange={(e) => onUpdateField("title", e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="text-gray-800">{generatedFlashcard.title}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("flashcard.generatedFlashcard.fields.category")}
            </label>
            {isEditing ? (
              <Select
                value={editingFlashcard?.category || "OTHER"}
                onChange={(value) => onUpdateField("category", value)}
                className="w-full mt-1"
                options={CATEGORY_OPTIONS.map((c) => ({
                  value: c,
                  label: formatDisplayValue(c, "category"),
                }))}
              />
            ) : (
              <p className="text-gray-800">
                {formatDisplayValue(generatedFlashcard.category, "category")}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("flashcard.generatedFlashcard.fields.cardType")}
            </label>
            {isEditing ? (
              <Select
                value={editingFlashcard?.cardType || "STANDARD"}
                onChange={(value) => onUpdateField("cardType", value)}
                className="w-full mt-1"
                options={[
                  {
                    value: "STANDARD",
                    label: "Standard",
                  },
                  {
                    value: "FILL_IN_THE_BLANK",
                    label: "Fill in the Blank",
                  },
                ]}
              />
            ) : (
              <p className="text-gray-800">
                {formatDisplayValue(generatedFlashcard.cardType, "cardType")}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("flashcard.generatedFlashcard.fields.visibility")}
            </label>
            {isEditing ? (
              <Select
                value={editingFlashcard?.visibility || "PRIVATE"}
                onChange={(value) => onUpdateField("visibility", value)}
                className="w-full mt-1"
                options={[
                  { value: "PUBLIC", label: "Public" },
                  { value: "HIDDEN", label: "Hidden" },
                  { value: "PRIVATE", label: "Private" },
                ]}
              />
            ) : (
              <p className="text-gray-800">
                {formatDisplayValue(
                  generatedFlashcard.visibility,
                  "visibility"
                )}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            {t("flashcard.generatedFlashcard.fields.description")}
          </label>
          {isEditing ? (
            <Input.TextArea
              value={editingFlashcard?.description || ""}
              onChange={(e) => onUpdateField("description", e.target.value)}
              rows={3}
              className="mt-1"
              placeholder="Nhập mô tả"
            />
          ) : (
            <p className="text-gray-800">
              {generatedFlashcard.description || "Không có mô tả"}
            </p>
          )}
        </div>

        {(isEditing ? editingFlashcard?.cards : generatedFlashcard.cards) &&
          (isEditing ? editingFlashcard?.cards : generatedFlashcard.cards)
            .length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                {t("flashcard.generatedFlashcard.fields.cards")}
              </label>
              <div className="space-y-3">
                {(isEditing
                  ? editingFlashcard?.cards
                  : generatedFlashcard.cards
                ).map((card, index) => (
                  <div
                    key={`card-${index}-${card.order || index}`}
                    className="relative group animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Add Card Button - appears on hover between cards */}
                    {isEditing && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                          onClick={() => onAddCard(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                          title="Thêm thẻ mới"
                        >
                          <span className="text-lg font-bold transition-transform duration-200 group-hover:rotate-90">
                            +
                          </span>
                        </button>
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-600">
                          {t("flashcard.generatedFlashcard.card.label")}{" "}
                          {index + 1}:
                        </label>
                        {isEditing && (
                          <button
                            onClick={() => onDeleteCard(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-red-50 px-2 py-1 rounded"
                            title={t("flashcard.buttons.delete")}
                          >
                            {t("flashcard.buttons.delete")}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">
                            {t("flashcard.generatedFlashcard.card.front")}
                          </label>
                          {isEditing ? (
                            <Input.TextArea
                              value={card.front || ""}
                              onChange={(e) =>
                                onUpdateCard(index, "front", e.target.value)
                              }
                              rows={3}
                              placeholder="Nhập nội dung mặt trước"
                              className="mb-3"
                            />
                          ) : (
                            <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded">
                              {card.front}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-2">
                            {t("flashcard.generatedFlashcard.card.back")}
                          </label>
                          {isEditing ? (
                            <Input.TextArea
                              value={card.back || ""}
                              onChange={(e) =>
                                onUpdateCard(index, "back", e.target.value)
                              }
                              rows={3}
                              placeholder="Nhập nội dung mặt sau"
                              className="mb-3"
                            />
                          ) : (
                            <p className="font-medium text-gray-800 bg-blue-50 p-3 rounded">
                              {card.back}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Card Button at the end */}
                {isEditing && (
                  <div
                    className="flex justify-center pt-4 animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                    style={{
                      animationDelay: `${
                        (editingFlashcard?.cards?.length || 0) * 100
                      }ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <button
                      onClick={() =>
                        onAddCard(editingFlashcard?.cards?.length || 0)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      title="Thêm thẻ mới"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default GeneratedFlashcard;
