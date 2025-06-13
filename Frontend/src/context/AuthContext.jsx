import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // ✅ Parse JSON data correctly
      } catch (error) {
        console.error("Error parsing user data from cookies", error);
        Cookies.remove("user"); // Remove invalid data
      }
    }
  }, []);

  const login = (userData) => {
    // console.log("Login function called with data:", userData);
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 7, secure: true }); 
  };
  
  const updateUser = (updatedUserData) => {
    console.log("Login updated:", updatedUserData);
    setUser(updatedUserData);
    Cookies.set("user", JSON.stringify(updatedUserData), { expires: 7, secure: true });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

