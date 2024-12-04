import React from "react";
import ReactDOM from "react-dom/client"; // use createRoot para React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Inclua estilos globais, se necessário

// Obtenha o elemento root
const rootElement = document.getElementById("root");

// Use createRoot para renderizar o App
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
