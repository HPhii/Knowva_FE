import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Button,
  Input,
  Select,
  Empty,
  Spin,
  message,
  Tooltip,
  Pagination,
  Modal,
  Dropdown,
} from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import "./MyLibrary.scss";
import { isLoggedIn } from "../../utils/auth";
import RequireLoginModal from "../../components/RequireLoginModal";
import { ToastContainer } from "react-toastify";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const MyLibrary = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGenerateOption, setShowGenerateOption] = useState(false);

  console.log("generate option: ", showGenerateOption);

  // Separate states for different data types
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tests, setTests] = useState([]);

  // Pagination states for each tab
  const [flashcardsPage, setFlashcardsPage] = useState(1);
  const [quizzesPage, setQuizzesPage] = useState(1);
  const [testsPage, setTestsPage] = useState(1);
  const [cardsPerPage] = useState(6);

  console.log("Day la flashcards: ", flashcards);

  // Fetch flashcards data
  const fetchFlashcards = async () => {
    try {
      const response = await api.get("/flashcard-sets/my-flashcard-sets");
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFlashcards(sorted || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      message.error("Không thể tải dữ liệu flashcard. Vui lòng thử lại.");
    }
  };

  // Fetch quizzes data
  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quiz-sets/my-quiz-sets");
      console.log("Day la response cua quizzes: ", response.data);
      setQuizzes(response.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      message.error("Không thể tải dữ liệu quiz. Vui lòng thử lại.");
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchFlashcards(), fetchQuizzes()]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    fetchAllData();
  }, []);

  // Pagination helper functions
  const getCurrentPageItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / cardsPerPage);
  };

  const handlePageChange = (page, type) => {
    if (type === "flashcards") {
      setFlashcardsPage(page);
    } else if (type === "quizzes") {
      setQuizzesPage(page);
    } else if (type === "tests") {
      setTestsPage(page);
    }
  };

  const toggleGenerateOption = () => {
    setShowGenerateOption((prev) => !prev);
  };

  const flashcardItems = [
    {
      key: "ai",
      label: (
        <div
          onClick={() => navigate("/flashcards")} // 👈 đổi đường dẫn theo route của bạn
        >
          Create with AI
        </div>
      ),
    },
    {
      key: "scratch",
      label: (
        <div
          onClick={() => navigate("/create-flashcard")} // 👈 đổi đường dẫn theo route của bạn
        >
          Create from Scratch
        </div>
      ),
    },
  ];

  // Function to format time ago
  // const getTimeAgo = (dateString) => {
  //   const now = new Date();
  //   const date = new Date(dateString);
  //   const diffInSeconds = Math.floor((now - date) / 1000);

  //   if (diffInSeconds < 60) {
  //     return `${diffInSeconds} seconds ago`;
  //   } else if (diffInSeconds < 3600) {
  //     const minutes = Math.floor(diffInSeconds / 60);
  //     return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  //   } else if (diffInSeconds < 86400) {
  //     const hours = Math.floor(diffInSeconds / 3600);
  //     return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  //   } else if (diffInSeconds < 2592000) {
  //     const days = Math.floor(diffInSeconds / 86400);
  //     return `${days} day${days > 1 ? "s" : ""} ago`;
  //   } else if (diffInSeconds < 31536000) {
  //     const months = Math.floor(diffInSeconds / 2592000);
  //     return `${months} month${months > 1 ? "s" : ""} ago`;
  //   } else {
  //     const years = Math.floor(diffInSeconds / 31536000);
  //     return `${years} year${years > 1 ? "s" : ""} ago`;
  //   }
  // };

  const renderCard = (item, type) => {
    // For flashcards, show simplified information
    if (type === "flashcards") {
      return (
        <div
          key={item.id}
          className="bg-white min-h-[180px] rounded-lg shadow-sm border border-gray-200 pt-6 pb-4 pl-4 pr-5 mb-4 hover:shadow-lg transition-shadow duration-300 relative h-full flex flex-col"
        >
          {/* Flashcard Title */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 !mb-0 line-clamp-3 overflow-hidden">
              {item.title || item.name}
            </h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex text-sm font-medium text-gray-500">
                <span>
                  {item?.flashcards?.length || 0}{" "}
                  {t("myLibrary.cards", "Cards")}
                </span>
                {/* <span className="text-gray-500 mx-2">•</span> */}
                {/* <span>{getTimeAgo(item.createdAt || item.created_at)}</span> */}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 text-white rounded-md">
            <div
              className="flex items-center justify-center bg-[#285AFF] hover:bg-[#234CD3] hover:transition-all duration-300 px-5 py-[6px] rounded-[10px] cursor-pointer"
              onClick={() => navigate(`/flashcard/${item.id}`)}
            >
              {t("myLibrary.study", "Study")}
            </div>
            <div
              className="flex items-center justify-center bg-[#FFA500] hover:bg-[#FF8C00] hover:transition-all duration-300 px-5 py-[6px] rounded-[10px] cursor-pointer"
              onClick={() => navigate(`/edit-flashcard/${item.id}`)}
            >
              {t("myLibrary.edit", "Edit")}
            </div>
          </div>
        </div>
      );
    }

    // For quizzes and tests, show full information
    return (
      <div
        key={item.id}
        className="bg-white min-h-[180px] rounded-lg shadow-sm border border-gray-200 pt-6 pb-4 pl-4 pr-5 mb-4 hover:shadow-lg transition-shadow duration-300 relative h-full flex flex-col"
      >
        {/* body quizzes  */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-3 overflow-hidden">
            {item.title || item.name}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <div className="flex text-sm font-medium text-gray-500">
              <span className="flex items-center">
                {t("myLibrary.questions", "Questions")}:{" "}
                {item.totalQuestions || item.questionCount}
              </span>
              {/* <span className="text-gray-500 mx-2">•</span> */}
              {/* <span>{getTimeAgo(item.createdAt || item.created_at)}</span> */}
            </div>
          </div>
        </div>
        {/* button  */}
        <div className="flex justify-end cursor-pointer text-white rounded-md">
          <div
            className="flex items-center justify-center bg-[#285AFF] hover:bg-[#234CD3] hover:transition-all duration-300 px-5 py-[6px] rounded-[10px]"
            onClick={() => navigate(`/flashcard/${item.id}`)}
          >
            {t("myLibrary.study", "Study")}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = (type) => {
    let items = [];
    let currentPage = 1;

    if (type === "flashcards") {
      items = flashcards;
      currentPage = flashcardsPage;
    } else if (type === "quizzes") {
      items = quizzes;
      currentPage = quizzesPage;
    } else if (type === "tests") {
      items = tests;
      currentPage = testsPage;
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <Empty
          description={t("myLibrary.noItemsFound", "No items found")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            {t("myLibrary.createNew", "Create New")}{" "}
            {type === "flashcards"
              ? t("myLibrary.flashcardSet", "Flashcard Set")
              : type === "quizzes"
              ? t("myLibrary.quiz", "Quiz")
              : t("myLibrary.test", "Test")}
          </Button>
        </Empty>
      );
    }

    // Get items for current page
    const currentPageItems = getCurrentPageItems(items, currentPage);
    const totalPages = getTotalPages(items);

    return (
      <div>
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentPageItems.map((item) => renderCard(item, type))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              total={items.length}
              pageSize={cardsPerPage}
              showSizeChanger={false}
              onChange={(page) => handlePageChange(page, type)}
              className="pagination-custom"
              size="default"
              responsive={true}
              showLessItems={true}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <RequireLoginModal
          open={showLoginModal}
          onOk={() => navigate("/login")}
          onCancel={() => navigate("/")}
        />
        {/* Tabs */}
        <div>
          <Tabs defaultActiveKey="flashcards" size="large">
            <TabPane
              tab={
                <span>
                  {t("myLibrary.flashcards", "Flashcards")} ({flashcards.length}
                  )
                </span>
              }
              key="flashcards"
            >
              <div className="flex justify-baseline mb-5">
                {/* <div className="cursor bg-[#CA56D2] text-white px-3 py-2 rounded-xl">
                  Create New
                </div> */}
                {/* <div className="relative">
                  <Button onClick={toggleGenerateOption}>Create New</Button>
                  {showGenerateOption && <div>cc</div>}
                </div> */}
                <Dropdown
                  menu={{ items: flashcardItems }}
                  placement="bottomLeft"
                  trigger={["click"]}
                >
                  <Button icon={<PlusOutlined />}>Create New</Button>
                </Dropdown>
              </div>
              {renderTabContent("flashcards")}
            </TabPane>
            <TabPane
              tab={
                <span>
                  {t("myLibrary.quizzes", "Quizzes")} ({quizzes.length})
                </span>
              }
              key="quizzes"
            >
              {renderTabContent("quizzes")}
            </TabPane>
          </Tabs>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyLibrary;
