import React from 'react';
import { EyeOutlined, UserOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const FlashcardCard = ({ flashcard, onView }) => {
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
      onClick={() => onView(flashcard)}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
    >
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {flashcard.title || 'Untitled Flashcard Set'}
        </h3>
        
        {/* Description */}
        {flashcard.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {flashcard.description}
          </p>
        )}

        {/* Author */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <UserOutlined className="mr-2" />
          <span>{flashcard.authorName || t('explore.unknownAuthor', 'Unknown Author')}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <FileTextOutlined className="mr-1" />
            <span>{flashcard.maxQuestion || flashcard.cardCount || 0} {t('explore.cards', 'cards')}</span>
          </div>
          {flashcard.estimatedTime && (
            <div className="flex items-center">
              <ClockCircleOutlined className="mr-1" />
              <span>{flashcard.estimatedTime} {t('explore.minutes', 'min')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;
