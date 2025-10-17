import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";

const FlashcardSet = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get user ID from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    fetchFlashcardSets();
  }, [location.pathname, id]);

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine if we're viewing current user or another user
      const isViewingOtherUser = id && id !== "me";
      setIsCurrentUser(!isViewingOtherUser);
      
      let response;
      if (isViewingOtherUser) {
        // Get public flashcard sets of another user
        response = await api.get(`/flashcard-sets/user/${id}`);
        // Filter only PUBLIC visibility flashcard sets
        const publicFlashcardSets = (response.data || []).filter(flashcard => 
          (flashcard.visibility || flashcard.visibilityStatus) === "PUBLIC"
        );
        setFlashcardSets(publicFlashcardSets);
      } else {
        // Get current user's flashcard sets
        response = await api.get("/flashcard-sets/my-flashcard-sets");
        setFlashcardSets(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching flashcard sets:", err);
      setError(err.response?.data?.message || t("userDetailsPage.flashcardSet.cannotLoadFlashcardSets"));
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component (vertical list style)
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="text-red-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Có lỗi xảy ra
      </h3>
      <p className="text-red-600 mb-4">
        {error}
      </p>
      <button
        onClick={fetchFlashcardSets}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        {t("userDetailsPage.flashcardSet.tryAgain")}
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="bg-gray-50 rounded-xl p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isCurrentUser 
          ? (t("noFlashcardSets") || "No Flashcard Sets Available")
          : t("userDetailsPage.flashcardSet.noPublicFlashcards")
        }
      </h3>
      <p className="text-gray-500 mb-6">
        {isCurrentUser 
          ? "Bạn chưa có bộ flashcard nào. Hãy bắt đầu tạo flashcard để học tập hiệu quả!"
          : t("userDetailsPage.flashcardSet.noPublicFlashcardsDesc")
        }
      </p>
      {isCurrentUser && (
        <button
          onClick={() => navigate('/flashcards')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t("userDetailsPage.flashcardSet.createNewFlashcard")}</span>
        </button>
      )}
    </div>
  );

  // Handle flashcard set card click
  const handleFlashcardSetClick = (flashcardSet) => {
    const flashcardId = flashcardSet.id || flashcardSet._id;
    if (flashcardId) {
      navigate(`/flashcard/${flashcardId}`);
    }
  };

  // Flashcard set card component (vertical list item)
  const FlashcardSetCard = ({ flashcardSet }) => (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-blue-300 cursor-pointer transition-all duration-200"
      onClick={() => handleFlashcardSetClick(flashcardSet)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
            {flashcardSet.title || flashcardSet.name || "Flashcard không có tiêu đề"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {flashcardSet.description || "Không có mô tả"}
          </p>
        </div>
        <div className="flex flex-col items-end text-sm text-gray-600">
          <span className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {(() => {
              // Tính số card dựa trên ID lớn nhất trong danh sách flashcards (giống FlashcardCard)
              if (flashcardSet.flashcards && Array.isArray(flashcardSet.flashcards) && flashcardSet.flashcards.length > 0) {
                const maxId = Math.max(...flashcardSet.flashcards.map(card => card.id || 0));
                return maxId;
              }
              // Fallback về các field khác nếu không có flashcards array
              return flashcardSet.maxQuestion || flashcardSet.cardCount || flashcardSet.maxFlashcards || flashcardSet.flashcardCount || flashcardSet.cards?.length || 0;
            })()} thẻ
          </span>
          <span className="text-xs text-gray-400">
            {flashcardSet.createdAt ? new Date(flashcardSet.createdAt).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isCurrentUser 
            ? (t("flashcardSet") || "Flashcard Sets")
            : "Flashcard công khai"
          }
        </h3>
        <p className="text-gray-600 text-sm">
          {isCurrentUser 
            ? (t("flashcardSetDescription") || "Create and manage your flashcard sets for effective learning")
            : "Các flashcard được công khai của người dùng này"
          }
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage />
      ) : flashcardSets.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {flashcardSets.map((flashcardSet) => (
            <FlashcardSetCard key={flashcardSet.id || flashcardSet._id} flashcardSet={flashcardSet} />
          ))}
        </div>
      )}

      {/* Floating Add Button - Only show for current user */}
      {isCurrentUser && (
        <button
          onClick={() => navigate('/flashcards')}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
          title="Tạo flashcard mới"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FlashcardSet;
