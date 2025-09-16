import React from "react";
import { useTranslation } from "react-i18next";

const TabBar = ({ activeTab, onTabClick }) => {
  const { t } = useTranslation();

  const tabs = [
    { key: "Text", label: t("quiz.tabs.text") },
    { key: "Document", label: t("quiz.tabs.document") },
    { key: "Image", label: t("quiz.tabs.image") },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="bg-[#f5f7ff] rounded-[100px] p-1 flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`px-6 py-2 rounded-[100px] !text-[15px] transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-[#1e40af] shadow-sm"
                : "text-[#1e40af]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Options Button */}
      <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
        {t("quiz.buttons.options")}
      </button>
    </div>
  );
};

export default TabBar;
