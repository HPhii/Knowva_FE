import React from "react";
import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
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
  if (type === "category") {
    return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
  return value;
};

const QuizModal = ({ isOpen, onCancel, onFinish, form, isGenerating }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("quiz.modal.title")}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          language: "vi",
          questionType: "MULTIPLE_CHOICE",
          visibility: "PRIVATE",
          maxQuestions: 5,
          timeLimit: 30,
          category: ["OTHER"],
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label={t("quiz.modal.form.title")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.titleRequired"),
            },
          ]}
        >
          <Input placeholder={t("quiz.modal.form.titlePlaceholder")} />
        </Form.Item>

        <Form.Item name="description" label={t("quiz.modal.form.description")}>
          <Input.TextArea
            rows={3}
            placeholder={t("quiz.modal.form.descriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item name="language" label={t("quiz.modal.form.language")}>
          <Select
            options={[
              { value: "vi", label: "Vietnamese" },
              { value: "en", label: "English" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="questionType"
          label={t("quiz.modal.form.questionType")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.questionTypeRequired"),
            },
          ]}
        >
          <Select
            options={[
              { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
              { value: "TRUE_FALSE", label: "True/False" },
              { value: "MIXED", label: "Mixed" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="maxQuestions"
          label={t("quiz.modal.form.maxQuestions")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.maxQuestionsRequired"),
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="visibility"
          label={t("quiz.modal.form.visibility")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.visibilityRequired"),
            },
          ]}
        >
          <Select
            options={[
              { value: "PUBLIC", label: "Public" },
              { value: "HIDDEN", label: "Hidden" },
              { value: "PRIVATE", label: "Private" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label={t("quiz.modal.form.category")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.categoryRequired"),
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={t("quiz.modal.form.categoryPlaceholder")}
            options={CATEGORY_OPTIONS.map((c) => ({
              value: c,
              label: formatDisplayValue(c, "category"),
            }))}
          />
        </Form.Item>

        <Form.Item
          name="timeLimit"
          label={t("quiz.modal.form.timeLimit")}
          rules={[
            {
              required: true,
              message: t("quiz.modal.validation.timeLimitRequired"),
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel}>{t("quiz.buttons.cancel")}</Button>
          <Button
            type="primary"
            loading={isGenerating}
            onClick={() => form.submit()}
          >
            {isGenerating
              ? t("quiz.buttons.generate") + "..."
              : t("quiz.buttons.generate")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default QuizModal;
