import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../config/axios';

const Rating = ({ entityId, entityType = 'blogpost', variant = 'blog', userRating: initialUserRating = null, onRatingChange = null }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(initialUserRating?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme configuration for different variants
  const themes = {
    blog: {
      starColor: 'text-blue-500',
      starHoverColor: 'text-blue-400',
      starSelectedColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    flashcard: {
      starColor: 'text-purple-500',
      starHoverColor: 'text-purple-400',
      starSelectedColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    quiz: {
      starColor: 'text-green-500',
      starHoverColor: 'text-green-400',
      starSelectedColor: 'text-green-600',
      borderColor: 'border-green-200'
    }
  };

  const theme = themes[variant];

  // Debug log for rating state
  console.log('⭐ Rating component state:', { rating, hoverRating, initialUserRating });

  // Update rating when userRating prop changes
  React.useEffect(() => {
    console.log('🔄 Rating component - userRating prop changed:', initialUserRating);
    if (initialUserRating?.rating) {
      console.log('⭐ Setting rating to:', initialUserRating.rating);
      setRating(initialUserRating.rating);
    } else {
      console.log('❌ No rating in userRating prop, setting to 0');
      setRating(0);
    }
  }, [initialUserRating]);

  // Handle star click
  const handleStarClick = async (starValue) => {
    if (isSubmitting) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      showToast(t('rating.pleaseLoginToRate'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ratingValue: starValue
      };

                      const response = await api.post(`interactions/${entityType}/${entityId}/rating`, payload);
        
        setRating(starValue);
        showToast(t('rating.ratingSubmittedSuccessfully'), 'success');
        
        // Call callback to update parent component
        if (onRatingChange) {
          onRatingChange();
        }
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      
              let errorMessage = t('rating.errorSubmittingRating');
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple toast function
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`;
    
    if (type === 'success') {
      toast.className += ' bg-green-500';
    } else if (type === 'error') {
      toast.className += ' bg-red-500';
    } else {
      toast.className += ' bg-blue-500';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  // Get star icon based on rating state
  const getStarIcon = (starValue) => {
    const isFilled = starValue <= (hoverRating || rating);
    const isHovered = starValue <= hoverRating;
    
    if (isFilled) {
      return (
        <svg 
          className={`w-6 h-6 ${isHovered ? theme.starHoverColor : theme.starSelectedColor} transition-colors duration-200`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      return (
        <svg 
          className={`w-6 h-6 ${theme.starColor} transition-colors duration-200`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  };

  return (
    <div className={`mb-4 p-3 border-2 ${theme.borderColor} rounded-lg bg-gray-50`}>
             <div className="flex items-center justify-between mb-2">
         <label className={`text-sm font-medium ${theme.starColor}`}>
           {t('rating.rateThis')} {variant}:
         </label>
         {rating > 0 && (
           <span className={`text-xs ${theme.starSelectedColor} font-medium`}>
             {initialUserRating ? t('rating.yourRating', 'Đánh giá của bạn') : t('rating.currentRating', 'Đánh giá hiện tại')}: {rating}/5 ⭐
           </span>
         )}
       </div>
      
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={isSubmitting}
            className={`p-1 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            title={`${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
          >
            {getStarIcon(starValue)}
          </button>
        ))}
      </div>
      
      {isSubmitting && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
                      {t('rating.sendingRating')}...
        </div>
      )}
    </div>
  );
};

export default Rating;

