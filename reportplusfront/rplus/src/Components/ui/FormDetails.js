import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/utils";
import HomeScreenHeader from "../../headers/HomeScreenHeader"; // Importando o Header

const FormDetails = ({ user, onLogout }) => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");
    const [downloadError, setDownloadError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormDetails = async () => {
            try {
                const response = await api.get(`/form/${id}`);
                setForm(response.data);
            } catch (error) {
                console.error("Erro ao buscar o formulário:", error);
                setError("Erro ao carregar os detalhes do formulário.");
            }
        };

        fetchFormDetails();
    }, [id]);

    const handleDownload = async (fileName) => {
        try {
            if (!fileName || typeof fileName !== "string") {
                setDownloadError("Nome do arquivo inválido.");
                return;
            }

            const response = await api.get(`/form/download/${encodeURIComponent(fileName)}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadError("");
        } catch (error) {
            console.error("Erro ao baixar o arquivo:", error);
            setDownloadError("Erro ao baixar o arquivo. Tente novamente.");
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
                <HomeScreenHeader user={user} onLogout={onLogout} />
                <div className="flex-grow flex justify-center items-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <p className="text-red-500 font-bold text-lg">{error}</p>
                        <button
                            onClick={() => navigate("/home")}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
    
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
                <HomeScreenHeader user={user} onLogout={onLogout} />
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-lg font-semibold text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
            {/* Adicionando o Header */}
            <HomeScreenHeader user={user} onLogout={onLogout} />

            <main className="container mx-auto py-12 px-8 flex-grow">
                <div className="flex justify-between mb-4">
                    {/*<button
                        onClick={handleGoBack}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Voltar
                    </button>*/}
                </div>

                <div className="bg-white p-10 rounded-xl shadow-lg">
                    <h1 className="text-4xl font-extrabold text-gray-800">{form.title}</h1>
                    <p className="text-lg text-gray-600 mt-4">{form.description}</p>

                    <div className="mt-4">
                        {downloadError && (
                            <p className="text-red-500 font-semibold">{downloadError}</p>
                        )}
                        <button
                            onClick={() => handleDownload(form.fileName)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Baixar Arquivo
                        </button>
                    </div>
                </div>
            </main>

            {/* Barra inferior 
            <footer className="bg-blue-700 text-white py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <p className="text-lg font-semibold">R+</p>
                    <p className="text-sm">© 2024 by Report+, Inc. Todos os direitos reservados.</p>
                    <a href="/contato" className="text-white hover:underline">
                        Contate-nos
                    </a>
                </div>
            </footer>*/}
        </div>
    );
};

export default FormDetails;
