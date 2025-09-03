import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../config/axios';
import Rating from './Rating';

const CommentSection = ({ variant = 'blog', entityId, entityType = 'blogpost', comments = [], onAddComment, isLoading = false, onRefreshComments, userRating: propUserRating = null }) => {
  const { t } = useTranslation();
  
  // Local state for form input
  const [commentText, setCommentText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reply state management
  const [replyText, setReplyText] = useState('');
  const [replyImageUrl, setReplyImageUrl] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // User rating state - use prop if provided, otherwise use local state
  const [userRating, setUserRating] = useState(propUserRating);
  const [isLoadingRating, setIsLoadingRating] = useState(false);

  // Debug info
  console.log('CommentSection props:', { variant, entityId, entityType, commentsCount: comments.length });
  console.log('Comments data received:', comments);
  console.log('First comment structure:', comments[0]);
  console.log('Comments array type:', Array.isArray(comments));

  // Fetch user's rating on component mount (only if not provided via props)
  useEffect(() => {
    if (entityId && entityType && !propUserRating) {
      fetchUserRating();
    }
  }, [entityId, entityType, propUserRating]);

  // Update local userRating when propUserRating changes
  useEffect(() => {
    if (propUserRating) {
      setUserRating(propUserRating);
    }
  }, [propUserRating]);

  // Fetch user's rating for this entity
  const fetchUserRating = async () => {
    try {
      setIsLoadingRating(true);
      const token = localStorage.getItem('token');
      if (!token) return;

              const response = await api.get(`interactions/${entityType}/${entityId}/rating/my`);
      setUserRating(response.data);
    } catch (error) {
      console.log('User has no rating yet or error:', error);
      setUserRating(null);
    } finally {
      setIsLoadingRating(false);
    }
  };

  // Theme configuration for different variants
  const themes = {
    blog: {
      title: t('comments.title'),
      borderColor: 'border-slate-200',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      buttonFocus: 'focus:ring-blue-500',
      accentColor: 'text-blue-600',
      borderAccent: 'border-slate-200',
      bgColor: 'bg-slate-50',
      icon: '💬',
      likeColor: 'text-red-500',
      likeHover: 'hover:text-red-600',
      cardBg: 'bg-white',
      cardHover: 'hover:bg-slate-50'
    },
    flashcard: {
      title: t('comments.flashcardTitle'),
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      buttonFocus: 'focus:ring-purple-500',
      accentColor: 'text-purple-600',
      borderAccent: 'border-purple-200',
      bgColor: 'bg-purple-50',
      icon: '📚',
      likeColor: 'text-red-500',
      likeHover: 'hover:text-red-600',
      cardBg: 'bg-white',
      cardHover: 'hover:bg-slate-50'
    },
    quiz: {
      title: t('comments.quizTitle'),
      borderColor: 'border-green-200',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      buttonFocus: 'focus:ring-green-500',
      accentColor: 'text-green-600',
      borderAccent: 'border-green-200',
      bgColor: 'bg-green-50',
      icon: '🧩',
      likeColor: 'text-red-500',
      likeHover: 'hover:text-red-600',
      cardBg: 'bg-white',
      cardHover: 'hover:bg-slate-50'
    }
  };

  const theme = themes[variant];

  // Organize comments into parent comments with replies
  const organizeComments = (comments) => {
    // If comments already have replies organized, use them directly
    if (comments.length > 0 && comments[0].replies !== undefined) {
      return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Fallback to old logic if needed
    const parentComments = [];
    const replyMap = new Map();

    // First pass: identify parent comments and create reply map
    comments.forEach(comment => {
      if (!comment.parentCommentId && !comment.parentId) {
        parentComments.push({ ...comment, replies: comment.replies || [] });
      } else {
        const parentId = comment.parentCommentId || comment.parentId;
        if (!replyMap.has(parentId)) {
          replyMap.set(parentId, []);
        }
        replyMap.get(parentId).push(comment);
      }
    });

    // Second pass: attach replies to parent comments
    parentComments.forEach(parent => {
      if (replyMap.has(parent.id)) {
        parent.replies = replyMap.get(parent.id).sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
    });

    return parentComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const organizedComments = organizeComments(comments);
  
  // Show-more pagination (compact feed)
  const COMMENTS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  
  // Reset visible count when the comment list changes
  useEffect(() => {
    setVisibleCount(COMMENTS_PER_PAGE);
  }, [comments]);
  
  const displayedComments = organizedComments.slice(0, visibleCount);
  const canShowMore = visibleCount < organizedComments.length;
  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + COMMENTS_PER_PAGE, organizedComments.length));
  };

  // Handle comment form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if comment is empty
    if (!commentText.trim()) {
      showToast(t('comments.enterComment'), 'error');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      showToast(t('comments.pleaseLogin'), 'error');
      return;
    }

    // Get userId from localStorage
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      showToast(t('comments.userNotFound'), 'error');
      return;
    }

    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        content: commentText.trim(),
      };

      // Add imageUrl if provided
      if (imageUrl.trim()) {
        payload.imageUrl = imageUrl.trim();
      }

              const newComment = await api.post(`interactions/${entityType}/${entityId}/comment`, payload);

      // Add new comment to the list
      const commentToAdd = {
        id: newComment.data.id || newComment.data._id || Date.now(),
        authorName: newComment.data.authorName || newComment.data.user?.name || newComment.data.author?.name || 'You',
        content: commentText.trim(),
        createdAt: newComment.data.createdAt || newComment.data.created_at || new Date().toISOString(),
        imageUrl: imageUrl.trim() || null,
        user: newComment.data.user || { name: 'You' },
        likes: 0,
        isLiked: false,
        replies: []
      };

      // Clear form
      setCommentText('');
      setImageUrl('');
      
      // Show success message
      showToast(t('comments.commentPosted'), 'success');
      
      // Call onAddComment to update parent's comments state
      if (onAddComment) {
        onAddComment(commentToAdd);
      }
      
    } catch (error) {
      console.error('Error posting comment:', error);
      
      let errorMessage = t('comments.errorPostingComment');
      
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

  // Handle reply form submission
  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    
    // Prevent submission if reply is empty
    if (!replyText.trim()) {
      showToast(t('comments.enterReply'), 'error');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      showToast(t('comments.pleaseLoginReply'), 'error');
      return;
    }

    // Get userId from localStorage
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      showToast(t('comments.userNotFound'), 'error');
      return;
    }

    // Prevent double submission
    if (isSubmittingReply) return;

    setIsSubmittingReply(true);

    try {
      const payload = {
        content: replyText.trim(),
      };

      // Add imageUrl if provided
      if (replyImageUrl.trim()) {
        payload.imageUrl = replyImageUrl.trim();
      }

              const newReply = await api.post(`interactions/${entityType}/${entityId}/comment`, {
        ...payload,
        parentCommentId: parentCommentId
      });

      // Add new reply to the parent comment
      const replyToAdd = {
        id: newReply.data.id || newReply.data._id || Date.now(),
        authorName: newReply.data.authorName || newReply.data.user?.name || newReply.data.author?.name || 'You',
        content: replyText.trim(),
        createdAt: newReply.data.createdAt || newReply.data.created_at || new Date().toISOString(),
        imageUrl: replyImageUrl.trim() || null,
        user: newReply.data.user || { name: 'You' },
        parentCommentId: parentCommentId,
        likes: 0,
        isLiked: false
      };

      // Clear reply form
      setReplyText('');
      setReplyImageUrl('');
      setReplyingTo(null);
      
      // Show success message
      showToast(t('comments.replyPosted'), 'success');
      
      // Call onAddComment to update parent's comments state
      if (onAddComment) {
        onAddComment(replyToAdd);
      }
      
    } catch (error) {
      console.error('Error posting reply:', error);
      
      let errorMessage = t('comments.errorPostingReply');
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle like/unlike comment
  const handleLikeComment = async (commentId, isLiked) => {
    try {
      // Toggle like state optimistically
      // In a real app, you'd update the comment's like state here
      
      // Call API to like/unlike
      if (isLiked) {
        // Unlike
        await api.delete(`interactions/${entityType}/${entityId}/comment/${commentId}/like`);
      } else {
        // Like
        await api.post(`interactions/${entityId}/${entityType}/comment/${commentId}/like`);
      }
      
      showToast(isLiked ? t('comments.unliked') : t('comments.liked'), 'success');
      
      // Refresh comments to get updated like count
      if (onRefreshComments) {
        onRefreshComments();
      }
      
    } catch (error) {
      console.error('Error toggling like:', error);
      showToast(t('comments.errorLiking'), 'error');
    }
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyText('');
    setReplyImageUrl('');
    setReplyingTo(null);
  };

  // Simple toast function (can be replaced with react-toastify later)
  const showToast = (message, type = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`;
    
    // Set background color based on type
    if (type === 'success') {
      toast.className += ' bg-green-500';
    } else if (type === 'error') {
      toast.className += ' bg-red-500';
    } else {
      toast.className += ' bg-blue-500';
    }
    
    toast.textContent = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Don't render if no entityId
  if (!entityId || entityId === 'undefined' || entityId === 'null') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-slate-500 text-base">{t('comments.cannotLoad', 'Không thể tải bình luận - thiếu ID bài viết')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {theme.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {theme.title}
            </h3>
            <p className="text-slate-500 text-base">
              {organizedComments.length} {organizedComments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        
        {/* Refresh button */}
        {onRefreshComments && (
          <button
            onClick={onRefreshComments}
            disabled={isLoading}
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200 disabled:opacity-50 hover:scale-105"
            title={t('comments.refreshTooltip')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Rating Component */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-slate-800 flex items-center">
            <span className="text-2xl mr-2">⭐</span>
            {t('comments.rateThisPost', 'Đánh giá bài viết này')}
          </h4>
          {userRating && (
            <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {t('comments.yourRating', 'Đánh giá của bạn')}: {userRating.rating}/5
            </span>
          )}
        </div>
        <Rating 
          entityId={entityId} 
          entityType={entityType} 
          variant={variant}
          userRating={userRating}
          onRatingChange={fetchUserRating}
        />
      </div>
      
      {/* Comment Form */}
      <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="text-xl mr-2">✍️</span>
          {t('comments.addComment', 'Thêm bình luận')}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('comments.writeComment')}
              className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              rows="3"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Image URL Input */}
          <div className="mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t('comments.imageUrlPlaceholder')}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 text-base"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('comments.posting')}</span>
                </>
              ) : (
                <>
                  <span className="text-xl">✍️</span>
                  <span>{t('comments.postComment')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {/* Loading state */}
        {isLoading && organizedComments.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 text-lg">{t('comments.loadingComments')}</p>
          </div>
        ) : organizedComments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">💭</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {t('comments.noComments')}
            </h3>
            <p className="text-slate-500 text-base">
              {t('comments.noCommentsSubtitle')}
            </p>
          </div>
        ) : (
          displayedComments.map((comment) => {
            // Extract comment data with fallbacks for different API structures
            const commentId = comment.id || comment._id;
            const authorName = comment.userName || comment.authorName || comment.user?.name || comment.author?.name || comment.username || 'User';
            const commentContent = comment.content || comment.text || comment.message || comment.body || '';
            const commentImage = comment.imageUrl || comment.image || comment.attachment || comment.userAvatarUrl;
            const commentDate = comment.createdAt || comment.created_at || comment.timestamp || comment.date || new Date().toISOString();
            const likeCount = comment.likes || comment.likeCount || 0;
            const isLiked = comment.isLiked || comment.userLiked || false;
            
            return (
              <div key={commentId} className="space-y-4">
                {/* Parent Comment */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-bold text-slate-800 text-base">
                          {authorName}
                        </h4>
                        <span className="text-slate-400 text-sm">
                          {formatDate(commentDate)}
                        </span>
                        {comment.replyCount > 0 && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">
                            {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-700 text-sm leading-relaxed mb-4">
                        {commentContent}
                      </p>
                      
                      {/* Display image if exists */}
                      {commentImage && (
                        <div className="mb-4">
                          <img 
                            src={commentImage} 
                            alt="Comment attachment" 
                            className="max-w-xs rounded-xl shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-6">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikeComment(commentId, isLiked)}
                          className={`flex items-center space-x-2 text-xs font-medium transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-slate-500'} hover:text-red-500`}
                        >
                          <span className={`text-lg ${isLiked ? '❤️' : '🤍'}`}>
                            {isLiked ? '❤️' : '🤍'}
                          </span>
                          <span className="font-semibold">{likeCount > 0 ? likeCount : ''}</span>
                          <span>{isLiked ? t('comments.liked') : t('comments.like')}</span>
                        </button>

                        {/* Reply button */}
                        <button
                          onClick={() => setReplyingTo(commentId)}
                          className="text-xs text-blue-600 hover:text-blue-700 focus:outline-none font-medium flex items-center space-x-2 transition-all duration-200"
                        >
                          <span className="text-base">💬</span>
                          <span>{t('comments.reply')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reply form */}
                  {replyingTo === commentId && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <form onSubmit={(e) => handleReplySubmit(e, commentId)}>
                        <div className="mb-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={t('comments.writeReply')}
                            className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
                            rows="2"
                            disabled={isSubmittingReply}
                          />
                        </div>
                        
                        {/* Reply Image URL Input */}
                        <div className="mb-3">
                          <input
                            type="url"
                            value={replyImageUrl}
                            onChange={(e) => setReplyImageUrl(e.target.value)}
                            placeholder={t('comments.imageUrlPlaceholder')}
                            className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
                            disabled={isSubmittingReply}
                          />
                        </div>
                        
                        {/* Reply Submit/Cancel Buttons */}
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={cancelReply}
                            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
                          >
                            {t('comments.cancel')}
                          </button>
                          <button
                            type="submit"
                            disabled={!replyText.trim() || isSubmittingReply}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                          >
                            {isSubmittingReply ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('comments.sending')}
                              </>
                            ) : (
                              <>
                                <span>💬</span>
                                <span>{t('comments.sendReply')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 space-y-3">
                    {comment.replies.map((reply) => {
                      const replyId = reply.id || reply._id;
                      const replyAuthorName = reply.userName || reply.authorName || reply.user?.name || reply.author?.name || reply.username || 'User';
                      const replyContent = reply.content || reply.text || reply.message || reply.body || '';
                      const replyImage = reply.imageUrl || reply.image || reply.attachment || reply.userAvatarUrl;
                      const replyDate = reply.createdAt || reply.created_at || reply.timestamp || reply.date || new Date().toISOString();
                      const replyLikeCount = reply.likes || reply.likeCount || 0;
                      const replyIsLiked = reply.isLiked || reply.userLiked || false;
                      
                      return (
                        <div key={replyId} className="p-4 rounded-xl border-l-4 border-blue-200 bg-slate-50 hover:bg-slate-100 transition-all duration-300">
                          <div className="flex items-start space-x-3">
                            {/* Reply Avatar */}
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                              {replyAuthorName.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Reply Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className="font-semibold text-slate-700 text-sm">
                                  {replyAuthorName}
                                </h5>
                                <span className="text-xs text-slate-400">
                                  {formatDate(replyDate)}
                                </span>
                                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full font-medium">
                                  {t('comments.replyingTo')}
                                </span>
                              </div>
                              
                              <p className="text-slate-600 text-xs leading-relaxed mb-2">
                                {replyContent}
                              </p>
                              
                              {/* Display reply image if exists */}
                              {replyImage && (
                                <div className="mb-2">
                                  <img 
                                    src={replyImage} 
                                    alt="Reply attachment" 
                                    className="max-w-xs rounded-xl shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}

                              {/* Reply Action Buttons */}
                              <div className="flex items-center space-x-6">
                                {/* Like Button */}
                                <button
                                  onClick={() => handleLikeComment(replyId, replyIsLiked)}
                                  className={`flex items-center space-x-2 text-xs font-medium transition-all duration-200 ${replyIsLiked ? 'text-red-500' : 'text-slate-500'} hover:text-red-500`}
                                >
                                  <span className={`text-lg ${replyIsLiked ? '❤️' : '🤍'}`}>
                                    {replyIsLiked ? '❤️' : '🤍'}
                                  </span>
                                  <span className="font-semibold">{replyLikeCount > 0 ? replyLikeCount : ''}</span>
                                  <span>{replyIsLiked ? t('comments.liked') : t('comments.like')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
        {/* Show more button */}
        {displayedComments.length > 0 && canShowMore && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
            >
              {t('comments.showMore', 'Show more')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
