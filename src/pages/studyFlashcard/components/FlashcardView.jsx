import React from "react";
import { Card, message } from "antd";
import { useTranslation } from "react-i18next";
import FlashcardList from "./FlashcardList";

const FlashcardView = ({
  flashcardSet,
  currentCardIndex,
  showAnswer,
  onShowAnswer,
  onNextCard,
  onPreviousCard,
}) => {
  const { t } = useTranslation();
  // Sort flashcards by order ascending before rendering
  const sortedFlashcards = [...flashcardSet.flashcards].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const currentCard = sortedFlashcards[currentCardIndex];
  const isLastCard = currentCardIndex === sortedFlashcards.length - 1;

  const handleNextCard = () => {
    if (currentCardIndex < flashcardSet.flashcards.length - 1) {
      onNextCard();
    } else {
      message.success("Bạn đã hoàn thành tất cả flashcard!");
    }
  };

  return (
    <>
      {/* Flashcard */}
      <div className="flex justify-center mb-8">
        <div className="flashcard-container" onClick={onShowAnswer}>
          <div className={`flashcard-inner ${showAnswer ? "flipped" : ""}`}>
            {/* Front side - Question */}
            <div className="flashcard-side front">
              <Card
                className="w-full h-full shadow-lg flashcard-question"
                bodyStyle={{ padding: "2rem", height: "100%" }}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-[24px] leading-relaxed text-gray-800">
                    {currentCard.front}
                  </div>
                </div>
              </Card>
            </div>

            {/* Back side - Answer */}
            <div className="flashcard-side back">
              <Card
                className="w-full h-full shadow-lg flashcard-answer"
                bodyStyle={{ padding: "2rem", height: "100%" }}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-[24px] leading-relaxed text-gray-800">
                    {currentCard.back}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation UI */}
      <div className="flex justify-center">
        <div className="flex items-center">
          {/* Previous Button */}
          <button
            onClick={onPreviousCard}
            disabled={currentCardIndex === 0}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              currentCardIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Current Card Counter */}
          <div className="text-black text-lg font-medium px-4">
            {currentCardIndex + 1} / {sortedFlashcards.length}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextCard}
            disabled={isLastCard}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isLastCard
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Flashcard List */}
      <FlashcardList flashcardSet={flashcardSet} />
    </>
  );
};

export default FlashcardView;
