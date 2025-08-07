import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined, MobileOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";

const Explore = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [contentType, setContentType] = useState("quiz"); // quiz, flashcard, test
  const [sortType, setSortType] = useState("newest"); // newest, mostViewed, topRated
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for quizzes/templates
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      category: "programming",
      difficulty: "beginner",
      questions: 20,
      time: "30 min",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free"
    },
    {
      id: 2,
      title: "React Development",
      category: "programming",
      difficulty: "intermediate",
      questions: 25,
      time: "45 min",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free"
    },
    {
      id: 3,
      title: "Data Structures",
      category: "computer-science",
      difficulty: "advanced",
      questions: 30,
      time: "60 min",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free"
    },
    {
      id: 4,
      title: "Web Design Principles",
      category: "design",
      difficulty: "beginner",
      questions: 15,
      time: "25 min",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: true,
      isMobileOptimized: true,
      price: "Free"
    },
    {
      id: 5,
      title: "Database Management",
      category: "computer-science",
      difficulty: "intermediate",
      questions: 22,
      time: "40 min",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
      isNew: false,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free"
    },
    {
      id: 6,
      title: "UI/UX Design",
      category: "design",
      difficulty: "intermediate",
      questions: 18,
      time: "35 min",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      isNew: true,
      isPopular: false,
      isMobileOptimized: true,
      price: "Free"
    }
  ]);

  const categories = [
    { id: "all", name: "All", icon: "📚" },
    { id: "programming", name: "Programming", icon: "💻" },
    { id: "computer-science", name: "Computer Science", icon: "🔬" },
    { id: "design", name: "Design", icon: "🎨" },
    { id: "mathematics", name: "Mathematics", icon: "📐" },
    { id: "languages", name: "Languages", icon: "🌍" }
  ];

  // Lọc dữ liệu theo contentType (ở đây chỉ có quiz, bạn có thể mở rộng sau)
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory;
    // Giả lập: chỉ hiển thị quiz nếu contentType là quiz
    const matchesType = contentType === "quiz"; // sau này mở rộng thêm flashcard, test
    return matchesSearch && matchesCategory && matchesType;
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
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left Sidebar */}
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

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t("explore.categories", "Categories")}
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:pl-8 mt-8 lg:mt-0">
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
                        {quiz.difficulty}
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
