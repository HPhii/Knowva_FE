import React from "react";
import { useTranslation } from "react-i18next";

const Cookies = () => {
  const { t } = useTranslation();

  const cookieTypes = [
    {
      title: t("cookies.cookieTypes.essential.title"),
      description: t("cookies.cookieTypes.essential.description"),
      examples: t("cookies.cookieTypes.essential.examples", {
        returnObjects: true,
      }),
      necessary: true,
    },
    {
      title: t("cookies.cookieTypes.analytics.title"),
      description: t("cookies.cookieTypes.analytics.description"),
      examples: t("cookies.cookieTypes.analytics.examples", {
        returnObjects: true,
      }),
      necessary: false,
    },
    {
      title: t("cookies.cookieTypes.functional.title"),
      description: t("cookies.cookieTypes.functional.description"),
      examples: t("cookies.cookieTypes.functional.examples", {
        returnObjects: true,
      }),
      necessary: false,
    },
    {
      title: t("cookies.cookieTypes.marketing.title"),
      description: t("cookies.cookieTypes.marketing.description"),
      examples: t("cookies.cookieTypes.marketing.examples", {
        returnObjects: true,
      }),
      necessary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t("cookies.title", "Cookie Policy")}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {t("cookies.lastUpdated", "Last updated: March 15, 2025")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.whatAreCookies", "What Are Cookies?")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.cookiesDescription",
                  "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site."
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.howWeUseCookies", "How We Use Cookies")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("cookies.howWeUseDescription", "We use cookies to:")}
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  {t(
                    "cookies.use1",
                    "Remember your login status and preferences"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.use2",
                    "Analyze how our website is used to improve performance"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.use3",
                    "Provide personalized content and features"
                  )}
                </li>
                <li>
                  {t("cookies.use4", "Ensure security and prevent fraud")}
                </li>
                <li>{t("cookies.use5", "Deliver relevant advertisements")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.typesOfCookies", "Types of Cookies We Use")}
              </h2>

              <div className="space-y-6">
                {cookieTypes.map((type, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {type.title}
                      </h3>
                      {type.necessary && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {t("cookies.necessary", "Necessary")}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{type.description}</p>
                    <div className="text-sm text-gray-600">
                      <strong>{t("cookies.examples", "Examples:")}</strong>
                      <ul className="list-disc pl-4 mt-1">
                        {type.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.thirdPartyCookies", "Third-Party Cookies")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.thirdPartyDescription",
                  "We may also use third-party cookies from trusted partners to help us provide better services. These include:"
                )}
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  {t(
                    "cookies.thirdParty1",
                    "Google Analytics for website analytics"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.thirdParty2",
                    "Social media platforms for sharing features"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.thirdParty3",
                    "Payment processors for secure transactions"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.thirdParty4",
                    "Advertising networks for relevant ads"
                  )}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(
                  "cookies.managingCookies",
                  "Managing Your Cookie Preferences"
                )}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.managingDescription",
                  "You can control and manage cookies in several ways:"
                )}
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  {t(
                    "cookies.manage1",
                    "Browser settings: Most browsers allow you to control cookies through their settings"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.manage2",
                    "Cookie consent: You can change your preferences through our cookie consent banner"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.manage3",
                    "Third-party opt-outs: Visit the websites of our third-party partners to opt out"
                  )}
                </li>
                <li>
                  {t(
                    "cookies.manage4",
                    "Contact us: Reach out to us for assistance with cookie management"
                  )}
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.cookieConsent", "Cookie Consent")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.consentDescription",
                  "When you first visit our website, you will see a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences. Your choices will be remembered for future visits."
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.updates", "Updates to This Policy")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.updatesDescription",
                  "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website."
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("cookies.contactUs", "Contact Us")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "cookies.contactDescription",
                  "If you have any questions about our use of cookies or this Cookie Policy, please contact us:"
                )}
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  {t("cookies.contactEmail", "Email: privacy@knowva.com")}
                </p>
                <p className="text-gray-700">
                  {t(
                    "cookies.contactAddress",
                    "Address: 123 Innovation Drive, San Francisco, CA 94105"
                  )}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
