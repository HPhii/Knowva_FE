import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../config/axios';
import Rating from './Rating';

const CommentSection = ({ variant = 'blog', entityId, entityType = 'blogpost', comments = [], onAddComment, isLoading = false, onRefreshComments }) => {
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

  // Debug info
  console.log('CommentSection props:', { variant, entityId, entityType, commentsCount: comments.length });
  console.log('Comments data received:', comments);
  console.log('First comment structure:', comments[0]);
  console.log('Comments array type:', Array.isArray(comments));

  // Theme configuration for different variants
  const themes = {
    blog: {
      title: t('comments.title'),
      borderColor: 'border-blue-200',
      buttonBg: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      buttonFocus: 'focus:ring-blue-500',
      accentColor: 'text-blue-600',
      borderAccent: 'border-blue-300',
      bgColor: 'bg-blue-50',
      icon: '💬'
    },
    flashcard: {
      title: t('comments.flashcardTitle'),
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      buttonFocus: 'focus:ring-purple-500',
      accentColor: 'text-purple-600',
      borderAccent: 'border-purple-300',
      bgColor: 'bg-purple-50',
      icon: '📚'
    },
    quiz: {
      title: t('comments.quizTitle'),
      borderColor: 'border-green-200',
      buttonBg: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      buttonFocus: 'focus:ring-green-500',
      accentColor: 'text-green-600',
      borderAccent: 'border-green-300',
      bgColor: 'bg-green-50',
      icon: '🧩'
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

  // API function to post comment
  const postComment = async (entityId, payload) => {
    try {
      const response = await api.post(`/interactions/${entityType}/${entityId}/comment`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // API function to post reply comment
  const postReply = async (entityId, parentId, payload) => {
    try {
      const response = await api.post(`/interactions/${entityType}/${entityId}/comment`, {
        ...payload,
        parentCommentId: parentId  // Use parentCommentId instead of parentId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Handle form submission
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

      const newComment = await postComment(entityId, payload);

      // Add new comment to the top of the list
      const commentToAdd = {
        id: newComment.id || newComment._id || Date.now(),
        authorName: newComment.authorName || newComment.user?.name || newComment.author?.name || 'You',
        content: commentText.trim(),
        createdAt: newComment.createdAt || newComment.created_at || new Date().toISOString(),
        imageUrl: imageUrl.trim() || null,
        user: newComment.user || { name: 'You' }
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
      
      let errorMessage = t('comments.errorPosting');
      
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

      const newReply = await postReply(entityId, parentCommentId, payload);

      // Add new reply to the parent comment
      const replyToAdd = {
        id: newReply.id || newReply._id || Date.now(),
        authorName: newReply.authorName || newReply.user?.name || newReply.author?.name || 'You',
        content: replyText.trim(),
        createdAt: newReply.createdAt || newReply.created_at || new Date().toISOString(),
        imageUrl: replyImageUrl.trim() || null,
        user: newReply.user || { name: 'You' },
        parentCommentId: parentCommentId  // Use parentCommentId instead of parentId
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
      <div className={`max-w-4xl rounded-xl shadow-lg p-6 bg-white border ${theme.borderColor} hover:shadow-xl transition-all duration-300`}>
        <div className="text-center py-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.bgColor} flex items-center justify-center`}>
            <span className="text-2xl">{theme.icon}</span>
          </div>
          <p className="text-gray-500 text-lg">{t('comments.cannotLoad', 'Không thể tải bình luận - thiếu ID bài viết')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl rounded-xl shadow-lg p-6 bg-white border ${theme.borderColor} hover:shadow-xl transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl ${theme.bgColor} flex items-center justify-center`}>
            <span className="text-2xl">{theme.icon}</span>
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${theme.accentColor}`}>
              {theme.title}
            </h3>
            <p className="text-gray-500 text-sm">
              {organizedComments.length} {organizedComments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        
        {/* Refresh button */}
        {onRefreshComments && (
          <button
            onClick={onRefreshComments}
            disabled={isLoading}
            className={`p-3 rounded-xl ${theme.buttonBg} ${theme.buttonHover} text-white transition-all duration-200 disabled:opacity-50 hover:scale-105`}
            title={t('comments.refreshTooltip')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Rating Component */}
      <div className="mb-8">
        <Rating 
          entityId={entityId} 
          entityType={entityType} 
          variant={variant} 
        />
      </div>
      
      {/* Comment Form */}
      <div className="mb-8 p-6 rounded-xl bg-gray-50 border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Add a comment</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('comments.writeComment')}
              className={`w-full p-4 border ${theme.borderAccent} rounded-xl resize-none focus:outline-none focus:ring-2 ${theme.buttonFocus} focus:border-transparent transition-all duration-200`}
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
              className={`w-full p-3 border ${theme.borderAccent} rounded-lg focus:outline-none focus:ring-2 ${theme.buttonFocus} focus:border-transparent transition-all duration-200`}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className={`${theme.buttonBg} ${theme.buttonHover} text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('comments.posting')}</span>
                </>
              ) : (
                <>
                  <span className="text-lg">{theme.icon}</span>
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
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">{t('comments.loadingComments')}</p>
          </div>
        ) : organizedComments.length === 0 ? (
          <div className={`text-center py-12 border-2 border-dashed ${theme.borderColor} rounded-xl`}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.bgColor} flex items-center justify-center`}>
              <span className="text-2xl">💭</span>
            </div>
            <h3 className={`text-xl font-semibold ${theme.accentColor} mb-2`}>
              {t('comments.noComments')}
            </h3>
            <p className="text-gray-500">
              {t('comments.noCommentsSubtitle')}
            </p>
          </div>
        ) : (
          organizedComments.map((comment) => {
            // Extract comment data with fallbacks for different API structures
            const commentId = comment.id || comment._id;
            const authorName = comment.userName || comment.authorName || comment.user?.name || comment.author?.name || comment.username || 'User';
            const commentContent = comment.content || comment.text || comment.message || comment.body || '';
            const commentImage = comment.imageUrl || comment.image || comment.attachment || comment.userAvatarUrl;
            const commentDate = comment.createdAt || comment.created_at || comment.timestamp || comment.date || new Date().toISOString();
            
            return (
              <div key={commentId} className="space-y-4">
                {/* Parent Comment */}
                <div className={`p-6 rounded-xl border ${theme.borderColor} bg-white hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full ${theme.buttonBg} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className={`font-semibold ${theme.accentColor} text-lg`}>
                          {authorName}
                        </h4>
                        <span className="text-sm text-gray-400">
                          {formatDate(commentDate)}
                        </span>
                        {comment.replyCount > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-base leading-relaxed mb-3">
                        {commentContent}
                      </p>
                      
                      {/* Display image if exists */}
                      {commentImage && (
                        <div className="mb-4">
                          <img 
                            src={commentImage} 
                            alt="Comment attachment" 
                            className="max-w-xs rounded-lg shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Reply button */}
                      <button
                        onClick={() => setReplyingTo(commentId)}
                        className={`text-sm ${theme.accentColor} hover:underline focus:outline-none font-medium flex items-center space-x-1`}
                      >
                        <span>💬</span>
                        <span>{t('comments.reply')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Reply form */}
                  {replyingTo === commentId && (
                    <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <form onSubmit={(e) => handleReplySubmit(e, commentId)}>
                        <div className="mb-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={t('comments.writeReply')}
                            className={`w-full p-3 border ${theme.borderAccent} rounded-lg resize-none focus:outline-none focus:ring-2 ${theme.buttonFocus} focus:border-transparent transition-all duration-200`}
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
                            className={`w-full p-3 border ${theme.borderAccent} rounded-lg focus:outline-none focus:ring-2 ${theme.buttonFocus} focus:border-transparent transition-all duration-200`}
                            disabled={isSubmittingReply}
                          />
                        </div>
                        
                        {/* Reply Submit/Cancel Buttons */}
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={cancelReply}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                          >
                            {t('comments.cancel')}
                          </button>
                          <button
                            type="submit"
                            disabled={!replyText.trim() || isSubmittingReply}
                            className={`${theme.buttonBg} ${theme.buttonHover} text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium`}
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
                      
                      return (
                        <div key={replyId} className={`p-4 rounded-lg border-l-4 ${theme.borderAccent} bg-gray-50 hover:bg-gray-100 transition-all duration-200`}>
                          <div className="flex items-start space-x-3">
                            {/* Reply Avatar */}
                            <div className={`w-8 h-8 rounded-full ${theme.buttonBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {replyAuthorName.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Reply Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h5 className={`font-semibold ${theme.accentColor} text-sm`}>
                                  {replyAuthorName}
                                </h5>
                                <span className="text-xs text-gray-400">
                                  {formatDate(replyDate)}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                  {t('comments.replyingTo')}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                {replyContent}
                              </p>
                              
                              {/* Display reply image if exists */}
                              {replyImage && (
                                <div className="mb-2">
                                  <img 
                                    src={replyImage} 
                                    alt="Reply attachment" 
                                    className="max-w-xs rounded-lg shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
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
      </div>
    </div>
  );
};

export default CommentSection;
