import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const initializeAuthState = () => {
  const storedIsAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
  const storedIsAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const storedUsername = localStorage.getItem('username');
  const storedAuthHeader = localStorage.getItem('authHeader');

  return {
    isAuthenticated: storedIsAuthenticated || false,
    isAdmin: storedIsAdmin || false,
    username: storedUsername || '',
    authHeader: storedAuthHeader || ''
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initializeAuthState().isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(initializeAuthState().isAdmin);
  const [username, setUsername] = useState(initializeAuthState().username);
  const [authHeader, setAuthHeader] = useState(initializeAuthState().authHeader);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    if (authHeader) {
      localStorage.setItem('authHeader', authHeader);
    } else {
      localStorage.removeItem('authHeader');
    }
  }, [authHeader]);

  const setAuthState = (username, password, isAdmin) => {
    setUsername(username);
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);

    // Tạo token Base64 từ username và password
    const token = btoa(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${token}`
    };
    setAuthHeader(headers.Authorization);
  };

  const login = async ({ username, password }) => {
    try {
      // Gửi yêu cầu đăng nhập tới backend
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
  
      if (response.data.success) {
        // Kiểm tra xem người dùng có phải admin không từ phản hồi backend
        const isAdmin = response.data.isAdmin;
  
        // Đặt trạng thái xác thực và quyền admin
        setAuthState(username, password, isAdmin);
  
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Chi tiết lỗi từ backend
        console.error('Response status:', error.response.status); // Mã trạng thái từ backend
      }
      return false;
    }
  };

  const register = async ({ username, password }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/register', { username, password });
      if (response.data.success) {
        setAuthState(username, password, false);  // Người dùng mới không phải admin
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data); // Chi tiết lỗi từ backend
        console.error('Response status:', error.response.status); // Mã trạng thái từ backend
      }
      return false;
    }
  };

  const logout = () => {
    setUsername('');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAuthHeader(''); // Xóa header xác thực
    localStorage.removeItem('authHeader');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, register, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
