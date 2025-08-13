import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getCategoryNameSmart } from '../utils/blogCategories';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Categories are managed by utility file

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'N/A';
    }
  };

  const handleCardClick = () => {
    navigate(`/blog/${blog.slug}`);
  };

  return (
    <article 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Featured Image */}
      <div className="relative overflow-hidden">
        <img
          src={blog.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getCategoryNameSmart(blog.categoryId || blog.categoryName, t)}
          </span>
        </div>
        {/* Read Time Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {blog.readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {/* Author Avatar */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {blog.authorName?.charAt(0)?.toUpperCase() || t('blog.defaultAuthorInitial', 'A')}
              </span>
            </div>
            <span className="font-medium">{blog.authorName}</span>
          </div>
          
          {/* Published Date */}
          <time dateTime={blog.publishedAt}>
            {formatDate(blog.publishedAt)}
          </time>
        </div>

        {/* Status Badge */}
        {blog.status === 'PUBLISHED' && (
          <div className="mt-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t('blog.status.published', 'Đã xuất bản')}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;

