import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/logo_no_text.png';

// --- HEADER COMPONENT ---
const LoggedOutHeader = () => {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'VN' : 'EN');
  };

  return (
    <header className="sticky top-0 z-50 bg-white w-full py-3 px-4 sm:px-6 flex items-center justify-between shadow-md">
      {/* === LEFT SECTION: BRAND & MAIN FEATURES === */}
      <div className="flex items-center space-x-6">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Local logo image */}
          <img src={logoImage} alt="KnowVa Logo" className="h-8 w-8" />
          <span className="hidden sm:block text-3xl font-bold text-gray-700 tracking-tight">KnowVa</span>
        </Link>
        
        {/* Public navigation links */}
        <nav className="hidden lg:flex items-center space-x-6 border-l border-gray-200 ml-4 pl-6">
            <Link to="/quizzes" className="text-gray-600 hover:text-[#00A9E7] font-semibold transition-colors duration-200 text-lg">
                Quizzes
            </Link>
            <Link to="/flashcards" className="text-gray-600 hover:text-[#00A9E7] font-semibold transition-colors duration-200 text-lg">
                Flashcards
            </Link>
            <Link to="/tests" className="text-gray-600 hover:text-[#00A9E7] font-semibold transition-colors duration-200 text-lg">
                Tests
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-[#00A9E7] font-semibold transition-colors duration-200 text-lg">
                Blog
            </Link>
            <Link to="/Explore" className="text-gray-600 hover:text-[#00A9E7] font-semibold transition-colors duration-200 text-lg">
                Explore
            </Link>
        </nav>
      </div>

      {/* === RIGHT SECTION: AUTH ACTIONS & LANGUAGE TOGGLE === */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1 font-semibold text-gray-700 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
        >
          <span>{language}</span>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </button>
        
        {/* Login & Sign Up Buttons */}
        <div className="flex items-center space-x-2">
            <Link to="/login">
  <button className="font-semibold text-gray-700 py-2 px-4 rounded-full hover:bg-gray-100 transition-colors duration-200 text-base sm:text-lg">
    Login
  </button>
</Link>
            <Link to="/signup">
              <button className="bg-[#00A9E7] text-white font-bold py-2 px-4 rounded-full hover:bg-[#0095cc] transition-transform duration-200 hover:scale-105 text-base sm:text-lg">
                Sign up
              </button>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default LoggedOutHeader;