import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import loginIllustration from "../../assets/images/login.png";
import api from "../../config/axios";
import { saveLoginData } from "../../utils/auth";
import { getLoginErrorMessage } from "../../utils/errorMessages";

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { email, password } = formData;
    const payload = { email, password };
    try {
      const response = await fetch("https://api.knowva.me/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Unexpected error occurred");
      }
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      const savedSuccessfully = saveLoginData(data);
      if (savedSuccessfully) {
        console.log("Login data saved successfully");
      }
      navigate("/");
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row">
          <div className="bg-[#FAFAF3] p-8 lg:p-12 flex-1">
            <div className="max-w-md mx-auto">
              {/* Language Switcher */}
              <div className="flex justify-end mb-4">
                <div
                  className={`${i18n.language === "en" ? "text-[#fff]" : ""}`}
                >
                  <button
                    className={`px-3 py-1 rounded-l ${
                      i18n.language === "en"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => i18n.changeLanguage("en")}
                  >
                    EN
                  </button>
                </div>

                <div
                  className={`${i18n.language === "vi" ? "text-[#fff]" : ""}`}
                >
                  <button
                    className={`px-3 py-1 rounded-r ${
                      i18n.language === "vi"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => i18n.changeLanguage("vi")}
                  >
                    VI
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {t("login.title")}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("login.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder={t("login.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("login.password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={t("login.passwordPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="!mb-0 text-red-600 text-sm text-center">
                      {error}
                    </p>
                  </div>
                )}
                <div className="text-[#fff]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {loading ? t("login.loggingIn") : t("login.loginButton")}
                  </button>
                </div>
              </form>
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#FAFAF3] text-gray-500">
                      {t("login.continueWith")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t("login.google")}
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="#1877F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  {t("login.facebook")}
                </button>
              </div>
              <div className="mt-8 text-center">
                <span className="text-gray-600">{t("login.noAccount")}</span>
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {t("login.signupLink")}
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1 lg:w-1/2">
            <img
              src={loginIllustration}
              alt={t("login.illustrationAlt")}
              className="w-full h-full object-cover lg:rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
