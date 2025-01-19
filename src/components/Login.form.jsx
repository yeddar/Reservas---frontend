import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { loginApi } from "../api/backend"; // Función de API para autenticar al usuario
import { Button } from 'primereact/button';
import "../styles/globals.css"; // Importa los estilos generales
import "../styles/Login.css"; // Importa los estilos específicos del login

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Manejo de autenticación del contexto global
  const [loading, setLoading] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); // Estado para manejar errores del login

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setError(null); // Reinicia el error al intentar hacer login

    setLoading(true); 

    try {
      // Llamada a la API para autenticar al usuario
      const response = await loginApi(formData.email, formData.password);

      // Si el login es exitoso
      if (response.access_token) {
        login(formData.email, response.access_token); // Guardar el token en el contexto global
        navigate("/home"); // Redirigir al Home
      } else {
        setError(response.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError(err);
    }
    finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="login-form">
        
        <div className="login-header">
          <h1>Acceso</h1>
          <h2>a las reservas</h2>
        </div>
      
        <div className="form-group login-form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Introduce tu correo asociado"
          />
        </div>
        <div className="form-group login-form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Introduce tu contraseña asociada"
          />
        </div>
        {error && <div className="error-message">{error}</div>} {/* Mostrar errores */}
      
        <Button
            label={loading ? 'Espera...' : 'Acceder'} 
            icon="pi pi-sign-in" 
            type="submit" 
            loading={loading} 
        />
      </form>
    </div>
  );
};

export default LoginForm;
