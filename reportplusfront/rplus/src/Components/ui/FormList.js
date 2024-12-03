import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/utils";
import HomeScreenHeader from "../../headers/HomeScreenHeader"; // Importando o header

const FormList = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchForms = async () => {
            if (!user?.id) {
                setMessage("Usuário não identificado.");
                return;
            }

            try {
                const response = await api.get(`/form/list?userId=${user.id}`);
                setForms(response.data);
            } catch (error) {
                console.error("Erro ao buscar formulários:", error);
            }
        };

        fetchForms();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/form/${id}`);
            setForms(forms.filter((form) => form.id !== id));
            setMessage("Formulário excluído com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir o formulário:", error);
            setMessage("Erro ao excluir o formulário.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            {/* Adicionando o Header */}
            <HomeScreenHeader user={user} onLogout={onLogout} />

            <main className="container mx-auto py-12 px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Lista de Formulários</h1>
                    {/*<button
                        onClick={() => navigate("/home")}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Voltar para a Home
                    </button>*/}
                </div>

                {message && <p className="text-red-500 mb-4">{message}</p>}

                <ul className="space-y-4">
                    {forms.map((form) => (
                        <li key={form.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{form.title}</h2>
                            <p className="text-gray-600">{form.description}</p>
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => navigate(`/form/${form.id}`)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Visualizar
                                </button>
                                <button
                                    onClick={() => navigate(`/forms/edit/${form.id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(form.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default FormList;
