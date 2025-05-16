const API_BASE_URL = 'https://reservasvg.ddns.net/api/v1';
//const API_BASE_URL = 'http://192.168.1.100:8001/api/v1';

export const fetchRoot = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

/**
 * Realiza una solicitud de inicio de sesión.
 * @param {string} username - El nombre de usuario del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} - La respuesta de la API con el token.
 */
export const loginApi = async (username, password, keepSession) => {

    const scopeValue = keepSession ? "keep_session" : "";

    const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Importante para OAuth2PasswordRequestForm
        },
        body: new URLSearchParams({
            username: username,
            password: password,
            scope: scopeValue, // Enviar el valor de rememberMe
        }).toString(),

        credentials: 'include', // Enviar la cookie con el refresh_token
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el inicio de sesión');
    }

    return response.json();
};

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/refresh/`, {
            method: 'POST',
            credentials: 'include', // 🔹 IMPORTANTE: Enviar la cookie con el refresh_token
        });

        if (!response.ok) {
            throw new Error('No se pudo refrescar el token');
        }

        const data = await response.json();

        // Guardar el nuevo access_token en localStorage
        localStorage.setItem('access_token', data.access_token);

        return true;
    } catch (error) {
        console.error(error);
        localStorage.removeItem('access_token'); // Borrar el token inválido
        return false;
    }
};


export const authFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem('access_token');

    // Configurar headers y autenticación
    options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    } 
    
    options.credentials = 'include'; // Para enviar la cookie del refresh_token

    // Hacer la solicitud
    let response = await fetch(`${url}`, options);

    // Si el access token expiró, intentamos renovarlo
    if (response.status === 401) {
        console.log("Access token expirado. Intentando refrescar...");

        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
            accessToken = localStorage.getItem('access_token'); // Obtener el nuevo token
            options.headers['Authorization'] = `Bearer ${accessToken}`;

            // Reintentar la petición original
            response = await fetch(`${url}`, options);
        } else {
            console.error("No se pudo refrescar el token. Redirigiendo a login...");
            window.location.href = "/login"; // Si el refresh falla, redirigir al login
            return;
        }
    }

    return response;
};


/**
 * Obtiene las reservas de un usuario 
 * @returns {Promise<Array>} Lista de reservas.
 */
export const getReservas = async () => {

    const response = await authFetch(`${API_BASE_URL}/usuario/reservas`, { method: 'GET' });

    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }

    return response.json();
};


/**
 * Modifica una reserva existente
 * @param {object} reservaData
 * @returns {Promise<Array>} Lista de reservas.
 */
export const updateEstadoReserva = async (reservaId, reservaData) => {

    const response = await authFetch(`${API_BASE_URL}/usuario/reserva/${reservaId}`, {
        method: 'PUT', 
        body: JSON.stringify(reservaData)
    });

    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }

    return response.json();
};


/**
 * Elimina una reserva por su ID.
 * @param {number} reservaId
 * @returns {Promise<void>}
 */
export const deleteReserva = async (reservaId) => {
    const response = await authFetch(`${API_BASE_URL}/usuario/reserva/${reservaId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error('Error al eliminar la reserva');
    }
};

/**
 * Añade una nueva reserva.
 * @param {object} reservaData
 * @returns {Promise<object>} La reserva creada.
 */
export const addReserva = async (reservaData) => {
    const response = await authFetch(`${API_BASE_URL}/usuario/reserva`, {
        method: 'POST',
        body: JSON.stringify(reservaData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear la reserva');
    }

    return response.json();
};


