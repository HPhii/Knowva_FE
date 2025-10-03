import React from "react";
import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
import { useTranslation } from "react-i18next";

const FlashcardModal = ({ isOpen, onCancel, onFinish, form, isGenerating }) => {
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
    if (type === "category") {
      return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return value;
  };

  return (
    <Modal
      title={t("flashcard.modal.title")}
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
          cardType: "STANDARD",
          visibility: "PRIVATE",
          maxCards: 5,
          category: ["OTHER"],
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label={t("flashcard.modal.form.title")}
          rules={[
            {
              required: true,
              message: t("flashcard.modal.validation.titleRequired"),
            },
          ]}
        >
          <Input placeholder={t("flashcard.modal.form.titlePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("flashcard.modal.form.description")}
        >
          <Input.TextArea
            rows={3}
            placeholder={t("flashcard.modal.form.descriptionPlaceholder")}
          />
        </Form.Item>

        <Form.Item name="language" label={t("flashcard.modal.form.language")}>
          <Select
            options={[
              { value: "vi", label: "Vietnamese" },
              { value: "en", label: "English" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="cardType"
          label={t("flashcard.modal.form.cardType")}
          rules={[
            {
              required: true,
              message: t("flashcard.modal.validation.cardTypeRequired"),
            },
          ]}
        >
          <Select
            options={[
              { value: "STANDARD", label: "Standard" },
              { value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="maxCards"
          label={t("flashcard.modal.form.maxCards")}
          rules={[
            {
              required: true,
              message: t("flashcard.modal.validation.maxCardsRequired"),
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="visibility"
          label={t("flashcard.modal.form.visibility")}
          rules={[
            {
              required: true,
              message: t("flashcard.modal.validation.visibilityRequired"),
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
          label={t("flashcard.modal.form.category")}
          rules={[
            {
              required: true,
              message: t("flashcard.modal.validation.categoryRequired"),
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder={t("flashcard.modal.form.categoryPlaceholder")}
            options={CATEGORY_OPTIONS.map((c) => ({
              value: c,
              label: formatDisplayValue(c, "category"),
            }))}
          />
        </Form.Item>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel}>{t("flashcard.buttons.cancel")}</Button>
          <Button
            type="primary"
            loading={isGenerating}
            onClick={() => form.submit()}
          >
            {isGenerating
              ? t("flashcard.buttons.generate") + "..."
              : t("flashcard.buttons.generate")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FlashcardModal;
