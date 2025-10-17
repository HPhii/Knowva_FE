import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BrainCircuit, BookCopy, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import NotFoundImage from "../../assets/images/NotFound.png";
import QuizCard from "../../components/QuizCard";
import FlashcardCard from "../../components/FlashcardCard";

const SearchResult = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [results, setResults] = useState({
    quizSets: [],
    flashcardSets: [],
    users: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    
    setSearchTerm(term);
    setSearchType(type);
    
    if (term) {
      performSearch(term, type);
    }
  }, [searchParams]);

  const performSearch = async (term, type = "all") => {
    setLoading(true);
    try {
      const searchPromises = [];
      
      if (type === "all" || type === "quiz") {
        searchPromises.push(
          api.get("/search/quiz-sets", {
            params: { keyword: term, page: 0, size: 20 }
          }).then(res => res.data.quizSets || [])
        );
      } else {
        searchPromises.push(Promise.resolve([]));
      }
      
      if (type === "all" || type === "flashcard") {
        searchPromises.push(
          api.get("/search/flashcard-sets", {
            params: { keyword: term, page: 0, size: 20 }
          }).then(res => res.data.flashcardSets || [])
        );
      } else {
        searchPromises.push(Promise.resolve([]));
      }
      
      if (type === "all" || type === "user") {
        searchPromises.push(
          api.get("/search/accounts", {
            params: { keyword: term, page: 0, size: 20 }
          }).then(res => res.data.accounts || [])
        );
      } else {
        searchPromises.push(Promise.resolve([]));
      }

      const [quizSets, flashcardSets, users] = await Promise.all(searchPromises);
      
      // Filter quiz and flashcard results to only show PUBLIC visibility
      const filteredQuizSets = (quizSets || []).filter(item => 
        (item.visibility || item.visibilityStatus) === "PUBLIC"
      );
      const filteredFlashcardSets = (flashcardSets || []).filter(item => 
        (item.visibility || item.visibilityStatus) === "PUBLIC"
      );
      
      // Filter out ADMIN users from search results
      const filteredUsers = (users || []).filter(user => user.role !== 'ADMIN');
      
      setResults({
        quizSets: filteredQuizSets,
        flashcardSets: filteredFlashcardSets,
        users: filteredUsers
      });
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ quizSets: [], flashcardSets: [], users: [] });
    } finally {
      setLoading(false);
    }
  };


  const handleResultClick = (item, type) => {
    if (type === "quiz") {
      navigate(`/quiz/${item.id}`);
    } else if (type === "flashcard") {
      navigate(`/study-flashcard/${item.id}`);
    } else if (type === "user") {
      // Navigate to user detail page instead of showing modal
      navigate(`/users/${item.userId || item.accountId}`);
    }
  };


  // Handle view actions for cards
  const handleViewQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleViewFlashcard = (flashcard) => {
    navigate(`/study-flashcard/${flashcard.id}`);
  };

  const getTotalResults = () => {
    if (searchType === "quiz") return results.quizSets.length;
    if (searchType === "flashcard") return results.flashcardSets.length;
    if (searchType === "user") return results.users.length;
    return results.quizSets.length + results.flashcardSets.length + results.users.length;
  };

  const getCurrentResults = () => {
    if (searchType === "quiz") return results.quizSets;
    if (searchType === "flashcard") return results.flashcardSets;
    if (searchType === "user") return results.users;
    return [];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };


  // User Card Component (only for user results)
  const UserCard = ({ item }) => {
    return (
      <div
        onClick={() => handleResultClick(item, "user")}
        className="bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-white shadow-sm">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Người dùng
              </span>
            </div>
            {item.createdAt && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {formatDate(item.createdAt)}
              </span>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center space-x-3 mb-3">
            {item.avatarUrl ? (
              <img
                src={item.avatarUrl}
                alt={item.fullName || item.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-sm">
                {(item.fullName || item.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {item.fullName || item.username}
              </h3>
              <p className="text-sm text-gray-600">
                @{item.username}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {item.email || "Không có mô tả"}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{item.role || "User"}</span>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === "ACTIVE" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {item.status === "ACTIVE" ? "Hoạt động" : item.status}
              </span>
              {item.isVerified && (
                <span className="flex items-center space-x-1 text-blue-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Đã xác thực</span>
                </span>
              )}
            </div>
            <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Xem chi tiết →
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Kết quả tìm kiếm</h1>
              <p className="text-sm text-gray-600 mt-1">
                {getTotalResults() > 0 ? (
                  <>Tìm thấy {getTotalResults()} kết quả cho "<span className="font-semibold text-gray-900">{searchTerm}</span>"</>
                ) : (
                  <>Không tìm thấy kết quả nào cho "<span className="font-semibold text-gray-900">{searchTerm}</span>"</>
                )}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tìm kiếm...</span>
          </div>
        ) : getTotalResults() === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img 
                src={NotFoundImage} 
                alt="Không tìm thấy kết quả" 
                className="w-64 h-64 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-500 mb-6">
                Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>💡 Gợi ý:</p>
                <p>• Kiểm tra chính tả từ khóa</p>
                <p>• Thử từ khóa ngắn gọn hơn</p>
                <p>• Sử dụng từ đồng nghĩa</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show results based on search type */}
            {searchType === "all" ? (
              <>
                {/* Quiz Results */}
                {results.quizSets.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BrainCircuit className="w-5 h-5 text-blue-500 mr-2" />
                      Quiz Sets ({results.quizSets.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.quizSets.map((item) => (
                        <QuizCard
                          key={item.id}
                          quiz={item}
                          onView={handleViewQuiz}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Flashcard Results */}
                {results.flashcardSets.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BookCopy className="w-5 h-5 text-green-500 mr-2" />
                      Flashcard Sets ({results.flashcardSets.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.flashcardSets.map((item) => (
                        <FlashcardCard
                          key={item.id}
                          flashcard={item}
                          onView={handleViewFlashcard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* User Results */}
                {results.users.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 text-purple-500 mr-2" />
                      Người dùng ({results.users.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.users.map((item) => (
                        <UserCard key={item.accountId} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Show specific type results */
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  {searchType === "quiz" && <BrainCircuit className="w-5 h-5 text-blue-500 mr-2" />}
                  {searchType === "flashcard" && <BookCopy className="w-5 h-5 text-green-500 mr-2" />}
                  {searchType === "user" && <Users className="w-5 h-5 text-purple-500 mr-2" />}
                  {searchType === "quiz" && `Quiz Sets (${results.quizSets.length})`}
                  {searchType === "flashcard" && `Flashcard Sets (${results.flashcardSets.length})`}
                  {searchType === "user" && `Người dùng (${results.users.length})`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchType === "quiz" && results.quizSets.map((item) => (
                    <QuizCard
                      key={item.id}
                      quiz={item}
                      onView={handleViewQuiz}
                    />
                  ))}
                  {searchType === "flashcard" && results.flashcardSets.map((item) => (
                    <FlashcardCard
                      key={item.id}
                      flashcard={item}
                      onView={handleViewFlashcard}
                    />
                  ))}
                  {searchType === "user" && results.users.map((item) => (
                    <UserCard 
                      key={item.accountId} 
                      item={item}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchResult;
