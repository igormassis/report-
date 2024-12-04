// LoginPageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPageHeader() {
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
          <Link to="/register" className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-all">
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
}
