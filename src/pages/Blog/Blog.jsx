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
          setError(t('blog.errors.cannotLoadPosts', 'Không thể tải danh sách bài viết. Vui lòng thử lại sau.'));
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const ErrorState = () => (
        <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
                onClick={() => fetchBlogs(keyword)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {t('blog.actions.tryAgain', 'Thử lại')}
            </button>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết nào</h3>
                            <p className="text-gray-600 mb-6">{t('blog.errors.tryDifferentKeyword', 'Vui lòng thử lại với từ khóa hoặc danh mục khác.')}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Filter and Search Section - Redesigned */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    {/* Search and Create Post Row */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        {/* Search Bar - Enhanced */}
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={keyword}
                                    onChange={handleSearchChange}
                                    placeholder={t('blog.searchPlaceholder', 'Tìm kiếm bài viết...')}
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white focus:bg-white"
                                />
                            </div>
                        </div>
                        
                        {/* Create Post Button - Inline with Search */}
                        <button
                            onClick={() => navigate('/blog/create')}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('blog.actions.createNewPost', 'Đăng bài mới')}
                        </button>
                    </div>
                    
                    {/* Sort Controls Row */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        {/* Sort By */}
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {t('blog.sort.sortBy', 'Sắp xếp theo:')}
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortByChange(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white focus:bg-white"
                            >
                                <option value="publishedAt">{t('blog.sort.publishedAt', 'Ngày xuất bản')}</option>
                                <option value="title">{t('blog.sort.title', 'Tiêu đề')}</option>
                                <option value="authorName">{t('blog.sort.authorName', 'Tác giả')}</option>
                                <option value="readTime">{t('blog.sort.readTime', 'Thời gian đọc')}</option>
                                <option value="createdAt">{t('blog.sort.createdAt', 'Ngày tạo')}</option>
                                <option value="updatedAt">{t('blog.sort.updatedAt', 'Ngày cập nhật')}</option>
                            </select>
                        </div>
                        
                        {/* Sort Direction */}
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {t('blog.sort.direction', 'Thứ tự:')}
                            </label>
                            <select
                                value={sortDirection}
                                onChange={(e) => handleSortDirectionChange(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white focus:bg-white"
                            >
                                <option value="DESC">{t('blog.sort.desc', 'Giảm dần')}</option>
                                <option value="ASC">{t('blog.sort.asc', 'Tăng dần')}</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Category Filters - Enhanced */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id || 'all'}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                                    selectedCategoryId === category.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {t(category.nameKey)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content - Enhanced */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
                {loading && <LoadingSpinner />}
                {error && !loading && <ErrorState />}
                {!loading && !error && blogs.length === 0 && <EmptyState />}

                {!loading && !error && blogs.length > 0 && (
                    <>
                        {/* Results Header */}
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                {t('blog.results.title', 'Kết quả tìm kiếm')}
                            </h2>
                            <p className="text-gray-600">
                                {t('blog.results.found', 'Tìm thấy')} <span className="font-semibold text-blue-600">{blogs.length}</span> {t('blog.results.posts', 'bài viết')}
                                {keyword && (
                                    <span> {t('blog.results.for', 'cho')} "<span className="font-medium text-gray-800">{keyword}</span>"</span>
                                )}
                            </p>
                        </div>
                        
                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0 || loading}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('blog.pagination.previous', 'Trang trước')}
                                </button>
                                <span className="text-gray-700">
                                    {t('blog.pagination.page', 'Trang')} {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1 || loading}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('blog.pagination.next', 'Trang sau')}
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