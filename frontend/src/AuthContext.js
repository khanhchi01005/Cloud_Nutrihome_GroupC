import { jsx as _jsx } from "react/jsx-runtime";
// contexts/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext({
    user: null,
    setUser: () => { },
    logout: () => { },
});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Load user từ localStorage khi app mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, setUser, logout }, children: children }));
};
