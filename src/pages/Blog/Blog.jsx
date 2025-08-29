import React from 'react';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();

  // Posts removed; show empty state instead

  const categories = [
    t('blog.categories.all'),
    t('blog.categories.learningScience'),
    t('blog.categories.technology'),
    t('blog.categories.studyTips'),
    t('blog.categories.edTech')
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.title', 'KnowVa Blog')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('blog.subtitle', 'Insights, tips, and stories about learning, technology, and the future of education.')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">📰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('blog.emptyTitle')}</h2>
            <p className="text-gray-600">{t('blog.emptySubtitle')}</p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {t('blog.newsletterTitle', 'Stay Updated')}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('blog.newsletterSubtitle', 'Get the latest insights on learning, technology, and education delivered to your inbox.')}
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder={t('blog.emailPlaceholder')}
              className="flex-1 px-4 py-3 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-blue-800 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition-colors">
              {t('blog.subscribe')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
