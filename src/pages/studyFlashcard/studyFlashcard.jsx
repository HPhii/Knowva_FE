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
    }
  }, [id]);

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

      // Save into flashcardSet as requested
      setFlashcardSet({ flashcards: normalizedFlashcards });

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

      // Save into flashcardSet as requested
      setFlashcardSet({ flashcards: normalizedFlashcards });

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
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={2} className="!mb-2">
                {flashcardSet.title || flashcardSet.name}
              </Title>
            </div>

            <Button
              icon={<RotateLeftOutlined />}
              onClick={handleRestart}
              type="default"
            >
              {t("studyFlashcard.restart")}
            </Button>
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
      </div>
    </div>
  );
};

export default StudyFlashcard;
