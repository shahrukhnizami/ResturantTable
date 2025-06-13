import React, { useState } from "react";
import { useColors } from "../context/ColorContext";

const Button = ({ children, onClick, Width, className, Danger, Padding, hover, bgColor, textColor }) => {
  const { colors } = useColors();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        background: isHovered ? hover || bgColor || "navy" : "white",
        transition: "background 0.3s ease, color 0.3s ease",
        color: isHovered ? (textColor || "white") : (textColor || "black"),
        border: "1px solid black",
      }}
      
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
