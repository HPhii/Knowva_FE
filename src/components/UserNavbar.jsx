import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logoImage from "../assets/images/logo_no_text.png";

const UserNavbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: "profile",
      label: t("myProfile"),
      path: "/user/profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      key: "quiz-set",
      label: t("quizSet"),
      path: "/user/quiz-set",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      key: "flashcard-set",
      label: t("flashcardSet"),
      path: "/user/flashcard-set",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      key: "transaction",
      label: t("transaction"),
      path: "/user/transaction",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="26"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31c.487-1.866-1.273-3.9-3.546-4.49S7.977 9.54 8.464 7.675s2.724-2.899 4.998-2.31c.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen flex-shrink-0 bg-[var(--color-blue)] border-r border-gray-200 overflow-y-auto py-4 z-[60]">
      <div className="flex items-center justify-center space-x-6">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Local logo image */}
          <span className="hidden sm:block text-3xl font-bold text-[#fff] tracking-tight">
            KnowVa
          </span>
        </Link>
      </div>
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-5 py-3 text-left transition-colors ${
              isActive(item.path)
                ? "bg-white !text-black"
                : "!text-white hover:!text-black hover:bg-white"
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UserNavbar;
