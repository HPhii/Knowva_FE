import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import FailImage from "../../assets/images/Fail.png";
import BetterImage from "../../assets/images/better.png";
import SuperImage from "../../assets/images/super.png";

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

  const getScoreDisplay = (score) => {
    const scoreValue = Math.round(score || 0);
    
    if (scoreValue >= 0 && scoreValue <= 49) {
      return {
        icon: FailImage,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'Cần cải thiện'
      };
    } else if (scoreValue >= 50 && scoreValue <= 79) {
      return {
        icon: BetterImage,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        label: 'Khá tốt'
      };
    } else {
      return {
        icon: SuperImage,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Xuất sắc'
      };
    }
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
    const scoreDisplay = getScoreDisplay(score.score);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <style>
          {`
            @keyframes angryShake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              25% { transform: translateX(-5px) rotate(-5deg); }
              75% { transform: translateX(5px) rotate(5deg); }
            }
            
            @keyframes gentleFloat {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-8px) scale(1.05); }
            }
            
            @keyframes gentleGlow {
              0%, 100% { 
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                transform: scale(1);
              }
              50% { 
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
                transform: scale(1.02);
              }
            }
            
            @keyframes checkmarkBounce {
              0%, 100% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.1) rotate(-5deg); }
              75% { transform: scale(1.1) rotate(5deg); }
            }
            
            @keyframes sparkle {
              0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
              50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            }
            
            @keyframes starTwinkle {
              0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
              50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
            }
            
            .angry-shake {
              animation: angryShake 0.5s ease-in-out infinite;
            }
            
            .wind-blow {
              animation: windBlow 1s ease-in-out infinite;
            }
            
            .sparkle {
              animation: sparkle 2s ease-in-out infinite;
            }
            
            .star-twinkle {
              animation: starTwinkle 1.5s ease-in-out infinite;
            }
            
            .gentle-float {
              animation: gentleFloat 3s ease-in-out infinite;
            }
            
            .gentle-glow {
              animation: gentleGlow 2s ease-in-out infinite;
            }
            
            .checkmark-bounce {
              animation: checkmarkBounce 1.5s ease-in-out infinite;
            }
          `}
        </style>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="flex items-center justify-center mx-auto mb-4 relative">
              <img 
                src={scoreDisplay.icon} 
                alt={scoreDisplay.label}
                className={`w-32 h-32 object-contain ${
                  scoreDisplay.label === 'Cần cải thiện' 
                    ? 'angry-shake' 
                    : scoreDisplay.label === 'Khá tốt' 
                    ? 'animate-pulse' 
                    : 'sparkle'
                }`}
              />
              
              {/* Animation effects based on score */}
              {scoreDisplay.label === 'Cần cải thiện' && (
                <>
                  <div className="absolute -top-2 -right-2 text-red-500 text-2xl animate-ping">
                    😡
                  </div>
                  <div className="absolute -top-1 -left-2 text-red-400 text-xl animate-ping">
                    💥
                  </div>
                </>
              )}
              
              {scoreDisplay.label === 'Khá tốt' && (
                <>
                  <div className="absolute -top-2 -right-2 text-yellow-500 text-2xl animate-ping">
                    😊
                  </div>
                  <div className="absolute -top-1 -left-2 text-yellow-400 text-xl animate-ping">
                    👍
                  </div>
                </>
              )}
              
              {scoreDisplay.label === 'Xuất sắc' && (
                <>
                  <div className="absolute -top-2 -right-2 text-yellow-500 text-2xl star-twinkle">
                    ✨
                  </div>
                  <div className="absolute -top-1 -left-2 text-yellow-400 text-xl star-twinkle" style={{animationDelay: '0.5s'}}>
                    ⭐
                  </div>
                  <div className="absolute top-2 -right-3 text-yellow-300 text-lg star-twinkle" style={{animationDelay: '1s'}}>
                    💫
                  </div>
                </>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
            <p className="text-gray-600 mb-2">Bạn đã hoàn thành quiz thành công</p>
            <p className={`text-lg font-semibold ${scoreDisplay.color} mb-6`}>{scoreDisplay.label}</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className={`text-4xl font-bold ${scoreDisplay.color} mb-2`}>
                {Math.round(score.score || 0)}/100
              </div>
              <p className="text-gray-600">Điểm số</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onBack}
                className="w-full bg-blue-600 hover:bg-blue-700 !text-white py-3 px-6 rounded-lg font-medium transition-colors"
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
