import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};