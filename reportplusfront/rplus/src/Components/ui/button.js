import React from 'react';

export default function Button({ onClick, children, className, variant }) {
  const baseStyles = "px-4 py-2 rounded-lg focus:outline-none focus:ring transition-all duration-300";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
