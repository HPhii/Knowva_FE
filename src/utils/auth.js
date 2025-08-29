// Authentication utility functions

export const saveLoginData = (data) => {
  try {
    // 1. Lưu token với nhiều format khác nhau
    if (data.token || data.accessToken || data.access_token) {
      const token = data.token || data.accessToken || data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
    }
    
    // 2. Lưu refresh token
    if (data.refreshToken || data.refresh_token) {
      const refreshToken = data.refreshToken || data.refresh_token;
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // 3. Lưu thông tin user
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id || data.user._id || '');
      localStorage.setItem('userEmail', data.user.email || '');
      localStorage.setItem('userName', data.user.name || data.user.username || '');
      localStorage.setItem('userRole', data.user.role || '');
    }
    
    // 4. Lưu thời gian và expiry
    localStorage.setItem('loginTime', new Date().toISOString());
    
    if (data.expiresIn || data.expires_in) {
      const expiresIn = data.expiresIn || data.expires_in;
      const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString();
      localStorage.setItem('tokenExpiresAt', expiresAt);
    }
    
    // 5. Lưu toàn bộ response
    localStorage.setItem('loginResponse', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
    
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