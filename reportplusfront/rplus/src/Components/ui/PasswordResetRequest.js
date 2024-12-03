import React, { useState } from 'react';
import api from './api';
import PasswordResetHeader from './PasswordResetHeader';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequest = async () => {
        setMessage('');  
        setError('');    

        // Verificar se o e-mail está preenchido
        if (!email.trim()) {
            setError('O campo de e-mail é obrigatório.');
            return;
        }

        console.log('Iniciando requisição para /auth/request-password-reset com email:', email);

        try {
            // Enviar requisição para o backend
            const response = await api.post('/auth/request-password-reset', {
                email: email.trim() // Remove espaços em branco
            });

            console.log('Resposta recebida:', response.data);
            setMessage(response.data.message); // Mensagem de sucesso do backend
        } catch (error) {
            console.error('Erro na requisição:', error.response || error.message);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Mensagem de erro do backend
            } else {
                setError('Erro: Não foi possível solicitar a recuperação de senha.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-custom-bg bg-cover bg-center text-gray-800">
            <PasswordResetHeader />
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="bg-white bg-opacity-90 shadow-lg p-8 rounded-lg w-full max-w-md mx-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Recuperação de Senha</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Insira seu e-mail para receber instruções de recuperação.
                    </p>
                    <div>
                        <label className="text-gray-700 font-medium mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                        <button
                            onClick={handleRequest}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                        >
                            Solicitar Recuperação
                        </button>
                        {message && (
                            <p className="mt-6 text-center text-green-600 font-medium">
                                {message}
                            </p>
                        )}
                        {error && (
                            <p className="mt-6 text-center text-red-600 font-medium">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequest;
