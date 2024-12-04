import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/utils";
import HomeScreenHeader from "../../headers/HomeScreenHeader"; // Importando o Header

const FormEdit = ({ user, onLogout }) => {
  const { id } = useParams(); // Captura o ID da URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Carrega os dados do formulário
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await api.get(`/form/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao carregar formulário:", err);
        setError("Não foi possível carregar o formulário.");
        setIsLoading(false);
      }
    };

    fetchFormDetails();
  }, [id]);

  // Atualiza os dados do formulário
  const handleUpdate = async () => {
    try {
      const response = await api.put(`/form/${id}`, {
        title,
        description,
      });

      if (response.status === 200) {
        alert("Formulário atualizado com sucesso!");
        navigate("/forms");
      } else {
        throw new Error("Erro ao salvar o formulário");
      }
    } catch (err) {
      console.error("Erro ao atualizar o formulário:", err);
      alert("Não foi possível salvar o formulário. Tente novamente.");
    }
  };

  if (isLoading) return <div className="text-center py-12">Carregando formulário...</div>;

  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
      {/* Adicionando o Header */}
      <HomeScreenHeader user={user} onLogout={onLogout} />

      <main className="container mx-auto py-12 px-8 flex-grow">
        <section className="bg-white p-10 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Formulário</h1>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-all"
            >
              Salvar
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition-all"
            >
              Cancelar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FormEdit;
