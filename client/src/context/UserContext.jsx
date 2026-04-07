import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("fittrack-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("fittrack-token") || null
  );

  const login = (userData, authToken) => {
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem("fittrack-user", JSON.stringify(userData));
    localStorage.setItem("fittrack-token", authToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("fittrack-user");
    localStorage.removeItem("fittrack-token");
  };

  return (
    <UserContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
