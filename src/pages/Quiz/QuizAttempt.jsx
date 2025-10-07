import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";

const QuizAttempt = ({ quiz, attemptId, onBack, onComplete }) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert minutes to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Shuffle questions and answers when component mounts
  useEffect(() => {
    if (quiz.questions && quiz.questions.length > 0) {
      const shuffled = [...quiz.questions].map(question => ({
        ...question,
        answers: [...question.answers].sort(() => Math.random() - 0.5)
      })).sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
    }
  }, [quiz.questions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 && !hasSubmitted && !showTimeUpModal) {
      setShowTimeUpModal(true);
      return;
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, hasSubmitted, showTimeUpModal]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [Number(questionId)]: Number(answerId)
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted) return; // Prevent multiple submissions
    
    try {
      setIsSubmitting(true);
      setHasSubmitted(true);
      
      // Convert answers object to the required format
      const submitData = Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
        questionId: Number(questionId),
        selectedAnswerId: Number(selectedAnswerId)
      }));
      
      const response = await api.post(`/quiz-attempts/${attemptId}/submit`, submitData);
      
      setScore(response.data);
      setShowResults(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, attemptId, hasSubmitted]);

  const getAnswerStatus = (questionId) => {
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  const handleTimeUpConfirm = () => {
    setShowTimeUpModal(false);
    handleSubmit();
  };

  // Show loading if questions haven't been shuffled yet
  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuẩn bị câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (showResults && score) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
            <p className="text-gray-600 mb-6">Bạn đã hoàn thành quiz thành công</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round(score.score || 0)}/100
              </div>
              <p className="text-gray-600">Điểm số</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onBack}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Quay lại chi tiết quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">Câu hỏi {currentQuestionIndex + 1} / {shuffledQuestions.length}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`px-4 py-2 rounded-lg font-mono text-lg ${
                timeLeft <= 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {formatTime(timeLeft)}
              </div>
              
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.questionText}
            </h2>
            <div className="text-sm text-gray-500">
              Thời gian: {currentQuestion.timeLimit || 30} giây
            </div>
          </div>

          {/* Answers */}
          <div className={`${
            currentQuestion.answers.length % 2 === 0 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-3' 
              : 'space-y-3'
          }`}>
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={answer.id || index}
                onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion.id] === answer.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm ${
                    answers[currentQuestion.id] === answer.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{answer.answerText}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg font-medium transition-colors"
          >
            Câu trước
          </button>

          <div className="flex items-center space-x-2">
            {shuffledQuestions.map((question, index) => (
              <button
                key={question.id || index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : getAnswerStatus(question.id) === 'answered'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === shuffledQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Câu tiếp
            </button>
          )}
        </div>
      </div>

      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hết thời gian!</h2>
              <p className="text-gray-600 mb-6">Thời gian làm bài của bạn đã hết. Bạn có muốn nộp bài không?</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleTimeUpConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
