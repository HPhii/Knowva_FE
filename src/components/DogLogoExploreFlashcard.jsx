import React from "react";
import flashcardShiba from "../../src/assets/images/flashcard_shiba.png";

const DogLogoExplore = ({ activeTab }) => {
  return (
    <div>
      <div className="relative w-fit">
        <img
          src={flashcardShiba}
          alt="Flashcard Sets"
          className={`relative !w-20 !h-20 sm:w-24 sm:h-24 object-contain transition-all duration-300 z-20 ${
            activeTab === "flashcard"
              ? "brightness-110 contrast-120 delay-400"
              : "brightness-90 hover:brightness-100"
          }`}
        />

        <div
          className={`absolute !w-22 !h-22 z-10 top-[-10px] left-[-5px] w-full h-full bg-[#F78DFF] blur-md rounded-full opacity-50 duration-300 z-10 transition-all duration-300 ${
            activeTab === "flashcard" ? "!opacity-50 delay-400" : "!opacity-0"
          }`}
        ></div>

        <div
          className={`absolute top-[-5px] left-[-5px] transition-all duration-500 z-20 ${
            activeTab === "flashcard"
              ? "opacity-100 delay-400 animate-spin brightness-110"
              : "opacity-0"
          }`}
          style={{ animationDuration: "7s" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ff85d9"
              d="M12 1a4 4 0 0 1 4 4l-.002.055l.03-.018a3.97 3.97 0 0 1 2.79-.455l.237.056a3.97 3.97 0 0 1 2.412 1.865a4.01 4.01 0 0 1-1.455 5.461l-.068.036l.071.039a4.01 4.01 0 0 1 1.555 5.27l-.101.186a3.97 3.97 0 0 1-5.441 1.468l-.03-.02L16 19a4 4 0 0 1-3.8 3.995L12 23a4 4 0 0 1-4-4l.001-.056l-.029.019a3.97 3.97 0 0 1-2.79.456l-.236-.056a3.97 3.97 0 0 1-2.413-1.865a4.01 4.01 0 0 1 1.453-5.46l.07-.038l-.071-.038a4.01 4.01 0 0 1-1.555-5.27l.1-.187a3.97 3.97 0 0 1 5.444-1.468L8 5.055V5a4 4 0 0 1 3.8-3.995zm0 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
            />
          </svg>
        </div>
        <div
          className={`absolute top-[2px] right-[-8px] transition-all duration-500 z-20 ${
            activeTab === "flashcard"
              ? "opacity-100 delay-400 animate-spin brightness-110"
              : "opacity-0"
          }`}
          style={{ animationDuration: "7s", animationDirection: "reverse" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ff85d9"
              d="M12 1a4 4 0 0 1 4 4l-.002.055l.03-.018a3.97 3.97 0 0 1 2.79-.455l.237.056a3.97 3.97 0 0 1 2.412 1.865a4.01 4.01 0 0 1-1.455 5.461l-.068.036l.071.039a4.01 4.01 0 0 1 1.555 5.27l-.101.186a3.97 3.97 0 0 1-5.441 1.468l-.03-.02L16 19a4 4 0 0 1-3.8 3.995L12 23a4 4 0 0 1-4-4l.001-.056l-.029.019a3.97 3.97 0 0 1-2.79.456l-.236-.056a3.97 3.97 0 0 1-2.413-1.865a4.01 4.01 0 0 1 1.453-5.46l.07-.038l-.071-.038a4.01 4.01 0 0 1-1.555-5.27l.1-.187a3.97 3.97 0 0 1 5.444-1.468L8 5.055V5a4 4 0 0 1 3.8-3.995zm0 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
            />
          </svg>
        </div>
        <div
          className={`absolute top-[40px] left-[-12px] transition-all duration-500 z-20 ${
            activeTab === "flashcard"
              ? "opacity-100 delay-400 animate-spin brightness-110"
              : "opacity-0"
          }`}
          style={{ animationDuration: "7s" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ff85d9"
              d="M12 1a4 4 0 0 1 4 4l-.002.055l.03-.018a3.97 3.97 0 0 1 2.79-.455l.237.056a3.97 3.97 0 0 1 2.412 1.865a4.01 4.01 0 0 1-1.455 5.461l-.068.036l.071.039a4.01 4.01 0 0 1 1.555 5.27l-.101.186a3.97 3.97 0 0 1-5.441 1.468l-.03-.02L16 19a4 4 0 0 1-3.8 3.995L12 23a4 4 0 0 1-4-4l.001-.056l-.029.019a3.97 3.97 0 0 1-2.79.456l-.236-.056a3.97 3.97 0 0 1-2.413-1.865a4.01 4.01 0 0 1 1.453-5.46l.07-.038l-.071-.038a4.01 4.01 0 0 1-1.555-5.27l.1-.187a3.97 3.97 0 0 1 5.444-1.468L8 5.055V5a4 4 0 0 1 3.8-3.995zm0 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
            />
          </svg>
        </div>
        <div
          className={`absolute top-[45px] right-[-10px] transition-all duration-500 z-20 ${
            activeTab === "flashcard"
              ? "opacity-100 delay-400 animate-spin brightness-110"
              : "opacity-0"
          }`}
          style={{ animationDuration: "7s", animationDirection: "reverse" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ff85d9"
              d="M12 1a4 4 0 0 1 4 4l-.002.055l.03-.018a3.97 3.97 0 0 1 2.79-.455l.237.056a3.97 3.97 0 0 1 2.412 1.865a4.01 4.01 0 0 1-1.455 5.461l-.068.036l.071.039a4.01 4.01 0 0 1 1.555 5.27l-.101.186a3.97 3.97 0 0 1-5.441 1.468l-.03-.02L16 19a4 4 0 0 1-3.8 3.995L12 23a4 4 0 0 1-4-4l.001-.056l-.029.019a3.97 3.97 0 0 1-2.79.456l-.236-.056a3.97 3.97 0 0 1-2.413-1.865a4.01 4.01 0 0 1 1.453-5.46l.07-.038l-.071-.038a4.01 4.01 0 0 1-1.555-5.27l.1-.187a3.97 3.97 0 0 1 5.444-1.468L8 5.055V5a4 4 0 0 1 3.8-3.995zm0 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DogLogoExplore;
