import React from 'react';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  categories, 
  selectedCategory, 
  onCategoryChange,
  showFilters,
  onToggleFilters 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("explore.searchPlaceholder", "Search quiz sets or flashcard sets...")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t("explore.allCategories", "All Categories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">{t("explore.sortNewest", "Newest First")}</option>
            <option value="oldest">{t("explore.sortOldest", "Oldest First")}</option>
            <option value="mostPlayed">{t("explore.sortMostPlayed", "Most Played")}</option>
            <option value="title">{t("explore.sortTitle", "Title A-Z")}</option>
          </select>

          {/* Toggle Filters Button */}
          <button
            onClick={onToggleFilters}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              showFilters 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FilterOutlined className="mr-2" />
            {t("explore.filters", "Filters")}
          </button>
        </div>
      </div>

      {/* Advanced Filters (when showFilters is true) */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("explore.difficulty", "Difficulty")}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t("explore.allDifficulties", "All Difficulties")}</option>
                <option value="beginner">{t("explore.beginner", "Beginner")}</option>
                <option value="intermediate">{t("explore.intermediate", "Intermediate")}</option>
                <option value="advanced">{t("explore.advanced", "Advanced")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("explore.timeRange", "Time Range")}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t("explore.anyTime", "Any Time")}</option>
                <option value="0-15">{t("explore.under15min", "Under 15 min")}</option>
                <option value="15-30">{t("explore.15to30min", "15-30 min")}</option>
                <option value="30-60">{t("explore.30to60min", "30-60 min")}</option>
                <option value="60+">{t("explore.over60min", "Over 60 min")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("explore.rating", "Minimum Rating")}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t("explore.anyRating", "Any Rating")}</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

