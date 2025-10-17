import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Pricing = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(null); // Track which plan is loading
  const [error, setError] = useState(null);

  const getUserData = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    console.log('Debug getUserData:', {
      token: token ? 'exists' : 'null',
      userId,
      user,
      isLoggedIn,
      tokenLength: token ? token.length : 0
    });

    return { token, userId, user, isLoggedIn };
  };

  const openPaymentUrl = (checkoutUrl) => {
    try {
      const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');

      setTimeout(() => {
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          const message = i18n.language === 'vi'
            ? 'Trình duyệt đã chặn popup. Đang chuyển hướng đến trang thanh toán...'
            : 'Popup blocked by browser. Redirecting to payment page...';

          alert(message);
          window.location.href = checkoutUrl;
        } else {
          newWindow.focus();
        }
      }, 100);

    } catch (error) {
      console.error('Error opening payment URL:', error);
      window.location.href = checkoutUrl;
    }
  };

  // Handle payment creation
  const handlePayment = async (planType) => {
    const { token, userId, user, isLoggedIn } = getUserData();

    console.log('Payment attempt:', { token: !!token, userId, isLoggedIn });

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLoggedIn || !token || !userId) {
      console.log('Authentication check failed:', { isLoggedIn, hasToken: !!token, userId });
      setError(t('pricing.errors.loginRequired'));
      return;
    }

    const isVipPlan = planType === 'vip';
    setLoading(planType);
    setError(null);

    try {
      console.log('Making payment request with:', {
        url: `${import.meta.env.VITE_SERVER_URL || 'https://api.knowva.me/api'}/payment/create-payment-link?isRenewal=false`,
        userId: parseInt(userId),
        hasToken: !!token
      });

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL || 'https://api.knowva.me/api'}/payment/create-payment-link?isRenewal=false`,
        { userId: parseInt(userId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment response:', response.data);

      if (response.data && response.data.checkoutUrl) {
        // Sử dụng function mới để mở payment URL
        openPaymentUrl(response.data.checkoutUrl);
      } else {
        setError(t('pricing.errors.paymentLinkFailed'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response);

      // Kiểm tra nếu user đã là VIP
      if (err.response?.status === 400 && err.response?.data === 'User is already VIP') {
        handleVipUserRenewal();
        return;
      }

      const errorMessage = err.response?.data?.message || t('pricing.errors.paymentFailed');
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  // Handle VIP user renewal confirmation
  const handleVipUserRenewal = () => {
    const confirmed = window.confirm(
      i18n.language === 'vi'
        ? 'Bạn đã là thành viên VIP. Bạn có muốn gia hạn VIP không?'
        : 'You are already a VIP member. Would you like to renew your VIP membership?'
    );

    if (confirmed) {
      handleRenewalPayment();
    }
  };

  // Handle renewal payment
  const handleRenewalPayment = async () => {
    const { token, userId } = getUserData();
    setLoading('vip');
    setError(null);

    try {
      console.log('Making renewal payment request');

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api'}/payment/create-payment-link?isRenewal=true`,
        { userId: parseInt(userId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Renewal payment response:', response.data);

      if (response.data && response.data.checkoutUrl) {
        // Sử dụng function mới để mở renewal payment URL
        openPaymentUrl(response.data.checkoutUrl);
      } else {
        setError(t('pricing.errors.paymentLinkFailed'));
      }
    } catch (err) {
      console.error('Renewal payment error:', err);
      const errorMessage = err.response?.data?.message || t('pricing.errors.renewalFailed');
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  // Currency conversion and display logic
  const getCurrencyInfo = () => {
    const isVietnamese = i18n.language === 'vi';
    return {
      symbol: isVietnamese ? '₫' : '$',
      regularPrice: isVietnamese ? '0' : '0', // Free plan
      vipPrice: isVietnamese ? '50.000' : '1.90',
      period: t('pricing.perMonth')
    };
  };

  const currencyInfo = getCurrencyInfo();

  const plans = [
    {
      id: 'free',
      name: t('pricing.free'),
      price: t('pricing.free'),
      period: '',
      features: [
        t('pricing.features.upTo50Flashcards'),
        t('pricing.features.basicQuizGeneration'),
        t('pricing.features.standardTestCreation'),
        t('pricing.features.emailSupport'),
        t('pricing.features.basicAnalytics'),
        t('pricing.features.2GBStorage')
      ],
      buttonText: t('pricing.getStarted'),
      popular: false,
      isFree: true
    },
    {
      id: 'vip',
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
      popular: true,
      isFree: false
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

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
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
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
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
                onClick={() => plan.isFree ? null : handlePayment(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors relative mt-auto ${
                  plan.popular && !plan.isFree
                    ? 'bg-blue-600 !text-white hover:bg-blue-700 disabled:bg-blue-400'
                    : plan.isFree
                    ? 'bg-green-600 !text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50'
                } ${loading === plan.id ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading === plan.id ? (
                  <div className="flex items-center justify-center !text-white">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 !text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('pricing.processing')}
                  </div>
                ) : (
                  plan.buttonText
                )}
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
