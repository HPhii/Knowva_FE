import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Typography, message, Space, Input } from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import loginIllustration from "../../assets/images/login.png";
import api from "../../config/axios";

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    // Lấy email từ localStorage nếu có
    const loginResponse = JSON.parse(
      localStorage.getItem("loginResponse") || "{}"
    );
    return loginResponse.email || "";
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef([]);
  const [seconds, setSeconds] = useState(() => {
    // Khôi phục thời gian countdown từ localStorage
    const savedCountdown = localStorage.getItem("forgotPasswordCountdown");
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
    const savedCountdown = localStorage.getItem("forgotPasswordCountdown");
    if (savedCountdown) {
      const { endTime } = JSON.parse(savedCountdown);
      const now = Date.now();
      return endTime - now > 0;
    }
    return false;
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Focus vào ô đầu tiên khi component mount
  useEffect(() => {
    if (showOtpForm && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showOtpForm]);

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
              "forgotPasswordCountdown",
              JSON.stringify({ endTime })
            );
          } else {
            // Xóa countdown khi hết thời gian
            localStorage.removeItem("forgotPasswordCountdown");
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      setIsDisableSendOtp(false);
      // Xóa countdown khi hết thời gian
      localStorage.removeItem("forgotPasswordCountdown");
    }
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSendOtp = async () => {
    if (!email) {
      setEmailError(t("forgotPassword.emailRequired"));
      return;
    }
    setEmailError(""); // Clear error when email is provided

    setLoading(true);
    try {
      await api.post(`/send-reset-otp?email=${encodeURIComponent(email)}`);
      setSeconds(60);
      setIsDisableSendOtp(true);
      setShowOtpForm(true);

      // Lưu thời gian bắt đầu countdown vào localStorage
      const endTime = Date.now() + 10 * 1000;
      localStorage.setItem(
        "forgotPasswordCountdown",
        JSON.stringify({ endTime })
      );

      message.success(t("forgotPassword.otpSentSuccess"));
    } catch (err) {
      console.error("Send OTP error:", err);
      message.error(t("forgotPassword.otpSentError"));
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

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(t("forgotPassword.invalidCode"));
      return;
    }

    setVerifying(true);
    setError(""); // Clear previous error
    try {
      // Bỏ qua bước verify OTP riêng, chuyển thẳng sang form đổi mật khẩu
      // OTP sẽ được verify khi gọi API reset-password
      message.success(t("forgotPassword.verificationSuccess"));
      // Show password reset form
      setShowPasswordForm(true);
    } catch (err) {
      console.log("err: ", err.response?.data);
      setError(t("forgotPassword.verificationError"));
    } finally {
      setVerifying(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError(t("forgotPassword.passwordRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("forgotPassword.passwordMismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("forgotPassword.passwordTooShort"));
      return;
    }

    setResettingPassword(true);
    setError("");

    try {
      const otpString = otp.join("");
      await api.post("/reset-password", {
        email: email,
        otp: otpString,
        newPassword: newPassword,
      });

      message.success(t("forgotPassword.passwordResetSuccess"));
      // Clear localStorage
      localStorage.removeItem("forgotPasswordCountdown");
      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      setError(t("forgotPassword.passwordResetError"));
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-grey-light)] flex items-center justify-center p-4">
      <div className="bg-[var(--color-background)] rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row">
          <div className="bg-[var(--color-background)] p-8 lg:p-12 flex-1">
            <div className="max-w-md mx-auto">
              {/* Language Switcher */}
              <div className="flex justify-end mb-4">
                <button
                  className={`px-3 py-1 rounded-l ${
                    i18n.language === "en"
                      ? "bg-[var(--color-blue)] !text-white"
                      : "bg-[var(--color-grey-dark)]"
                  }`}
                  onClick={() => i18n.changeLanguage("en")}
                >
                  EN
                </button>
                <button
                  className={`px-3 py-1 rounded-r ${
                    i18n.language === "vi"
                      ? "bg-[var(--color-blue)] !text-white"
                      : "bg-[var(--color-grey-dark)]"
                  }`}
                  onClick={() => i18n.changeLanguage("vi")}
                >
                  VI
                </button>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  {t("forgotPassword.title")}
                </h1>
              </div>

              {!showOtpForm && !showPasswordForm ? (
                // Email Form
                <div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("forgotPassword.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-colors"
                      placeholder={t("forgotPassword.emailPlaceholder")}
                    />
                    {emailError && (
                      <div className="mt-1 ml-2">
                        <p className="!mb-0 text-red-500 text-sm">
                          {emailError}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={loading || seconds > 0}
                      onClick={handleSendOtp}
                      className="cursor-pointer w-full bg-[var(--color-blue)] py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-blue-hover)] duration-200 disabled:bg-[var(--color-grey-dark)] disabled:cursor-not-allowed !text-white"
                    >
                      {loading
                        ? t("forgotPassword.sending")
                        : seconds > 0
                        ? `${t("forgotPassword.resendIn")} ${seconds}`
                        : t("forgotPassword.sendOtp")}
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {t("forgotPassword.backToLogin")}
                    </Link>
                  </div>
                </div>
              ) : showOtpForm && !showPasswordForm ? (
                // OTP Form
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Paragraph
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        color: "#666",
                        marginBottom: 24,
                      }}
                    >
                      {t("forgotPassword.codeSentTo")} {email}
                    </Paragraph>
                  </div>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-2 sm:gap-3 mb-6 px-2">
                    {otp.map((digit, index) => (
                      <div key={index}>
                        <Input
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
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
                    className="w-full !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none !mb-4"
                    onClick={handleVerifyOtp}
                    loading={verifying}
                    disabled={!isOtpComplete}
                    icon={<CheckCircleOutlined />}
                  >
                    {t("forgotPassword.verifyCode")}
                  </Button>

                  <Space direction="vertical" size="large" className="w-full">
                    <Button
                      type="default"
                      size="large"
                      className="w-full"
                      onClick={handleSendOtp}
                      loading={loading}
                      disabled={seconds > 0}
                    >
                      {isDisableSendOtp ? (
                        <div>
                          <p className="!mb-0">
                            {t("forgotPassword.resendIn")} {seconds}
                          </p>
                        </div>
                      ) : (
                        t("forgotPassword.sendOtp")
                      )}
                    </Button>

                    <Button
                      type="default"
                      size="large"
                      className="w-full"
                      onClick={() => setShowOtpForm(false)}
                      icon={<ArrowLeftOutlined />}
                    >
                      {t("forgotPassword.backToEmail")}
                    </Button>
                  </Space>
                </div>
              ) : (
                // Password Reset Form
                <div>
                  <div className="text-center mb-6">
                    <div className="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="85"
                        height="85"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="#008a20"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <path
                            stroke-dasharray="64"
                            stroke-dashoffset="64"
                            d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              dur="0.6s"
                              values="64;0"
                            />
                          </path>
                          <path
                            stroke-dasharray="14"
                            stroke-dashoffset="14"
                            d="M8 12l3 3l5 -5"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              begin="0.6s"
                              dur="0.2s"
                              values="14;0"
                            />
                          </path>
                        </g>
                      </svg>
                    </div>
                    <Title level={3} style={{ marginBottom: "8px" }}>
                      {t("forgotPassword.createNewPassword")}
                    </Title>
                    <Paragraph style={{ color: "#666", marginBottom: 0 }}>
                      {t("forgotPassword.enterNewPassword")}
                    </Paragraph>
                  </div>

                  {/* New Password Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("forgotPassword.newPassword")}
                    </label>
                    <Input.Password
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t("forgotPassword.newPasswordPlaceholder")}
                      prefix={<LockOutlined />}
                      className="w-full"
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("forgotPassword.confirmPassword")}
                    </label>
                    <Input.Password
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t(
                        "forgotPassword.confirmPasswordPlaceholder"
                      )}
                      prefix={<LockOutlined />}
                      className="w-full"
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4">
                      <p className="text-red-500 text-center text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Reset Password Button */}
                  <Button
                    type="primary"
                    size="large"
                    className="!text-white w-full !bg-[var(--color-blue)] hover:!bg-[var(--color-blue-hover)] !border-none !mb-4"
                    onClick={handleResetPassword}
                    loading={resettingPassword}
                    disabled={!newPassword || !confirmPassword}
                    icon={<CheckCircleOutlined />}
                  >
                    {t("forgotPassword.changePassword")}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 lg:w-1/2">
            <img
              src={loginIllustration}
              alt="Forgot Password illustration"
              className="w-full h-full object-cover lg:rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
