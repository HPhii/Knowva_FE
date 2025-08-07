// Utility function to convert backend errors to user-friendly messages
export const getErrorMessage = (error) => {
  // If error is already a user-friendly message, return it
  if (typeof error === 'string') {
    return error;
  }

  // Handle different error response formats
  let errorMessage = 'An error occurred. Please try again.';

  if (error?.response?.data) {
    const { data } = error.response;
    
    // Handle specific error messages from backend
    if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (typeof data === 'string') {
      errorMessage = data;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  // Convert common backend error messages to user-friendly English messages
  const errorMappings = {
    // Login errors
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection or try again later.',
    'Incorrect Email or Password': 'Invalid email or password. Please check your credentials.',
    'User not found': 'Account not found. Please check your email.',
    'Invalid email or password': 'Invalid email or password. Please check your credentials.',
    'Authentication failed': 'Login failed. Please check your information.',
    'Login failed': 'Login failed. Please try again.',
    
    // Register errors
    'User already exists': 'Account already exists. Please use a different email.',
    'Email already exists': 'Email is already in use. Please choose a different email.',
    'Username already exists': 'Username already exists. Please choose a different username.',
    'Password too short': 'Password must be at least 6 characters long.',
    'Password too weak': 'Password is too weak. Please choose a stronger password.',
    'Invalid email format': 'Invalid email format.',
    'Invalid username': 'Invalid username format.',
    'Registration failed': 'Registration failed. Please try again.',
    
    // Network errors
    'Network Error': 'Network connection error. Please check your internet connection or try again later.',
    'Request timeout': 'Request timed out. Please try again.',
    'Server error': 'Server error. Please try again later.',
    'Service unavailable': 'Service temporarily unavailable. Please try again later.',
    
    // Generic errors
    'Something went wrong': 'Something went wrong. Please try again.',
    'Internal server error': 'Server error. Please try again later.',
    'Bad request': 'Invalid request. Please check your information.',
    'Unauthorized': 'Access denied. Please log in again.',
    'Forbidden': 'Access denied.',
    'Not found': 'Resource not found.',
    'Conflict': 'Data conflict. Please try again.',
    'Too many requests': 'Too many requests. Please try again later.',
  };

  // Check if the error message matches any of our mappings
  for (const [backendError, userFriendlyError] of Object.entries(errorMappings)) {
    if (errorMessage.toLowerCase().includes(backendError.toLowerCase())) {
      return userFriendlyError;
    }
  }

  // If no specific mapping found, return a generic message
  return 'An error occurred. Please try again.';
};

// Specific error handlers for different scenarios
export const getLoginErrorMessage = (error) => {
  const baseMessage = getErrorMessage(error);
  
  // Additional login-specific error handling
  if (error?.response?.status === 401) {
    return 'Invalid email or password. Please check your credentials.';
  }
  
  if (error?.response?.status === 429) {
    return 'Too many failed login attempts. Please try again in 5 minutes.';
  }
  
  return baseMessage;
};

export const getRegisterErrorMessage = (error) => {
  const baseMessage = getErrorMessage(error);
  
  // Additional register-specific error handling
  if (error?.response?.status === 409) {
    return 'Account already exists. Please use a different email.';
  }
  
  if (error?.response?.status === 400) {
    return 'Invalid registration information. Please check your details.';
  }
  
  return baseMessage;
};
