import React, { useState } from 'react';

const teamsData = [
  { name: 'Guilherme Silva', role: 'Equipe', img: 'path/to/image', position: 'T.I' },
  { name: 'Lucas Oliveira', role: 'Equipe', img: 'path/to/image', position: 'R.H' },
  { name: 'Maria Souza', role: 'Equipe', img: 'path/to/image', position: 'P.O' },
  { name: 'Júlia Costa', role: 'Equipe', img: 'path/to/image', position: 'C.E.O' },
  // Adicione mais membros conforme necessário
];

const TeamScreen = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const handleHover = (member) => {
    setHoveredMember(member);
  };

  const handleLeave = () => {
    setHoveredMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <main className="container mx-auto py-12 px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Equipes</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {teamsData.map((member, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center p-4 bg-white rounded-lg shadow-md hover:scale-105 transform transition"
              onMouseEnter={() => handleHover(member)}
              onMouseLeave={handleLeave}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center rounded-lg">
                {hoveredMember === member && (
                  <div className="text-center text-white p-4">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p>{member.position}</p>
                    <div className="mt-4">
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-full mb-2 hover:bg-blue-600">
                        Atribuir Pasta
                      </button>
                      <button className="bg-green-500 text-white py-2 px-4 rounded-full mb-2 hover:bg-green-600">
                        Atribuir Formulário
                      </button>
                      <button className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600">
                        Criar Formulário Colaborativo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeamScreen;
