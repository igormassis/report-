// PasswordResetHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function PasswordResetHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Botão de Voltar */}
        <Link to="/login" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
          <FaArrowLeft className="text-xl" />
          <span>Voltar para Login</span>
        </Link>

        {/* Título da Página */}
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Recuperação de Senha
        </h1>

        {/* Espaço para alinhamento */}
        <div></div>
      </div>
    </header>
  );
}
