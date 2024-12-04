import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './ui/api';
import Button from './ui/button';
import Input from './ui/input';
import Card, { CardContent, CardHeader, CardTitle } from './ui/card';
import LoginPageHeader from '../headers/LoginPageHeader';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Resposta do backend:', response.data);

            if (response.data && response.data.user) {
                onLogin({
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                });
                navigate('/home'); // Redireciona após login bem-sucedido
            } else {
                setError('Erro ao fazer login. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Email ou senha inválidos.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <LoginPageHeader />
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">
                            Entre em sua conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                            <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                            Entrar
                            </Button>

                        </form>
                        <p className="text-center mt-4 text-gray-600">
                            <Link to="/password-reset-request" className="text-blue-600 hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </p>
                        <p className="text-center mt-4 text-gray-600">
                            Não tem uma conta?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
