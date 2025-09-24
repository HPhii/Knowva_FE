import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import { useNavigate, useLocation } from "react-router-dom";
import RequireEmailVerificationModal from "../../components/RequireEmailVerificationModal";
import { 
  processBirthdate, 
  isLocalDateError, 
  getLocalDateErrorMessage 
} from "../../utils/dateUtils";

// Icons
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Crown, 
  Clock, 
  BarChart3, 
  BookOpen, 
  Brain, 
  CreditCard, 
  Settings,
  Edit3,
  TrendingUp,
  Activity
} from "lucide-react";

const UserDetails = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const loginResponse = localStorage.getItem("loginResponse");
    if (!loginResponse) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/users/me");
        
        // 🔧 Handle potential LocalDate serialization issues using utility function
        let processedUserData = { ...response.data };
        processedUserData.birthdate = processBirthdate(response.data.birthdate);
        
        setUserData(processedUserData);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        
        // 🔍 Check for specific error types using utility function
        const localDateError = getLocalDateErrorMessage(err);
        if (localDateError) {
          setError(localDateError);
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(t("loadUserError") || "Không thể tải thông tin người dùng");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, [navigate]);

  const onEditProfileClick = () => {
    const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
    if (loginResponse && loginResponse.isVerified) {
      navigate("/user/edit");
    } else {
      setShowVerifyModal(true);
    }
  };

  // Redirect to profile route if accessing /user
  useEffect(() => {
    if (location.pathname === "/user") {
      navigate("/user/profile", { replace: true });
    }
  }, [navigate, location.pathname]);

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

  // Tab navigation items
  const tabs = [
    { id: "overview", label: t("overview") || "Tổng quan", icon: BarChart3 },
    { id: "quizzes", label: t("quizzes") || "Quiz", icon: Brain },
    { id: "flashcards", label: t("flashcards") || "Flashcard", icon: BookOpen },
    { id: "transactions", label: t("transactions") || "Giao dịch", icon: CreditCard },
    { id: "settings", label: t("settings") || "Cài đặt", icon: Settings },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{t("flashcardSets")}</p>
                    <p className="text-3xl font-bold text-emerald-600">{userData.stats.totalFlashcardSets}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{t("quizSets")}</p>
                    <p className="text-3xl font-bold text-blue-600">{userData.stats.totalQuizSets}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{t("avgQuizScore")}</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {userData.stats.averageQuizScore ? `${userData.stats.averageQuizScore}%` : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  {t("personalInfo")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("fullName")}</p>
                      <p className="font-medium text-gray-900">{userData.fullName || t("notSet")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("email")}</p>
                      <p className="font-medium text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("phoneNumber")}</p>
                      <p className="font-medium text-gray-900">{userData.phoneNumber || t("notSet")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("birthdate")}</p>
                      <p className="font-medium text-gray-900">{userData.birthdate || t("notSet")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-gray-600" />
                  {t("accountDetails")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("accountStatus")}</p>
                      <p className="font-medium text-green-600">{t("active")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t("vipDaysLeft")}</p>
                      <p className="font-medium text-gray-900">
                        {userData.vipDaysLeft ? `${userData.vipDaysLeft} ${t("days")}` : t("noVIP")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gray-600" />
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Đăng nhập lần cuối: Hôm nay</p>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Quiz gần nhất: 2 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "quizzes":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Sets của bạn</h3>
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có quiz nào được tạo</p>
            </div>
          </div>
        );
      
      case "flashcards":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flashcard Sets của bạn</h3>
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có flashcard nào được tạo</p>
            </div>
          </div>
        );
      
      case "transactions":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử giao dịch</h3>
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có giao dịch nào</p>
            </div>
          </div>
        );
      
      case "settings":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt tài khoản</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onEditProfileClick()}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Edit3 className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Chỉnh sửa hồ sơ</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {userData?.avatarUrl ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden">
                    <img
                      src={userData.avatarUrl}
                      alt={userData.fullName || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {userData?.fullName ? userData?.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userData.fullName || t("user")}
                </h1>
                <p className="text-gray-600 mb-2">{userData.email}</p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userData.vipDaysLeft 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Crown className="w-4 h-4 mr-1" />
                    {userData.vipDaysLeft ? t("vipMember") : t("freeUser")}
                  </span>
                  {userData.vipDaysLeft && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      <Clock className="w-4 h-4 mr-1" />
                      {userData.vipDaysLeft} {t("days")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onEditProfileClick()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              {t("editProfile")}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex justify-center space-x-12 px-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>

      <RequireEmailVerificationModal
        open={showVerifyModal}
        onCancel={() => setShowVerifyModal(false)}
      />
    </div>
  );
};

export default UserDetails;
