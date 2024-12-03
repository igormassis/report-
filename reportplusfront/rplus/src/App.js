import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "./Components/HomePage";
import HomeScreen from "./Components/HomeScreen";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import PasswordResetRequest from "./Components/ui/PasswordResetRequest";
import PasswordReset from "./Components/ui/PasswordReset";
import ProfilePage from "./Components/ProfilePage";
import Footer from "./Components/Footer";
import FormList from "./Components/ui/FormList";
import FormCreate from "./Components/ui/FormCreate";
import FormDetails from "./Components/ui/FormDetails";
import FormGrid from "./Components/ui/FormGrid";
import TeamScreen from "./Components/TeamScreen";
import FormEdit from "./Components/ui/FormEdit";
import TaskScreen from "./Components/ui/taskScreen"; // Importar a nova tela de tarefas

// Componente para proteger rotas
const ProtectedRoute = ({ isLoggedIn, user, children }) => {
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Para redirecionamento

  // Recupera o usuário armazenado no localStorage ao carregar o app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Usuário recuperado do localStorage:", parsedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Função para lidar com login
  const handleLogin = (userData) => {
    console.log("Dados do usuário após login:", userData);
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Função para lidar com logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // Redireciona para a homepage
  };

  // Função para lidar com atualização de perfil
  const handleUpdateProfile = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };

  // Função para lidar com desativação de conta
  const handleDeactivateAccount = () => {
    console.log("Desativando conta do usuário...");
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // Redireciona para a homepage após desativação
  };

  // Para gerenciar o estado do Footer dinamicamente
  const location = useLocation();

  return (
    <div className="app flex flex-col min-h-screen">
      <Routes>
        {/* Página inicial (não autenticada) */}
        <Route exact path="/" element={<HomePage />} />

        {/* Página de Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Página de Registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Página inicial autenticada */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <HomeScreen user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Solicitação de redefinição de senha */}
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />

        {/* Redefinição de senha com token */}
        <Route path="/reset-password/:token" element={<PasswordReset />} />

        {/* Página de Perfil */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <ProfilePage
                user={user}
                onUpdateProfile={handleUpdateProfile}
                onDeactivateAccount={handleDeactivateAccount}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* Lista de formulários */}
        <Route
          path="/forms"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <FormList user={user} />
            </ProtectedRoute>
          }
        />

        {/* Criar novo formulário */}
        <Route
          path="/forms/create"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <FormCreate user={user} />
            </ProtectedRoute>
          }
        />

        {/* Detalhes do formulário */}
        <Route
          path="/form/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <FormDetails user={user} />
            </ProtectedRoute>
          }
        />

        {/* Página de visualização em grade dos formulários */}
        <Route
          path="/forms-grid"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <FormGrid user={user} />
            </ProtectedRoute>
          }
        />

        {/* Página de Equipes */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <TeamScreen />
            </ProtectedRoute>
          }
        />

        {/* Edição de formulários */}
        <Route
          path="/forms/edit/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <FormEdit user={user} />
            </ProtectedRoute>
          }
        />

        {/* Nova rota para tarefas */}
        <Route
          path="/tarefas"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} user={user}>
              <TaskScreen user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Renderizar Footer apenas em páginas específicas */}
      {!["/login", "/register", "/password-reset-request"].includes(
        location.pathname
      ) && <Footer />}
    </div>
  );
}

export default App;
