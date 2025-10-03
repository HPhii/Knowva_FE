import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Rate, Progress } from 'antd';
import api from '../../config/axios';
import CommentSection from '../../components/CommentSection';
import { getCategoryNameSmart } from '../../utils/blogCategories';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Categories are managed by utility file
  
  // State management
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`blog/posts/slug/${slug}`);
        setBlog(response.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(t('blog.errors.cannotLoadPost', 'Không thể tải bài viết. Vui lòng thử lại sau.'));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  // Fetch user's rating for this blog
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!blog || !blog.id) return;
      
      try {
        setRatingLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get(`interactions/blogpost/${blog.id}/rating/my`);
        setUserRating(response.data);
        console.log('User rating:', response.data);
      } catch (error) {
        console.log('User has no rating yet or error:', error);
        setUserRating(null);
      } finally {
        setRatingLoading(false);
      }
    };

    if (blog && blog.id) {
      fetchUserRating();
    }
  }, [blog?.id]);

  // Fetch summary data for this blog
  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!blog || !blog.id) return;
      
      try {
        setSummaryLoading(true);
        const response = await api.get(`interactions/blogpost/${blog.id}/summary`);
        setSummaryData(response.data);
      } catch (error) {
        setSummaryData(null);
      } finally {
        setSummaryLoading(false);
      }
    };

    if (blog && blog.id) {
      fetchSummaryData();
    }
  }, [blog?.id]);

  // Fetch comments when blog is loaded
  useEffect(() => {
    const fetchComments = async () => {
      if (!blog || !blog.id) return;
      
      try {
        setCommentsLoading(true);
        console.log('Fetching comments for blog:', blog.id);
        
        const response = await api.get(`interactions/blogpost/${blog.id}/comments`);
        console.log('Comments API response:', response.data);
        console.log('Response data type:', typeof response.data);
        console.log('Response data keys:', Object.keys(response.data || {}));
        console.log('Is response.data array?', Array.isArray(response.data));
        console.log('Response data length:', response.data?.length);
        
        // Sort comments by newest first
        let commentsData = [];
        if (Array.isArray(response.data)) {
          commentsData = response.data;
          console.log('Using response.data directly as array');
        } else if (response.data && response.data.comments && Array.isArray(response.data.comments)) {
          commentsData = response.data.comments;
          console.log('Using response.data.comments');
        } else if (response.data && Array.isArray(response.data.content)) {
          // Handle case where API returns { content: [...], pageable: {...} }
          commentsData = response.data.content;
          console.log('Using response.data.content');
        } else {
          console.log('Unexpected response structure:', response.data);
        }
        
        console.log('Extracted comments data:', commentsData);
        
        if (commentsData.length > 0) {
          const sortedComments = commentsData.sort((a, b) => 
            new Date(b.createdAt || b.created_at || b.timestamp) - new Date(a.createdAt || a.created_at || a.timestamp)
          );
          
          console.log('Sorted comments:', sortedComments);
          setComments(sortedComments);
        } else {
          console.log('No comments found in response');
          setComments([]);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    // Fetch comments immediately when blog.id is available
    if (blog && blog.id) {
      fetchComments();
    }
  }, [blog?.id]); // Only depend on blog.id, not the entire blog object

  // Fetch comments when component mounts (for cases when navigating back to the page)
  useEffect(() => {
    if (blog && blog.id) {
      const fetchCommentsOnMount = async () => {
        try {
          setCommentsLoading(true);
          console.log('Fetching comments on mount for blog:', blog.id);
          
          const response = await api.get(`interactions/blogpost/${blog.id}/comments`);
          console.log('Comments API response on mount:', response.data);
          console.log('Response data type on mount:', typeof response.data);
          console.log('Response data keys on mount:', Object.keys(response.data || {}));
          console.log('Is response.data array on mount?', Array.isArray(response.data));
          
          let commentsData = [];
          if (Array.isArray(response.data)) {
            commentsData = response.data;
            console.log('Using response.data directly as array on mount');
          } else if (response.data && response.data.comments && Array.isArray(response.data.comments)) {
            commentsData = response.data.comments;
            console.log('Using response.data.comments on mount');
          } else if (response.data && Array.isArray(response.data.content)) {
            // Handle case where API returns { content: [...], pageable: {...} }
            commentsData = response.data.content;
            console.log('Using response.data.content on mount');
          } else {
            console.log('Unexpected response structure on mount:', response.data);
          }
          
          console.log('Extracted comments data on mount:', commentsData);
          
          if (commentsData.length > 0) {
            const sortedComments = commentsData.sort((a, b) => 
              new Date(b.createdAt || b.created_at || b.timestamp) - new Date(a.createdAt || a.created_at || a.timestamp)
            );
            
            console.log('Sorted comments on mount:', sortedComments);
            setComments(sortedComments);
          } else {
            console.log('No comments found in response on mount');
            setComments([]);
          }
        } catch (err) {
          console.error('Error fetching comments on mount:', err);
          setComments([]);
        } finally {
          setCommentsLoading(false);
        }
      };
      
      fetchCommentsOnMount();
    }
  }, []); // Empty dependency array - only run once on mount

  // Function to add new comment to state
  const addNewComment = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  // Function to refresh comments
  const refreshComments = async () => {
    if (!blog || !blog.id) return;
    
    try {
      setCommentsLoading(true);
      console.log('Refreshing comments for blog:', blog.id);
      
      const response = await api.get(`interactions/blogpost/${blog.id}/comments`);
      console.log('Comments refresh response:', response.data);
      console.log('Response data type for refresh:', typeof response.data);
      console.log('Response data keys for refresh:', Object.keys(response.data || {}));
      console.log('Is response.data array for refresh?', Array.isArray(response.data));
      
      let commentsData = [];
      if (Array.isArray(response.data)) {
        commentsData = response.data;
        console.log('Using response.data directly as array for refresh');
      } else if (response.data && response.data.comments && Array.isArray(response.data.comments)) {
        commentsData = response.data.comments;
        console.log('Using response.data.comments for refresh');
      } else if (response.data && Array.isArray(response.data.content)) {
        // Handle case where API returns { content: [...], pageable: {...} }
        commentsData = response.data.content;
        console.log('Using response.data.content for refresh');
      } else {
        console.log('Unexpected response structure for refresh:', response.data);
      }
      
      console.log('Extracted comments data for refresh:', commentsData);
      
      if (commentsData.length > 0) {
        const sortedComments = commentsData.sort((a, b) => 
          new Date(b.createdAt || b.created_at || b.timestamp) - new Date(a.createdAt || a.created_at || a.timestamp)
        );
        
        console.log('Refreshed comments:', sortedComments);
        setComments(sortedComments);
      } else {
        console.log('No comments found in refresh response');
        setComments([]);
      }
    } catch (err) {
      console.error('Error refreshing comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'N/A';
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
        </div>
        
        {/* Meta Info Skeleton */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
        </div>
      </div>
    </div>
  );

  // Error state component
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
            {t('blog.actions.tryAgain', 'Thử lại')}
          </button>
          <button
            onClick={() => navigate('/blog')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {t('blog.actions.backToBlog', 'Quay lại Blog')}
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

  // No blog data
  if (!blog) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button - Fixed positioning */}
      <div className="fixed top-20 left-6 z-50">
        <button
          onClick={() => navigate('/blog')}
          className="bg-white shadow-lg hover:shadow-xl text-gray-700 hover:text-gray-900 px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">{t('blog.actions.backToBlog', 'Quay lại Blog')}</span>
        </button>
      </div>

      {/* Compact Header: Title first, then meta, then image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {blog.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="font-medium text-gray-700">{blog.authorName}</span>
          </div>
          <span className="text-gray-300">•</span>
          {/* Publish Date */}
          <span>{formatDate(blog.publishedAt)}</span>
          {blog.readTime && (
            <>
              <span className="text-gray-300">•</span>
              <span>{blog.readTime}</span>
            </>
          )}
          <span className="text-gray-300">•</span>
          {/* Category */}
          <span className="text-blue-600 font-medium">
            {getCategoryNameSmart(blog.categoryId || blog.categoryName, t)}
          </span>
          {/* User Rating Display */}
          {userRating && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-yellow-600 font-medium">
                ⭐ {userRating.rating}/5
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main image below meta (compact height) */}
      {blog.imageUrl && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image';
            }}
          />
        </div>
      )}

      {/* Main Content - Wider layout for better space utilization */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Excerpt Section */}
        {blog.excerpt && (
          <div className="py-8 border-b border-gray-100">
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* Article Content - Clean white space */}
        <div className="py-12">
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>p]:mb-6 [&>p]:text-lg [&>p]:leading-relaxed [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:border-b [&>h2]:border-gray-200 [&>h2]:pb-3 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-3 [&>ul]:text-lg [&>ul]:text-gray-700 [&>ul]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-8 [&>blockquote]:bg-blue-50 [&>blockquote]:rounded-r-lg [&>blockquote]:italic"
          />
        </div>

        {/* Summary Statistics Section */}
        {summaryLoading && (
          <div className="py-12 border-t border-gray-100">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Đang tải thống kê...</p>
            </div>
          </div>
        )}

        {summaryData && (
          <div className="py-12 border-t border-gray-100">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('blog.statistics.title', 'Thống kê đánh giá')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Average Rating */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('blog.statistics.averageRating', 'Điểm trung bình')}</h4>
                  <div className="flex items-center space-x-3">
                    <Rate 
                      value={summaryData.averageRating || 0} 
                      disabled 
                      style={{ fontSize: '20px' }}
                    />
                    <span className="text-2xl font-bold text-yellow-600">
                      {(summaryData.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Total Ratings */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('blog.statistics.totalRatings', 'Tổng đánh giá')}</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {summaryData.totalRatings || 0}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t('blog.statistics.ratingsCount', 'lượt đánh giá')}</p>
                </div>

                {/* Total Comments */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('blog.statistics.totalComments', 'Tổng bình luận')}</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {summaryData.totalComments || 0}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t('blog.statistics.commentsCount', 'bình luận')}</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('blog.statistics.ratingDistribution', 'Phân bố đánh giá')}</h4>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const ratingDistribution = summaryData.ratingDistribution || {};
                    const count = ratingDistribution[`${stars === 1 ? 'one' : stars === 2 ? 'two' : stars === 3 ? 'three' : stars === 4 ? 'four' : 'five'}Star`] || 0;
                    const totalRatings = summaryData.totalRatings || 0;
                    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                    
                    return (
                      <div key={stars} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 flex items-center space-x-2">
                          <span className="text-yellow-500 text-sm">
                            {'⭐'.repeat(stars)}
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            ({stars})
                          </span>
                        </div>
                        <div className="col-span-7">
                          <Progress 
                            percent={percentage} 
                            showInfo={false}
                            strokeColor="#f59e0b"
                            trailColor="#f3f4f6"
                            size="small"
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-sm font-medium text-gray-700">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section - Seamless transition */}
        <div className="py-12 border-t border-gray-100">
          {/* Comments Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('blog.comments.title', 'Bình luận')}</h3>
            <p className="text-gray-500">{t('blog.comments.subtitle', 'Chia sẻ suy nghĩ của bạn về bài viết này')}</p>
          </div>
          
          {/* CommentSection Component */}
          {blog && blog.id && (
            <>
              {/* Debug info - remove in production */}
             
              <CommentSection 
                variant="blog" 
                entityId={blog.id} 
                comments={comments} 
                onAddComment={addNewComment}
                isLoading={commentsLoading}
                onRefreshComments={refreshComments}
                userRating={userRating}
              />
            </>
          )}
          {(!blog || !blog.id) && (
            <div className="text-center py-6 text-gray-500">
              {t('blog.comments.cannotDisplay', 'Không thể hiển thị bình luận - thiếu ID bài viết')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

