import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/utils"; // Certifique-se de que este arquivo aponta corretamente para seu axios configurado
import HomeScreenHeader from "../../headers/HomeScreenHeader";

const FormCreate = ({ user }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "" });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            setMessage("Erro: Usuário não está autenticado.");
            return;
        }

        if (!file) {
            setMessage("Erro: Por favor, anexe um arquivo.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", form.title.trim());
            formData.append("description", form.description.trim());
            formData.append("userId", user.id);
            formData.append("file", file);

            const response = await api.post("/form/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percent);
                },
            });

            setMessage("Formulário criado com sucesso!");
            setTimeout(() => navigate("/home"), 2000);
        } catch (error) {
            console.error("Erro ao criar o formulário:", error.response?.data || error.message);
            setMessage("Erro ao criar o formulário. Verifique os dados e tente novamente.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <HomeScreenHeader user={user} />

            <main className="container mx-auto py-12 px-8">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Criar Novo Formulário</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-10 rounded-xl shadow-lg space-y-6"
                >
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                            Título do Formulário
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="mt-2 w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Digite o título..."
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-lg font-medium text-gray-700"
                        >
                            Descrição do Formulário
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="mt-2 w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Digite a descrição..."
                            rows="5"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="block text-lg font-medium text-gray-700">
                            Anexar Arquivo
                        </label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="mt-2 w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            required
                        />
                    </div>

                    {progress > 0 && (
                        <div className="relative w-full bg-gray-200 rounded">
                            <div
                                className="absolute top-0 left-0 h-2 bg-blue-600 rounded"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all"
                    >
                        Criar Formulário
                    </button>

                    {message && (
                        <p className="text-center text-lg mt-4 text-green-600">
                            {message}
                        </p>
                    )}
                </form>
            </main>
        </div>
    );
};

export default FormCreate;
