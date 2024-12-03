import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { AiOutlineForm, AiOutlineTeam, AiOutlineCheckCircle } from 'react-icons/ai';

export default function HomeScreenHeader({ user, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-8">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wider">
          R<span className="text-yellow-300">+</span>
        </Link>

        <nav className="flex space-x-6 items-center">
          <Link to="/home" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <IoHomeOutline className="text-xl" />
            <span>Home</span>
          </Link>
          <Link to="/forms" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <AiOutlineForm className="text-xl" />
            <span>Formulários</span>
          </Link>
          <Link to="/tarefas" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <AiOutlineCheckCircle className="text-xl" />
            <span>Tarefas</span>
          </Link>
          {/*<Link to="/teams" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
            <AiOutlineTeam className="text-xl" />
            <span>Equipes</span>
          </Link>*/}
        </nav>

        <div className="flex items-center space-x-4">
          <select className="bg-transparent text-white border border-white rounded px-3 py-1 text-sm focus:ring-2 focus:ring-yellow-300 focus:outline-none">
            <option value="pt-br">Português (Brasil)</option>
            <option value="en">English</option>
          </select>

          <div className="flex items-center space-x-4">
            {user && user.name !== 'Visitante' ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-colors">
                  <FaUserCircle className="text-2xl" />
                  <span>Perfil</span>
                </Link>
              </>
            ) : null}

            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
