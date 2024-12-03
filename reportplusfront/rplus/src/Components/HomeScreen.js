import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usado para navegação
import api from '../lib/utils';
import HomeScreenHeader from '../headers/HomeScreenHeader';

export default function HomeScreen({ user, onLogout }) {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredForms, setFilteredForms] = useState([]);
    const [tasks, setTasks] = useState([]); // Lista completa de tarefas

    // Fetch de formulários
    useEffect(() => {
        const fetchForms = async () => {
            try {
                if (!user || !user.id) {
                    console.error("ID do usuário não está definido.");
                    return;
                }

                const response = await api.get(`/form/list?userId=${user.id}`);
                if (Array.isArray(response.data)) {
                    setForms(response.data);
                    setFilteredForms(response.data);
                } else {
                    console.error("Resposta inesperada da API:", response.data);
                    setForms([]);
                    setFilteredForms([]);
                }
            } catch (error) {
                console.error("Erro ao buscar formulários:", error);
            }
        };

        if (user?.id) {
            fetchForms();
        }
    }, [user]);

    // Fetch de tarefas
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (!user || !user.id) {
                    console.error("ID do usuário não está definido.");
                    return;
                }

                const response = await api.get(`/tasks?userId=${user.id}`);
                if (Array.isArray(response.data)) {
                    // Ordenar tarefas pela data de vencimento mais próxima
                    const sortedTasks = response.data
                        .filter(task => new Date(task.dueDate) >= new Date()) // Apenas tarefas futuras
                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                    setTasks(sortedTasks);
                } else {
                    console.error("Resposta inesperada da API:", response.data);
                    setTasks([]);
                }
            } catch (error) {
                console.error("Erro ao buscar tarefas:", error);
            }
        };

        if (user?.id) {
            fetchTasks();
        }
    }, [user]);

    // Filtra os formulários pelo título com base no termo de pesquisa
    useEffect(() => {
        const filtered = forms.filter((form) =>
            form.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredForms(filtered);
    }, [searchTerm, forms]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <HomeScreenHeader user={user} onLogout={onLogout} />

            <main className="container mx-auto py-12 px-8">
                {/* Seção de Saudação */}
                <section className="bg-white p-10 rounded-xl shadow-lg flex justify-between items-center transition-transform transform hover:scale-105">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            Olá, {user && user.name ? user.name : 'Visitante'} 👋
                        </h1>
                        <p className="text-lg mt-4 text-gray-600">
                            Pesquise por formulários ou tarefas para começar.
                        </p>
                    </div>
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full p-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="absolute right-3 top-3 text-gray-600 hover:text-blue-600 transition-all">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 16l4-4m0 0l4 4m-4-4v12"
                                />
                            </svg>
                        </button>
                    </div>
                </section>

                {/* Seção de Formulários */}
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Formulários</h2>
                        <nav className="space-x-6">
                            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                Em destaque
                            </button>
                            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                Novos
                            </button>
                            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                Antigos
                            </button>
                            <button
                                onClick={() => navigate('/forms')}
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Mostrar Todos
                            </button>
                        </nav>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {filteredForms.map((form) => (
                            <div
                                key={form.id}
                                onClick={() => navigate(`/form/${form.id}`)}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105 cursor-pointer"
                            >
                                <span className="block text-center text-xl font-semibold text-gray-800">
                                    {form.title}
                                </span>
                                <span className="block text-center text-gray-500 mt-2">{form.createdAt}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => navigate('/forms/create')}
                            className="flex flex-col items-center justify-center bg-blue-100 text-blue-600 p-6 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-all transform hover:scale-105"
                        >
                            <span className="text-3xl font-bold">+</span>
                            <span className="mt-2">Novo Formulário</span>
                        </button>
                    </div>
                </section>

                {/* Seção de Tarefas */}
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Próxima Tarefa</h2>
                    {tasks.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-medium text-gray-800">{tasks[0].title}</h3>
                            <p className="text-gray-500">
                                Data de Vencimento: {new Date(tasks[0].dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
                    )}
                    <button
                        onClick={() => navigate('/tarefas')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                    >
                        Ver Todas as Tarefas
                    </button>
                </section>
            </main>
        </div>
    );
}
