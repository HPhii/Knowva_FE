import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FeedbackModal from "./FeedbackModal";
import BugReportModal from "./BugReportModal";

const Footer = () => {
  const { t } = useTranslation();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [bugReportModalVisible, setBugReportModalVisible] = useState(false);

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Animated Background with Universe Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles with CSS animations */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400/20 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/4 right-1/2 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-float-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-blue-400/20 rounded-full animate-float-medium" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-pink-900/5"></div>
      </div>

      {/* Deep Wave Separator */}
      <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V120C200,60,400,180,600,120C800,60,1000,180,1200,120V0Z"
            fill="#0f172a"
          />
          <path
            d="M0,0V80C150,40,300,120,450,80C600,40,750,120,900,80C1050,40,1200,120,1200,80V0Z"
            fill="#1e293b"
            opacity="0.8"
          />
          <path
            d="M0,0V60C100,30,200,90,300,60C400,30,500,90,600,60C700,30,800,90,900,60C1000,30,1100,90,1200,60V0Z"
            fill="#334155"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 pt-32 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t("footer.brand")}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("footer.brandDesc")}
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setFeedbackModalVisible(true)}
                  className="w-40 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-xs uppercase tracking-wide"
                >
                  {t("footer.sendFeedback")}
                </button>
                
                <button
                  onClick={() => setBugReportModalVisible(true)}
                  className="w-40 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-xs uppercase tracking-wide group"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1.5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {t("footer.reportBug")}
                  </div>
                </button>
              </div>
            </div>

            {/* Customers Column */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6">
                {t("footer.customers")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.support")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/documentation"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.documentation")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6">
                {t("footer.company")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.contactUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.blog")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Further Information Column */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-bold text-white mb-6">
                {t("footer.furtherInfo")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {t("footer.cookies")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                {t("footer.copyright")}
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{t("footer.twitter")}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{t("footer.facebook")}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <span className="sr-only">{t("footer.linkedin")}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(4px); }
          50% { transform: translateY(-4px) translateX(-6px); }
          75% { transform: translateY(-12px) translateX(2px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-6px) translateX(3px); }
          66% { transform: translateY(-10px) translateX(-5px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-5px) translateX(2px); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        visible={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
      />
      
      {/* Bug Report Modal */}
      <BugReportModal 
        visible={bugReportModalVisible}
        onCancel={() => setBugReportModalVisible(false)}
      />
    </footer>
  );
};

export default Footer;