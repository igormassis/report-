import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../lib/utils';
import HomeScreenHeader from "../../headers/HomeScreenHeader";

export default function TaskScreen({ user }) {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
    });

    const fetchTasks = async () => {
        try {
            if (user && user.id) {
                const response = await api.get(`/tasks?userId=${user.id}`);
                setTasks(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.dueDate) {
            alert("Título e Data de Vencimento são obrigatórios!");
            return;
        }
        try {
            const response = await api.post("/tasks", {
                ...newTask,
                userId: user.id,
            });
            setTasks([...tasks, response.data]);
            setNewTask({ title: "", description: "", dueDate: "" });
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`); // Faz a chamada para deletar a tarefa no backend
            setTasks(tasks.filter((task) => task.id !== taskId)); // Remove a tarefa da lista local
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <HomeScreenHeader user={user} />

            <main className="container mx-auto py-12 px-8">
                {/* Seção de Tarefas */}
                <section className="bg-white p-10 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
                    <ul className="mt-6 space-y-4">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold">{task.title}</h3>
                                        <p className="text-gray-600">{task.description}</p>
                                        <p className="text-gray-500">
                                            Data de Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleDeleteTask(task.id)} // Chama o método de exclusão
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Seção de Nova Tarefa */}
                <section className="mt-12 bg-white p-10 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Nova Tarefa</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateTask();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block font-semibold text-gray-700">Título</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">Descrição</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, description: e.target.value })
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">Data de Vencimento</label>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) =>
                                    setNewTask({ ...newTask, dueDate: e.target.value })
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-600"
                        >
                            Criar Tarefa
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}
