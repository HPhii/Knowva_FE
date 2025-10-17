import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Spin, message, Typography, Modal } from "antd";
import { RotateLeftOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import "./studyFlashcard.scss";
import ExamMode from "./components/ExamMode";
import TabBar from "./components/TabBar";
import FlashcardView from "./components/FlashcardView";
import SpacedRepetitionView from "./components/SpacedRepetitionView";
import CardLimitModal from "./components/CardLimitModal";
import NextDayNotificationModal from "./components/NextDayNotificationModal";
import InviteModal from "../../components/InviteModal";
import CommentSection from "../../components/CommentSection";
import { getLoginData } from "../../utils/auth";

const { Title } = Typography;

const StudyFlashcard = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState(new Set());
  const [activeTab, setActiveTab] = useState("flashcards");

  // Spaced Repetition states
  const [currentReviewCard, setCurrentReviewCard] = useState(null);
  const [showSpacedAnswer, setShowSpacedAnswer] = useState(false);
  const [cardLimit, setCardLimit] = useState(5);
  const [reviewCards, setReviewCards] = useState([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tempCardLimit, setTempCardLimit] = useState(5);
  const [isSpacedRepetitionSetup, setIsSpacedRepetitionSetup] = useState(false);
  const [nextDayNotiModal, setNextDayNotiModal] = useState(false);
  const [modeDataResult, setModeDataResult] = useState(null);

  // console.log("modeDataResult: ", modeDataResult);

  const [isSpacedRepetitionLoading, setIsSpacedRepetitionLoading] =
    useState(false);
  const [isSpacedRepetitionCompleted, setIsSpacedRepetitionCompleted] =
    useState(false);
  const [performanceStats, setPerformanceStats] = useState(null);
  
  // User and invite states
  const [currentUser, setCurrentUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  
  // Copy link state
  const [copyMessage, setCopyMessage] = useState("");
  
  // Share dropdown state
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isShareDropdownOpen && !event.target.closest('.share-dropdown')) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareDropdownOpen]);

  // Fetch flashcard set data
  const fetchFlashcardSet = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/flashcard-sets/${id}`);
      setFlashcardSet(response.data);
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      message.error(t("studyFlashcard.errors.loadError"));
      navigate("/my-library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFlashcardSet();
      checkSpacedRepetitionSetup();
      checkUserPermissions();
      fetchComments();
    }
  }, [id]);

  // Check user permissions for editing
  const checkUserPermissions = () => {
    try {
      const loginData = getLoginData();
      console.log("Login data from localStorage:", loginData);
      
      if (loginData) {
        // Try multiple ways to get userId
        const userId = loginData.userId || loginData.user?.id || loginData.user?.userId || loginData.id;
        console.log("Extracted userId:", userId);
        
        if (userId) {
          setCurrentUser({
            ...loginData,
            userId: userId,
            id: userId
          });
        }
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  // Check if current user can edit this flashcard set
  useEffect(() => {
    if (flashcardSet && currentUser) {
      const flashcardUserId = flashcardSet.userId || flashcardSet.authorId || flashcardSet.createdBy;
      const currentUserId = currentUser.userId || currentUser.id;
      
      // Convert both to strings for comparison to handle number/string mismatches
      const flashcardUserIdStr = String(flashcardUserId || '');
      const currentUserIdStr = String(currentUserId || '');
      
      console.log("Checking edit permissions:", {
        flashcardSet: flashcardSet,
        currentUser: currentUser,
        flashcardUserId,
        currentUserId,
        flashcardUserIdStr,
        currentUserIdStr,
        canEdit: flashcardUserIdStr === currentUserIdStr,
        strictEqual: flashcardUserId === currentUserId
      });
      
      setCanEdit(flashcardUserIdStr === currentUserIdStr && flashcardUserIdStr !== '');
    }
  }, [flashcardSet, currentUser]);

  // Handle invite success
  const handleInviteSuccess = () => {
    // You can add any additional logic here after successful invitation
    console.log('Invitation sent successfully');
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'https://knowva.me';
      let link = `${baseUrl}/flashcard/${id}`;
      
      // Check visibility and add token if needed
      if (flashcardSet.visibility === 'HIDDEN' && flashcardSet.accessToken) {
        link += `?token=${flashcardSet.accessToken}`;
      } else if (flashcardSet.visibility === 'PRIVATE') {
        setCopyMessage("Set này là riêng tư, hãy dùng chức năng 'Mời' để chia sẻ.");
        return;
      }
      
      await navigator.clipboard.writeText(link);
      setCopyMessage("Đã sao chép link!");
      setTimeout(() => setCopyMessage(""), 3000);
      setIsShareDropdownOpen(false); // Close dropdown after copying
    } catch (error) {
      console.error('Error copying link:', error);
      setCopyMessage("Không thể sao chép link");
      setTimeout(() => setCopyMessage(""), 3000);
    }
  };

  // Handle invite from share dropdown
  const handleInviteFromShare = () => {
    setIsInviteModalOpen(true);
    setIsShareDropdownOpen(false); // Close dropdown
  };

  // Fetch comments for the flashcard set
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      console.log('Fetching comments for flashcard set:', id);
      const response = await api.get(`/interactions/flashcardset/${id}/comments`);
      console.log('Comments API response:', response.data);
      
      // Ensure we always set an array
      const commentsData = response.data;
      if (Array.isArray(commentsData)) {
        setComments(commentsData);
        console.log('Set comments (array):', commentsData);
      } else if (commentsData && Array.isArray(commentsData.content)) {
        setComments(commentsData.content);
        console.log('Set comments (content):', commentsData.content);
      } else if (commentsData && Array.isArray(commentsData.comments)) {
        setComments(commentsData.comments);
        console.log('Set comments (nested):', commentsData.comments);
      } else {
        console.log('API response format:', commentsData);
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      console.error("Error details:", err.response?.data);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Handle adding new comment
  const handleAddComment = (newComment) => {
    if (newComment.parentId) {
      // This is a reply - find parent and add to replies
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === newComment.parentId 
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        )
      );
    } else {
      // This is a new parent comment
      setComments(prevComments => [newComment, ...prevComments]);
    }
  };

  // Handle refreshing comments
  const handleRefreshComments = () => {
    fetchComments();
  };

  // Check if spaced repetition has been setup for this flashcard set
  const checkSpacedRepetitionSetup = () => {
    const setupKey = `spaced-repetition-setup-${id}`;
    const completedKey = `spaced-repetition-completed-${id}`;
    const statsKey = `performance-stats-${id}`;
    const today = new Date().toDateString();

    const isSetup = localStorage.getItem(setupKey) === "true";
    const completedDate = localStorage.getItem(completedKey);
    const completedToday = completedDate === today;

    // If completed on a different day, clear the completion status and stats
    if (completedDate && completedDate !== today) {
      localStorage.removeItem(completedKey);
      localStorage.removeItem(statsKey);
    } else if (completedToday) {
      // If completed today, load saved performance stats
      const savedStats = localStorage.getItem(statsKey);
      if (savedStats) {
        try {
          setPerformanceStats(JSON.parse(savedStats));
        } catch (error) {
          console.error("Error parsing saved performance stats:", error);
        }
      }
    }

    setIsSpacedRepetitionSetup(isSetup);
    setIsSpacedRepetitionCompleted(completedToday);
  };

  // Save spaced repetition setup status
  const saveSpacedRepetitionSetup = (cardLimit) => {
    const setupKey = `spaced-repetition-setup-${id}`;
    localStorage.setItem(setupKey, "true");
    localStorage.setItem(`spaced-repetition-limit-${id}`, cardLimit.toString());
    setIsSpacedRepetitionSetup(true);
  };

  // Fetch performance stats
  const fetchPerformanceStats = async () => {
    try {
      const response = await api.get("/spaced-repetition/performance-stats", {
        params: {
          userId: localStorage.getItem("userId") || "1",
          flashcardSetId: id,
        },
      });
      setPerformanceStats(response.data);

      // Save to localStorage to persist when navigating back
      const statsKey = `performance-stats-${id}`;
      localStorage.setItem(statsKey, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching performance stats:", error);
      message.error(t("studyFlashcard.errors.performanceError"));
    }
  };

  // Load spaced repetition session automatically
  const loadSpacedRepetitionSession = async () => {
    try {
      // Clear completion status and performance stats when starting new session
      const completedKey = `spaced-repetition-completed-${id}`;
      const statsKey = `performance-stats-${id}`;
      localStorage.removeItem(completedKey);
      localStorage.removeItem(statsKey);
      setIsSpacedRepetitionCompleted(false);
      setPerformanceStats(null);

      const savedLimit = localStorage.getItem(`spaced-repetition-limit-${id}`);
      if (savedLimit) {
        setCardLimit(parseInt(savedLimit));
      }

      // Start session to get flashcards (mode-data already called in handleTabChange)
      const startSessionRes = await api.get(
        "/spaced-repetition/start-session",
        {
          params: {
            userId: localStorage.getItem("userId") || "1",
            flashcardSetId: id,
          },
        }
      );

      // Normalize flashcards from response
      const sessionData = startSessionRes?.data;
      const normalizedFlashcards = Array.isArray(sessionData)
        ? sessionData
        : sessionData?.flashcards || [];

      // Save into flashcardSet while preserving existing metadata (owner, visibility, etc.)
      setFlashcardSet((prev) => ({ ...(prev || {}), flashcards: normalizedFlashcards }));

      // Initialize review session from API data
      setReviewCards(normalizedFlashcards);
      setCurrentReviewCard(normalizedFlashcards[0] || null);
      setIsSpacedRepetitionCompleted(false);
    } catch (error) {
      console.error("Error loading spaced repetition session:", error);
      // If there's an error, reset setup status
      const setupKey = `spaced-repetition-setup-${id}`;
      localStorage.removeItem(setupKey);
      setIsSpacedRepetitionSetup(false);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent page scroll
        handleShowAnswer();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        handlePreviousCard();
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        handleNextCard();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showAnswer, currentCardIndex, flashcardSet]); // Include dependencies

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) {
      setStudiedCards((prev) => new Set([...prev, currentCardIndex]));
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcardSet.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleCardSelect = (index) => {
    setCurrentCardIndex(index);
    setShowAnswer(false);
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudiedCards(new Set());
    setActiveTab("flashcards"); // Reset về tab Flashcards mặc định
  };

  // Handle tab change
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    // Reset flashcard state when switching tabs
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudiedCards(new Set());
    setShowSpacedAnswer(false);
    setCurrentReviewCard(null);

    // Only reset completion status if not switching to spaced repetition tab
    if (tabKey !== "spaced-repetition") {
      setIsSpacedRepetitionCompleted(false);
    }

    // Handle spaced repetition tab with delay
    if (tabKey === "spaced-repetition") {
      setIsSpacedRepetitionLoading(true);

      // Delay 1 second before showing content
      setTimeout(async () => {
        setIsSpacedRepetitionLoading(false);

        // Check completion status again when switching to tab
        checkSpacedRepetitionSetup();

        // Always call mode-data API first when entering spaced repetition tab
        try {
          const modeDataRes = await api.get("/spaced-repetition/mode-data", {
            params: {
              userId: localStorage.getItem("userId") || "1",
              flashcardSetId: id,
            },
          });
          setModeDataResult(modeDataRes?.data);

          // Decide flow using API firstTime flag and local completion cache
          const completedKey = `spaced-repetition-completed-${id}`;
          const statsKey = `performance-stats-${id}`;
          const today = new Date().toDateString();

          const completedDate = localStorage.getItem(completedKey);
          const completedToday = completedDate === today;

          if (completedToday) {
            setIsSpacedRepetitionSetup(true);
            setIsSpacedRepetitionCompleted(true);
            const savedStats = localStorage.getItem(statsKey);
            if (savedStats) {
              try {
                setPerformanceStats(JSON.parse(savedStats));
              } catch (e) {
                console.error("Error parsing saved performance stats:", e);
              }
            }
            // Do not show modal or load new session
            return;
          }

          const firstTime = Boolean(modeDataRes?.data?.firstTime);

          if (firstTime) {
            // First time: Show card limit modal for user to set up
            setIsSpacedRepetitionSetup(false);
            setTempCardLimit(cardLimit);
            setShowLimitModal(true);
          } else {
            // Not first time: Go straight into the session
            setNextDayNotiModal(true);
          }
          // If completed, just show the completion message
        } catch (error) {
          console.error("Error fetching mode data:", error);
          message.error(t("studyFlashcard.errors.modeDataError"));
        }
      }, 1000);
    }
  };

  // Show limit modal
  const showCardLimitModal = () => {
    setTempCardLimit(cardLimit);
    setShowLimitModal(true);
  };

  // Handle modal confirm
  const handleModalConfirm = async () => {
    try {
      // Step 1: Call API to save new flashcards per day
      await api.post("/spaced-repetition/set-new-flashcards-per-day", null, {
        params: {
          userId: localStorage.getItem("userId") || "1",
          flashcardSetId: id,
          newFlashcardsPerDay: tempCardLimit,
        },
      });

      // Step 2: Start session to get flashcards
      const startSessionRes = await api.get(
        "/spaced-repetition/start-session",
        {
          params: {
            userId: localStorage.getItem("userId") || "1",
            flashcardSetId: id,
          },
        }
      );

      // Normalize flashcards from response
      const sessionData = startSessionRes?.data;
      const normalizedFlashcards = Array.isArray(sessionData)
        ? sessionData
        : sessionData?.flashcards || [];

      // Save into flashcardSet while preserving existing metadata (owner, visibility, etc.)
      setFlashcardSet((prev) => ({ ...(prev || {}), flashcards: normalizedFlashcards }));

      // Initialize review session from API data
      setReviewCards(normalizedFlashcards);
      setCurrentReviewCard(normalizedFlashcards[0] || null);
      setIsSpacedRepetitionCompleted(false);

      setCardLimit(tempCardLimit);
      saveSpacedRepetitionSetup(tempCardLimit);
      setShowLimitModal(false);
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const errMsg = error?.response?.data || error?.message;

      console.log("status", status);
      console.log("errMsg", errMsg);
      console.log("error", error);

      // Kiểm tra nhiều điều kiện để đảm bảo popup hiển thị
      const isNoFlashcardsError =
        (status === 400 || status === 404) &&
        typeof errMsg === "string" &&
        (errMsg.includes("No flashcards available for study session") ||
          errMsg.includes("No flashcards available") ||
          errMsg.includes("no flashcards"));

      if (isNoFlashcardsError) {
        Modal.info({
          title: "Thông báo",
          content:
            errMsg ||
            "Không có flashcard nào để học trong phiên này. Bạn có thể thử lại sau hoặc kiểm tra lại bộ flashcard.",
          centered: true,
          okText: "Đóng",
        });
        setShowLimitModal(false);
        return;
      }

      // Fallback: Nếu không phải lỗi cụ thể, vẫn hiển thị popup nếu có từ khóa liên quan
      if (
        typeof errMsg === "string" &&
        errMsg.toLowerCase().includes("flashcard") &&
        (errMsg.toLowerCase().includes("no") ||
          errMsg.toLowerCase().includes("empty"))
      ) {
        Modal.info({
          title: "Thông báo",
          content: errMsg || "Không có flashcard nào để học trong phiên này.",
          centered: true,
          okText: "Đóng",
        });
        setShowLimitModal(false);
        return;
      }

      console.error("Error setting new flashcards per day:", error);
      message.error(errMsg || "Không thể lưu cài đặt. Vui lòng thử lại.");
    }
  };

  const handleNextDayModalConfirm = async () => {
    try {
      // Step 2: Start session to get flashcards
      const startSessionRes = await api.get(
        "/spaced-repetition/start-session",
        {
          params: {
            userId: localStorage.getItem("userId") || "1",
            flashcardSetId: id,
          },
        }
      );

      // Normalize flashcards from response
      const sessionData = startSessionRes?.data;
      const normalizedFlashcards = Array.isArray(sessionData)
        ? sessionData
        : sessionData?.flashcards || [];

      // Save into flashcardSet as requested
      setFlashcardSet({ flashcards: normalizedFlashcards });

      // Initialize review session from API data
      setReviewCards(normalizedFlashcards);
      setCurrentReviewCard(normalizedFlashcards[0] || null);
      setIsSpacedRepetitionCompleted(false);

      setCardLimit(tempCardLimit);
      saveSpacedRepetitionSetup(tempCardLimit);
      setNextDayNotiModal(false);
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const errMsg = error?.response?.data || error?.message;

      console.log("status", status);
      console.log("errMsg", errMsg);
      console.log("error", error);

      // Kiểm tra nhiều điều kiện để đảm bảo popup hiển thị
      const isNoFlashcardsError =
        (status === 400 || status === 404) &&
        typeof errMsg === "string" &&
        (errMsg.includes("No flashcards available for study session") ||
          errMsg.includes("No flashcards available") ||
          errMsg.includes("no flashcards"));

      if (isNoFlashcardsError) {
        Modal.info({
          title: "Thông báo",
          content:
            errMsg ||
            "Không có flashcard nào để học trong phiên này. Bạn có thể thử lại sau hoặc kiểm tra lại bộ flashcard.",
          centered: true,
          okText: "Đóng",
        });
        setNextDayNotiModal(false);
        return;
      }

      // Fallback: Nếu không phải lỗi cụ thể, vẫn hiển thị popup nếu có từ khóa liên quan
      if (
        typeof errMsg === "string" &&
        errMsg.toLowerCase().includes("flashcard") &&
        (errMsg.toLowerCase().includes("no") ||
          errMsg.toLowerCase().includes("empty"))
      ) {
        Modal.info({
          title: "Thông báo",
          content: errMsg || "Không có flashcard nào để học trong phiên này.",
          centered: true,
          okText: "Đóng",
        });
        setShowLimitModal(false);
        return;
      }

      console.error("Error setting new flashcards per day:", error);
      message.error(errMsg || "Không thể lưu cài đặt. Vui lòng thử lại.");
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setShowLimitModal(false);
    setNextDayNotiModal(false);
  };

  // Handle Spaced Repetition answer reveal
  const handleSpacedAnswerReveal = () => {
    setShowSpacedAnswer(true);
  };

  // Handle Spaced Repetition rating (1-5 quality scale)
  const handleSpacedRepetitionRating = async (quality) => {
    if (currentReviewCard) {
      try {
        // Call API to submit review
        await api.post("/spaced-repetition/submit-review", null, {
          params: {
            userId: localStorage.getItem("userId") || "1",
            flashcardId: currentReviewCard.id,
            flashcardSetId: id,
            quality: quality,
          },
        });

        // Move to next card
        const currentIndex = reviewCards.findIndex(
          (card) => card.id === currentReviewCard.id
        );

        if (currentIndex < reviewCards.length - 1) {
          setCurrentReviewCard(reviewCards[currentIndex + 1]);
        } else {
          setCurrentReviewCard(null);
          setReviewCards([]);
          setIsSpacedRepetitionCompleted(true);

          // Save completion status to localStorage
          const completedKey = `spaced-repetition-completed-${id}`;
          const today = new Date().toDateString();
          localStorage.setItem(completedKey, today);

          // Fetch performance stats
          await fetchPerformanceStats();

          message.success(
            "🎉 Chúc mừng! Bạn đã hoàn thành tất cả thẻ học hôm nay!"
          );
        }

        setShowSpacedAnswer(false);
      } catch (error) {
        console.error("Error submitting review:", error);
        message.error("Không thể lưu đánh giá. Vui lòng thử lại.");
      }
    }
  };

  const getProgressPercentage = () => {
    if (!flashcardSet || !flashcardSet.flashcards) return 0;
    return Math.round(
      (studiedCards.size / flashcardSet.flashcards.length) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
        <span className="ml-3">{t("studyFlashcard.loading")}</span>
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Title level={3}>{t("studyFlashcard.notFound")}</Title>
          <Button type="primary" onClick={() => navigate("/my-library")}>
            {t("studyFlashcard.backToLibrary")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          {/* Copy message */}
          {copyMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              copyMessage.includes('riêng tư') 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              {copyMessage}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={2} className="!mb-2 whitespace-nowrap">
                {flashcardSet.title || flashcardSet.name}
              </Title>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              {/* Secondary Actions - Restart + Share grouped on the right */}
              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                {/* Restart Button - icon only, purple, sits to the left of Share */}
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Bắt đầu lại"
                >
                  <RotateLeftOutlined />
                </button>

                <div className="relative group share-dropdown">
                  <button
                    onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Chia sẻ"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Chia sẻ
                  </div>

                  {/* Share Dropdown */}
                  {isShareDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <button
                        onClick={handleCopyLink}
                        disabled={flashcardSet.visibility === 'PRIVATE'}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors duration-200 flex items-center ${
                          flashcardSet.visibility === 'PRIVATE'
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </button>

                      {canEdit && (
                        <button
                          onClick={handleInviteFromShare}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          Mời người dùng
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content based on active tab */}
        {activeTab === "flashcards" && (
          <FlashcardView
            flashcardSet={flashcardSet}
            currentCardIndex={currentCardIndex}
            showAnswer={showAnswer}
            onShowAnswer={handleShowAnswer}
            onNextCard={handleNextCard}
            onPreviousCard={handlePreviousCard}
          />
        )}

        {/* Exam Mode Content */}
        {activeTab === "exam-mode" && (
          <div>
            <ExamMode flashcardSet={flashcardSet} />
          </div>
        )}

        {/* Spaced Repetition Content */}
        {activeTab === "spaced-repetition" && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
              <SpacedRepetitionView
                isSpacedRepetitionLoading={isSpacedRepetitionLoading}
                isSpacedRepetitionSetup={isSpacedRepetitionSetup}
                isSpacedRepetitionCompleted={isSpacedRepetitionCompleted}
                currentReviewCard={currentReviewCard}
                reviewCards={reviewCards}
                showSpacedAnswer={showSpacedAnswer}
                performanceStats={performanceStats}
                onShowCardLimitModal={showCardLimitModal}
                onLoadSpacedRepetitionSession={loadSpacedRepetitionSession}
                onSpacedAnswerReveal={handleSpacedAnswerReveal}
                onSpacedRepetitionRating={handleSpacedRepetitionRating}
              />
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mb-12">
          <CommentSection
            variant="flashcard"
            entityId={id}
            entityType="flashcardset"
            comments={comments}
            onAddComment={handleAddComment}
            isLoading={isLoadingComments}
            onRefreshComments={handleRefreshComments}
          />
        </div>

        {/* Modals */}
        <CardLimitModal
          open={showLimitModal}
          onOk={handleModalConfirm}
          onCancel={handleModalCancel}
          tempCardLimit={tempCardLimit}
          onCardLimitChange={(value) => setTempCardLimit(value || 1)}
        />

        <NextDayNotificationModal
          modeDataResult={modeDataResult}
          open={nextDayNotiModal}
          onOk={handleNextDayModalConfirm}
          onCancel={handleModalCancel}
        />

        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          entityId={id}
          entityType="flashcard"
          onInviteSuccess={handleInviteSuccess}
        />
      </div>
    </div>
  );
};

export default StudyFlashcard;
