import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../config/axios";
import {
  Brain,
  BookOpen,
  FileText,
  Star,
  MessageCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  Eye,
  ThumbsUp
} from "lucide-react";

const UserActivities = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const pageSize = 8;

  // Activity type configurations
  const activityTypes = {
    CREATE_QUIZ_SET: {
      label: t("activities.types.CREATE_QUIZ_SET"),
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    ATTEMPT_QUIZ: {
      label: t("activities.types.ATTEMPT_QUIZ"),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    CREATE_FLASHCARD_SET: {
      label: t("activities.types.CREATE_FLASHCARD_SET"),
      icon: BookOpen,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    STUDY_FLASHCARD_SET: {
      label: t("activities.types.STUDY_FLASHCARD_SET"),
      icon: Eye,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    CREATE_BLOG_POST: {
      label: t("activities.types.CREATE_BLOG_POST"),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    PUBLISH_BLOG_POST: {
      label: t("activities.types.PUBLISH_BLOG_POST"),
      icon: Plus,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    RATE_CONTENT: {
      label: t("activities.types.RATE_CONTENT"),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    COMMENT_ON_CONTENT: {
      label: t("activities.types.COMMENT_ON_CONTENT"),
      icon: MessageCircle,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    }
  };

  const fetchActivities = async (page = 0, search = "", types = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString()
      });

      if (search) {
        params.append('search', search);
      }

      if (types.length > 0) {
        types.forEach(type => params.append('type', type));
      }

      const response = await api.get(`/activities/my-activities?${params}`);
      
      setActivities(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(t("activities.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage, searchTerm, selectedTypes);
  }, [currentPage, searchTerm, selectedTypes]);

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleTypeFilter = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderActivityItem = (activity) => {
    const typeConfig = activityTypes[activity.type] || {
      label: activity.type,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    };

    const Icon = typeConfig.icon;

    return (
      <div key={activity.id} className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
        
        <div className={`relative bg-white rounded-xl p-4 shadow-sm border ${typeConfig.borderColor} hover:shadow-md transition-shadow`}>
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 ${typeConfig.bgColor} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${typeConfig.color}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {typeConfig.label}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
              
              {activity.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {activity.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("activities.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Clock className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchActivities(currentPage, searchTerm, selectedTypes)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("activities.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t("activities.title")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("activities.totalActivities").replace("{count}", totalElements)}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("activities.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                selectedTypes.length > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t("activities.filter")}
              {selectedTypes.length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {selectedTypes.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {Object.entries(activityTypes).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTypes.includes(type)
                      ? `${config.bgColor} ${config.color} border-2 ${config.borderColor}`
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
            
            {selectedTypes.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t("activities.clearFilters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("activities.noActivities")}</h3>
            <p className="text-gray-600">{t("activities.noActivitiesDesc")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(renderActivityItem)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t("activities.page")} {currentPage + 1} {t("activities.of")} {totalPages} ({totalElements} {t("activities.activities")})
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t("activities.previous")}
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("activities.next")}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivities;
