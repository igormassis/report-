import React from 'react';
import HomePageHeader from '../headers/HomePageHeader'; // Importe o header específico da HomePage

export default function HomePage() {
  return (
    <div className="min-h-screen bg-custom-bg bg-cover bg-center">
      <HomePageHeader />  {/* Adicione o header da HomePage */}
      
      <main className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl bg-opacity-70">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Trabalhe conosco</h1>
            <p className="mb-6 text-center text-gray-700">
              Nosso sistema de criação de relatórios personalizados está em constante evolução, e estamos sempre em busca de talentos
              para aprimorar nossas soluções inovadoras. Cadastre seu e-mail e faça parte do futuro da criação e gestão de relatórios!
            </p>
            <div className="flex space-x-2 justify-center">
              <input
                type="email"
                placeholder="Insira seu endereço de email"
                className="flex-grow border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              />
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all">
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
