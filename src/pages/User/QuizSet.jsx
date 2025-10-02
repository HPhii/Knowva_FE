import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const QuizSet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizSets();
  }, [location.pathname]);

  const fetchQuizSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/quiz-sets/my-quiz-sets");
      setQuizSets(response.data || []);
    } catch (err) {
      console.error("Error fetching quiz sets:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách quiz sets");
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component (vertical list style)
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="text-red-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Có lỗi xảy ra
      </h3>
      <p className="text-red-600 mb-4">
        {error}
      </p>
      <button
        onClick={fetchQuizSets}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Thử lại
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
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
      <p className="text-gray-500 mb-6">
        Bạn chưa có bộ câu hỏi nào. Hãy bắt đầu tạo quiz để kiểm tra kiến thức!
      </p>
      <button
        onClick={() => navigate('/quiz')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Tạo quiz mới</span>
      </button>
    </div>
  );

  // Handle quiz card click
  const handleQuizClick = (quizSet) => {
    const quizId = quizSet.id || quizSet._id;
    if (quizId) {
      navigate(`/quiz/${quizId}`);
    }
  };

  // Quiz set card component (vertical list item)
  const QuizSetCard = ({ quizSet }) => (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-blue-300 cursor-pointer transition-all duration-200"
      onClick={() => handleQuizClick(quizSet)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
            {quizSet.title || "Quiz không có tiêu đề"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {quizSet.description || "Không có mô tả"}
          </p>
        </div>
        <div className="flex flex-col items-end text-sm text-gray-600">
          <span className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {(quizSet.maxQuestions ?? quizSet.questionCount ?? 0)} câu hỏi
          </span>
          <span className="text-xs text-gray-400">
            {quizSet.createdAt ? new Date(quizSet.createdAt).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("quizSet")}
        </h3>
        <p className="text-gray-600 text-sm">
          {t("quizSetDescription") ||
            "Manage your quiz sets and track your progress"}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage />
      ) : quizSets.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {quizSets.map((quizSet) => (
            <QuizSetCard key={quizSet.id || quizSet._id} quizSet={quizSet} />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/quizzes')}
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
        title="Tạo quiz mới"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default QuizSet;
