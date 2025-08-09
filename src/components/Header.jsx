import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// --- HEADER COMPONENT ---
const Header = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language === "vi" ? "VI" : "EN"
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  console.log("userInfo", userInfo);

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

  // Mock notifications data - replace with actual API call
  const fetchNotifications = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get("/notifications");
      // setNotifications(response.data);

      // Mock data for now
      setNotifications([
        {
          id: 1,
          title: "New quiz available",
          message: "A new quiz has been added to your course",
          time: "2 hours ago",
          read: false,
        },
        {
          id: 2,
          title: "Flashcard reminder",
          message: "Time to review your flashcards",
          time: "1 day ago",
          read: true,
        },
        {
          id: 3,
          title: "Test results",
          message: "Your test results are ready",
          time: "3 days ago",
          read: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Tạo dropdown menu items cho Ant Design
  const dropdownItems = [
    {
      key: "userInfo",
      label: (
        <Link to="/user" className="flex items-center pr-5">
          <div className="w-8 h-8 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-white font-bold overflow-hidden mr-3">
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
        <div className="py-2 px-3 border-b border-gray-200">
          <span className="text-lg font-light text-gray-900">
            Notifications
          </span>
        </div>
      ),
      disabled: true,
    },
    ...notifications.map((notification) => ({
      key: notification.id,
      label: (
        <div className={`py-2 px-3 ${!notification.read ? "bg-blue-50" : ""}`}>
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
              <div className="text-xs text-gray-600 mt-1">
                {notification.message}
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
          <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
            View all notifications
          </span>
        </div>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white h-[70px] w-full py-0 px-4 sm:px-6 flex items-center justify-between shadow-md">
      {/* === LEFT SECTION: BRAND & MAIN FEATURES === */}
      <div className="flex items-center space-x-6">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Local logo image */}
          <img src={logoImage} alt="KnowVa Logo" className="h-8 w-8" />
          <span className="hidden sm:block text-3xl font-bold text-[#000] tracking-tight">
            KnowVa
          </span>
        </Link>
      </div>

      <div className="flex justify-center items-center h-full">
        {/* Public navigation links */}
        <nav className="h-full hidden lg:flex items-center ml-4 pl-6">
          {/* Quizzes */}
          <div className="cursor-pointer flex items-center h-full transition-colors duration-300 group hover:bg-[var(--color-blue)] px-8">
            <Link
              to="/quizzes"
              className="text-[#000] text-lg transition-colors duration-300 group-hover:text-white"
            >
              {t("header.quizzes")}
            </Link>
          </div>

          {/* Flashcards */}
          <div className=" cursor-pointer flex items-center h-full transition-colors duration-300 group hover:bg-[var(--color-blue)] px-8">
            <Link
              to="/flashcards"
              className="text-[#000] text-lg transition-colors duration-300 group-hover:text-white"
            >
              {t("header.flashcards")}
            </Link>
          </div>

          {/* Tests */}
          <div className="cursor-pointer flex items-center h-full transition-colors duration-300 group hover:bg-[var(--color-blue)] px-8">
            <Link
              to="/tests"
              className="text-[#000] text-lg transition-colors duration-300 group-hover:text-white"
            >
              {t("header.tests")}
            </Link>
          </div>

          {/* Blog */}
          <div className="cursor-pointer flex items-center h-full transition-colors duration-300 group hover:bg-[var(--color-blue)] px-8">
            <Link
              to="/blog"
              className="text-[#000] text-lg transition-colors duration-300 group-hover:text-white"
            >
              {t("header.blog")}
            </Link>
          </div>

          {/* Explore */}
          <div className="cursor-pointer flex items-center h-full transition-colors duration-300 group hover:bg-[var(--color-blue)] px-8">
            <Link
              to="/Explore"
              className="text-[#000] text-lg transition-colors duration-300 group-hover:text-white"
            >
              {t("header.explore")}
            </Link>
          </div>
        </nav>
      </div>

      {/* === RIGHT SECTION: AUTH ACTIONS & LANGUAGE TOGGLE === */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="cursor-pointer flex items-center space-x-1 font-semibold text-[#000] py-2 px-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
        >
          <span>{language}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
          >
            <path
              fill="#000"
              d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20m7.75-8a8 8 0 0 0 0-4h-3.82a29 29 0 0 1 0 4zm-.82 2h-3.22a14.4 14.4 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14m-8.85-2h3.84a24.6 24.6 0 0 0 0-4H8.08a24.6 24.6 0 0 0 0 4m.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4zm-6.08-2h3.82a29 29 0 0 1 0-4H2.25a8 8 0 0 0 0 4m.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6M3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6"
            />
          </svg>
        </button>

        {/* Conditional rendering based on login status */}
        {userLoggedIn ? (
          // User Avatar & Dropdown when logged in using Ant Design
          <div className="ml-5 flex items-center space-x-3">
            {/* Notification Bell */}
            <div>
              <Dropdown
                menu={{ items: notificationItems }}
                placement="bottomRight"
                arrow
                trigger={["click"]}
              >
                <button className="cursor-pointer relative flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <BellOutlined className="text-[23px] text-gray-600" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
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
              <button className="cursor-pointer flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200">
                <div className="w-8 h-8 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
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
                  className="w-4 h-4 text-[#000]"
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
          <div className="flex items-center space-x-2 ml-2">
            <Link to="/login">
              <button className="cursor-pointer text-[#000] py-2 px-6 rounded-full hover:bg-gray-100 transition-colors duration-200 text-[18px]">
                {t("header.login")}
              </button>
            </Link>
            <Link to="/signup">
              <div className="cursor-pointer bg-[var(--color-blue)] text-[#fff] py-2 px-4 rounded-full hover:bg-[var(--color-blue-hover)] transition-transform duration-200 hover:scale-105 text-base">
                {t("header.signup")}
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
