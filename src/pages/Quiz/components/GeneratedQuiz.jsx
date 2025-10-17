import React from "react";
import { Button, Input, Select, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

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
  if (type === "questionType") {
    const mapping = {
      MULTIPLE_CHOICE: "Multiple Choice",
      TRUE_FALSE: "True/False",
      MIXED: "Mixed",
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

const GeneratedQuiz = ({
  generatedQuiz,
  isEditing,
  editingQuiz,
  isSaving,
  onEditQuiz,
  onCancelEdit,
  onSaveEdit,
  onUpdateField,
  onUpdateQuestion,
  onUpdateAnswer,
  onAddQuestion,
  onDeleteQuestion,
  onSaveQuiz,
  onCancelQuiz,
}) => {
  const { t } = useTranslation();

  if (!generatedQuiz) return null;

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {t("quiz.generatedQuiz.title")}
        </h3>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <Button
                onClick={onEditQuiz}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {t("quiz.buttons.edit")}
              </Button>
              <Button
                onClick={onCancelQuiz}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {t("quiz.buttons.cancel")}
              </Button>
              <Button
                type="primary"
                loading={isSaving}
                onClick={onSaveQuiz}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving
                  ? t("quiz.buttons.save") + "..."
                  : t("quiz.buttons.save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onCancelEdit}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {t("quiz.buttons.cancel")}
              </Button>
              <Button
                type="primary"
                onClick={onSaveEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                {t("quiz.buttons.saveChanges")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("quiz.generatedQuiz.fields.title")}
            </label>
            {isEditing ? (
              <Input
                value={editingQuiz?.title || ""}
                onChange={(e) => onUpdateField("title", e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="text-gray-800">{generatedQuiz.title}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("quiz.generatedQuiz.fields.category")}
            </label>
            {isEditing ? (
              <Select
                value={editingQuiz?.category || "OTHER"}
                onChange={(value) => onUpdateField("category", value)}
                className="w-full mt-1"
                options={CATEGORY_OPTIONS.map((c) => ({
                  value: c,
                  label: formatDisplayValue(c, "category"),
                }))}
              />
            ) : (
              <p className="text-gray-800">
                {formatDisplayValue(generatedQuiz.category, "category")}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("quiz.generatedQuiz.fields.questionType")}
            </label>
            {isEditing ? (
              <Select
                value={editingQuiz?.questionType || "MULTIPLE_CHOICE"}
                onChange={(value) => onUpdateField("questionType", value)}
                className="w-full mt-1"
                options={[
                  {
                    value: "MULTIPLE_CHOICE",
                    label: "Multiple Choice",
                  },
                  { value: "TRUE_FALSE", label: "True/False" },
                  { value: "MIXED", label: "Mixed" },
                ]}
              />
            ) : (
              <p className="text-gray-800">
                {formatDisplayValue(generatedQuiz.questionType, "questionType")}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("quiz.generatedQuiz.fields.timeLimit")}
            </label>
            {isEditing ? (
              <InputNumber
                value={editingQuiz?.timeLimit || 30}
                onChange={(value) => onUpdateField("timeLimit", value)}
                min={1}
                className="w-full mt-1"
                addonAfter="phút"
              />
            ) : (
              <p className="text-gray-800">{generatedQuiz.timeLimit} phút</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              {t("quiz.generatedQuiz.fields.visibility")}
            </label>
            {isEditing ? (
              <Select
                value={editingQuiz?.visibility || "PRIVATE"}
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
                {formatDisplayValue(generatedQuiz.visibility, "visibility")}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            {t("quiz.generatedQuiz.fields.description")}
          </label>
          {isEditing ? (
            <Input.TextArea
              value={editingQuiz?.description || ""}
              onChange={(e) => onUpdateField("description", e.target.value)}
              rows={3}
              className="mt-1"
              placeholder="Nhập mô tả"
            />
          ) : (
            <p className="text-gray-800">
              {generatedQuiz.description || "Không có mô tả"}
            </p>
          )}
        </div>

        {(isEditing ? editingQuiz?.questions : generatedQuiz.questions) &&
          (isEditing ? editingQuiz?.questions : generatedQuiz.questions)
            .length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                {t("quiz.generatedQuiz.fields.questions")}
              </label>
              <div className="space-y-3">
                {(isEditing
                  ? editingQuiz?.questions
                  : generatedQuiz.questions
                ).map((question, index) => (
                  <div
                    key={`question-${index}-${question.order || index}`}
                    className="relative group animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Add Question Button - appears on hover between questions */}
                    {isEditing && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                          onClick={() => onAddQuestion(index)}
                          className="bg-blue-600 hover:bg-blue-700 !text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
                          title="Thêm câu hỏi mới"
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
                          {t("quiz.generatedQuiz.question.label")} {index + 1}:
                        </label>
                        {isEditing && (
                          <button
                            onClick={() => onDeleteQuestion(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-red-50 px-2 py-1 rounded"
                            title={t("quiz.buttons.delete")}
                          >
                            {t("quiz.buttons.delete")}
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <Input.TextArea
                          value={question.questionText || ""}
                          onChange={(e) =>
                            onUpdateQuestion(
                              index,
                              "questionText",
                              e.target.value
                            )
                          }
                          rows={2}
                          placeholder={t("quiz.generatedQuiz.question.label")}
                          className="mb-3"
                        />
                      ) : (
                        <p className="font-medium text-gray-800 mb-3">
                          {question.questionText}
                        </p>
                      )}

                      {question.answers && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 block">
                            {t("quiz.generatedQuiz.question.answers")}
                          </label>
                          {question.answers.map((answer, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm font-medium text-gray-600 w-6">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {isEditing ? (
                                <>
                                  <Input
                                    value={answer.answerText || ""}
                                    onChange={(e) =>
                                      onUpdateAnswer(
                                        index,
                                        optionIndex,
                                        "answerText",
                                        e.target.value
                                      )
                                    }
                                    placeholder={t(
                                      "quiz.generatedQuiz.question.answers"
                                    )}
                                    className="flex-1"
                                  />
                                  <Button
                                    type={
                                      answer.isCorrect ? "primary" : "default"
                                    }
                                    size="small"
                                    onClick={() =>
                                      onUpdateAnswer(
                                        index,
                                        optionIndex,
                                        "isCorrect",
                                        !answer.isCorrect
                                      )
                                    }
                                    className={`transition-all duration-300 ease-out hover:scale-105 ${
                                      answer.isCorrect
                                        ? "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    {answer.isCorrect
                                      ? t("quiz.generatedQuiz.question.correct")
                                      : t("quiz.generatedQuiz.question.wrong")}
                                  </Button>
                                </>
                              ) : (
                                <div
                                  className={`text-sm flex-1 ${
                                    answer.isCorrect
                                      ? "text-green-600 font-medium"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {answer.answerText}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Question Button at the end */}
                {isEditing && (
                  <div
                    className="flex justify-center pt-4 animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
                    style={{
                      animationDelay: `${
                        (editingQuiz?.questions?.length || 0) * 100
                      }ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <button
                      onClick={() =>
                        onAddQuestion(editingQuiz?.questions?.length || 0)
                      }
                      className="bg-blue-600 hover:bg-blue-700 !text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      title="Thêm câu hỏi mới"
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

export default GeneratedQuiz;
