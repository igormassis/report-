// ProfileScreenHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

export default function ProfileScreenHeader({ user, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Botão de Voltar */}
        <Link to="/home" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
          <FaArrowLeft className="text-2xl" />
          <span>Voltar</span>
        </Link>

        {/* Informações do Usuário */}
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-3xl text-white" />
          <span className="text-white text-lg font-semibold">
            {user?.name || 'Usuário'}
          </span>
        </div>

        {/* Opções de Configuração e Logout */}
        <div className="flex items-center space-x-4">
          <Link to="/settings" className="text-white hover:text-yellow-300 transition-colors">
            <FaCog className="text-2xl" title="Configurações" />
          </Link>
          <button onClick={onLogout} className="text-white hover:text-yellow-300 transition-colors flex items-center space-x-1">
            <FaSignOutAlt className="text-2xl" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
