const API_BASE_URL = 'http://192.168.1.100:8001/api';

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
export const loginApi = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Importante para OAuth2PasswordRequestForm
        },
        body: new URLSearchParams({
            username: username,
            password: password,
        }).toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el inicio de sesión');
    }

    return response.json();
};


/**
 * Obtiene las reservas de un usuario por su ID.
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<Array>} Lista de reservas.
 */
export const getReservas = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/usuario/reservas`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }

    return response.json();
};


/**
 * Modifica una reserva existente
 * @param {object} reservaData
 * @param {string} token
 * @returns {Promise<Array>} Lista de reservas.
 */
export const updateEstadoReserva = async (reservaId, reservaData, token) => {
    const response = await fetch(`${API_BASE_URL}/usuario/reserva/${reservaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
    });

    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }

    return response.json();
};


/**
 * Elimina una reserva por su ID.
 * @param {number} reservaId
 * @param {string} token
 * @returns {Promise<void>}
 */
export const deleteReserva = async (reservaId, token) => {
    const response = await fetch(`${API_BASE_URL}/usuario/reserva/${reservaId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al eliminar la reserva');
    }
};

/**
 * Añade una nueva reserva.
 * @param {object} reservaData
 * @param {string} token
 * @returns {Promise<object>} La reserva creada.
 */
export const addReserva = async (reservaData, token) => {
    const response = await fetch(`${API_BASE_URL}/usuario/reserva`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear la reserva');
    }

    return response.json();
};


