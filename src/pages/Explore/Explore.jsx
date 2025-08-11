import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined, MobileOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";

const Explore = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState("quiz"); // quiz, flashcard, test
  const [sortType, setSortType] = useState("newest"); // newest, mostViewed, topRated
  // Advanced filters
  const [selectedCategories, setSelectedCategories] = useState([]); // multi-select
  const [selectedDifficulties, setSelectedDifficulties] = useState([]); // beginner|intermediate|advanced
  const [filterNew, setFilterNew] = useState(false);
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterMobile, setFilterMobile] = useState(false);
  const [filterFree, setFilterFree] = useState(false);
  const [minQuestions, setMinQuestions] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(100);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(120);
  const [minRating, setMinRating] = useState(0);

  // Mock data for quizzes/templates
  const [quizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      category: "programming",
      difficulty: "beginner",
      questions: 20,
      time: "30 min",
      timeMinutes: 30,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free",
      views: 1200,
      rating: 4.6
    },
    {
      id: 2,
      title: "React Development",
      category: "programming",
      difficulty: "intermediate",
      questions: 25,
      time: "45 min",
      timeMinutes: 45,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free",
      views: 3500,
      rating: 4.8
    },
    {
      id: 3,
      title: "Data Structures",
      category: "computer-science",
      difficulty: "advanced",
      questions: 30,
      time: "60 min",
      timeMinutes: 60,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free",
      views: 900,
      rating: 4.2
    },
    {
      id: 4,
      title: "Web Design Principles",
      category: "design",
      difficulty: "beginner",
      questions: 15,
      time: "25 min",
      timeMinutes: 25,
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free",
      views: 2700,
      rating: 4.5
    },
    {
      id: 5,
      title: "Database Management",
      category: "computer-science",
      difficulty: "intermediate",
      questions: 22,
      time: "40 min",
      timeMinutes: 40,
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free",
      views: 1450,
      rating: 4.0
    },
    {
      id: 6,
      title: "UI/UX Design",
      category: "design",
      difficulty: "intermediate",
      questions: 18,
      time: "35 min",
      timeMinutes: 35,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free",
      views: 650,
      rating: 3.9
    }
  ]);

  const categories = [
    { id: "programming", icon: "💻" },
    { id: "computer-science", icon: "🔬" },
    { id: "design", icon: "🎨" },
    { id: "mathematics", icon: "📐" },
    { id: "languages", icon: "🌍" }
  ];

  const difficulties = ["beginner", "intermediate", "advanced"];

  const toggleArrayValue = (arr, value) => {
    const set = new Set(arr);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    return Array.from(set);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setFilterNew(false);
    setFilterPopular(false);
    setFilterMobile(false);
    setFilterFree(false);
    setMinQuestions(0);
    setMaxQuestions(100);
    setMinTime(0);
    setMaxTime(120);
    setMinRating(0);
  };

  // Filtering
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesType = contentType === "quiz";
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || selectedCategories.includes(quiz.category);
    const matchesDifficulties = selectedDifficulties.length === 0 || selectedDifficulties.includes(quiz.difficulty);
    const matchesNew = !filterNew || quiz.isNew;
    const matchesPopular = !filterPopular || quiz.isPopular;
    const matchesMobile = !filterMobile || quiz.isMobileOptimized;
    const matchesFree = !filterFree || quiz.price === "Free";
    const matchesQuestions = quiz.questions >= minQuestions && quiz.questions <= maxQuestions;
    const timeValue = typeof quiz.timeMinutes === 'number' ? quiz.timeMinutes : 0;
    const matchesTime = timeValue >= minTime && timeValue <= maxTime;
    const matchesRating = (quiz.rating || 0) >= minRating;

    return (
      matchesType &&
      matchesSearch &&
      matchesCategories &&
      matchesDifficulties &&
      matchesNew &&
      matchesPopular &&
      matchesMobile &&
      matchesFree &&
      matchesQuestions &&
      matchesTime &&
      matchesRating
    );
  });

  // Sắp xếp dữ liệu theo sortType (giả lập, bạn có thể thay đổi logic khi có dữ liệu thực)
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (sortType === "newest") return b.id - a.id;
    if (sortType === "mostViewed") return (b.views || 0) - (a.views || 0);
    if (sortType === "topRated") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      {/* Header Section */}
 

      <div className="py-8">
        {/* Header: Filter & Refine, chips and clear all */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-gray-800 font-semibold">
              <span className="mr-2">⚙️</span>
              {t('explore.filterAndRefine', 'Filter & Refine')}
            </div>
            {/* Applied search term chip */}
            {searchTerm && (
              <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                {t('explore.term', 'Term')}: '{searchTerm}'
                <button className="ml-2" onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {/* Applied other chips will render in main section as well */}
          </div>
          <div className="flex items-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm underline"
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? t('explore.hideFilters', 'Hide filters') : t('explore.showFilters', 'Show filters')}
            </button>
            <button onClick={() => { setSearchTerm(''); clearAllFilters(); }} className="text-sm text-blue-600 hover:text-blue-800">
              {t('explore.clearAll', 'Clear all filters')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left Sidebar */}
          {showFilters && (
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-none lg:rounded-r-lg shadow-sm border border-gray-200 border-l-0 border-t-0 border-b-0 lg:border-l lg:border-t lg:border-b p-6 min-h-full">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("explore.searchPlaceholder", "e.g. JavaScript, React, Design")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters - Content Type */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t("explore.filters", "Filters")}
                </h3>
                <div className="mb-4">
                  <div className="font-medium text-gray-700 mb-2">{t("explore.contentType", "Content Type")}</div>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value="quiz"
                        checked={contentType === "quiz"}
                        onChange={() => setContentType("quiz")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Quiz</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value="flashcard"
                        checked={contentType === "flashcard"}
                        onChange={() => setContentType("flashcard")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Flashcard</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value="test"
                        checked={contentType === "test"}
                        onChange={() => setContentType("test")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Test</span>
                    </label>
                  </div>
                </div>
                {/* Filters - Sort */}
                <div>
                  <div className="font-medium text-gray-700 mb-2">{t("explore.sortBy", "Sort By")}</div>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortType"
                        value="newest"
                        checked={sortType === "newest"}
                        onChange={() => setSortType("newest")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t("explore.newest", "Newest")}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortType"
                        value="mostViewed"
                        checked={sortType === "mostViewed"}
                        onChange={() => setSortType("mostViewed")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t("explore.mostViewed", "Most Viewed")}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="sortType"
                        value="topRated"
                        checked={sortType === "topRated"}
                        onChange={() => setSortType("topRated")}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t("explore.topRated", "Top Rated")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Categories - Multi-select */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t("explore.categories", "Categories")}</div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => setSelectedCategories(toggleArrayValue(selectedCategories, category.id))}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="mr-2">{category.icon}</span>
                        {t(`explore.categoryNames.${category.id}`, category.id)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t('explore.difficulty', 'Difficulty')}</div>
                <div className="space-y-2">
                  {difficulties.map((level) => (
                    <label key={level} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(level)}
                        onChange={() => setSelectedDifficulties(toggleArrayValue(selectedDifficulties, level))}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t(`explore.difficultyLevels.${level}`, level)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t('explore.features', 'Features')}</div>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={filterNew} onChange={(e) => setFilterNew(e.target.checked)} className="mr-3" />
                    <span className="text-sm text-gray-700">{t('explore.featureNew', 'New')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={filterPopular} onChange={(e) => setFilterPopular(e.target.checked)} className="mr-3" />
                    <span className="text-sm text-gray-700">{t('explore.featurePopular', 'Popular')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={filterMobile} onChange={(e) => setFilterMobile(e.target.checked)} className="mr-3" />
                    <span className="text-sm text-gray-700">{t('explore.featureMobile', 'Mobile Optimized')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={filterFree} onChange={(e) => setFilterFree(e.target.checked)} className="mr-3" />
                    <span className="text-sm text-gray-700">{t('explore.featureFreeOnly', 'Free only')}</span>
                  </label>
                </div>
              </div>

              {/* Questions Range */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t('explore.questionsRange', 'Questions range')}</div>
                <div className="flex items-center space-x-2">
                  <input type="number" value={minQuestions} onChange={(e) => setMinQuestions(Number(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded" />
                  <span className="text-gray-500">-</span>
                  <input type="number" value={maxQuestions} onChange={(e) => setMaxQuestions(Number(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded" />
                </div>
              </div>

              {/* Time Range */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t('explore.timeRange', 'Time range')}</div>
                <div className="flex items-center space-x-2">
                  <input type="number" value={minTime} onChange={(e) => setMinTime(Number(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded" />
                  <span className="text-gray-500">-</span>
                  <input type="number" value={maxTime} onChange={(e) => setMaxTime(Number(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded" />
                  <span className="text-sm text-gray-500">{t('explore.minutes', 'min')}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">{t('explore.rating', 'Minimum rating')}</div>
                <div className="space-y-1">
                  {[0, 3, 4, 4.5].map((r) => (
                    <label key={r} className="flex items-center cursor-pointer">
                      <input type="radio" name="minRating" checked={minRating === r} onChange={() => setMinRating(r)} className="mr-2" />
                      <span className="text-sm text-gray-700">{r === 0 ? t('explore.anyRating', 'Any rating') : `${r}+ ★`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear All */}
              <button onClick={clearAllFilters} className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                {t('explore.clearAll', 'Clear all filters')}
              </button>
            </div>
          </div>
          )}

          {/* Main Content */}
          <div className="flex-1 lg:pl-8 mt-8 lg:mt-0">
            {/* Applied Filters Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedCategories.map((c) => (
                <span key={`c-${c}`} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  {t(`explore.categoryNames.${c}`, c)}
                  <button className="ml-1" onClick={() => setSelectedCategories(selectedCategories.filter((x) => x !== c))}>×</button>
                </span>
              ))}
              {selectedDifficulties.map((d) => (
                <span key={`d-${d}`} className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                  {t(`explore.difficultyLevels.${d}`, d)}
                  <button className="ml-1" onClick={() => setSelectedDifficulties(selectedDifficulties.filter((x) => x !== d))}>×</button>
                </span>
              ))}
              {filterNew && (
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {t('explore.featureNew', 'New')}
                  <button className="ml-1" onClick={() => setFilterNew(false)}>×</button>
                </span>
              )}
              {filterPopular && (
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {t('explore.featurePopular', 'Popular')}
                  <button className="ml-1" onClick={() => setFilterPopular(false)}>×</button>
                </span>
              )}
              {filterMobile && (
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {t('explore.featureMobile', 'Mobile Optimized')}
                  <button className="ml-1" onClick={() => setFilterMobile(false)}>×</button>
                </span>
              )}
              {filterFree && (
                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {t('explore.featureFreeOnly', 'Free only')}
                  <button className="ml-1" onClick={() => setFilterFree(false)}>×</button>
                </span>
              )}
              {(minQuestions !== 0 || maxQuestions !== 100) && (
                <span className="inline-flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                  {t('explore.questions', 'Questions')}: {minQuestions}-{maxQuestions}
                  <button className="ml-1" onClick={() => { setMinQuestions(0); setMaxQuestions(100); }}>×</button>
                </span>
              )}
              {(minTime !== 0 || maxTime !== 120) && (
                <span className="inline-flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                  {t('explore.time', 'Time')}: {minTime}-{maxTime} {t('explore.minutes', 'min')}
                  <button className="ml-1" onClick={() => { setMinTime(0); setMaxTime(120); }}>×</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs">
                  {t('explore.ratingAtLeast', 'Rating ≥')} {minRating}★
                  <button className="ml-1" onClick={() => setMinRating(0)}>×</button>
                </span>
              )}
              {(selectedCategories.length || selectedDifficulties.length || filterNew || filterPopular || filterMobile || filterFree || minQuestions !== 0 || maxQuestions !== 100 || minTime !== 0 || maxTime !== 120 || minRating > 0) && (
                <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:text-blue-800 ml-2">{t('explore.clearAll', 'Clear all filters')}</button>
              )}
            </div>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {t("explore.resultsCount", "Showing")} {sortedQuizzes.length} {t("explore.quizzes", "quizzes")}
              </p>
            </div>

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Quiz Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="w-full h-full object-cover"
                    />
                    {quiz.isNew && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW!
                      </div>
                    )}
                    {quiz.isMobileOptimized && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
                        <MobileOutlined className="mr-1" />
                        Mobile Optimized
                      </div>
                    )}
                  </div>

                  {/* Quiz Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {quiz.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{quiz.questions} questions</span>
                      <span>{quiz.time}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 capitalize">
                        {t(`explore.difficultyLevels.${quiz.difficulty}`)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {quiz.price}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium">
                        <EyeOutlined className="mr-1" />
                        {t("explore.view", "VIEW")}
                      </button>
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm font-medium">
                        <EditOutlined className="mr-1" />
                        {t("explore.edit", "EDIT")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedQuizzes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("explore.noResults", "No quizzes found")}
                </h3>
                <p className="text-gray-600">
                  {t("explore.noResultsDesc", "Try adjusting your search or filters")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
