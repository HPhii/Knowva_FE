import React from 'react';
import { useTranslation } from 'react-i18next';

const Support = () => {
  const { t } = useTranslation();

  const supportCategories = [
    {
      title: t('support.gettingStarted.title'),
      description: t('support.gettingStarted.description'),
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: [
        t('support.gettingStarted.article1'),
        t('support.gettingStarted.article2'),
        t('support.gettingStarted.article3'),
        t('support.gettingStarted.article4')
      ]
    },
    {
      title: t('support.accountBilling.title'),
      description: t('support.accountBilling.description'),
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      articles: [
        t('support.accountBilling.article1'),
        t('support.accountBilling.article2'),
        t('support.accountBilling.article3'),
        t('support.accountBilling.article4')
      ]
    },
    {
      title: t('support.featuresTools.title'),
      description: t('support.featuresTools.description'),
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      articles: [
        t('support.featuresTools.article1'),
        t('support.featuresTools.article2'),
        t('support.featuresTools.article3'),
        t('support.featuresTools.article4')
      ]
    },
    {
      title: t('support.troubleshooting.title'),
      description: t('support.troubleshooting.description'),
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      articles: [
        t('support.troubleshooting.article1'),
        t('support.troubleshooting.article2'),
        t('support.troubleshooting.article3'),
        t('support.troubleshooting.article4')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('support.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder={t('support.searchPlaceholder')}
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

        {/* Support Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {supportCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {category.icon}
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
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

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('support.contactTitle')}
            </h2>
            <p className="text-gray-600">
              {t('support.contactSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('support.emailSupport.title')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('support.emailSupport.email')}</p>
              <p className="text-xs text-gray-500">{t('support.emailSupport.responseTime')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('support.liveChat.title')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('support.liveChat.availability')}</p>
              <p className="text-xs text-gray-500">{t('support.liveChat.responseTime')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('support.documentation.title')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('support.documentation.description')}</p>
              <p className="text-xs text-gray-500">{t('support.documentation.tutorials')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
