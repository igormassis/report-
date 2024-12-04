import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PasswordResettHeader() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navega para a página anterior
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center max-w-3xl mx-auto mt-4 rounded-lg">
            <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 font-semibold">
                &larr; Voltar
            </button>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                Home
            </Link>
        </header>
    );
}
