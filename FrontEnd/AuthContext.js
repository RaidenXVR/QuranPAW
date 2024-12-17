import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: username,
        password: password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      console.log('Token disimpan di localStorage');
    } catch (error) {
      console.error('Error saat login:', error);
    }
  };

  const value = {
    isAuthenticated,
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
