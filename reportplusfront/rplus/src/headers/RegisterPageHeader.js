// RegisterPageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPageHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md py-2">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wider">
          R<span className="text-yellow-300">+</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <select className="bg-transparent text-white border border-white rounded px-3 py-1 text-sm focus:ring-2 focus:ring-yellow-300 focus:outline-none">
            <option value="pt-br">Português(Brasil)</option>
            <option value="en">English</option>
          </select>
          <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900 transition-all">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
