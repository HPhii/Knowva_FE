import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BellOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Input,
  Select,
  Button,
  Card,
  Badge,
  Pagination,
  Empty,
  Spin,
} from "antd";
import api from "../../config/axios";

const { Search } = Input;
const { Option } = Select;

const Notification = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  console.log("Day la notifications: ", notifications);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          sortBy: "timestamp",
          sortDirection: "DESC",
          search: searchTerm || undefined,
          type: filterType !== "all" ? filterType : undefined,
          // Note: API might not support read filter, we'll filter client-side
        },
      });

      // Handle different API response structures
      const notificationsData =
        response.data.notifications || response.data || [];

      console.log("Raw API response:", response.data);
      console.log("Notifications data:", notificationsData);

      // Use data directly from API, only transform if needed
      const transformedNotifications = notificationsData.map(
        (notification) => ({
          id: notification.id,
          title: notification.title || getNotificationTitle(notification.type),
          message: notification.message,
          time: notification.time || formatTimeAgo(notification.timestamp),
          read: notification.read,
          type: notification.type,
          timestamp: notification.timestamp,
        })
      );

      console.log("Transformed notifications:", transformedNotifications);

      // Apply client-side filtering for read status
      let filteredNotifications = transformedNotifications;
      if (filterStatus !== "all") {
        filteredNotifications = transformedNotifications.filter(
          (notification) => {
            if (filterStatus === "read") {
              return notification.read === true;
            } else if (filterStatus === "unread") {
              return notification.read === false;
            }
            return true;
          }
        );
      }

      setNotifications(filteredNotifications);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalElements || notificationsData.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get notification title based on type
  const getNotificationTitle = (type) => {
    return t(`notification.types.${type}`, "Thông báo");
  };

  // Helper function to format timestamp to time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return t("notification.timeAgo.justNow", "Vừa xong");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("notification.timeAgo.minutesAgo", "{{count}} phút trước", {
        count: minutes,
      });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("notification.timeAgo.hoursAgo", "{{count}} giờ trước", {
        count: hours,
      });
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return t("notification.timeAgo.daysAgo", "{{count}} ngày trước", {
        count: days,
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (type, value) => {
    if (type === "type") {
      setFilterType(value);
    } else if (type === "status") {
      setFilterStatus(value);
    }
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch notifications when dependencies change
  useEffect(() => {
    fetchNotifications();
  }, [currentPage, searchTerm, filterType, filterStatus]);

  // Get notification type color
  const getTypeColor = (type) => {
    const colorMap = {
      REMINDER: "blue",
      QUIZ_RESULT: "green",
      FLASHCARD_REMINDER: "purple",
      SYSTEM: "orange",
      ACHIEVEMENT: "gold",
      COURSE_UPDATE: "cyan",
    };
    return colorMap[type] || "default";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <BellOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("notification.title", "Thông báo")}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t(
                    "notification.subtitle",
                    "Quản lý và xem tất cả thông báo của bạn"
                  )}
                </p>
              </div>
            </div>

            {notifications.some((n) => !n.read) && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={markAllAsRead}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("notification.markAllRead", "Đánh dấu tất cả đã đọc")}
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Search
                placeholder={t(
                  "notification.searchPlaceholder",
                  "Tìm kiếm thông báo..."
                )}
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Select
                placeholder={t("notification.filterByType", "Loại thông báo")}
                value={filterType}
                onChange={(value) => handleFilterChange("type", value)}
                className="w-40"
                size="large"
              >
                <Option value="all">{t("notification.all", "Tất cả")}</Option>
                <Option value="REMINDER">
                  {t("notification.types.REMINDER", "Nhắc nhở")}
                </Option>
                <Option value="QUIZ_RESULT">
                  {t("notification.types.QUIZ_RESULT", "Kết quả quiz")}
                </Option>
                <Option value="FLASHCARD_REMINDER">
                  {t("notification.types.FLASHCARD_REMINDER", "Flashcard")}
                </Option>
                <Option value="SYSTEM">
                  {t("notification.types.SYSTEM", "Hệ thống")}
                </Option>
                <Option value="ACHIEVEMENT">
                  {t("notification.types.ACHIEVEMENT", "Thành tích")}
                </Option>
                <Option value="COURSE_UPDATE">
                  {t("notification.types.COURSE_UPDATE", "Khóa học")}
                </Option>
              </Select>

              <Select
                placeholder={t("notification.filterByStatus", "Trạng thái")}
                value={filterStatus}
                onChange={(value) => handleFilterChange("status", value)}
                className="w-32"
                size="large"
              >
                <Option value="all">{t("notification.all", "Tất cả")}</Option>
                <Option value="unread">
                  {t("notification.unread", "Chưa đọc")}
                </Option>
                <Option value="read">{t("notification.read", "Đã đọc")}</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t(
                  "notification.noNotifications",
                  "Không có thông báo nào"
                )}
              />
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read
                    ? "border-l-4 border-blue-500 bg-blue-50/30"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge
                        color={getTypeColor(notification.type)}
                        text={notification.title}
                        className="text-sm font-medium"
                      />
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 whitespace-pre-line">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {notification.time}
                      </span>

                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {t("notification.markAsRead", "Đánh dấu đã đọc")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                t(
                  "notification.pagination.showing",
                  "Hiển thị {{start}}-{{end}} của {{total}} thông báo",
                  {
                    start: range[0],
                    end: range[1],
                    total: total,
                  }
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
