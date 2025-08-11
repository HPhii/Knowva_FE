import React from "react";
import { useTranslation } from "react-i18next";

const FlashcardSet = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("flashcardSet")}
        </h1>
        <p className="text-gray-600">
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
    </>
  );
};

export default FlashcardSet;
