import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe o BrowserRouter
import { AuthProvider } from './context/AuthContext.jsx'; // Importe o AuthProvider
import App from './App.jsx';
import './App.css'; // Mova os imports de CSS globais para cá

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);