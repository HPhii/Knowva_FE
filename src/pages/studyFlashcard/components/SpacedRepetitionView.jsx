import React from "react";
import { Card, Button, Spin, Progress, message } from "antd";
import { useTranslation } from "react-i18next";
import PerformanceChart from "./PerformanceChart";

const SpacedRepetitionView = ({
  isSpacedRepetitionLoading,
  isSpacedRepetitionSetup,
  isSpacedRepetitionCompleted,
  currentReviewCard,
  reviewCards,
  showSpacedAnswer,
  performanceStats,
  onShowCardLimitModal,
  onLoadSpacedRepetitionSession,
  onSpacedAnswerReveal,
  onSpacedRepetitionRating,
}) => {
  const { t } = useTranslation();
  if (isSpacedRepetitionLoading) {
    // Loading screen during delay
    return (
      <div className="text-center">
        <div className="mb-6">
          <Spin size="large" />
        </div>
        <p className="text-gray-600 text-lg">
          {t("studyFlashcard.spacedRepetition.session.loading")}
        </p>
      </div>
    );
  }

  if (!currentReviewCard && !isSpacedRepetitionSetup) {
    // Start screen - show setup modal
    return (
      <div className="text-center">
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            {t("studyFlashcard.spacedRepetition.setup.description")}
          </p>
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            onClick={onShowCardLimitModal}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🚀 {t("studyFlashcard.spacedRepetition.setup.start")}
          </Button>
        </div>
      </div>
    );
  }

  if (
    !currentReviewCard &&
    (isSpacedRepetitionSetup || isSpacedRepetitionCompleted)
  ) {
    // Setup completed but no cards available or session completed
    return (
      <div className="text-center">
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            {isSpacedRepetitionCompleted
              ? "🎉 Bạn đã hoàn thành tất cả thẻ học hôm nay! Quay lại ngày mai để tiếp tục."
              : "Không có flashcard nào để học trong phiên này. Bạn có thể thử lại sau."}
          </p>
        </div>

        {/* Performance Stats Chart - only show when completed */}
        {isSpacedRepetitionCompleted && performanceStats && (
          <div className="mb-6">
            <div className="flex justify-center items-center gap-8">
              <PerformanceChart stats={performanceStats} />

              {/* Stats breakdown */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#FDBB6B]">
                    <span className="font-semibold text-[#924E12]">
                      Don't know
                    </span>{" "}
                  </div>
                  <span className="text-gray-700">
                    cards to study again –{" "}
                    {Math.round(
                      ((100 - performanceStats.retentionRate) / 100) *
                        performanceStats.totalAttempts
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#A4F07F]">
                    <span className="font-semibold text-[#1F780E]">Know</span>{" "}
                  </div>
                  <span className="text-gray-700">
                    cards to study again –{" "}
                    {Math.round(
                      (performanceStats.retentionRate / 100) *
                        performanceStats.totalAttempts
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isSpacedRepetitionCompleted && (
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              onClick={onLoadSpacedRepetitionSession}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🔄 Tải lại phiên học
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Review session
  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {reviewCards.findIndex((card) => card.id === currentReviewCard.id) +
              1}{" "}
            / {reviewCards.length}
          </span>
        </div>
        <Progress
          percent={Math.round(
            ((reviewCards.findIndex(
              (card) => card.id === currentReviewCard.id
            ) +
              1) /
              reviewCards.length) *
              100
          )}
          strokeColor="#285AFF"
          trailColor="#f0f0f0"
          showInfo={false}
        />
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-8">
        <div
          className="flashcard-container w-full max-w-2xl"
          onClick={() => onSpacedAnswerReveal(!showSpacedAnswer)}
        >
          <div
            className={`flashcard-inner ${showSpacedAnswer ? "flipped" : ""}`}
          >
            {/* Front side - Question */}
            <div className="flashcard-side front">
              <Card
                className="w-full h-full shadow-lg flashcard-question"
                bodyStyle={{
                  padding: "2rem",
                  height: "100%",
                  minHeight: "300px",
                }}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-[24px] leading-relaxed text-gray-800">
                    {currentReviewCard.front}
                  </div>
                </div>
              </Card>
            </div>

            {/* Back side - Answer */}
            <div className="flashcard-side back">
              <Card
                className="w-full h-full shadow-lg flashcard-answer"
                bodyStyle={{
                  padding: "2rem",
                  height: "100%",
                  minHeight: "300px",
                }}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-[24px] leading-relaxed text-gray-800">
                    {currentReviewCard.back}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons - 5 levels */}
      <div className="text-center">
        <div className="mb-4">
          <p className="text-gray-600 text-lg mb-2">
            Bạn nhớ câu trả lời như thế nào?
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 flex-wrap">
          {/* Level 1: Không nhớ */}
          <div
            className="cursor-pointer rounded-full border-2 border-red-400 bg-red-50 hover:bg-red-100 p-3 transition-all duration-200 min-w-[80px]"
            onClick={() => onSpacedRepetitionRating(1)}
          >
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-1">😞</div>
              <div className="text-red-600 text-xs font-medium">Không nhớ</div>
            </div>
          </div>

          {/* Level 2: Mơ hồ */}
          <div
            className="cursor-pointer rounded-full border-2 border-orange-400 bg-orange-50 hover:bg-orange-100 p-3 transition-all duration-200 min-w-[80px]"
            onClick={() => onSpacedRepetitionRating(2)}
          >
            <div className="text-center">
              <div className="text-orange-500 text-2xl mb-1">😕</div>
              <div className="text-orange-600 text-xs font-medium">Mơ hồ</div>
            </div>
          </div>

          {/* Level 3: Nhớ chậm */}
          <div
            className="cursor-pointer rounded-full border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100 p-3 transition-all duration-200 min-w-[80px]"
            onClick={() => onSpacedRepetitionRating(3)}
          >
            <div className="text-center">
              <div className="text-yellow-500 text-2xl mb-1">🤔</div>
              <div className="text-yellow-600 text-xs font-medium">
                Nhớ chậm
              </div>
            </div>
          </div>

          {/* Level 4: Nhớ */}
          <div
            className="cursor-pointer rounded-full border-2 border-green-400 bg-green-50 hover:bg-green-100 p-3 transition-all duration-200 min-w-[80px]"
            onClick={() => onSpacedRepetitionRating(4)}
          >
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-1">😊</div>
              <div className="text-green-600 text-xs font-medium">Nhớ</div>
            </div>
          </div>

          {/* Level 5: Nhớ rất rõ */}
          <div
            className="cursor-pointer rounded-full border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 p-3 transition-all duration-200 min-w-[80px]"
            onClick={() => onSpacedRepetitionRating(5)}
          >
            <div className="text-center">
              <div className="text-blue-500 text-2xl mb-1">😎</div>
              <div className="text-blue-600 text-xs font-medium">
                Nhớ rất rõ
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="text-sm text-gray-500">
            {reviewCards.findIndex((card) => card.id === currentReviewCard.id) +
              1}{" "}
            / {reviewCards.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetitionView;
