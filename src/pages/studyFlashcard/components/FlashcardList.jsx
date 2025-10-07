import React from "react";
import { useTranslation } from "react-i18next";

const FlashcardList = ({ flashcardSet }) => {
  const { t } = useTranslation();

  // Sort flashcards by order ascending
  const sortedFlashcards = [...flashcardSet.flashcards].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div className="mt-15">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {t("studyFlashcard.flashcard.allCardsList", {
          count: sortedFlashcards.length,
        })}
      </h3>

      <div className="space-y-4">
        {sortedFlashcards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              {/* Card number */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {index + 1}
                </span>
              </div>

              {/* Card content */}
              <div className="flex-1 space-y-3">
                {/* Front side */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {t("studyFlashcard.flashcard.question")}:
                  </div>
                  <div className="text-gray-800 bg-blue-50 p-3 rounded-md">
                    {card.front}
                  </div>
                </div>

                {/* Back side */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {t("studyFlashcard.flashcard.answer")}:
                  </div>
                  <div className="text-gray-800 bg-green-50 p-3 rounded-md">
                    {card.back}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
