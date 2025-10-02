import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import QuizAttempt from "./QuizAttempt";
import CommentSection from "../../components/CommentSection";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAttempting, setIsAttempting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    fetchQuizDetail();
    fetchComments();
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/quiz-sets/${id}`);
      setQuiz(response.data);
    } catch (err) {
      console.error("Error fetching quiz detail:", err);
      setError(err.response?.data?.message || "Không thể tải thông tin chi tiết quiz");
    } finally {
      setLoading(false);
    }
  };

  const startQuizAttempt = async () => {
    try {
      const response = await api.get(`/quiz-attempts/${quiz.id}/start`);
      console.log('Start quiz response:', response.data);
      
      // Lấy id từ response.attempt.id thay vì quiz.id
      const attemptId = response.data?.attempt?.id;
      if (attemptId) {
        setAttemptId(attemptId);
        setIsAttempting(true);
      } else {
        console.error('No attempt ID found in response:', response.data);
        setError("Không thể lấy ID của lần thử quiz");
      }
    } catch (err) {
      console.error("Error starting quiz attempt:", err);
      setError(err.response?.data?.message || "Không thể bắt đầu làm quiz");
    }
  };

  const handleBackToDetail = () => {
    setIsAttempting(false);
    setAttemptId(null);
  };

  // Fetch comments for the quiz
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await api.get(`/interactions/quizset/${id}/comments`);
      
      // Ensure we always set an array
      const commentsData = response.data;
      if (Array.isArray(commentsData)) {
        setComments(commentsData);
      } else if (commentsData && Array.isArray(commentsData.comments)) {
        setComments(commentsData.comments);
      } else {
        console.log('API response format:', commentsData);
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Handle adding new comment
  const handleAddComment = (newComment) => {
    if (newComment.parentId) {
      // This is a reply - find parent and add to replies
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === newComment.parentId 
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        )
      );
    } else {
      // This is a new parent comment
      setComments(prevComments => [newComment, ...prevComments]);
    }
  };

  // Handle refreshing comments
  const handleRefreshComments = () => {
    fetchComments();
  };


  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Đã xảy ra lỗi</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {t("quiz.detail.actions.tryAgain", "Thử lại")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {t("quiz.detail.actions.back", "Quay lại")}
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState />;
  }

  // No quiz data
  if (!quiz) {
    return <ErrorState />;
  }

  // Show quiz attempt if user is taking the quiz
  if (isAttempting && quiz) {
    return (
      <QuizAttempt
        quiz={quiz}
        attemptId={attemptId}
        onBack={handleBackToDetail}
        onComplete={handleBackToDetail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="bg-gray-100 rounded-full p-2 mr-3 group-hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium">Quay lại</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={startQuizAttempt}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors group"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bắt đầu làm quiz
              </button>
              
              <button
                onClick={() => navigate(`/quiz/${id}/edit`)}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors group"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sửa Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Header */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Left side - Title, Icon and Description */}
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-4 mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {quiz.title || "Quiz không có tiêu đề"}
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  {quiz.description || "Không có mô tả"}
                </p>
              </div>
              
              {/* Right side - Quiz Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{quiz.maxQuestions ?? quiz.questionCount ?? 0}</div>
                  <div className="text-sm text-blue-500">{t("quiz.detail.questions", "Câu hỏi")}</div>
                </div>
                <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{quiz.timeLimit || 30}</div>
                  <div className="text-sm text-green-500">Phút</div>
                </div>
                <div className="bg-purple-50 rounded-xl px-4 py-3 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{quiz.questionType === 'MULTIPLE_CHOICE' ? 'MC' : 'TF'}</div>
                  <div className="text-sm text-purple-500">Loại</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        {quiz.questions && quiz.questions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {t("quiz.detail.questionList", "Danh sách câu hỏi")}
            </h2>
            <div className="grid gap-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                  {/* Question Header */}
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-600 text-white font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-relaxed">
                        {question.questionText || `Câu hỏi ${index + 1}`}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {question.timeLimit || 30} giây
                      </div>
                    </div>
                  </div>

                  {/* Answers - Kahoot Style Layout */}
                  {question.answers && question.answers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.answers.map((answer, answerIndex) => {
                        return (
                          <div 
                            key={answer.id || answerIndex}
                            className={`${
                              answer.isCorrect 
                                ? 'bg-green-50 border-green-300 text-green-800 ring-2 ring-green-400 ring-opacity-50' 
                                : 'bg-white border-gray-200 text-gray-800'
                            } rounded-xl p-4 border-2 relative group hover:shadow-md transition-all duration-200`}
                          >
                            {answer.isCorrect && (
                              <div className="absolute top-2 right-2">
                                <div className="bg-green-500 rounded-full p-1">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center">
                              <div className={`${
                                answer.isCorrect 
                                  ? 'bg-green-100 border-green-300 text-green-800' 
                                  : 'bg-gray-100 border-gray-300 text-gray-600'
                              } rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold text-sm border-2`}>
                                {String.fromCharCode(65 + answerIndex)}
                              </div>
                              <span className="font-medium text-sm leading-relaxed">
                                {answer.answerText || `Lựa chọn ${answerIndex + 1}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mb-12">
          <CommentSection
            variant="quiz"
            entityId={id}
            entityType="quizset"
            comments={comments}
            onAddComment={handleAddComment}
            isLoading={isLoadingComments}
            onRefreshComments={handleRefreshComments}
          />
        </div>

      </div>

    </div>
  );
};

export default QuizDetail;
