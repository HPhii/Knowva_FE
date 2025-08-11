import React from 'react';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t, i18n } = useTranslation();

  // Currency conversion and display logic
  const getCurrencyInfo = () => {
    const isVietnamese = i18n.language === 'vi';
    return {
      symbol: isVietnamese ? '₫' : '$',
      regularPrice: isVietnamese ? '249.000' : '9.99',
      vipPrice: isVietnamese ? '499.000' : '19.99',
      period: t('pricing.perMonth')
    };
  };

  const currencyInfo = getCurrencyInfo();

  const plans = [
    {
      name: t('pricing.regular'),
      price: currencyInfo.symbol + currencyInfo.regularPrice,
      period: currencyInfo.period,
      features: [
        t('pricing.features.upTo50Flashcards'),
        t('pricing.features.basicQuizGeneration'),
        t('pricing.features.standardTestCreation'),
        t('pricing.features.emailSupport'),
        t('pricing.features.basicAnalytics'),
        t('pricing.features.2GBStorage')
      ],
      buttonText: t('pricing.getStarted'),
      popular: false
    },
    {
      name: t('pricing.vip'),
      price: currencyInfo.symbol + currencyInfo.vipPrice,
      period: currencyInfo.period,
      features: [
        t('pricing.features.unlimitedFlashcards'),
        t('pricing.features.advancedAIQuiz'),
        t('pricing.features.premiumTestCreation'),
        t('pricing.features.prioritySupport'),
        t('pricing.features.advancedAnalytics'),
        t('pricing.features.10GBStorage'),
        t('pricing.features.customBranding'),
        t('pricing.features.apiAccess')
      ],
      buttonText: t('pricing.getVIP'),
      popular: true
    }
  ];

  const faqItems = [
    {
      title: t('pricing.faq.changePlanTitle'),
      answer: t('pricing.faq.changePlanAnswer')
    },
    {
      title: t('pricing.faq.freeTrialTitle'),
      answer: t('pricing.faq.freeTrialAnswer')
    },
    {
      title: t('pricing.faq.paymentMethodsTitle'),
      answer: t('pricing.faq.paymentMethodsAnswer')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('pricing.faqTitle')}
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
