import React, { useState } from 'react';
import api from './api';
import '../../styles.css';
import PasswordResettHeader from './PasswordResettHeader';

const PasswordReset = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setMessage('Senha redefinida com sucesso.');
        } catch (error) {
            setMessage('Erro: Não foi possível redefinir a senha.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center">
            <PasswordResettHeader />
            <div className="flex items-center justify-center min-h-[80vh] w-full">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Redefinir Senha</h2>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Token de Recuperação</label>
                        <input
                            type="text"
                            placeholder="Digite o token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                        <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua nova senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                        <button
                            onClick={handleReset}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Redefinir Senha
                        </button>
                        {message && <p className="text-center mt-4 font-medium text-green-600">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
