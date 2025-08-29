import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, message, Space, Input } from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Title, Paragraph } = Typography;

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [seconds, setSeconds] = useState(() => {
    // Khôi phục thời gian countdown từ localStorage
    const savedCountdown = localStorage.getItem("verifyEmailCountdown");
    if (savedCountdown) {
      const { endTime } = JSON.parse(savedCountdown);
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });
  const [isDisableSendOtp, setIsDisableSendOtp] = useState(() => {
    // Kiểm tra xem có đang trong thời gian countdown không
    const savedCountdown = localStorage.getItem("verifyEmailCountdown");
    if (savedCountdown) {
      const { endTime } = JSON.parse(savedCountdown);
      const now = Date.now();
      return endTime - now > 0;
    }
    return false;
  });
  const [error, setError] = useState("");
  // Check verified status from localStorage
  const [isVerified, setIsVerified] = useState(() => {
    const loginResponse = JSON.parse(
      localStorage.getItem("loginResponse") || "{}"
    );
    return loginResponse.isVerified === true;
  });

  // Focus vào ô đầu tiên khi component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev - 1;
          // Lưu thời gian countdown vào localStorage
          if (newSeconds > 0) {
            const endTime = Date.now() + newSeconds * 1000;
            localStorage.setItem(
              "verifyEmailCountdown",
              JSON.stringify({ endTime })
            );
          } else {
            // Xóa countdown khi hết thời gian
            localStorage.removeItem("verifyEmailCountdown");
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      setIsDisableSendOtp(false);
      // Xóa countdown khi hết thời gian
      localStorage.removeItem("verifyEmailCountdown");
    }
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Lấy email từ localStorage hoặc context
      const userString = localStorage.getItem("loginResponse") || "{}";
      const user = JSON.parse(userString);
      const userEmail = user.email;

      if (!userEmail) {
        message.error("Email not found. Please login again.");
        return;
      }

      await api.post(`/send-verify-otp?email=${encodeURIComponent(userEmail)}`);
      setSeconds(60);
      setIsDisableSendOtp(true);

      // Lưu thời gian bắt đầu countdown vào localStorage
      const endTime = Date.now() + 60 * 1000;
      localStorage.setItem("verifyEmailCountdown", JSON.stringify({ endTime }));

      message.success(t("verifyEmail.resendSuccess"));
    } catch (err) {
      console.error("Send OTP error:", err);
      message.error(t("verifyEmail.resendError"));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Xử lý paste 6 số vào ô đầu tiên
    if (index === 0 && value.length === 6 && /^\d{6}$/.test(value)) {
      const digits = value.split("");
      setOtp(digits);
      // Focus vào ô cuối cùng
      inputRefs.current[5]?.focus();
      return;
    }

    // Xử lý nhập từng số một
    if (value.length > 1) return; // Chỉ cho phép 1 ký tự

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Kiểm tra nếu paste 6 số
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      // Focus vào ô cuối cùng
      inputRefs.current[5]?.focus();
    }
  };

  //ham goi khi an nut verify email
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(t("verifyEmail.invalidOtp"));
      return;
    }

    setVerifying(true);
    setError(""); // Clear previous error
    try {
      const userString = localStorage.getItem("loginResponse") || "{}";
      const user = JSON.parse(userString);
      const userEmail = user.email;

      if (!userEmail) {
        setError("Email not found. Please login again.");
        navigate("/login");
        return;
      }

      await api.post(
        `/verify-email?email=${encodeURIComponent(userEmail)}&otp=${otpString}`
      );
      message.success(t("verifyEmail.verificationSuccess"));

      // Cập nhật isVerified thành true trong localStorage
      const loginResponse = JSON.parse(
        localStorage.getItem("loginResponse") || "{}"
      );
      loginResponse.isVerified = true;
      localStorage.setItem("loginResponse", JSON.stringify(loginResponse));
      setIsVerified(true);
      navigate("/verify-complete");
    } catch (err) {
      console.log("err: ", err.response.data);
      if (
        err.response.data ===
        `500 INTERNAL_SERVER_ERROR "Failed to verify email"`
      ) {
        setError(t("verifyEmail.verificationError"));
      } else {
        setError(t("verifyEmail.failedToVerify"));
      }
    } finally {
      setVerifying(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div
      style={{ minHeight: "100vh", background: "#f5f7fa" }}
      className="flex items-center justify-center py-8 px-2"
    >
      <Card
        className="w-full max-w-md rounded-3xl shadow-2xl"
        style={{ borderRadius: 24 }}
        bodyStyle={{ padding: 32 }}
      >
        {isVerified ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircleOutlined
              style={{ fontSize: 48, color: "var(--color-green-price-board)" }}
            />
            <Title
              level={2}
              style={{
                color: "var(--color-green-price-board)",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              {t("verifyEmail.alreadyVerified")}
            </Title>
            <Paragraph
              style={{
                textAlign: "center",
                fontSize: "16px",
                color: "#666",
                marginBottom: 24,
              }}
            >
              {t("verifyEmail.alreadyVerifiedDesc")}
            </Paragraph>

            <Button
              type="primary"
              size="large"
              className="w-full !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none mt-4"
              onClick={() => navigate(-1)}
            >
              {t("verifyEmail.goBack")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              {/* Email Icon */}
              <div className="w-16 h-16 bg-[var(--color-blue)] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffffff"
                    d="M2 20V4h20v16zm10-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"
                  />
                </svg>
              </div>

              <Title
                level={2}
                style={{
                  color: "var(--color-blue)",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {t("verifyEmail.title")}
              </Title>

              <Paragraph
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: 24,
                }}
              >
                {t("verifyEmail.enterOtp")}
              </Paragraph>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6 px-2">
                {otp.map((digit, index) => (
                  <div key={index}>
                    <Input
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="!w-10 !h-10 sm:!w-12 sm:!h-12 text-center !text-[14px] sm:!text-[16px] font-semibold border-2 border-gray-300 rounded-lg focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue)] focus:ring-opacity-20"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4">
                  <p className="text-red-500 text-center text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Verify OTP Button */}
              <Button
                type="primary"
                size="large"
                className="w-full !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none mb-4"
                onClick={handleVerifyOtp}
                loading={verifying}
                disabled={!isOtpComplete}
                icon={<CheckCircleOutlined />}
              >
                {t("verifyEmail.verifyOtp")}
              </Button>
            </div>

            <Space direction="vertical" size="large" className="w-full">
              <Button
                type="default"
                size="large"
                className="w-full"
                onClick={handleSendOtp}
                loading={loading}
                disabled={seconds > 0}
                // icon={<MailOutlined />}
              >
                {isDisableSendOtp ? (
                  <div>
                    <p className="!mb-0">Resend OTP in: {seconds}</p>
                  </div>
                ) : (
                  t("verifyEmail.sendButton")
                )}
              </Button>

              <Button
                type="default"
                size="large"
                className="w-full"
                onClick={() => navigate("/")}
                icon={<ArrowLeftOutlined />}
              >
                {t("verifyEmail.backToHome")}
              </Button>
            </Space>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
