import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`px-4 py-2 rounded ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
