import React from 'react';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();

  const blogPosts = [
    {
      id: 1,
      title: t('blog.posts.post1.title'),
      excerpt: t('blog.posts.post1.excerpt'),
      author: t('blog.posts.post1.author'),
      date: 'March 15, 2024',
      category: t('blog.posts.post1.category'),
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post1.readTime')
    },
    {
      id: 2,
      title: t('blog.posts.post2.title'),
      excerpt: t('blog.posts.post2.excerpt'),
      author: t('blog.posts.post2.author'),
      date: 'March 10, 2024',
      category: t('blog.posts.post2.category'),
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post2.readTime')
    },
    {
      id: 3,
      title: t('blog.posts.post3.title'),
      excerpt: t('blog.posts.post3.excerpt'),
      author: t('blog.posts.post3.author'),
      date: 'March 5, 2024',
      category: t('blog.posts.post3.category'),
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post3.readTime')
    },
    {
      id: 4,
      title: t('blog.posts.post4.title'),
      excerpt: t('blog.posts.post4.excerpt'),
      author: t('blog.posts.post4.author'),
      date: 'February 28, 2024',
      category: t('blog.posts.post4.category'),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post4.readTime')
    },
    {
      id: 5,
      title: t('blog.posts.post5.title'),
      excerpt: t('blog.posts.post5.excerpt'),
      author: t('blog.posts.post5.author'),
      date: 'February 20, 2024',
      category: t('blog.posts.post5.category'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post5.readTime')
    },
    {
      id: 6,
      title: t('blog.posts.post6.title'),
      excerpt: t('blog.posts.post6.excerpt'),
      author: t('blog.posts.post6.author'),
      date: 'February 15, 2024',
      category: t('blog.posts.post6.category'),
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      readTime: t('blog.posts.post6.readTime')
    }
  ];

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

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  className="w-full h-64 md:h-full object-cover"
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm ml-4">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{blogPosts[0].author}</p>
                      <p className="text-xs text-gray-500">{blogPosts[0].date}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('blog.readMore')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <img
                className="w-full h-48 object-cover"
                src={post.image}
                alt={post.title}
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-4">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t('blog.readMore')}
                  </button>
                </div>
              </div>
            </article>
          ))}
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
