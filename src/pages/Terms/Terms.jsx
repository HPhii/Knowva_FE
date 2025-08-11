import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('terms.title', 'Terms & Conditions')}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {t('terms.lastUpdated')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.acceptanceTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.acceptanceText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.useLicenseTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.useLicenseText')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {t('terms.useLicenseItems', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.userAccountsTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.userAccountsText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.contentMaterialsTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.contentMaterialsText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.privacyPolicyTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.privacyPolicyText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.subscriptionBillingTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.subscriptionBillingText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.terminationTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.terminationText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.limitationLiabilityTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.limitationLiabilityText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.changesTermsTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.changesTermsText')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms.contactInfoTitle')}</h2>
              <p className="text-gray-700 mb-4">
                {t('terms.contactInfoText')}
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{t('terms.contactEmail')}</p>
                <p className="text-gray-700">{t('terms.contactAddress')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
