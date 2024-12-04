import React from 'react';
import ProfileScreenHeader from '../headers/ProfileScreenHeader';
import Card, { CardHeader, CardContent, CardTitle } from './ui/card';
import { FaUserCircle, FaCog } from 'react-icons/fa';

export default function ProfileScreen({ user, onLogout }) {
    const handleDeactivateAccount = async () => {
        if (!user || !user.id) {
            alert('Usuário inválido ou ID não encontrado.');
            console.error('Erro: Usuário inválido ou ID ausente.', user);
            return;
        }

        const confirm = window.confirm(
            'Tem certeza de que deseja desativar sua conta? Esta ação é irreversível.'
        );
        if (!confirm) return;

        try {
            console.log(`Tentando desativar conta para o usuário com ID: ${user.id}`);

            const response = await fetch(`https://localhost:7180/api/auth/desativar-conta/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Resposta da API:', response);

            if (response.ok) {
                alert('Conta desativada com sucesso!');
                console.log('Usuário desativado:', user);

                // Verifica se onLogout foi passado como prop
                if (onLogout && typeof onLogout === 'function') {
                    onLogout(); // Limpa estado e redireciona
                } else {
                    console.warn('onLogout não foi passado ou não é uma função.');
                }
            } else {
                const errorMessage = await response.text();
                console.error('Erro na API:', errorMessage);
                alert(`Erro ao desativar conta: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Erro ao desativar conta:', error);
            alert('Ocorreu um erro ao tentar desativar sua conta. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
            <ProfileScreenHeader user={user} onLogout={onLogout} />

            <div className="flex items-center justify-center p-6">
                <div className="max-w-3xl w-full space-y-6">
                    {/* Card de Informações do Usuário */}
                    <Card className="p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <FaUserCircle className="text-blue-500 text-4xl" />
                                <CardTitle className="text-3xl font-bold text-gray-800">Perfil do Usuário</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Nome</p>
                                    <p className="text-lg font-semibold text-gray-800">{user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-lg font-semibold text-gray-800">{user?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Configurações de Conta */}
                    <Card className="p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <FaCog className="text-blue-500 text-4xl" />
                                <CardTitle className="text-3xl font-bold text-gray-800">Configurações de Conta</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <button
                                onClick={handleDeactivateAccount}
                                className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-semibold"
                            >
                                Desativar Conta
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
