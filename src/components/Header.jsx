import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MailOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { isLoggedIn, getUserInfo, clearLoginData } from "../utils/auth";
import api from "../config/axios";
import logoImage from "../assets/images/logo_no_text.png";
import GlobalSearch from "./GlobalSearch";

// --- HEADER COMPONENT ---
const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [language, setLanguage] = useState(
    i18n.language === "vi" ? "VI" : "EN"
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập và fetch user data khi component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);

      if (loggedIn) {
        try {
          // Fetch user data from API
          const response = await api.get("/users/me");
          setUserInfo(response.data);
          // Fetch notifications
          await fetchNotifications();
        } catch (err) {
          console.error("Error fetching user data:", err);
          // Fallback to localStorage data if API fails
          const user = getUserInfo();
          setUserInfo(user);
        }
      }
    };

    checkLoginStatus();

    // Lắng nghe thay đổi localStorage
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const toggleLanguage = () => {
    if (language === "EN") {
      // Chuyển sang tiếng Việt
      i18n.changeLanguage("vi");
      setLanguage("VN");
    } else {
      // Chuyển sang tiếng Anh
      i18n.changeLanguage("en");
      setLanguage("EN");
    }
  };

  const handleLogout = () => {
    clearLoginData();
    setUserLoggedIn(false);
    setUserInfo(null);
    navigate("/"); // chuyển về trang chủ sau khi logout
  };

  // Lấy initials từ tên user để hiển thị avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications", {
        params: {
          page: 0,
          size: 3,
          sortBy: "timestamp",
          sortDirection: "DESC",
        },
      });

      // Transform API response to match current UI structure
      const transformedNotifications = response.data.notifications.map(
        (notification) => ({
          id: notification.id,
          title: getNotificationTitle(notification.type),
          message: notification.message,
          time: formatTimeAgo(notification.timestamp),
          read: notification.read,
        })
      );

      setNotifications(transformedNotifications);

      // Reset hasViewedNotifications when new notifications are fetched
      // This will show the count again if there are new unread notifications
      setHasViewedNotifications(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Set empty array on error to avoid breaking UI
      setNotifications([]);
    }
  };

  // Helper function to get notification title based on type
  const getNotificationTitle = (type) => {
    const titleMap = {
      REMINDER: "Nhắc nhở",
      QUIZ_RESULT: "Kết quả quiz",
      FLASHCARD_REMINDER: "Nhắc nhở flashcard",
      SYSTEM: "Thông báo hệ thống",
      ACHIEVEMENT: "Thành tích",
      COURSE_UPDATE: "Cập nhật khóa học",
    };
    return titleMap[type] || "Thông báo";
  };

  // Helper function to format timestamp to time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    }
  };

  // Helper function to format message with line breaks and truncation
  const formatMessage = (message) => {
    if (!message) return "";

    // If message is longer than 50 characters, add line break
    if (message.length > 50) {
      // Find the best place to break (around 50 characters)
      let breakPoint = 50;

      // Try to break at word boundary
      for (let i = 50; i >= 30; i--) {
        if (
          message[i] === " " ||
          message[i] === "," ||
          message[i] === "." ||
          message[i] === "!"
        ) {
          breakPoint = i + 1;
          break;
        }
      }

      const firstLine = message.substring(0, breakPoint).trim();
      const secondLine = message.substring(breakPoint).trim();

      // If second line is still too long, truncate it
      if (secondLine.length > 50) {
        return `${firstLine}\n${secondLine.substring(0, 47)}...`;
      }

      return `${firstLine}\n${secondLine}`;
    }

    return message;
  };

  // Handle notification dropdown open/close
  const handleNotificationDropdownChange = (open) => {
    setNotificationDropdownOpen(open);
    // Mark as viewed when dropdown is opened
    if (open) {
      setHasViewedNotifications(true);
    }
  };

  // Get unread notifications count (only show when not viewed yet)
  const getUnreadCount = () => {
    if (hasViewedNotifications) return 0; // Hide count after viewing
    return notifications.filter((n) => !n.read).length;
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const userId = userInfo?.id || userInfo?.userId;
      await api.post(`/notifications/read-all?userId=${userId}`);

      // Update local state - mark all as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Tạo dropdown menu items cho Ant Design
  const dropdownItems = [
    {
      key: "userInfo",
      label: (
        <Link to="/user" className="flex items-center pr-5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden mr-3">
            {userInfo?.avatarUrl ? (
              <img
                src={userInfo.avatarUrl}
                alt={userInfo?.fullName || userInfo?.username || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              getInitials(userInfo?.fullName || userInfo?.username)
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {userInfo?.fullName || userInfo?.username || "User"}
            </span>
            <span className="text-xs text-gray-500">
              {userInfo?.email || ""}
            </span>
          </div>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "verifyEmail",
      label: (
        <Link to="/verify-email" className="flex items-center text-[15px]">
          <MailOutlined className="mr-2" />
          <p className="!mb-0 !mt-1">{t("header.verifyEmail")}</p>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <span className="flex items-center text-[15px]">
          <LogoutOutlined className="mr-2" />
          {t("header.logout")}
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  // Tạo dropdown menu items cho notifications
  const notificationItems = [
    {
      key: "header",
      label: (
        <div className="py-2 px-3 border-b border-gray-200 flex items-center justify-between">
          <span className="text-lg font-light text-gray-900">
            Notifications
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              markAllNotificationsAsRead();
            }}
            className={`text-xs font-medium transition-all duration-200 ${
              notifications.some((n) => !n.read)
                ? "!text-blue-600 hover:text-blue-800 hover:underline"
                : "!text-gray-400 cursor-not-allowed"
            }`}
            disabled={!notifications.some((n) => !n.read)}
          >
            Mark all read
          </button>
        </div>
      ),
      disabled: true,
    },
    ...notifications.map((notification) => ({
      key: notification.id,
      label: (
        <div
          className={`py-2 px-3 cursor-pointer hover:bg-gray-50 transition-colors ${
            !notification.read ? "bg-blue-50" : ""
          }`}
          onClick={() => markNotificationAsRead(notification.id)}
        >
          <div className="flex items-start">
            <div
              className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                !notification.read ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {notification.title}
              </div>
              <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                {formatMessage(notification.message)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {notification.time}
              </div>
            </div>
          </div>
        </div>
      ),
    })),
    {
      type: "divider",
    },
    {
      key: "viewAll",
      label: (
        <div className="text-center py-2">
          <Link to="/notification">
            <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
              View all notifications
            </span>
          </Link>
        </div>
      ),
    },
  ];

  // Hàm kiểm tra trang hiện tại để highlight navigation item
  const isCurrentPage = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    // BUG: xóa overflow-hidden
    <header className="sticky top-0 z-50 bg-slate-900 h-[70px] w-full py-0 px-4 sm:px-6 flex items-center justify-between shadow-md relative">
      {/* Animated Background with Universe Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles with CSS animations */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400/30 rounded-full animate-float-fast"></div>
        <div
          className="absolute top-1/4 right-1/2 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full animate-float-medium"
          style={{ animationDelay: "0.5s" }}
        ></div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-pink-900/5"></div>
      </div>

      {/* === LEFT SECTION: BRAND & MAIN NAVIGATION === */}
      <div className="h-full flex items-center space-x-6 relative z-10">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Local logo image */}
          <img src={logoImage} alt="KnowVa Logo" className="h-8 w-8" />
          <span className="hidden sm:block text-2xl md:text-3xl font-extrabold text-white tracking-tight font-brand-script">
            KnowVa
          </span>
        </Link>

        {/* Main Navigation - chỉ giữ lại các link chính */}
        <nav className="h-full hidden lg:flex items-center">
          {/* My library */}
          <div
            className={`cursor-pointer flex items-center h-full transition-all duration-300 group px-6 ${
              isCurrentPage("/my-library")
                ? "bg-white/20 border-b-2 border-white/40"
                : "hover:bg-white/10"
            }`}
          >
            <Link
              to="/my-library"
              className="text-white text-lg transition-all duration-300 font-medium"
            >
              {t("header.myLibrary")}
            </Link>
          </div>
          {/* Generate Tab (Dropdown for Quizzes/Flashcards) */}
          <div
            className={`cursor-pointer flex items-center h-full transition-all duration-300 group px-6 relative ${
              isCurrentPage("/quizzes") || isCurrentPage("/flashcards")
                ? "bg-white/20 border-b-2 border-white/40"
                : "hover:bg-white/10"
            }`}
          >
            <Dropdown
              menu={{
                items: [
                  {
                    key: "quizzes",
                    label: (
                      <Link
                        to="/quizzes"
                        className="block text-[16px] px-4 py-2 text-gray-900 hover:bg-blue-50"
                      >
                        {t("header.quizzes")}
                      </Link>
                    ),
                  },
                  {
                    key: "flashcards",
                    label: (
                      <Link
                        to="/flashcards"
                        className="block text-[16px] px-4 py-2 text-gray-900 hover:bg-blue-50"
                      >
                        {t("header.flashcards")}
                      </Link>
                    ),
                  },
                ],
              }}
              placement="bottom"
              arrow
              trigger={["click"]}
            >
              <button className="!text-white !text-[18px] transition-all duration-300 font-medium flex items-center gap-2">
                {t("header.generate", "Generate")}
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </Dropdown>
          </div>

          {/* Blog */}
          <div
            className={`cursor-pointer flex items-center h-full transition-all duration-300 group px-6 ${
              isCurrentPage("/blog")
                ? "bg-white/20 border-b-2 border-white/40"
                : "hover:bg-white/10"
            }`}
          >
            <Link
              to="/blog"
              className="text-white text-lg transition-all duration-300 font-medium"
            >
              {t("header.blog")}
            </Link>
          </div>

          {/* Explore */}
          <div
            className={`cursor-pointer flex items-center h-full transition-all duration-300 group px-6 ${
              isCurrentPage("/Explore")
                ? "bg-white/20 border-b-2 border-white/40"
                : "hover:bg-white/10"
            }`}
          >
            <Link
              to="/Explore"
              className="text-white text-lg transition-all duration-300 font-medium"
            >
              {t("header.explore")}
            </Link>
          </div>
        </nav>
      </div>

      {/* === RIGHT SECTION: SEARCH, LANGUAGE & AUTH === */}
      <div className="flex items-center space-x-3 relative z-10">
        {/* GLOBAL SEARCH - đã được di chuyển sang phải */}
        <GlobalSearch />

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="cursor-pointer flex items-center space-x-1 font-semibold !text-white py-2 px-3 rounded-full hover:bg-white/10 transition-all duration-300 text-sm sm:text-base hover:scale-105"
        >
          <span>{language}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            className="transition-transform duration-300 group-hover:rotate-180"
          >
            <path
              fill="white"
              d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20m7.75-8a8 8 0 0 0 0-4h-3.82a29 29 0 0 1 0 4zm-.82 2h-3.22a14.4 14.4 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14m-8.85-2h3.84a24.6 24.6 0 0 0 0-4H8.08a24.6 24.6 0 0 0 0 4m.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4zm-6.08-2h3.82a29 29 0 0 1 0-4H2.25a8 8 0 0 0 0 4m.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6M3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6"
            />
          </svg>
        </button>

        {/* Conditional rendering based on login status */}
        {userLoggedIn ? (
          // User Avatar & Dropdown when logged in using Ant Design
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div>
              <Dropdown
                menu={{ items: notificationItems }}
                placement="bottomRight"
                arrow
                trigger={["click"]}
                onOpenChange={handleNotificationDropdownChange}
              >
                <button className="cursor-pointer relative flex items-center justify-center w-10 h-10 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 !text-white">
                  <BellOutlined className="text-[23px] text-white" />
                  {getUnreadCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>
              </Dropdown>
            </div>

            {/* User Avatar & Dropdown */}
            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <button className="cursor-pointer flex items-center space-x-2 hover:bg-white/10 rounded-full p-2 transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                  {userInfo?.avatarUrl ? (
                    <img
                      src={userInfo.avatarUrl}
                      alt={userInfo?.fullName || userInfo?.username || "User"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials(userInfo?.fullName || userInfo?.username)
                  )}
                </div>
                {/* Dropdown arrow */}
                <svg
                  className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </Dropdown>
          </div>
        ) : (
          // Login & Sign Up Buttons when not logged in
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <button className="cursor-pointer !text-white py-2 px-5 rounded-full hover:bg-white/10 transition-all duration-300 text-[16px] font-medium hover:scale-105 border border-white/20 hover:border-white/40">
                {t("header.login")}
              </button>
            </Link>
            <Link to="/signup">
              <div className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t("header.signup")}
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(4px);
          }
          50% {
            transform: translateY(-4px) translateX(-6px);
          }
          75% {
            transform: translateY(-12px) translateX(2px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-6px) translateX(3px);
          }
          66% {
            transform: translateY(-10px) translateX(-5px);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-5px) translateX(2px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
