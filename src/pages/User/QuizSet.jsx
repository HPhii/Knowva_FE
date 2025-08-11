import React from "react";
import { useTranslation } from "react-i18next";

const QuizSet = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("quizSet")}
        </h1>
        <p className="text-gray-600">
          {t("quizSetDescription") ||
            "Manage your quiz sets and track your progress"}
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noQuizSets") || "No Quiz Sets Available"}
        </h3>
        <p className="text-gray-500">
          {t("quizSetEmptyMessage") ||
            "You haven't created any quiz sets yet. Start creating quizzes to test your knowledge!"}
        </p>
      </div>
    </>
  );
};

export default QuizSet;
