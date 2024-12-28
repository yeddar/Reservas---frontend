import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider'; // Importa AuthProvider desde su ruta

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Envuelve App con AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);

