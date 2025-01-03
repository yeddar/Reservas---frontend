import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addReserva } from '../api/backend'; 

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

import { Button } from 'primereact/button';

import "../styles/globals.css"; 
import "../styles/AddReservationForm.css"; 
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const AddReservationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState({
    dayOfWeek: null,
    time: null,
    classType: null,
    isRecurrent: false,
  });

  const classOptions = [
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Virtual Cycling', value: 'Virtual Cycling' },
    { label: 'Body Combat', value: 'Body Combat' },
    { label: 'Zumba', value: 'Zumba' },
    { label: 'Yoga', value: 'Yoga' },
    { label: 'GAP', value: 'GAP' },
    { label: 'Body Pump', value: 'Body Pump' },
    { label: 'Body Balance', value: 'Body Balance' },
  ];

  const daysOfWeek = [
    { label: 'Lunes', value: 'monday' },
    { label: 'Martes', value: 'tuesday' },
    { label: 'Miércoles', value: 'wednesday' },
    { label: 'Jueves', value: 'thursday' },
    { label: 'Viernes', value: 'friday' },
    { label: 'Sábado', value: 'saturday' },
    { label: 'Domingo', value: 'sunday' }
  ];

  const handleChange = (field, value) => {
    setReservation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    
    // Obtener el token de autenticación
    const token = localStorage.getItem('token'); 

    // Verificar que todos los campos requeridos están completos
    if (!reservation.dayOfWeek || !reservation.time || !reservation.classType) {
      alert('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    // Preparar los datos de la reserva
    const reservaData = {
      dia_semana: reservation.dayOfWeek,
      hora: reservation.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      centro: 'platero',
      clase: reservation.classType
    };

    try {
      // Llamar a la función addReserva
      const nuevaReserva = await addReserva(reservaData, token);
      console.log('Reserva creada exitosamente:', nuevaReserva);
      navigate('/home'); // Redirigir al usuario a la página de inicio
    } catch (error) {
      setLoading(false);
      console.error('Error al crear la reserva:', error.message);
      alert(`Error: ${error.message}`);
    }

  };

  const handleAtras = () => {
    navigate("/home");
};

  const irAtrasTemplate = () => (
    <Button 
        icon="pi pi-arrow-left small-icon" 
        style={
            { 
                color: '#ffff', 
                borderColor: '#fd5000', 
                backgroundColor: '#fd5000',
                width: '2.3rem',
                height: '2.3rem'
            }
        } 
        rounded aria-label="Nueva reserva" 
        onClick={() => handleAtras()}/>

  )

  return (
    <div className='home-container'>
        <div className='header'>
            {irAtrasTemplate()}
            <h1>Nueva reserva</h1>
        </div>
        <div className="form-container">
            <form onSubmit={handleSubmit} className="p-fluid">
                
                <div className="field">
                  <label htmlFor="date">Día</label>
                  <Dropdown
                      id="dayOfWeek"
                      value={reservation.dayOfWeek}
                      onChange={(e) => handleChange('dayOfWeek', e.value)}
                      options={daysOfWeek}
                      placeholder="Selecciona el dia de la semana"
              
                  />
                </div>
                <div className="field">
                    <label htmlFor="time">Hora</label>
                    <Calendar
                        id="time"
                        value={reservation.time}
                        onChange={(e) => handleChange('time', e.value)}
                        showTime
                        hourFormat="24"  // Formato de hora de 24 horas
                        placeholder="Selecciona la hora"
                        timeOnly
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="field">
                  <label htmlFor="classType">Clase</label>
                  <Dropdown
                      id="classType"
                      value={reservation.classType}
                      onChange={(e) => handleChange('classType', e.value)}
                      options={classOptions}
                      placeholder="Selecciona una clase"
                  />
                </div>
                <div className="field">
                  <Button
                      className='custom-button'
                      label="Añadir Reserva" 
                      icon="pi pi-check" 
                      type="submit" 
                      loading={loading} 
                  />
                </div>
                
            </form>
        </div>
    </div>
      
    
    
  );
};

export default AddReservationForm;
