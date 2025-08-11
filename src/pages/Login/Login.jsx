import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import
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

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
      const response = await api.post("/login", payload);
      const savedSuccessfully = saveLoginData(response.data);
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

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await api.post("/google", {
        token: credentialResponse.credential,
      });
      const savedSuccessfully = saveLoginData(response.data);
      if (savedSuccessfully) {
        console.log("Google login data saved successfully");
      }
      navigate("/");
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError(t("error.loginFailed"));
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-colors"
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
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-colors"
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
                      className="w-full bg-[var(--color-blue)] py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-blue-hover)] transition-colors duration-200 disabled:bg-[var(--color-grey-dark)] disabled:cursor-not-allowed"
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
                      <span className="px-2 bg-[var(--color-background)] text-gray-500">
                        {t("login.continueWith")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    text="continue_with"
                    theme="outline"
                    size="large"
                    shape="pill"
                    width="100%"
                  />
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
    </GoogleOAuthProvider>
  );
};

export default Login;
