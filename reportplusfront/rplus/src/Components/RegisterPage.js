import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/button';
import Input from './ui/input';
import Card, { CardContent, CardHeader, CardTitle } from './ui/card';
import RegisterPageHeader from '../headers/RegisterPageHeader'; // Header da página de registro
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            await axios.post('https://localhost:7180/api/Auth/register', {
                name,
                email,
                password,
            });
            // Redireciona para a página de login após cadastro bem-sucedido
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Erro no cadastro. Tente novamente.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <RegisterPageHeader /> {/* Header da página de registro */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">Crie a sua conta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Insira seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Insira seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Insira a sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                                Cadastrar
                            </Button>
                        </form>
                        <p className="text-center mt-4 text-gray-600">
                            Já tem uma conta?{' '}
                            <a href="/login" className="text-blue-600 hover:underline">Entre aqui</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
