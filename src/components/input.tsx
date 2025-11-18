import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

const InputComp = ({ label, type, value, onChange, id }: InputProps) => {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="block w-full px-3 py-2 text-lg text-gray-900 bg-transparent 
                   border-0 border-b-2 border-gray-300 appearance-none 
                   focus:outline-none focus:ring-0 focus:border-red-600 peer"
      />
    </div>
  );
};

export default InputComp;
