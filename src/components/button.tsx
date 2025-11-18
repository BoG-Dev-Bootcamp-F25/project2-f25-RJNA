import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const ButtonComp = ({
  label,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 mt-4 text-xl text-white bg-red-600 rounded-lg 
                 hover:bg-red-700 focus:outline-none focus:ring-2 
                 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};

export default ButtonComp;
