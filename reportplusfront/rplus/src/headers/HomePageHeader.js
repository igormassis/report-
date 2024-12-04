// HomePageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { AiOutlineForm } from 'react-icons/ai';

export default function HomePageHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wider">
          R<span className="text-yellow-300">+</span>
        </Link>
        
        {/*<nav className="flex space-x-6 items-center">
          <Link to="/" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <IoHomeOutline className="text-xl" />
            <span>Home</span>
          </Link>
          <Link to="/formularios" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <AiOutlineForm className="text-xl" />
            <span>Formulários</span>
          </Link>
        </nav>*/}
        
        <div className="flex items-center space-x-4">
          <select className="bg-transparent text-white border border-white rounded px-3 py-1 text-sm focus:ring-2 focus:ring-yellow-300 focus:outline-none">
            <option value="pt-br">Português(Brasil)</option>
            <option value="en">English</option>
          </select>
          <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900 transition-all">
            Login
          </Link>
          <Link to="/register" className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-all">
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
}
