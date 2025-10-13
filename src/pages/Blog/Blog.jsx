import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../config/axios';
import BlogCard from '../../components/BlogCard';
import { debounce } from 'lodash';
import { getCategoriesForFilter } from '../../utils/blogCategories';
import NotFoundImage from '../../assets/images/NotFound.png';

const Blog = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // === STATE QUẢN LÝ ===
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // === STATE TỪ URL PARAMS ===
    const [selectedCategoryId, setSelectedCategoryId] = useState(
        searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')) : null
    );
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [currentPage, setCurrentPage] = useState(
        parseInt(searchParams.get('page')) || 0
    );
    const [totalPages, setTotalPages] = useState(0);
    
    // === STATE SORT TỪ URL PARAMS ===
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'publishedAt');
    const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || 'DESC');

    // Get categories from utility file
    useEffect(() => {
        setCategories(getCategoriesForFilter(t));
    }, [t]);
    
    // Sync URL params with state when component mounts or URL changes
    useEffect(() => {
        const urlCategoryId = searchParams.get('categoryId');
        const urlKeyword = searchParams.get('keyword');
        const urlPage = searchParams.get('page');
        const urlSortBy = searchParams.get('sortBy');
        const urlSortDirection = searchParams.get('sortDirection');
        
        if (urlCategoryId !== null) {
            setSelectedCategoryId(parseInt(urlCategoryId));
        }
        if (urlKeyword !== null) {
            setKeyword(urlKeyword);
        }
        if (urlPage !== null) {
            setCurrentPage(parseInt(urlPage));
        }
        if (urlSortBy !== null) {
            setSortBy(urlSortBy);
        }
        if (urlSortDirection !== null) {
            setSortDirection(urlSortDirection);
        }
    }, [searchParams]);

    // === GỌI API LẤY BÀI VIẾT (ĐỘNG) ===
    const fetchBlogs = useCallback(async (searchKeyword) => {
      setLoading(true);
      setError(null);
      try {
          const params = {
              page: currentPage,
              size: 6,
              sortBy: sortBy,
              sortDirection: sortDirection,
              keyword: searchKeyword,
          };
          if (selectedCategoryId) {
              params.categoryId = selectedCategoryId;
          }
  
          const response = await api.get('/blog/posts', { params });
  
          // THAY ĐỔI Ở ĐÂY: đổi .content thành .posts để khớp với API
          setBlogs(response.data.posts || []);
          
          // Các dòng còn lại giữ nguyên
          setTotalPages(response.data.totalPages || 0);
  
      } catch (err) {
          console.error('Error fetching blogs:', err);
          setError(t('blog.errors.cannotLoadPosts', 'Cannot load blog posts. Please try again later.'));
      } finally {
          setLoading(false);
      }
  }, [currentPage, selectedCategoryId, sortBy, sortDirection]); 

    const debouncedFetch = useCallback(debounce((searchKeyword) => fetchBlogs(searchKeyword), 500), [fetchBlogs]);

    useEffect(() => {
        debouncedFetch(keyword);
        return () => debouncedFetch.cancel();
    }, [keyword, debouncedFetch]);

    // === HÀM CẬP NHẬT URL PARAMS ===
    const updateURLParams = useCallback((newParams) => {
        const currentParams = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                currentParams.set(key, value.toString());
            } else {
                currentParams.delete(key);
            }
        });
        setSearchParams(currentParams);
    }, [searchParams, setSearchParams]);

    // === HÀM XỬ LÝ SỰ KIỆN ===
    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(0);
        updateURLParams({ categoryId, page: 0 });
    };

    const handleSearchChange = (e) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);
        setCurrentPage(0);
        updateURLParams({ keyword: newKeyword, page: 0 });
    };
    
    // === HÀM XỬ LÝ SORT MỚI ===
    const handleSortByChange = (newSortBy) => {
        setSortBy(newSortBy);
        setCurrentPage(0);
        updateURLParams({ sortBy: newSortBy, page: 0 });
    };

    const handleSortDirectionChange = (newSortDirection) => {
        setSortDirection(newSortDirection);
        setCurrentPage(0);
        updateURLParams({ sortDirection: newSortDirection, page: 0 });
    };
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        updateURLParams({ page: newPage });
    };
    
    // === CÁC COMPONENT UI PHỤ ===
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const ErrorState = () => (
        <div className="text-center py-20 animate-fade-in">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Oops! Unable to load posts</h3>
            <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">{error}</p>
            <button
                onClick={() => fetchBlogs(keyword)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
            </button>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-20 animate-fade-in">
            <div className="mx-auto w-32 h-32 mb-6">
                <img 
                    src={NotFoundImage} 
                    alt="No blog posts found" 
                    className="w-full h-full object-contain"
                />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No blog posts found</h3>
            <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
                {t('blog.errors.tryDifferentKeyword', 'Please try with different keywords or categories.')}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section - Search and controls in one row */}
            <div className="border-b border-gray-100 sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* First row - Search, Sort, and Create button */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-4">
                        {/* Search Bar - Fixed width */}
                        <div className="w-full lg:w-80">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={keyword}
                                    onChange={handleSearchChange}
                                    placeholder={t('blog.searchPlaceholder', 'Search...')}
                                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                                />
                            </div>
                        </div>
                        
                        {/* Sort Controls - Fixed width */}
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortByChange(e.target.value)}
                                className="px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="publishedAt">{t('blog.sort.publishedAt', 'Date')}</option>
                                <option value="title">{t('blog.sort.title', 'Title')}</option>
                                <option value="authorName">{t('blog.sort.authorName', 'Author')}</option>
                                <option value="readTime">{t('blog.sort.readTime', 'Read Time')}</option>
                            </select>
                            
                            <select
                                value={sortDirection}
                                onChange={(e) => handleSortDirectionChange(e.target.value)}
                                className="px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="DESC">↓</option>
                                <option value="ASC">↑</option>
                            </select>
                        </div>
                        
                        {/* Create Post Button - Fixed width */}
                        <button
                            onClick={() => navigate('/blog/create')}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 !text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap w-full lg:w-auto justify-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('blog.actions.createNewPost', 'Create')}
                        </button>
                    </div>

                    {/* Second row - Category Filters */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category.id || 'all'}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                    selectedCategoryId === category.id
                                        ? 'bg-blue-600 !text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                                {t(category.nameKey)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content - Centered container with plenty of whitespace */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading && <LoadingSpinner />}
                {error && !loading && <ErrorState />}
                {!loading && !error && blogs.length === 0 && <EmptyState />}

                {!loading && !error && blogs.length > 0 && (
                    <>
                        {/* Results Header - Clean typography */}
                       
                        
                        {/* Blog Feed - Grid layout with BlogCard components */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                            {blogs.map((blog, index) => (
                                <div 
                                    key={blog.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <BlogCard blog={blog} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination - Minimal styling */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-16 gap-4 pt-8 border-t border-gray-100">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0 || loading}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {t('blog.pagination.previous', 'Previous')}
                                </button>
                                <span className="text-gray-600 px-4 py-2">
                                    {t('blog.pagination.page', 'Page')} {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1 || loading}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {t('blog.pagination.next', 'Next')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blog;