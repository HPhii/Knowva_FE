import React, { useState, useEffect } from "react";
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
} from "antd";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        form.setFieldsValue({
          fullName: res.data.fullName || "",
          phoneNumber: res.data.phoneNumber || "",
          birthdate: res.data.birthdate ? dayjs(res.data.birthdate) : null,
          gender: res.data.gender || "MALE",
          email: res.data.email || "",
        });
      } catch (err) {
        setError(t("loadUserError"));
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

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
        username: values.fullName,
      });
      message.success(
        t("updateProfileSuccess") || "Profile updated successfully!"
      );
      navigate("/user");
    } catch (err) {
      setError(t("updateProfileError") || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#f5f7fa" }}
      className="flex items-center justify-center py-8 px-2"
    >
      <Card
        className="w-full max-w-xl rounded-3xl shadow-2xl"
        style={{ borderRadius: 24 }}
        bodyStyle={{ padding: 32 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--color-blue)] rounded-full p-3 mb-3 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.232 5.232a3 3 0 1 1 4.243 4.243L7.5 21H3v-4.5z" />
              <path d="M16 7l1 1" />
            </svg>
          </div>
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
          <Paragraph
            style={{ color: "#64748b", textAlign: "center", margin: 0 }}
          >
            {t("editProfileDesc") ||
              "Update your personal information to keep your account up to date."}
          </Paragraph>
        </div>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
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
              rules={[{ required: true, message: t("required") || "Required" }]}
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
            <Form.Item label={t("birthdate")} name="birthdate" className="mb-0">
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
              <Input size="large" placeholder={t("email")} autoComplete="off" />
            </Form.Item>
          </div>
          <div className="pt-2 flex flex-col md:flex-row md:justify-end gap-3">
            <Button
              type="default"
              size="large"
              className="w-full md:w-auto"
              onClick={() => navigate("/user")}
              disabled={loading}
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button
              type="primary"
              size="large"
              className="w-full md:w-auto bg-[var(--color-blue)] hover:bg-[var(--color-blue-hover)] border-none"
              htmlType="submit"
              loading={loading}
              style={{ background: "var(--color-blue)", border: "none" }}
            >
              {t("save") || "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
