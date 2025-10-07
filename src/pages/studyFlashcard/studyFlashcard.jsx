import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  Button,
  Spin,
  message,
  Progress,
  Typography,
  Space,
  Modal,
  InputNumber,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Text,
} from "recharts";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  RotateLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import "./studyFlashcard.scss";
import ExamMode from "./components/examMode";
import InviteModal from "../../components/InviteModal";
import { getLoginData } from "../../utils/auth";

const { Title } = Typography;

// Performance Stats Chart Component
const PerformanceChart = ({ stats }) => {
  if (!stats) return null;

  const { retentionRate, totalAttempts } = stats;
  const knowCount = Math.round((retentionRate / 100) * totalAttempts);
  const dontKnowCount = totalAttempts - knowCount;

  const data = [
    { name: "Know", value: knowCount, color: "#52c41a" },
    { name: "Don't Know", value: dontKnowCount, color: "#ffa940" },
  ];

  const COLORS = ["#A4F07F", "#FDBB6B"];

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-60 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-[#1F2937]">
            {retentionRate.toFixed(0)}%
          </div>
          <div className="text-base font-medium text-[#1F2937]">Know</div>
        </div>
      </div>
    </div>
  );
};

// TabBar Component
const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      key: "flashcards",
      label: "Flashcards",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path
              fill="url(#SVGPrmugbjO)"
              d="M8 6.25A2.25 2.25 0 0 1 10.25 4h7.5A2.25 2.25 0 0 1 20 6.25v8.5A2.25 2.25 0 0 1 17.75 17h-7.5A2.25 2.25 0 0 1 8 14.75z"
            />
            <path
              fill="url(#SVGdBuGNmjL)"
              d="M8 6.25A2.25 2.25 0 0 1 10.25 4h7.5A2.25 2.25 0 0 1 20 6.25v8.5A2.25 2.25 0 0 1 17.75 17h-7.5A2.25 2.25 0 0 1 8 14.75z"
            />
            <path
              fill="url(#SVGDSS2BeGC)"
              d="M4 4.25A2.25 2.25 0 0 1 6.25 2h9a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 15.25 17h-9A2.25 2.25 0 0 1 4 14.75z"
            />
            <path
              fill="url(#SVGl7J9xcou)"
              d="M5.25 8A2.25 2.25 0 0 0 3 10.25v8.5A3.25 3.25 0 0 0 6.25 22h11.5A3.25 3.25 0 0 0 21 18.75v-1.5A2.25 2.25 0 0 0 18.75 15h-2.846a.75.75 0 0 1-.55-.24l-5.61-6.04A2.25 2.25 0 0 0 8.097 8z"
            />
            <defs>
              <linearGradient
                id="SVGPrmugbjO"
                x1="21.8"
                x2="23.639"
                y1="19.5"
                y2="5.773"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#bb45ea" />
                <stop offset="1" stop-color="#9c6cfe" />
              </linearGradient>
              <linearGradient
                id="SVGdBuGNmjL"
                x1="20"
                x2="17"
                y1="8.5"
                y2="8.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".338" stop-color="#5750e2" stop-opacity="0" />
                <stop offset="1" stop-color="#5750e2" />
              </linearGradient>
              <linearGradient
                id="SVGl7J9xcou"
                x1="6.857"
                x2="6.857"
                y1="8"
                y2="27.091"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".241" stop-color="#ffd638" />
                <stop offset=".637" stop-color="#fab500" />
                <stop offset=".985" stop-color="#ca6407" />
              </linearGradient>
              <radialGradient
                id="SVGDSS2BeGC"
                cx="0"
                cy="0"
                r="1"
                gradientTransform="matrix(8.775 -11.5 18.53666 14.14428 8.05 14)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".228" stop-color="#2764e7" />
                <stop offset=".685" stop-color="#5cd1ff" />
                <stop offset="1" stop-color="#6ce0ff" />
              </radialGradient>
            </defs>
          </g>
        </svg>
      ),
    },
    {
      key: "exam-mode",
      label: "Exam Mode",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 36 36"
        >
          <path
            fill="#ea596e"
            d="M29.896 26.667c.003.283-.07.653-.146.958c-.531 2.145-2.889 4.552-6.208 4.333c-3.008-.198-5.458-1.642-5.458-3.667s2.444-3.667 5.458-3.667s6.335.018 6.354 2.043"
          />
          <path
            fill="#dd2e44"
            d="M23.542 24.964c-1.619 0-5.314.448-6.162.448c-1.498 0-2.713.94-2.713 2.1c0 .558.286 1.062.744 1.438c0 0 1.006 1.009 2.818.525c.793-.212 2.083-1.786 4.354-2.036c1.131-.125 3.25.75 6.974.771c.16-.344.193-.583.193-.583c0-2.027-3.194-2.663-6.208-2.663"
          />
          <path
            fill="#f4abba"
            d="M29.75 27.625s2.184-.443 3.542-2.229c1.583-2.083 1.375-4.312 1.375-4.312c1.604-3-.5-5.813-.5-5.813C33.958 12.104 32 10.792 32 10.792c-1.271-3.021-4.083-3.833-4.083-3.833c-2.208-2.583-6.125-2.5-6.125-2.5s-3.67-1.345-8.708.167c-.833.25-3.625.833-5.667 2.083C.981 10.649.494 16.793.584 17.792C1.083 23.375 5 24.375 7.5 24.958c.583 1.583 2.729 4.5 6.583 3.417c4.75-.833 6.75-2.25 7.917-2.25s4.417 1.25 7.75 1.5"
          />
          <g fill="#ea596e">
            <path d="M17.737 18.648c2.328-1.255 3.59-1.138 4.704-1.037c.354.032.689.057 1.028.055c1.984-.045 3.591-.881 4.302-1.69a.501.501 0 0 0-.752-.661c-.548.624-1.899 1.313-3.573 1.351c-.3.009-.601-.021-.913-.05c-1.195-.111-2.679-.247-5.271 1.152c-.665.359-1.577.492-2.565.592c-2.197-3.171-.875-5.933-.497-6.591c.037.002.073.014.111.014c.4 0 .802-.098 1.166-.304a.5.5 0 0 0-.492-.87a1.426 1.426 0 0 1-1.88-.467a.5.5 0 0 0-.841.539c.237.371.571.65.948.837c-.521 1.058-1.51 3.84.372 6.951c-1.324.13-2.65.317-3.688.986a7.2 7.2 0 0 0-1.878 1.791c-.629-.108-2.932-.675-3.334-3.231c.25-.194.452-.45.577-.766a.5.5 0 1 0-.93-.368a.77.77 0 0 1-.454.461a.78.78 0 0 1-.643-.07a.5.5 0 0 0-.486.874c.284.158.588.238.89.238c.037 0 .072-.017.109-.019c.476 2.413 2.383 3.473 3.732 3.794a3.7 3.7 0 0 0-.331 1.192a.5.5 0 0 0 .454.542l.045.002a.5.5 0 0 0 .498-.456c.108-1.213 1.265-2.48 2.293-3.145c.964-.621 2.375-.752 3.741-.879c1.325-.121 2.577-.237 3.558-.767m12.866-1.504a.5.5 0 0 0 .878.48c.019-.034 1.842-3.449-1.571-5.744a.5.5 0 0 0-.558.83c2.644 1.778 1.309 4.326 1.251 4.434M9.876 9.07a.5.5 0 0 0 .406-.208c1.45-2.017 3.458-1.327 3.543-1.295a.5.5 0 0 0 .345-.938c-.96-.356-3.177-.468-4.7 1.65a.5.5 0 0 0 .406.791m13.072-1.888c2.225-.181 3.237 1.432 3.283 1.508a.5.5 0 0 0 .863-.507c-.054-.091-1.34-2.218-4.224-1.998a.5.5 0 0 0 .078.997m9.15 14.611c-.246-.014-.517.181-.539.457c-.002.018-.161 1.719-1.91 2.294a.499.499 0 0 0 .157.975a.5.5 0 0 0 .156-.025c2.372-.778 2.586-3.064 2.594-3.161a.5.5 0 0 0-.458-.54" />
            <path d="M7.347 16.934a.5.5 0 1 0 .965.26a1.423 1.423 0 0 1 1.652-1.014a.5.5 0 0 0 .205-.979a2.35 2.35 0 0 0-1.248.086c-1.166-1.994-.939-3.96-.936-3.981a.5.5 0 0 0-.429-.562a.503.503 0 0 0-.562.427c-.013.097-.28 2.316 1.063 4.614a2.4 2.4 0 0 0-.71 1.149m11.179-2.47a1.07 1.07 0 0 1 1.455.015a.5.5 0 0 0 .707-.011a.5.5 0 0 0-.01-.707a2 2 0 0 0-.797-.465c.296-1.016.179-1.467-.096-2.312a21 21 0 0 1-.157-.498l-.03-.1c-.364-1.208-.605-2.005.087-3.13a.5.5 0 0 0-.852-.524c-.928 1.508-.587 2.637-.192 3.944l.03.1q.088.29.163.517c.247.761.322 1.016.02 1.936a2 2 0 0 0-1.01.504a.5.5 0 0 0 .682.731m6.365-2.985a2 2 0 0 0 .859-.191a.5.5 0 0 0-.426-.905a1.07 1.07 0 0 1-1.384-.457a.5.5 0 1 0-.881.472c.18.336.448.601.76.785c-.537 1.305-.232 2.691.017 3.426a.5.5 0 1 0 .947-.319c-.168-.498-.494-1.756-.002-2.826c.038.002.073.015.11.015m4.797 9.429a.497.497 0 0 0-.531-.467a1.825 1.825 0 0 1-1.947-1.703a.51.51 0 0 0-.533-.465a.5.5 0 0 0-.465.533c.041.59.266 1.122.608 1.555c-.804.946-1.857 1.215-2.444 1.284c-.519.062-.973.009-1.498-.053c-.481-.055-1.025-.118-1.698-.098l-.005.001c-.02-.286-.088-.703-.305-1.05a.501.501 0 0 0-.847.531c.134.215.159.558.159.725c-.504.181-.94.447-1.334.704c-.704.458-1.259.82-2.094.632c-.756-.173-1.513-.208-2.155-.118c-.1-.251-.258-.551-.502-.782a.5.5 0 0 0-.687.727c.086.081.154.199.209.317c-1.103.454-1.656 1.213-1.682 1.25a.499.499 0 0 0 .407.788a.5.5 0 0 0 .406-.205c.005-.008.554-.743 1.637-1.04c.56-.154 1.363-.141 2.146.037c.219.05.422.067.619.07c.093.218.129.477.134.573a.5.5 0 0 0 .499.472l.027-.001a.5.5 0 0 0 .473-.523a3 3 0 0 0-.13-.686c.461-.167.862-.428 1.239-.673c.572-.373 1.113-.726 1.82-.749c.592-.021 1.08.036 1.551.091c.474.055.94.091 1.454.061c.091.253.084.591.07.704a.503.503 0 0 0 .497.563a.5.5 0 0 0 .495-.435a2.9 2.9 0 0 0-.059-.981a4.67 4.67 0 0 0 2.345-1.471a2.8 2.8 0 0 0 1.656.413a.5.5 0 0 0 .465-.531" />
          </g>
        </svg>
      ),
    },
    {
      key: "spaced-repetition",
      label: "Spaced Repetition",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 36 36"
        >
          <path
            fill="#ffcc4d"
            d="M20 6.042c0 1.112-.903 2.014-2 2.014s-2-.902-2-2.014V2.014C16 .901 16.903 0 18 0s2 .901 2 2.014z"
          />
          <path
            fill="#ffac33"
            d="M9.18 36c-.224 0-.452-.052-.666-.159a1.52 1.52 0 0 1-.667-2.027l8.94-18.127c.252-.512.768-.835 1.333-.835s1.081.323 1.333.835l8.941 18.127a1.52 1.52 0 0 1-.666 2.027a1.48 1.48 0 0 1-1.999-.676L18.121 19.74l-7.607 15.425A1.49 1.49 0 0 1 9.18 36"
          />
          <path
            fill="#58595b"
            d="M18.121 20.392a1 1 0 0 1-.702-.295L3.512 5.998c-.388-.394-.388-1.031 0-1.424s1.017-.393 1.404 0L18.121 17.96L31.324 4.573a.985.985 0 0 1 1.405 0a1.017 1.017 0 0 1 0 1.424l-13.905 14.1a1 1 0 0 1-.703.295"
          />
          <path
            fill="#dd2e44"
            d="M34.015 19.385c0 8.898-7.115 16.111-15.894 16.111c-8.777 0-15.893-7.213-15.893-16.111c0-8.9 7.116-16.113 15.893-16.113c8.778-.001 15.894 7.213 15.894 16.113"
          />
          <path
            fill="#e6e7e8"
            d="M30.041 19.385c0 6.674-5.335 12.084-11.92 12.084c-6.583 0-11.919-5.41-11.919-12.084C6.202 12.71 11.538 7.3 18.121 7.3c6.585-.001 11.92 5.41 11.92 12.085"
          />
          <path
            fill="#ffcc4d"
            d="M30.04 1.257a5.9 5.9 0 0 0-4.214 1.77l8.429 8.544A6.06 6.06 0 0 0 36 7.299c0-3.336-2.669-6.042-5.96-6.042m-24.08 0a5.9 5.9 0 0 1 4.214 1.77l-8.429 8.544A6.06 6.06 0 0 1 0 7.299c0-3.336 2.668-6.042 5.96-6.042"
          />
          <path
            fill="#414042"
            d="M23 20h-5a1 1 0 0 1-1-1v-9a1 1 0 0 1 2 0v8h4a1 1 0 1 1 0 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-col items-center justify-center text-[17px] gap-5 sm:flex-row w-full max-w-sm sm:max-w-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-3 border-3 bg-transparent text-slate-500 font-medium text-sm rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap text-center focus:outline-none mb-0.5 sm:mb-0 last:mb-0 flex items-center justify-center gap-2 flex-1 w-full ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md border-blue-600"
                : "border-[#D9D9D9] hover:text-blue-600 hover:bg-blue-50 hover:border-blue-500"
            }`}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

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
  const [isSpacedRepetitionLoading, setIsSpacedRepetitionLoading] =
    useState(false);
  const [isSpacedRepetitionCompleted, setIsSpacedRepetitionCompleted] =
    useState(false);
  const [performanceStats, setPerformanceStats] = useState(null);
  
  // User and invite states
  const [currentUser, setCurrentUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Copy link state
  const [copyMessage, setCopyMessage] = useState("");

  // Fetch flashcard set data
  const fetchFlashcardSet = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/flashcard-sets/${id}`);
      setFlashcardSet(response.data);
    } catch (error) {
      console.error("Error fetching flashcard set:", error);
      message.error("Không thể tải bộ flashcard. Vui lòng thử lại.");
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
    } catch (error) {
      console.error('Error copying link:', error);
      setCopyMessage("Không thể sao chép link");
      setTimeout(() => setCopyMessage(""), 3000);
    }
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

    // Don't auto-load session here, wait for user to click tab
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
      message.error("Không thể tải thống kê hiệu suất. Vui lòng thử lại.");
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
    } else {
      message.success("Bạn đã hoàn thành tất cả flashcard!");
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
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
          await api.get("/spaced-repetition/mode-data", {
            params: {
              userId: localStorage.getItem("userId") || "1",
              flashcardSetId: id,
            },
          });

          // After mode-data, decide flow based on localStorage (avoid async state race)
          const setupKey = `spaced-repetition-setup-${id}`;
          const completedKey = `spaced-repetition-completed-${id}`;
          const statsKey = `performance-stats-${id}`;
          const today = new Date().toDateString();

          const isSetup = localStorage.getItem(setupKey) === "true";
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

          // If not completed today
          if (!isSetup) {
            setTempCardLimit(cardLimit);
            setShowLimitModal(true);
          } else {
            await loadSpacedRepetitionSession();
          }
          // If completed, just show the completion message
        } catch (error) {
          console.error("Error fetching mode data:", error);
          message.error("Không thể tải dữ liệu chế độ học. Vui lòng thử lại.");
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

  // Handle modal cancel
  const handleModalCancel = () => {
    setShowLimitModal(false);
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
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Title level={3}>Không tìm thấy bộ flashcard</Title>
          <Button type="primary" onClick={() => navigate("/my-library")}>
            Quay lại thư viện
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = flashcardSet.flashcards[currentCardIndex];
  const isLastCard = currentCardIndex === flashcardSet.flashcards.length - 1;

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
              <Title level={2} className="!mb-2">
                {flashcardSet.title || flashcardSet.name}
              </Title>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              {/* Primary Button - Restart */}
              <Button
                icon={<RotateLeftOutlined />}
                onClick={handleRestart}
                type="primary"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none sm:min-w-[200px] h-12"
              >
                Bắt đầu lại
              </Button>
              
              {/* Secondary Actions - Moved to right */}
              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                {/* Copy Link Button */}
                <div className="relative group">
                  <Button
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>}
                    onClick={handleCopyLink}
                    disabled={flashcardSet.visibility === 'PRIVATE'}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                      flashcardSet.visibility === 'PRIVATE'
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100"
                        : "bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 border-green-100 hover:border-green-200 cursor-pointer shadow-md hover:shadow-lg"
                    }`}
                    type="default"
                    title="Copy Link"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {flashcardSet.visibility === 'PRIVATE' ? "Set này là riêng tư" : "Copy Link"}
                  </div>
                </div>

                {/* Invite Button - Only show for owner */}
                {canEdit && (
                  <div className="relative group">
                    <Button
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>}
                      onClick={() => setIsInviteModalOpen(true)}
                      type="default"
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700 border-purple-100 hover:border-purple-200 transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Mời người dùng"
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Mời người dùng
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content based on active tab */}
        {activeTab === "flashcards" && (
          <>
            {/* Flashcard */}
            <div className="flex justify-center mb-8">
              <div className="flashcard-container" onClick={handleShowAnswer}>
                <div
                  className={`flashcard-inner ${showAnswer ? "flipped" : ""}`}
                >
                  {/* Front side - Question */}
                  <div className="flashcard-side front">
                    <Card
                      className="w-full h-full shadow-lg flashcard-question"
                      bodyStyle={{ padding: "2rem", height: "100%" }}
                    >
                      <div className="text-center h-full flex flex-col justify-center">
                        {/* <Title level={3} className="!mb-4 question-title">
                      Câu hỏi
                    </Title> */}
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
                        {/* <Title level={3} className="!mb-4 answer-title">
                      Câu trả lời
                    </Title> */}
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
                  onClick={handlePreviousCard}
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
                  {currentCardIndex + 1} / {flashcardSet.flashcards.length}
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
          </>
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
              {isSpacedRepetitionLoading ? (
                // Loading screen during 3-second delay
                <div className="text-center">
                  <div className="mb-6">
                    <Spin size="large" />
                  </div>
                  <p className="text-gray-600 text-lg">
                    Đang chuẩn bị phiên học Spaced Repetition...
                  </p>
                </div>
              ) : !currentReviewCard && !isSpacedRepetitionSetup ? (
                // Start screen - show setup modal
                <div className="text-center">
                  <div className="mb-6">
                    <p className="text-gray-600 text-lg">
                      Nhập số thẻ muốn học hôm nay để bắt đầu phiên Spaced
                      Repetition.
                    </p>
                  </div>

                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      onClick={showCardLimitModal}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      🚀 Bắt đầu học ngay
                    </Button>
                  </div>
                </div>
              ) : !currentReviewCard &&
                (isSpacedRepetitionSetup || isSpacedRepetitionCompleted) ? (
                // Setup completed but no cards available or session completed
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
                              <span className="font-semibold text-[#1F780E]">
                                Know
                              </span>{" "}
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
                        onClick={loadSpacedRepetitionSession}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        🔄 Tải lại phiên học
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Review session
                <div>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        {reviewCards.findIndex(
                          (card) => card.id === currentReviewCard.id
                        ) + 1}{" "}
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
                      onClick={() => setShowSpacedAnswer(!showSpacedAnswer)}
                    >
                      <div
                        className={`flashcard-inner ${
                          showSpacedAnswer ? "flipped" : ""
                        }`}
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
                        onClick={() => handleSpacedRepetitionRating(1)}
                      >
                        <div className="text-center">
                          <div className="text-red-500 text-2xl mb-1">😞</div>
                          <div className="text-red-600 text-xs font-medium">
                            Không nhớ
                          </div>
                        </div>
                      </div>

                      {/* Level 2: Mơ hồ */}
                      <div
                        className="cursor-pointer rounded-full border-2 border-orange-400 bg-orange-50 hover:bg-orange-100 p-3 transition-all duration-200 min-w-[80px]"
                        onClick={() => handleSpacedRepetitionRating(2)}
                      >
                        <div className="text-center">
                          <div className="text-orange-500 text-2xl mb-1">
                            😕
                          </div>
                          <div className="text-orange-600 text-xs font-medium">
                            Mơ hồ
                          </div>
                        </div>
                      </div>

                      {/* Level 3: Nhớ chậm */}
                      <div
                        className="cursor-pointer rounded-full border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100 p-3 transition-all duration-200 min-w-[80px]"
                        onClick={() => handleSpacedRepetitionRating(3)}
                      >
                        <div className="text-center">
                          <div className="text-yellow-500 text-2xl mb-1">
                            🤔
                          </div>
                          <div className="text-yellow-600 text-xs font-medium">
                            Nhớ chậm
                          </div>
                        </div>
                      </div>

                      {/* Level 4: Nhớ */}
                      <div
                        className="cursor-pointer rounded-full border-2 border-green-400 bg-green-50 hover:bg-green-100 p-3 transition-all duration-200 min-w-[80px]"
                        onClick={() => handleSpacedRepetitionRating(4)}
                      >
                        <div className="text-center">
                          <div className="text-green-500 text-2xl mb-1">😊</div>
                          <div className="text-green-600 text-xs font-medium">
                            Nhớ
                          </div>
                        </div>
                      </div>

                      {/* Level 5: Nhớ rất rõ */}
                      <div
                        className="cursor-pointer rounded-full border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 p-3 transition-all duration-200 min-w-[80px]"
                        onClick={() => handleSpacedRepetitionRating(5)}
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
                        {reviewCards.findIndex(
                          (card) => card.id === currentReviewCard.id
                        ) + 1}{" "}
                        / {reviewCards.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Limit Modal */}
        <Modal
          open={showLimitModal}
          onOk={handleModalConfirm}
          onCancel={handleModalCancel}
          centered
        >
          <div className="py-4">
            <p className="!mb-1.5 font-semibold text-[#000] text-[25px]">
              Spaced Repetition
            </p>
            <p className="text-gray-700 text-[17px] mb-4 block">
              This mode helps you retain information by reviewing flashcards at
              optimal intervals, focusing on what needs the most reinforcement
              each day.
            </p>
            <div className="flex items-center gap-3">
              <span className="!mb-1.5 font-semibold text-[#000] text-[17px]">
                Số lượng muốn học:
              </span>
              <InputNumber
                min={1}
                max={100}
                value={tempCardLimit}
                onChange={(value) => setTempCardLimit(value || 1)}
                className="w-24"
              />
            </div>
          </div>
        </Modal>

        {/* Invite Modal */}
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
