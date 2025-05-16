import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token') || null);

    const login = (email, newToken) => {
        localStorage.setItem('user_mail', email);
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('user_mail');
        localStorage.removeItem('access_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
