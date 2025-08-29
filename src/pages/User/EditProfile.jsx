import React, { useState, useEffect, useRef } from "react";
import RequireEmailVerificationModal from "../../components/RequireEmailVerificationModal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Typography,
  message,
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    const checkVerificationAndFetchUser = async () => {
      try {
        // Check if user is verified first
        const loginResponse = JSON.parse(
          localStorage.getItem("loginResponse") || "{}"
        );

        if (!loginResponse.isVerified) {
          // Show verification modal first
          setShowVerifyModal(true);
          return;
        }

        // If verified, fetch user data
        const res = await api.get("/users/me");
        form.setFieldsValue({
          fullName: res.data.fullName || "",
          phoneNumber: res.data.phoneNumber || "",
          birthdate: res.data.birthdate ? dayjs(res.data.birthdate) : null,
          gender: res.data.gender || "MALE",
          email: res.data.email || "",
        });
        // Set profile image if available
        if (res.data.avatarUrl) {
          setImageUrl(res.data.avatarUrl);
        }
      } catch (err) {
        setError(t("loadUserError"));
      }
    };
    checkVerificationAndFetchUser();
    // eslint-disable-next-line
  }, [navigate]);

  const handleImageUpload = async (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(
        t("imageTypeError") || "You can only upload JPG/PNG files!"
      );
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("imageSizeError") || "Image must be smaller than 2MB!");
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "SDN_Blog");
      formData.append("cloud_name", "dejilsup7");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dejilsup7/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setImageUrl(result.secure_url);
      message.success(
        t("imageUploadSuccess") || "Image uploaded successfully!"
      );
    } catch (err) {
      console.error("Upload error:", err);
      message.error(t("imageUploadError") || "Failed to upload image");
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const me = await api.get("/users/me");
      await api.put(`/users/${me.data.id}/update`, {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        birthdate: values.birthdate
          ? values.birthdate.format("YYYY-MM-DD")
          : "",
        gender: values.gender,
        email: values.email,
        emailVerified: me.data.emailVerified,
        username: values.fullName,
        avatarUrl: imageUrl,
      });
      message.success(
        t("updateProfileSuccess") || "Profile updated successfully!"
      );

      // Navigate to user details page first
      navigate("/user");

      // Then reload the user details page to get fresh data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      if (
        err.response.data === "Email verification required for this action."
      ) {
        setShowVerifyModal(true);
      } else {
        setError(t("error.updateProfileError") || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{ minHeight: "100vh", background: "#fff" }}
        className="flex items-center justify-center py-8 px-2"
      >
        <Card
          className="w-full max-w-xl rounded-3xl shadow-2xl"
          style={{ borderRadius: 24 }}
          bodyStyle={{ padding: 32 }}
        >
          <div className="flex flex-col items-center mb-5">
            <Title
              level={2}
              style={{
                color: "var(--color-blue)",
                marginBottom: 0,
                textAlign: "center",
              }}
            >
              {t("editProfile")}
            </Title>
          </div>
          {error && (
            <div className="text-red-500 mb-2 text-center">{error}</div>
          )}

          {/* Profile Image Upload Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <Avatar
                  size={100}
                  src={imageUrl || undefined}
                  icon={!imageUrl ? <UserOutlined /> : undefined}
                  className="relative"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-[32px] opacity-0 hover:opacity-30 rounded-[100px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e3e3e3"
                      d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3"
                    />
                  </svg>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    await handleImageUpload(file);
                    e.target.value = ""; // reset input so same file can be selected again
                  }
                }}
              />
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="space-y-5"
            requiredMark={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Form.Item
                label={t("fullName")}
                name="fullName"
                rules={[
                  { required: true, message: t("required") || "Required" },
                ]}
                className="mb-0"
              >
                <Input
                  size="large"
                  placeholder={t("fullName")}
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                label={t("phoneNumber")}
                name="phoneNumber"
                className="mb-0"
              >
                <Input size="large" placeholder={t("phoneNumber")} />
              </Form.Item>
              <Form.Item
                label={t("birthdate")}
                name="birthdate"
                className="mb-0"
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder={t("birthdate")}
                />
              </Form.Item>
              <Form.Item label={t("gender")} name="gender" className="mb-0">
                <Select size="large">
                  <Option value="MALE">{t("male")}</Option>
                  <Option value="FEMALE">{t("female")}</Option>
                  <Option value="OTHER">{t("other")}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("email")}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("invalidEmail") || "Invalid email",
                  },
                ]}
                className="md:col-span-2 mb-0"
              >
                <Input
                  size="large"
                  placeholder={t("email")}
                  autoComplete="off"
                />
              </Form.Item>
            </div>
            <div className="pt-2 flex flex-col md:flex-row md:justify-end gap-3">
              <Button
                type="default"
                size="large"
                className="w-full md:w-auto"
                onClick={() => navigate("/user/profile")}
                disabled={loading}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <div>
                <Button
                  type="primary"
                  size="large"
                  className="w-full md:w-auto !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none"
                  htmlType="submit"
                  loading={loading}
                  style={{ background: "var(--color-blue)", border: "none" }}
                >
                  {t("save") || "Save"}
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
      <RequireEmailVerificationModal
        open={showVerifyModal}
        onCancel={() => {
          setShowVerifyModal(false);
          navigate("/user/profile");
        }}
      />
    </>
  );
};

export default EditProfile;
