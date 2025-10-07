import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FlashcardSet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("flashcardSet")}
        </h3>
        <p className="text-gray-600 text-sm">
          {t("flashcardSetDescription") ||
            "Create and manage your flashcard sets for effective learning"}
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
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
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noFlashcardSets") || "No Flashcard Sets Available"}
        </h3>
        <p className="text-gray-500">
          {t("flashcardSetEmptyMessage") ||
            "You haven't created any flashcard sets yet. Start creating flashcards to enhance your learning experience!"}
        </p>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/flashcards')}
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
        title="Tạo flashcard mới"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default FlashcardSet;
