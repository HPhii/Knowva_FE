import dayjs from 'dayjs';

/**
 * 🔧 Utility functions for handling date serialization issues
 * Specifically handles Jackson LocalDate serialization problems
 */

/**
 * Safely process birthdate from API response
 * Handles both string format and LocalDate object format
 * @param {any} birthdate - Birthdate from API response
 * @returns {string|null} - Formatted date string or null
 */
export const processBirthdate = (birthdate) => {
  if (!birthdate) return null;
  
  try {
    if (typeof birthdate === 'string') {
      // Already a string, validate and return
      return dayjs(birthdate).isValid() ? birthdate : null;
    } else if (birthdate.year && birthdate.month && birthdate.day) {
      // Handle LocalDate object format
      const year = birthdate.year;
      const month = birthdate.month.toString().padStart(2, '0');
      const day = birthdate.day.toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      return dayjs(dateString).isValid() ? dateString : null;
    }
  } catch (error) {
    console.warn('⚠️ Failed to process birthdate:', error);
  }
  
  return null;
};

/**
 * Safely process birthdate for dayjs
 * @param {any} birthdate - Birthdate from API response
 * @returns {dayjs.Dayjs|null} - Dayjs object or null
 */
export const processBirthdateForDayjs = (birthdate) => {
  const processedDate = processBirthdate(birthdate);
  return processedDate ? dayjs(processedDate) : null;
};

/**
 * Check if error is related to LocalDate serialization
 * @param {Error} error - Error object
 * @returns {boolean} - True if it's a LocalDate serialization error
 */
export const isLocalDateError = (error) => {
  return error?.response?.status === 500 && 
         (error?.response?.data?.message?.includes('LocalDate') || 
          error?.response?.data?.message?.includes('Jackson') ||
          error?.response?.data?.message?.includes('JSR310'));
};

/**
 * Get user-friendly error message for LocalDate errors
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getLocalDateErrorMessage = (error) => {
  if (isLocalDateError(error)) {
    return "Lỗi xử lý dữ liệu ngày tháng từ server. Vui lòng thử lại sau hoặc liên hệ quản trị viên.";
  }
  return null;
};

/**
 * Safely format date for API requests
 * @param {dayjs.Dayjs|null} date - Dayjs date object
 * @returns {string|null} - Formatted date string or null
 */
export const formatDateForAPI = (date) => {
  if (!date || !dayjs.isDayjs(date)) return null;
  return date.format('YYYY-MM-DD');
};


