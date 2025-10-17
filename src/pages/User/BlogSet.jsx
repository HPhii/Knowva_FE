import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Add fadeIn animation styles
const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = fadeInStyle;
  document.head.appendChild(styleSheet);
}
import { 
  FileText, 
  Calendar, 
  Eye, 
  Edit3, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle 
} from "lucide-react";
import api from "../../config/axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BlogSet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  const itemsPerPage = 6;

  // Status configuration
  const statusConfig = {
    ALL: { label: t("userDetailsPage.blogSet.allStatus"), icon: FileText, color: "gray" },
    DRAFT: { label: t("userDetailsPage.blogSet.draftStatus"), icon: Edit3, color: "gray" },
    PENDING_APPROVAL: { label: t("userDetailsPage.blogSet.pendingStatus"), icon: Clock, color: "yellow" },
    PUBLISHED: { label: t("userDetailsPage.blogSet.publishedStatus"), icon: CheckCircle, color: "green" },
    REJECTED: { label: t("userDetailsPage.blogSet.rejectedStatus"), icon: XCircle, color: "red" }
  };

  // Fetch blogs with pagination and status filter
  const fetchBlogs = async (page = 1, status = statusFilter, isFilterChange = false) => {
    try {
      if (isFilterChange) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = {
        page: page - 1, // API expects 0-based pagination
        size: itemsPerPage,
        sort: 'createdAt,desc'
      };
      
      // Add status filter if not ALL
      if (status !== "ALL") {
        params.status = status;
      }
      
      const response = await api.get("/blog/my-posts", { params });
      
      // Handle different response structures
      let blogsData = [];
      let totalElements = 0;
      
      if (Array.isArray(response.data)) {
        blogsData = response.data;
        totalElements = response.data.length;
      } else if (response.data.content) {
        blogsData = response.data.content;
        totalElements = response.data.totalElements || 0;
      } else if (response.data.posts) {
        blogsData = response.data.posts;
        totalElements = response.data.totalElements || 0;
      }
      
      setBlogs(blogsData);
      setTotalPages(Math.ceil(totalElements / itemsPerPage));
      setTotalBlogs(totalElements);
      
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(t("userDetailsPage.blogSet.cannotLoadBlogs"));
      setBlogs([]);
    } finally {
      if (isFilterChange) {
        setFilterLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "N/A";
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.DRAFT;
    const colorClasses = {
      gray: "bg-gray-100 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700"
    };
    
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    if (status === statusFilter) return; // Prevent unnecessary re-renders
    
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filter
    fetchBlogs(1, status, true); // Trigger filter change with loading state
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Combined header skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex-1">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-10 bg-gray-200 rounded-lg w-20"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchBlogs(currentPage, statusFilter)}
          className="px-4 py-2 bg-blue-600 !text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("userDetailsPage.blogSet.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filter and stats - Combined */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("userDetailsPage.blogSet.myBlogs")}</h2>
            <p className="text-gray-600 mb-4">
              {t("userDetailsPage.blogSet.totalBlogs", { count: totalBlogs })}
            </p>
            
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  disabled={filterLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out ${
                    statusFilter === status
                      ? "bg-blue-600 !text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:!text-white"
                  } ${filterLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => navigate("/blog/create")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 !text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {t("userDetailsPage.blogSet.writeNewBlog")}
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="transition-opacity duration-300 ease-in-out">
        {filterLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {statusFilter === "ALL" ? "Chưa có blog nào" : `Không có blog ${statusConfig[statusFilter]?.label.toLowerCase()}`}
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === "ALL" 
              ? "Hãy bắt đầu viết blog đầu tiên của bạn!" 
              : "Hãy thử chọn trạng thái khác hoặc viết blog mới."
            }
          </p>
          <button
            onClick={() => navigate("/blog/create")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 !text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            {t("userDetailsPage.blogSet.writeNewBlog")}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ease-out overflow-hidden animate-fadeIn cursor-pointer h-[500px] flex flex-col"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Blog Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden flex-shrink-0">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225?text=Blog+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3 flex-shrink-0">
                    {getStatusBadge(blog.status)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden flex-shrink-0" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {blog.title}
                  </h3>
                  
                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 overflow-hidden flex-grow" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 flex-shrink-0">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(blog.createdAt)}
                    </div>
                    {blog.viewCount && (
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {blog.viewCount}
                      </div>
                    )}
                  </div>
                  
                  {/* Edit buttons - Fixed at bottom */}
                  <div className="flex gap-2 mt-auto flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        navigate(`/blog/edit/${blog.id}`);
                      }}
                      className="flex-1 px-3 py-2 bg-orange-600 !text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
{t("userDetailsPage.blogSet.editBlog")}
                    </button>
                    {blog.status === "DRAFT" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          navigate(`/blog/edit/${blog.id}`);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-600 !text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
{t("userDetailsPage.blogSet.quickEdit")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};

export default BlogSet;
