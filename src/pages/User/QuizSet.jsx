import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Dropdown } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const QuizSet = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get user ID from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    fetchQuizSets();
  }, [location.pathname, id]);

  const fetchQuizSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine if we're viewing current user or another user
      const isViewingOtherUser = id && id !== "me";
      setIsCurrentUser(!isViewingOtherUser);
      
      let response;
      if (isViewingOtherUser) {
        // Get public quiz sets of another user
        response = await api.get(`/quiz-sets/user/${id}`);
        // Filter only PUBLIC visibility quiz sets
        const publicQuizSets = (response.data || []).filter(quiz => 
          (quiz.visibility || quiz.visibilityStatus) === "PUBLIC"
        );
        setQuizSets(publicQuizSets);
      } else {
        // Get current user's quiz sets
        response = await api.get("/quiz-sets/my-quiz-sets");
        setQuizSets(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching quiz sets:", err);
      setError(err.response?.data?.message || t("userDetailsPage.quizSet.cannotLoadQuizSets"));
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
        {t("userDetailsPage.quizSet.tryAgain")}
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
        {isCurrentUser 
          ? (t("noQuizSets") || "No Quiz Sets Available")
          : t("userDetailsPage.quizSet.noPublicQuizzes")
        }
      </h3>
      <p className="text-gray-500 mb-6">
        {isCurrentUser 
          ? "Bạn chưa có bộ câu hỏi nào. Hãy bắt đầu tạo quiz để kiểm tra kiến thức!"
          : t("userDetailsPage.quizSet.noPublicQuizzesDesc")
        }
      </p>
      {isCurrentUser && (
        <div className="flex justify-baseline mb-5">
          <Dropdown
            menu={{ items: createQuizItems }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button icon={<PlusOutlined />}>
              {t("userDetailsPage.quizSet.createNewQuiz", "Tạo Quiz mới")}
            </Button>
          </Dropdown>
        </div>
      )}
    </div>
  );

  // Create dropdown items for quiz creation
  const createQuizItems = [
    {
      key: "ai",
      label: (
        <div
          onClick={() => navigate("/quiz")}
          className="flex items-center px-2 py-1 hover:bg-gray-50 rounded"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {t("userDetailsPage.quizSet.createWithAI", "Tạo với AI")}
        </div>
      ),
    },
    {
      key: "scratch",
      label: (
        <div
          onClick={() => navigate("/quiz/create")}
          className="flex items-center px-2 py-1 hover:bg-gray-50 rounded"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          {t("userDetailsPage.quizSet.createFromScratch", "Tạo từ đầu")}
        </div>
      ),
    },
  ];

  // Handle quiz card click
  const handleQuizClick = (quizSet) => {
    const quizId = quizSet.id || quizSet._id;
    if (quizId) {
      const currentTab = searchParams.get('tab') || 'quizzes';
      navigate(`/quiz/${quizId}`, { 
        state: { 
          from: 'userDetail', 
          userId: id, 
          tab: currentTab 
        } 
      });
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
          {isCurrentUser 
            ? (t("quizSet") || "Quiz Sets")
            : "Quiz công khai"
          }
        </h3>
        <p className="text-gray-600 text-sm">
          {isCurrentUser 
            ? (t("quizSetDescription") || "Manage your quiz sets and track your progress")
            : "Các quiz được công khai của người dùng này"
          }
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

      {/* Floating Add Button - Only show for current user */}
      {isCurrentUser && (
        <button
          onClick={() => navigate('/quizzes')}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
          title="Tạo quiz mới"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default QuizSet;
