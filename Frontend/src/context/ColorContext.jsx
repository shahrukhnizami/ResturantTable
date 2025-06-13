import React, { createContext, useContext, useState } from "react";

// Create a Context
const ColorContext = createContext();

// Provider Component
export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    primary: "#1E3A8A",  // Default primary color (blue)
    secondary: "#1ee3c9", // Default secondary color (green)
  });

  // Function to update colors
  const updateColors = (newColors) => {
    setColors((prev) => ({ ...prev, ...newColors }));
  };

  return (
    <ColorContext.Provider value={{ colors, updateColors }}>
      {children}
    </ColorContext.Provider>
  );
};

// Custom Hook to use the context
export const useColors = () => useContext(ColorContext);
