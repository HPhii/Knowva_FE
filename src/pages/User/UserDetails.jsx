import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";
import RequireEmailVerificationModal from "../../components/RequireEmailVerificationModal";
import { 
  processBirthdate, 
  isLocalDateError, 
  getLocalDateErrorMessage 
} from "../../utils/dateUtils";
import QuizSet from "./QuizSet";
import FlashcardSet from "./FlashcardSet";
import BlogSet from "./BlogSet";
import Transaction from "./Transaction";
import UserActivities from "./UserActivities";

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
  FileText,
  CreditCard, 
  Settings,
  Edit3,
  TrendingUp,
  Activity
} from "lucide-react";

const UserDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get user ID from URL params
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize active tab from URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['overview', 'quizzes', 'flashcards', 'blogs', 'transactions', 'activities'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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
        
        // Determine if we're viewing current user or another user
        const isViewingOtherUser = id && id !== "me";
        setIsCurrentUser(!isViewingOtherUser);
        
        // Choose API endpoint based on whether we have an ID
        const apiEndpoint = isViewingOtherUser ? `/users/${id}` : "/users/me";
        const response = await api.get(apiEndpoint);
        
        // 🔧 Handle potential LocalDate serialization issues using utility function
        let processedUserData = { ...response.data };
        processedUserData.birthdate = processBirthdate(response.data.birthdate);
        
        
        setUserData(processedUserData);
      } catch (err) {

        const localDateError = getLocalDateErrorMessage(err);
        if (localDateError) {
          setError(localDateError);
        } else if (err.response?.status === 401) {
          setError(t("userDetailsPage.sessionExpired"));
        } else if (err.response?.status === 404) {
          setError(t("userDetailsPage.userNotFound"));
        } else {
          setError(t("loadUserError") || t("userDetailsPage.loadUserError"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, [navigate, id]);

  const onEditProfileClick = () => {
    const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
    if (loginResponse && loginResponse.isVerified) {
      navigate("/user/edit");
    } else {
      setShowVerifyModal(true);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
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
    { id: "overview", label: t("Overview") || "Tổng quan", icon: BarChart3 },
    { id: "quizzes", label: t("Quizzes") || "Câu hỏi", icon: Brain },
    { id: "flashcards", label: t("Flashcards") || "Thẻ ghi nhớ", icon: BookOpen },
    // Only show blogs, transactions and activities for current user
    ...(isCurrentUser ? [
      { id: "blogs", label: t("Blogs") || "Blog", icon: FileText },
      { id: "transactions", label: t("Transactions") || "Giao dịch", icon: CreditCard },
      { id: "activities", label: t("activities.title") || "Hoạt động gần đây", icon: Activity },
    ] : []),
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
                    <p className="text-3xl font-bold text-emerald-600">{userData.stats?.totalFlashcardSets || 0}</p>
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
                    <p className="text-3xl font-bold text-blue-600">{userData.stats?.totalQuizSets || 0}</p>
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
                      {userData.stats?.averageQuizScore !== null && userData.stats?.averageQuizScore !== undefined && userData.stats?.averageQuizScore !== "" ? userData.stats.averageQuizScore : "N/A"}
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
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("fullName")}</p>
                      <p className="font-medium text-gray-900">{userData.fullName || t("notSet")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("email")}</p>
                      <p className="font-medium text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("phoneNumber")}</p>
                      <p className="font-medium text-gray-900">{userData.phoneNumber || t("notSet")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("birthdate")}</p>
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
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <Crown className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("accountStatus")}</p>
                      <p className="font-medium text-green-600">{t("active")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{t("vipDaysLeft")}</p>
                      <p className="font-medium text-gray-900">
                        {userData.vipDaysLeft && userData.vipDaysLeft !== null ? `${userData.vipDaysLeft} ${t("days")}` : t("noVIP")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Only show for current user */}
            {isCurrentUser && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  {t("userDetailsPage.quickActions")}
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => onEditProfileClick()}
                    className="w-full flex items-center justify-between p-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Edit3 className="w-5 h-5 text-white" />
                      <span className="font-medium text-white">{t("userDetailsPage.editProfile")}</span>
                    </div>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleTabChange('activities')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{t("userDetailsPage.viewDetailedActivities")}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case "quizzes":
        return <QuizSet />;
      
      case "flashcards":
        return <FlashcardSet />;
      
      case "blogs":
        return <BlogSet />;
      
      case "transactions":
        return <Transaction />;
      
      case "activities":
        return <UserActivities />;
      
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
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={userData.avatarUrl}
                      alt={userData.fullName || t("User")}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
                    userData.role === 'VIP' || (userData.vipDaysLeft && userData.vipDaysLeft !== null)
                      ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg animate-pulse' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Crown className="w-4 h-4 mr-1" />
                    {userData.role === 'VIP' || (userData.vipDaysLeft && userData.vipDaysLeft !== null) ? t("userDetailsPage.vipUser") : t("userDetailsPage.freeUser")}
                  </span>
                  {userData.vipDaysLeft && userData.vipDaysLeft !== null && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      <Clock className="w-4 h-4 mr-1" />
                      {userData.vipDaysLeft} {t("days")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isCurrentUser && (
              <button
                onClick={() => onEditProfileClick()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 !text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                {t("editProfile")}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex justify-center space-x-12 px-8" aria-label={t("Tabs")}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
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
