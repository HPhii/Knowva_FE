// Authentication utility functions

export const saveLoginData = (data) => {
  try {
    console.log("saveLoginData received:", data);

    // 1. Lưu token với nhiều format khác nhau
    if (data.token || data.accessToken || data.access_token) {
      const token = data.token || data.accessToken || data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      console.log("Token saved:", token ? "exists" : "null");
    }
    
    // 2. Lưu refresh token
    if (data.refreshToken || data.refresh_token) {
      const refreshToken = data.refreshToken || data.refresh_token;
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // 3. Lưu thông tin user - Kiểm tra nhiều cấu trúc có thể
    let userInfo = null;
    let userId = null;

    // THAY ĐỔI: Kiểm tra user data ở root level TRƯỚC
    if (data.userId || data.id || data._id || data.accountId) {
      userId = data.userId || data.id || data._id || data.accountId;
      userInfo = {
        id: userId,
        userId: data.userId,
        accountId: data.accountId,
        email: data.email,
        name: data.fullName || data.name || data.username,
        username: data.username,
        role: data.role,
        status: data.status,
        isVerified: data.isVerified,
        avatarUrl: data.avatarUrl,
        phoneNumber: data.phoneNumber
      };
      console.log("User data found at root level");
    }
    // Kiểm tra nếu có object user trong response (fallback)
    else if (data.user) {
      userInfo = data.user;
      userId = data.user.id || data.user._id || data.user.userId;
      console.log("User data found in user object");
    }

    if (userInfo) {
      localStorage.setItem('user', JSON.stringify(userInfo));
      console.log("User info saved:", userInfo);
    }

    if (userId) {
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userEmail', data.email || userInfo?.email || '');
      localStorage.setItem('userName', data.fullName || data.username || userInfo?.name || '');
      localStorage.setItem('userRole', data.role || userInfo?.role || '');
      console.log("User ID saved:", userId);
    } else {
      console.error("No userId found in response!");
    }
    
    // 4. Lưu thời gian và expiry
    localStorage.setItem('loginTime', new Date().toISOString());
    
    if (data.expiresIn || data.expires_in) {
      const expiresIn = data.expiresIn || data.expires_in;
      const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString();
      localStorage.setItem('tokenExpiresAt', expiresAt);
    }
    
    // 5. Lưu toàn bộ response và set login flag
    localStorage.setItem('loginResponse', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
    
    console.log("Login data saved successfully. Final check:", {
      hasToken: !!localStorage.getItem('token'),
      hasUserId: !!localStorage.getItem('userId'),
      isLoggedIn: localStorage.getItem('isLoggedIn')
    });

    return true;
  } catch (error) {
    console.error('Error saving login data:', error);
    return false;
  }
};

export const getLoginData = () => {
  try {
    return {
      token: localStorage.getItem('token'),
      authToken: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      userId: localStorage.getItem('userId'),
      userEmail: localStorage.getItem('userEmail'),
      userName: localStorage.getItem('userName'),
      userRole: localStorage.getItem('userRole'),
      loginTime: localStorage.getItem('loginTime'),
      tokenExpiresAt: localStorage.getItem('tokenExpiresAt'),
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      fullResponse: JSON.parse(localStorage.getItem('loginResponse') || '{}')
    };
  } catch (error) {
    console.error('Error getting login data:', error);
    return null;
  }
};

export const clearLoginData = () => {
  try {
    const keysToRemove = [
      'token',
      'authToken', 
      'refreshToken',
      'user',
      'userId',
      'userEmail',
      'userName',
      'userRole',
      'loginTime',
      'tokenExpiresAt',
      'loginResponse',
      'isLoggedIn'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing login data:', error);
    return false;
  }
};

export const isTokenExpired = () => {
  try {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return false;
    
    return new Date() > new Date(expiresAt);
  } catch (error) {
    return false;
  }
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const isLoggedInFlag = localStorage.getItem('isLoggedIn') === 'true';
  const expired = isTokenExpired();
  
  return token && isLoggedInFlag && !expired;
};

export const getUserInfo = () => {
  try {
    const user = localStorage.getItem('loginResponse');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};