import React from 'react';

export default function Input({ type, id, placeholder, className, value, onChange }) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500 transition-all duration-300 ${className}`}
    />
  );
}
