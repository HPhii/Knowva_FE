import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('privacy.title', 'Privacy Policy')}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">{t('privacy.lastUpdated')}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.infoCollectionTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.infoCollectionText')}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {(t('privacy.infoCollectionItems', { returnObjects: true }) || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.infoUseTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.infoUseText')}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {(t('privacy.infoUseItems', { returnObjects: true }) || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.infoSharingTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.infoSharingText')}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {(t('privacy.infoSharingItems', { returnObjects: true }) || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.dataSecurityTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.dataSecurityText')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.yourRightsTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.yourRightsText')}</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                {(t('privacy.yourRightsItems', { returnObjects: true }) || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.cookiesTrackingTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.cookiesTrackingText')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.childrenPrivacyTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.childrenPrivacyText')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.internationalTransfersTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.internationalTransfersText')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.changesPolicyTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.changesPolicyText')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.contactUsTitle')}</h2>
              <p className="text-gray-700 mb-4">{t('privacy.contactUsText')}</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{t('privacy.contactEmail')}</p>
                <p className="text-gray-700">{t('privacy.contactAddress')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
