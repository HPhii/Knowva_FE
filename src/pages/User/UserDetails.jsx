import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";

const UserDetails = () => {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/users/me");
        setUserData(response.data);
      } catch (err) {
        setError(t("loadUserError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingUserInfo")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t("noUserData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("userDetails")}
          </h1>
        </div>
        {/* User Profile Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {userData?.fullName
                  ? userData?.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {userData.fullName || t("user")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t("email")}:</span>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t("vipDaysLeft")}:</span>
                  <p className="font-medium text-gray-900">
                    {userData.vipDaysLeft
                      ? `${userData.vipDaysLeft} ${t("days")}`
                      : t("noVIP")}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">{t("status")}:</span>
                  <p className="font-medium text-blue-600">
                    {userData.vipDaysLeft ? t("vipMember") : t("freeUser")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userData.stats.totalFlashcardSets}
            </div>
            <div className="text-sm text-gray-600">{t("flashcardSets")}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {userData.stats.totalQuizSets}
            </div>
            <div className="text-sm text-gray-600">{t("quizSets")}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {userData.stats.averageQuizScore
                ? `${userData.stats.averageQuizScore}%`
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">{t("avgQuizScore")}</div>
          </div>
        </div>
        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("personalInfo")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">{t("fullName")}</label>
                <p className="font-medium text-gray-900">
                  {userData.fullName || t("notSet")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t("email")}</label>
                <p className="font-medium text-gray-900">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  {t("phoneNumber")}
                </label>
                <p className="font-medium text-gray-900">
                  {userData.phoneNumber || t("notSet")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  {t("birthdate")}
                </label>
                <p className="font-medium text-gray-900">
                  {userData.birthdate || t("notSet")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t("gender")}</label>
                <p className="font-medium text-gray-900">
                  {userData.gender || t("notSet")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("accountDetails")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">
                  {t("vipDaysLeft")}
                </label>
                <p className="font-medium text-gray-900">
                  {userData.vipDaysLeft
                    ? `${userData.vipDaysLeft} ${t("days")}`
                    : t("noVIP")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  {t("accountStatus")}
                </label>
                <p className="font-medium text-green-600">{t("active")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
