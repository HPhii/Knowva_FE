import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import QuizCard from "../../components/QuizCard";
import FlashcardCard from "../../components/FlashcardCard";
import quizShiba from "../../assets/images/quiz_shiba.png";
import flashcardShiba from "../../assets/images/flashcard_shiba.png";
import notFoundImage from "../../assets/images/NotFound.png";
import DogLogoExploreQuiz from "../../components/DogLogoExploreQuiz";
import DogLogoExploreFlashcard from "../../components/DogLogoExploreFlashcard";
import tabBarIcon from "../../assets/images/tabBarIcon.png";
import DogWalkLoading from "../../components/DogWalkLoading";

const Explore = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("quiz"); // "quiz" or "flashcard"
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Data states
  const [quizSets, setQuizSets] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);

  // Main categories - hiển thị mặc định (6 items)
  const mainCategories = [
    { id: "ALL", name: t("explore.categories.all"), icon: "🌐" },
    { id: "MATHEMATICS", name: t("explore.categories.mathematics"), icon: "📐" },
    { id: "LITERATURE", name: t("explore.categories.literature"), icon: "📚" },
    { id: "PHYSICS", name: t("explore.categories.physics"), icon: "⚛️" },
    { id: "CHEMISTRY", name: t("explore.categories.chemistry"), icon: "🧪" },
    { id: "LANGUAGE", name: t("explore.categories.language"), icon: "🗣️" },
  ];

  // All categories - hiển thị khi click ">" (18 items - chia đều 2 hàng)
  const allCategories = [
    // Hàng 1 (9 items)
    { id: "ALL", name: t("explore.categories.all"), icon: "🌐" },
    { id: "MATHEMATICS", name: t("explore.categories.mathematics"), icon: "📐" },
    { id: "PHYSICS", name: t("explore.categories.physics"), icon: "⚛️" },
    { id: "CHEMISTRY", name: t("explore.categories.chemistry"), icon: "🧪" },
    { id: "BIOLOGY", name: t("explore.categories.biology"), icon: "🧬" },
    { id: "COMPUTER_SCIENCE", name: t("explore.categories.computerScience"), icon: "💻" },
    { id: "HISTORY", name: t("explore.categories.history"), icon: "📜" },
    { id: "GEOGRAPHY", name: t("explore.categories.geography"), icon: "🌍" },
    { id: "LITERATURE", name: t("explore.categories.literature"), icon: "📚" },
    // Hàng 2 (9 items)
    { id: "LANGUAGE", name: t("explore.categories.language"), icon: "🗣️" },
    { id: "BUSINESS", name: t("explore.categories.business"), icon: "💼" },
    { id: "ECONOMICS", name: t("explore.categories.economics"), icon: "📊" },
    { id: "PSYCHOLOGY", name: t("explore.categories.psychology"), icon: "🧠" },
    { id: "MEDICINE", name: t("explore.categories.medicine"), icon: "🏥" },
    { id: "LAW", name: t("explore.categories.law"), icon: "⚖️" },
    { id: "ENGINEERING", name: t("explore.categories.engineering"), icon: "⚙️" },
    { id: "ARTS", name: t("explore.categories.arts"), icon: "🎨" },
    { id: "MUSIC", name: t("explore.categories.music"), icon: "🎵" },
    { id: "OTHER", name: t("explore.categories.other"), icon: "🔖" },
  ];

  // Categories hiển thị hiện tại
  const displayCategories = showAllCategories ? allCategories : mainCategories;

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
        api.get("/quiz-sets/all"),
        api.get("/flashcard-sets/all"),
      ]);

      setQuizSets(quizResponse.data || []);
      setFlashcardSets(flashcardResponse.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Filter data by category and visibility
  const getFilteredData = () => {
    const data = activeTab === "quiz" ? quizSets : flashcardSets;

    // First filter by visibility - only show PUBLIC items
    const publicData = data.filter((item) => {
      const visibility = item.visibility || item.visibilityStatus;
      return visibility === "PUBLIC";
    });

    // Then filter by category
    if (selectedCategory === "ALL") {
      return publicData;
    }

    return publicData.filter((item) => {
      // Kiểm tra nhiều field có thể chứa category
      const itemCategory =
        item.categoryName || item.category || item.categoryType;


      return itemCategory === selectedCategory;
    });
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
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
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
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t("explore.error", "Đã xảy ra lỗi")}
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          {t("explore.tryAgain", "Thử lại")}
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <img
          src={notFoundImage}
          alt="Not Found"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain opacity-88 "
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {activeTab === "quiz"
          ? t("explore.noQuizSets", "No quiz sets found")
          : t("explore.noFlashcardSets", "No flashcard sets found")}
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
    <div className="min-h-screen bg-gray-50">
      {/* Category Header - Full Width */}
      <div className="w-full bg-gray-50 px-2 sm:px-4 py-4 sm:py-6">
        {!showAllCategories ? (
          // Main categories - 1 hàng
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {displayCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 !text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-900"
                }`}
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-lg">
                  {category.icon}
                </span>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(" ")[0]}</span>
              </button>
            ))}

            {/* Show More Button */}
            <button
              onClick={() => setShowAllCategories(true)}
              className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
            >
              <span className="mr-1 sm:mr-2 text-sm sm:text-lg">›</span>
              <span className="hidden sm:inline">{t("explore.categories.more")}</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        ) : (
          // All categories - 2 hàng đều nhau
          <div className="space-y-2">
            {/* Hàng 1 - 9 items đầu tiên */}
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              {displayCategories.slice(0, 9).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 !text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1 sm:mr-2 text-sm sm:text-lg">
                    {category.icon}
                  </span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">
                    {category.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Hàng 2 - 9 items còn lại + nút Less */}
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              {displayCategories.slice(9).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 !text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1 sm:mr-2 text-sm sm:text-lg">
                    {category.icon}
                  </span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">
                    {category.name.split(" ")[0]}
                  </span>
                </button>
              ))}

              {/* Show Less Button */}
              <button
                onClick={() => setShowAllCategories(false)}
                className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-lg">‹</span>
                <span className="hidden sm:inline">{t("explore.categories.less")}</span>
                <span className="sm:hidden">‹</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* ------------------------TEST------------------------------- */}
      <div className="ml-50">{/* <DogWalkLoading /> */}</div>
      {/* --------------------------------------------------------------- */}
      {/* Image Tab Navigation - Vertical Left Side */}
      <div className="w-full bg-gray-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Left Side - Vertical Image Navigation */}
          <div className="flex w-full h-21 space-y-4 mr-6 mt-13">
            {/* div bao quanh 2 cai nut  */}
            <div className="flex justify-center items-center w-full h-full gap-8">
              {/* Quiz Tab */}
              <div className="w-full h-full">
                {/* div bao quanh nut quiz  */}
                <div className="flex justify-end items-center h-full w-50%">
                  <div className="w-[40%] h-full relative">
                    <div
                      onClick={() => setActiveTab("quiz")}
                      className={`z-20 absolute cursor-pointer flex justify-center items-center bg-[#2F3353] h-full rounded-full py-1 px-2 w-[100%] transition-all duration-300 hover:bg-[#414990] hover:scale-105 ${
                        activeTab === "quiz" ? "scale-105 bg-[#414990]" : ""
                      }`}
                    >
                      <p className="!mb-0 font-bold !text-white !text-[35px] select-none">
                        {t("explore.categories.quiz")}
                      </p>
                    </div>

                    {/* logo con cho quiz  */}
                    <div
                      onClick={() => setActiveTab("quiz")}
                      className={`select-none z-10 absolute rotate-335 cursor-pointer transition-all duration-500 ${
                        activeTab === "quiz"
                          ? "top-[-67px] left-[-37px]"
                          : "top-[0px] left-[5px]"
                      }`}
                    >
                      <DogLogoExploreQuiz activeTab={activeTab} />
                    </div>
                    <div
                      onClick={() => setActiveTab("quiz")}
                      className={`select-none z-10 absolute rotate-20 cursor-pointer transition-all duration-500 ${
                        activeTab === "quiz"
                          ? "top-[-67px] right-[-37px]"
                          : "top-[0px] right-[5px]"
                      }`}
                    >
                      <DogLogoExploreQuiz activeTab={activeTab} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flashcard Tab */}
              <div className="w-full h-full">
                {/* div bao quanh nut flashcard  */}
                <div className="flex justify-baseline items-center h-full w-50%">
                  <div className="w-[40%] h-full relative">
                    <div
                      onClick={() => setActiveTab("flashcard")}
                      className={`z-20 absolute cursor-pointer flex justify-center items-center bg-[#2F3353] h-full rounded-full py-1 px-2 w-full transition-all duration-300 hover:bg-[#414990] hover:scale-105 ${
                        activeTab === "flashcard"
                          ? "scale-105 bg-[#414990]"
                          : ""
                      }`}
                    >
                      <p className="!mb-0 font-bold !text-white !text-[35px] select-none">
                        {t("explore.categories.flashcard")}
                      </p>
                    </div>
                    {/* lo go con cho flashcard  */}
                    <div
                      onClick={() => setActiveTab("flashcard")}
                      className={`select-none z-10 absolute rotate-15 cursor-pointer transition-all duration-500 ${
                        activeTab === "flashcard"
                          ? "top-[-67px] right-[-30px]"
                          : "top-[0px] right-[5px]"
                      }`}
                    >
                      <div className="relative">
                        <DogLogoExploreFlashcard activeTab={activeTab} />
                      </div>
                      <div className="text-center mt-1"></div>
                    </div>
                    <div
                      onClick={() => setActiveTab("flashcard")}
                      className={`select-none z-10 absolute rotate-335 cursor-pointer transition-all duration-500 ${
                        activeTab === "flashcard"
                          ? "top-[-67px] left-[-30px]"
                          : "top-[0px] left-[5px]"
                      }`}
                    >
                      <div className="relative">
                        <DogLogoExploreFlashcard activeTab={activeTab} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content Area */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {t("explore.resultsCount", "Showing")} {filteredData.length}{" "}
                {activeTab === "quiz"
                  ? t("explore.quizSets", "quiz sets")
                  : t("explore.flashcardSets", "flashcard sets")}
                {selectedCategory !== "ALL" &&
                  ` in ${
                    displayCategories.find((cat) => cat.id === selectedCategory)
                      ?.name
                  }`}
              </p>
            </div>

            {/* Content Grid */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item) =>
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
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
