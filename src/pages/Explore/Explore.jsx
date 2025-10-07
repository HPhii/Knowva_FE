import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import QuizCard from "../../components/QuizCard";
import FlashcardCard from "../../components/FlashcardCard";
import FilterBar from "../../components/FilterBar";

const Explore = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState("quiz"); // "quiz" or "flashcard"
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Data states
  const [quizSets, setQuizSets] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch quiz sets and flashcard sets in parallel
      const [quizResponse, flashcardResponse] = await Promise.all([
        api.get('/quiz-sets/all'),
        api.get('/flashcard-sets/all')
      ]);
      
      setQuizSets(quizResponse.data || []);
      setFlashcardSets(flashcardResponse.data || []);
      
      // Extract categories from both datasets
      const allCategories = new Set();
      [...(quizResponse.data || []), ...(flashcardResponse.data || [])].forEach(item => {
        if (item.categoryName) {
          allCategories.add(item.categoryName);
        }
      });
      
      setCategories(Array.from(allCategories).map((name, index) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name
      })));
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort data
  const getFilteredData = () => {
    const data = activeTab === "quiz" ? quizSets : flashcardSets;
    
    let filtered = data.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesCategory = !selectedCategory || item.categoryName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'mostPlayed':
          return (b.playCount || 0) - (a.playCount || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
    return 0;
      }
    });

    return filtered;
  };

  const filteredData = getFilteredData();

  // Handle view actions
  const handleViewQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleViewFlashcard = (flashcard) => {
    navigate(`/flashcard/${flashcard.id}`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Tab Skeleton */}
        <div className="flex space-x-4 mb-6">
          <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
                  ))}
                </div>
              </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('explore.error', 'Đã xảy ra lỗi')}</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          {t('explore.tryAgain', 'Thử lại')}
        </button>
                </div>
              </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">
        {activeTab === "quiz" ? "📝" : "🗂️"}
                </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {activeTab === "quiz" 
          ? t("explore.noQuizSets", "No quiz sets found") 
          : t("explore.noFlashcardSets", "No flashcard sets found")
        }
      </h3>
      <p className="text-gray-600">
        {t("explore.noResultsDesc", "Try adjusting your search or filters")}
      </p>
              </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "quiz"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("explore.quizSets", "Quiz Sets")} ({quizSets.length})
          </button>
          <button
            onClick={() => setActiveTab("flashcard")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "flashcard"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("explore.flashcardSets", "Flashcard Sets")} ({flashcardSets.length})
              </button>
            </div>

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
            {t("explore.resultsCount", "Showing")} {filteredData.length} {activeTab === "quiz" ? t("explore.quizSets", "quiz sets") : t("explore.flashcardSets", "flashcard sets")}
              </p>
            </div>

        {/* Content Grid */}
        {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              activeTab === "quiz" ? (
                <QuizCard
                  key={item.id}
                  quiz={item}
                  onView={handleViewQuiz}
                />
              ) : (
                <FlashcardCard
                  key={item.id}
                  flashcard={item}
                  onView={handleViewFlashcard}
                />
              )
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Explore;
