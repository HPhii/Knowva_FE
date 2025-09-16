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
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
      onClick={handleCardClick}
    >
      {/* Featured Image */}
      <div className="relative overflow-hidden">
        <img
          src={blog.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={blog.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">{blog.authorName}</span>
          </div>
          
          {/* Published Date */}
          <time dateTime={blog.publishedAt} className="text-gray-500">
            {formatDate(blog.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

