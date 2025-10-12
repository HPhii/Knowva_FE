import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import api from "../../../config/axios";

const ExamMode = ({ flashcardSet }) => {
  // console.log("flashcardSet: ", flashcardSet);

  const [cardsState, setCardsState] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sourceCards = Array.isArray(flashcardSet?.flashcards)
      ? flashcardSet.flashcards
      : [];
    // Sort cards by order ascending before setting state
    const sortedCards = [...sourceCards].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    setCardsState(sortedCards.map((c) => ({ ...c })));
    setCurrentIndex(0);
    setUserAnswer("");
  }, [flashcardSet]);

  const handleNext = () => {
    if (currentIndex < cardsState.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    const setId = flashcardSet?.id;
    const flashcardId = cardsState[currentIndex]?.id;
    if (!setId || !flashcardId) return;
    try {
      setSubmitting(true);
      const res = await api.post(`flashcard-sets/${setId}/exam-mode/submit`, {
        flashcardId,
        userAnswer: userAnswer || "",
      });
      console.log("res: ", res);
      message.success("Đã gửi câu trả lời");

      // Save result into current card
      const result = res?.data || {};
      setCardsState((prev) => {
        const next = [...prev];
        if (next[currentIndex]) {
          next[currentIndex] = {
            ...next[currentIndex],
            examResult: {
              score: result.score,
              whatCouldHaveIncluded: result.whatCouldHaveIncluded,
              whatWasCorrect: result.whatWasCorrect,
              whatWasIncorrect: result.whatWasIncorrect,
            },
          };
        }
        return next;
      });
    } catch (error) {
      console.error(error);
      message.error("Gửi câu trả lời thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cardsState.length) {
    return (
      <div className="text-center text-gray-600">Không có thẻ để hiển thị.</div>
    );
  }

  const isLastCard = currentIndex === cardsState.length - 1;
  const currentCard = cardsState[currentIndex];
  const currentResult = currentCard?.examResult;

  return (
    <div>
      {/* Flashcard (front only) */}
      <div className="flex justify-center mb-8">
        <div className="w-full">
          <Card
            className="w-full h-full shadow-lg"
            bodyStyle={{ padding: "2rem", height: "100%", minHeight: "300px" }}
          >
            <div className="text-center h-full flex flex-col justify-center">
              <div className="text-[24px] leading-relaxed text-gray-800">
                {currentCard.front}
              </div>
              <div className="mt-4">
                <textarea
                  className="w-full !text-[18px] bg-[#F2F4FD] rounded-xl p-4 border-0 focus:outline-none"
                  name="message"
                  rows="5"
                  cols="40"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                ></textarea>
              </div>
              {currentResult && (
                <div className="mt-4 text-left">
                  {currentResult.whatWasCorrect &&
                    currentResult.whatWasCorrect !== "null" && (
                      <div className="mb-2 bg-[#E1FCDB] rounded-xl p-4">
                        <div className="text-[#00AB1F] font-bold">
                          What was correct
                        </div>
                        <div className="text-[#00AB1F]">
                          {currentResult.whatWasCorrect}
                        </div>
                      </div>
                    )}
                  {currentResult.whatWasIncorrect &&
                    currentResult.whatWasIncorrect !== "null" && (
                      <div className="mb-2 bg-[#FFEDED] rounded-xl p-4">
                        <div className="text-[#D74646] font-bold">
                          What was incorrect
                        </div>
                        <div className="text-[#D74646]">
                          {currentResult.whatWasIncorrect}
                        </div>
                      </div>
                    )}
                  {currentResult.whatCouldHaveIncluded &&
                    currentResult.whatCouldHaveIncluded !== "null" && (
                      <div className="mb-2 bg-[#F3EFFF] rounded-xl p-4">
                        <div className="text-[#5839D3] font-bold">
                          What could have included{" "}
                        </div>
                        <div className="text-[#5839D3]">
                          {currentResult.whatCouldHaveIncluded}
                        </div>
                      </div>
                    )}
                </div>
              )}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                  className={`transition-all !text-blue-600 duration-300 w-[30%] mt-4 rounded-[100px] border-2 px-4 py-2 ${
                    submitting
                      ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "border-blue-600 text-blue-600 hover:bg-blue-100 cursor-pointer"
                  }`}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation UI (same style as Flashcards tab) */}
      <div className="flex justify-center">
        <div className="flex items-center">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0
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
            {currentIndex + 1} / {cardsState.length}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
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
    </div>
  );
};

export default ExamMode;
