import React, { useState, useEffect, useRef } from "react";
import { Search, BrainCircuit, BookCopy, Users, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import api from "../config/axios";
import ReactGA from "react-ga4";

const searchEndpoints = {
  quiz: "/search/quiz-sets",
  flashcard: "/search/flashcard-sets",
  user: "/search/accounts",
};

const GlobalSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("quiz");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.trim() === "") {
        setResults([]);
        return;
      }

      ReactGA.event({
        category: "Search",
        action: `User searched for ${searchType}`,
        label: debouncedSearchTerm,
      });

      setLoading(true);
      try {
        const endpoint = searchEndpoints[searchType];
        const { data } = await api.get(`${endpoint}`, {
          params: { keyword: debouncedSearchTerm, page: 0, size: 5 },
        });
        if (searchType === "quiz") {
          const quizSets = data.quizSets || [];
          setResults(quizSets.filter(item => (item.visibility || item.visibilityStatus) === "PUBLIC"));
        } else if (searchType === "flashcard") {
          const flashcardSets = data.flashcardSets || [];
          setResults(flashcardSets.filter(item => (item.visibility || item.visibilityStatus) === "PUBLIC"));
        } else if (searchType === "user") {
          setResults(data.accounts || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedSearchTerm, searchType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (item) => {
    setIsFocused(false);
    
    if (searchType === "quiz") {
      navigate(`/quiz/${item.id}`);
    } else if (searchType === "flashcard") {
      navigate(`/study-flashcard/${item.id}`);
    } else if (searchType === "user") {
      navigate(`/user/${item.accountId}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&type=${searchType}`);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const searchOptions = [
    {
      type: "quiz",
      icon: <BrainCircuit size={18} />,
      label: t("globalSearch.quiz"),
    },
    {
      type: "flashcard",
      icon: <BookCopy size={18} />,
      label: t("globalSearch.flashcard"),
    },
    { type: "user", icon: <Users size={18} />, label: t("globalSearch.user") },
  ];

  return (
    <div className="relative w-95% max-w-md" ref={searchContainerRef}>
      <div className="flex items-center bg-slate-800/80 backdrop-blur-sm rounded-full shadow-inner border border-slate-700">
        <div className="relative flex-grow flex items-center">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 !text-white"
            size={18}
          />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyPress={handleKeyPress}
            placeholder={t("globalSearch.searchPlaceholder", {
              type: t(`globalSearch.${searchType}`),
            })}
            className="w-full h-10 pl-11 pr-8 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1 pr-2">
          {searchOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSearchType(opt.type)}
              className={`p-1.5 rounded-full transition-colors duration-200 ${
                searchType === opt.type
                  ? "bg-white/20 !text-white"
                  : "!text-gray-400 hover:bg-white/10 hover:!text-white"
              }`}
              title={t("globalSearch.searchFor", { type: opt.label })}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      {isFocused && searchTerm && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-lg shadow-xl z-[50] overflow-hidden border border-slate-700">
          {loading && (
            <div className="p-4 text-center text-gray-400">
              {t("globalSearch.searching")}
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul>
              {results.map((item, index) => (
                <li
                  key={item.id || item.accountId || index}
                  onClick={() => handleResultClick(item)}
                  className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-b-0"
                >
                  <p className="font-semibold text-gray-100">
                    {item.title || item.username}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {item.description || item.email}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && debouncedSearchTerm && (
            <div className="p-4 text-center text-gray-400">
              {t("globalSearch.noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
