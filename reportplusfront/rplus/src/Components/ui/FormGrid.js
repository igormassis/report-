import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/utils";

const FormGrid = ({ user }) => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchForms = async () => {
            try {
                if (!user || !user.id) {
                    console.error("ID do usuário não encontrado.");
                    setMessage("Erro: Usuário não está autenticado.");
                    return;
                }

                const response = await api.get(`/form/list?userId=${user.id}`);
                console.log("Formulários recebidos:", response.data);
                setForms(response.data);
            } catch (error) {
                console.error("Erro ao buscar formulários:", error.response?.data || error.message);
                setMessage("Erro ao buscar os formulários. Tente novamente mais tarde.");
            }
        };

        fetchForms();
    }, [user]);

    if (message) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-red-500 text-center">{message}</p>
            </div>
        );
    }

    if (!forms.length) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Nenhum formulário encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-8">Registros</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {forms.map((form) => (
                        <div
                            key={form.id}
                            className="bg-white shadow-md p-4 rounded-md hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => navigate(`/forms/${form.id}`)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-bold">{form.title}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                {form.updatedAt
                                    ? `Atualizado em ${new Date(form.updatedAt).toLocaleDateString()}`
                                    : "Sem data de atualização"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {form.user ? `Por ${form.user}` : "Usuário não identificado"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormGrid;
