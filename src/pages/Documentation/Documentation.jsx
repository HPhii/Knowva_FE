import React from 'react';
import { useTranslation } from 'react-i18next';

const Documentation = () => {
  const { t } = useTranslation();

  const documentationSections = [
    {
      title: t('documentation.sections.gettingStarted.title'),
      description: t('documentation.sections.gettingStarted.description'),
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: t('documentation.sections.gettingStarted.articles', { returnObjects: true })
    },
    {
      title: t('documentation.sections.flashcards.title'),
      description: t('documentation.sections.flashcards.description'),
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      articles: t('documentation.sections.flashcards.articles', { returnObjects: true })
    },
    {
      title: t('documentation.sections.quizzes.title'),
      description: t('documentation.sections.quizzes.description'),
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      articles: t('documentation.sections.quizzes.articles', { returnObjects: true })
    },
    {
      title: t('documentation.sections.tests.title'),
      description: t('documentation.sections.tests.description'),
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      articles: t('documentation.sections.tests.articles', { returnObjects: true })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('documentation.title', 'Documentation')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('documentation.subtitle', 'Comprehensive guides and tutorials to help you make the most of KnowVa\'s features.')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder={t('documentation.searchPlaceholder', 'Search documentation...')}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {documentationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {section.icon}
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {section.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('documentation.apiTitle', 'API Documentation')}
            </h2>
            <p className="text-gray-600">
              {t('documentation.apiSubtitle', 'Integrate KnowVa into your applications with our comprehensive API.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('documentation.authentication', 'Authentication')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('documentation.authDescription', 'Learn about API keys and authentication methods')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('documentation.endpoints', 'Endpoints')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('documentation.endpointsDescription', 'Explore available API endpoints')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('documentation.examples', 'Examples')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('documentation.examplesDescription', 'Code examples and tutorials')}</p>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t('documentation.videoTitle', 'Video Tutorials')}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('documentation.videoSubtitle', 'Watch step-by-step tutorials to master KnowVa features quickly.')}
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {t('documentation.watchVideos', 'Watch Videos')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
