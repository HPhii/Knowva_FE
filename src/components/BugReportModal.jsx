import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { BugOutlined, SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import api from "../config/axios";

const { TextArea } = Input;

const BugReportModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "UI", label: t("bugReport.categories.UI") },
    { value: "FUNCTIONALITY", label: t("bugReport.categories.FUNCTIONALITY") },
    { value: "PERFORMANCE", label: t("bugReport.categories.PERFORMANCE") },
    { value: "PAYMENT", label: t("bugReport.categories.PAYMENT") },
    { value: "SECURITY", label: t("bugReport.categories.SECURITY") },
    { value: "OTHER", label: t("bugReport.categories.OTHER") },
  ];

  const priorities = [
    { value: "LOW", label: t("bugReport.priorities.LOW") },
    { value: "MEDIUM", label: t("bugReport.priorities.MEDIUM") },
    { value: "HIGH", label: t("bugReport.priorities.HIGH") },
    { value: "CRITICAL", label: t("bugReport.priorities.CRITICAL") },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post("/bug-reports", {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        priority: values.priority,
      });

      message.success(t("bugReport.successMessage"));

      // Reset form and close modal
      form.resetFields();
      onCancel();
    } catch (err) {
      console.error("Error submitting bug report:", err);
      message.error(err.response?.data?.message || t("bugReport.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BugOutlined style={{ color: "#ff4d4f" }} />
          <span>{t("bugReport.title")}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        {/* Title */}
        <Form.Item
          name="title"
          label={t("bugReport.titleLabel")}
          rules={[{ required: true, message: t("bugReport.titleRequired") }]}
        >
          <Input placeholder={t("bugReport.titlePlaceholder")} />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label={t("bugReport.descriptionLabel")}
          rules={[
            { required: true, message: t("bugReport.descriptionRequired") },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t("bugReport.descriptionPlaceholder")}
          />
        </Form.Item>

        {/* Category and Priority Row */}
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="category"
            label={t("bugReport.categoryLabel")}
            style={{ flex: 1 }}
            initialValue="UI"
          >
            <Select options={categories} style={{ color: "#000" }} />
          </Form.Item>

          <Form.Item
            name="priority"
            label={t("bugReport.priorityLabel")}
            style={{ flex: 1 }}
            initialValue="LOW"
          >
            <Select options={priorities} style={{ color: "#000" }} />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={handleCancel}>{t("bugReport.cancel")}</Button>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
            >
              {t("bugReport.submit")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BugReportModal;
