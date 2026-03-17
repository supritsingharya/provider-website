"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchOtp, submitOtp, submitUser, getUserById } from '../lib/auth-api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);

    const checkAuth = async (token, user) => {
        try {
            const result = await getUserById(user.id, token);
            if (result.error) {
                throw new Error(result.error.message);
            }
            // If valid, maybe update user data?
            // setUser(result); // Optional: update with fresh data
        } catch (error) {
            console.error("Auth check failed:", error);
            logout();
        }
    };

    useEffect(() => {
        // Check local storage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            const userObj = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(userObj);

            // Verify token validity
            checkAuth(storedToken, userObj);
        }
    }, []);

    const loginWithPhone = async (phoneNumber) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchOtp({ number: phoneNumber });
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const verifyOtpAndLogin = async (phoneNumber, otp) => {
        setLoading(true);
        setError(null);
        try {
            const result = await submitOtp({ number: phoneNumber, otp });

            if (result && result.jwt && result.user) {
                setToken(result.jwt);
                setUser(result.user);

                // Persist
                localStorage.setItem('token', result.jwt);
                localStorage.setItem('user', JSON.stringify(result.user));

                setLoading(false);
                return result;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError(err.message || 'Verification failed');
            setLoading(false);
            throw err;
        }
    };

    const registerUser = async (name, phoneNumber) => {
        setLoading(true);
        setError(null);
        try {
            const result = await submitUser({ name, number: phoneNumber });

            if (result && result.jwt && result.user) {
                setToken(result.jwt);
                setUser(result.user);

                localStorage.setItem('token', result.jwt);
                localStorage.setItem('user', JSON.stringify(result.user));

                setLoading(false);
                return result;
            } else {
                // Sometimes registration might act differently, e.g. require OTP verification after creation
                // But based on userSlice, submitUser returns result which is handled similarly.
                setLoading(false);
                return result;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
            console.error(err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            loginWithPhone,
            verifyOtpAndLogin,
            registerUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
