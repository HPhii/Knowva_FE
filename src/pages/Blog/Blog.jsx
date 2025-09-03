import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../config/axios';
import BlogCard from '../../components/BlogCard';
import { debounce } from 'lodash';
import { getCategoriesForFilter } from '../../utils/blogCategories';

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
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <span className="text-3xl">📰</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No blog posts found</h3>
            <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
                {t('blog.errors.tryDifferentKeyword', 'Please try with different keywords or categories.')}
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section - Minimalist with search and create button */}
            <div className="border-b border-gray-100 sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Search and Create Post Row */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                        {/* Search Bar - Minimalist with rounded corners */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="relative max-w-lg">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={keyword}
                                    onChange={handleSearchChange}
                                    placeholder={t('blog.searchPlaceholder', 'Search for articles...')}
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 focus:bg-white shadow-sm"
                                />
                            </div>
                        </div>
                        
                        {/* Create Post Button - Pill-shaped with system gradient */}
                        <button
                            onClick={() => navigate('/blog/create')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('blog.actions.createNewPost', 'Create Post')}
                        </button>
                    </div>
                    
                    {/* Sort Controls and Category Filters - Full width like header */}
                    <div className="w-full mt-6 pt-6 border-t border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between w-full">
                            {/* Sort Controls - Left side */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Sort By */}
                                <div className="flex items-center space-x-3">
                                    <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                        {t('blog.sort.sortBy', 'Sort by:')}
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortByChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50"
                                    >
                                        <option value="publishedAt">{t('blog.sort.publishedAt', 'Published Date')}</option>
                                        <option value="title">{t('blog.sort.title', 'Title')}</option>
                                        <option value="authorName">{t('blog.sort.authorName', 'Author')}</option>
                                        <option value="readTime">{t('blog.sort.readTime', 'Read Time')}</option>
                                        <option value="createdAt">{t('blog.sort.createdAt', 'Created Date')}</option>
                                        <option value="updatedAt">{t('blog.sort.updatedAt', 'Updated Date')}</option>
                                    </select>
                                </div>
                                
                                {/* Sort Direction */}
                                <div className="flex items-center space-x-3">
                                    <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                        {t('blog.sort.direction', 'Order:')}
                                    </label>
                                    <select
                                        value={sortDirection}
                                        onChange={(e) => handleSortDirectionChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50"
                                    >
                                        <option value="DESC">{t('blog.sort.desc', 'Descending')}</option>
                                        <option value="ASC">{t('blog.sort.asc', 'Ascending')}</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Category Filters - Right side, full width */}
                            <div className="flex flex-wrap gap-2 flex-1 lg:justify-end">
                                {categories.map((category) => (
                                    <button
                                        key={category.id || 'all'}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            selectedCategoryId === category.id
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {t(category.nameKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Centered container with plenty of whitespace */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {loading && <LoadingSpinner />}
                {error && !loading && <ErrorState />}
                {!loading && !error && blogs.length === 0 && <EmptyState />}

                {!loading && !error && blogs.length > 0 && (
                    <>
                        {/* Results Header - Clean typography */}
                        <div className="mb-12 text-center animate-fade-in">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                {t('blog.results.title', 'Search Results')}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t('blog.results.found', 'Found')} <span className="font-semibold text-blue-600">{blogs.length}</span> {t('blog.results.posts', 'articles')}
                                {keyword && (
                                    <span> {t('blog.results.for', 'for')} "<span className="font-medium text-gray-800">{keyword}</span>"</span>
                                )}
                            </p>
                        </div>
                        
                        {/* Blog Feed - Clean list layout with spacing */}
                        <div className="space-y-12 animate-fade-in">
                            {blogs.map((blog, index) => (
                                <article 
                                    key={blog.id} 
                                    className="animate-fade-in-up border-b border-gray-100 pb-12 last:border-b-0 last:pb-0"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Optional Thumbnail - Small and not dominant */}
                                        {blog.thumbnail && (
                                            <div className="md:col-span-1">
                                                <img 
                                                    src={blog.thumbnail} 
                                                    alt={blog.title}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        
                                        {/* Content - Main focus */}
                                        <div className={`${blog.thumbnail ? 'md:col-span-2' : 'md:col-span-3'}`}>
                                            {/* Title - Large and bold */}
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                                                {blog.title}
                                            </h3>
                                            
                                            {/* Description - Neutral gray */}
                                            <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                                {blog.description || blog.excerpt || 'No description available.'}
                                            </p>
                                            
                                            {/* Meta Info - Small muted text */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                {blog.authorName && (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {blog.authorName}
                                                    </span>
                                                )}
                                                
                                                {blog.publishedAt && (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(blog.publishedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                                
                                                {blog.category && (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {blog.category}
                                                    </span>
                                                )}
                                                
                                                {blog.readTime && (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {blog.readTime} min read
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
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