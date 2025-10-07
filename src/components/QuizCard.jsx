import React from 'react';
import { EyeOutlined, UserOutlined, QuestionCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const QuizCard = ({ quiz, onView }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div 
      onClick={() => onView(quiz)}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
    >
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {quiz.title || 'Untitled Quiz'}
        </h3>
        
        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {quiz.description}
          </p>
        )}

        {/* Author */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <UserOutlined className="mr-2" />
          <span>{quiz.username || quiz.authorName || quiz.author || t('explore.unknownAuthor', 'Unknown Author')}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <QuestionCircleOutlined className="mr-1" />
            <span>{quiz.maxQuestions || quiz.maxQuestion || quiz.questionCount || 0} {t('explore.questions', 'questions')}</span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center">
              <ClockCircleOutlined className="mr-1" />
              <span>{quiz.timeLimit} {t('explore.minutes', 'min')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
