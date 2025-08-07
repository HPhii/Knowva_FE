import i18n from "i18next";

// Utility function to convert backend errors to user-friendly messages
export const getErrorMessage = (error) => {
  // If error is already a user-friendly message, return it
  if (typeof error === "string") {
    return error;
  }

  // Handle different error response formats
  let errorMessage = "";

  if (error?.response?.data) {
    const { data } = error.response;
    if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (typeof data === "string") {
      errorMessage = data;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  // Mapping backend error messages to translation keys
  const errorMappings = [
    // Login errors
    { match: "Failed to fetch", key: "error.failedToFetch" },
    {
      match: "Incorrect Email or Password",
      key: "error.incorrectEmailOrPassword",
    },
    { match: "User not found", key: "error.userNotFound" },
    {
      match: "Invalid email or password",
      key: "error.incorrectEmailOrPassword",
    },
    { match: "Authentication failed", key: "error.authenticationFailed" },
    { match: "Login failed", key: "error.loginFailed" },
    // Register errors
    { match: "User already exists", key: "error.userAlreadyExists" },
    { match: "Email already exists", key: "error.emailAlreadyExists" },
    { match: "Username already exists", key: "error.usernameAlreadyExists" },
    { match: "Password too short", key: "error.passwordTooShort" },
    { match: "Password too weak", key: "error.passwordTooWeak" },
    { match: "Invalid email format", key: "error.invalidEmailFormat" },
    { match: "Invalid username", key: "error.invalidUsername" },
    { match: "Registration failed", key: "error.registrationFailed" },
    // Network errors
    { match: "Network Error", key: "error.networkError" },
    { match: "Request timeout", key: "error.requestTimeout" },
    { match: "Server error", key: "error.serverError" },
    { match: "Service unavailable", key: "error.serviceUnavailable" },
    // Generic errors
    { match: "Something went wrong", key: "error.somethingWentWrong" },
    { match: "Internal server error", key: "error.internalServerError" },
    { match: "Bad request", key: "error.badRequest" },
    { match: "Unauthorized", key: "error.unauthorized" },
    { match: "Forbidden", key: "error.forbidden" },
    { match: "Not found", key: "error.notFound" },
    { match: "Conflict", key: "error.conflict" },
    { match: "Too many requests", key: "error.tooManyRequests" },
  ];

  for (const { match, key } of errorMappings) {
    if (
      errorMessage &&
      errorMessage.toLowerCase().includes(match.toLowerCase())
    ) {
      return i18n.t(key);
    }
  }

  // If no specific mapping found, return a generic message
  return i18n.t("error.somethingWentWrong");
};

// Specific error handlers for different scenarios
export const getLoginErrorMessage = (error) => {
  const baseMessage = getErrorMessage(error);
  if (error?.response?.status === 401) {
    return i18n.t("error.incorrectEmailOrPassword");
  }
  if (error?.response?.status === 429) {
    return i18n.t("error.tooManyLoginAttempts");
  }
  return baseMessage;
};

export const getRegisterErrorMessage = (error) => {
  const baseMessage = getErrorMessage(error);
  if (error?.response?.status === 409) {
    return i18n.t("error.userAlreadyExists");
  }
  if (error?.response?.status === 400) {
    return i18n.t("error.invalidRegistration");
  }
  return baseMessage;
};
