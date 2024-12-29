import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservas, deleteReserva, updateEstadoReserva } from '../api/backend';
import { Reserva } from "../models/Reserva";
import "../styles/globals.css"; // Importa los estilos generales
import "../styles/Home.css"; 

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Switch from "react-switch";
import 'primeicons/primeicons.css';

        
        

function Home() {
    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    // Obtener reservas y guardarlas en el modelo
    const fetchReservas = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const data = await getReservas(userId, token);
            const reservas_map = data.reservas.map((reserva) => Reserva.fromApi(reserva));
            setReservas(reservas_map);
        } catch (err) {
            console.error(err);
            navigate('/login');
        } finally {
            setLoading(false);
          }
    };

    const handleDelete = async (reservaId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteReserva(reservaId, token);
            fetchReservas(); // Refrescar la lista
        } catch (err) {
            console.error(err);
        }
    };

    const handleSwitchChange = async (idReserva, newValue) => {
      const token = localStorage.getItem("token");
      
      try {
        setReservas((prevReservas) =>
          prevReservas.map((reserva) =>
            reserva.id_reserva === idReserva ? { ...reserva, activa: newValue } : reserva
          )
        );

        
        const updatedReserva = {
          estado: newValue 
        };

        // Llama a la API para actualizar la reserva en el servidor
        await updateEstadoReserva(idReserva, updatedReserva, token); 

      } catch (err) {
        // Si ocurre un error, opcionalmente puedes revertir el cambio local
        setReservas((prevReservas) =>
          prevReservas.map((reserva) =>
            reserva.id_reserva === idReserva ? { ...reserva, activa: !newValue } : reserva
          )
        );
        console.error("Error al actualizar la reserva:", err);
      }
    };

    // Navegar a la pantalla para añadir una nueva reserva
    const handleAddReservation = () => {
        navigate("/add-reservation");
    };

    

    useEffect(() => {
        fetchReservas();
    }, []);

    const nuevaReservaTemplate = () => (
      <Button 
        icon="pi pi-plus" 
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
        onClick={() => handleAddReservation()}/>

    )

    const estadoTemplate = (rowData) => (
      <div style={{ transform: 'scale(0.9)', display: 'inline-block' }}>
        <Switch
          onChange={(checked) => handleSwitchChange(rowData.id_reserva, checked)}
          checked={rowData.activa}
        />
      </div>
    );
    
    
    const confirmadaTemplate = (rowData) => (
        <i className={rowData.confirmada ? "pi pi-check-circle" : "pi pi-circle"} 
          style={rowData.confirmada ? { color: '#fd5000' } : { color: '#dfdfdf' }}></i>
    );

    const deleteTemplate = (rowData) => (
        <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={() => handleDelete(rowData.id_reserva)}/>

      );

    if (loading) {
        return <p>Cargando reservas...</p>;
    }

    return (
        <div className="home-container">
            <div className='header'>
              <h1>Mis Reservas</h1>
              {nuevaReservaTemplate()}
            </div>
            
            
          <DataTable
            value={reservas}
            //paginator
            //rows={10}
            loading={loading}
            emptyMessage="No hay reservas disponibles"
            className="p-datatable-sm"
            tableStyle={{minWidth:"20rem"}}
         
          >
            <Column
              resizeable="true"
              field="confirmada"
              body={confirmadaTemplate}
            />
            <Column field="dia_semana" header="Día" />
            <Column field="hora" header="Hora" />
            <Column field="clase" header="Clase" />
        
            
            
            <Column
              field="estado"
              header="Reserva automática"
              body={estadoTemplate}
 
              
            />
            <Column 
              body={deleteTemplate} 
              bodyStyle={{ textAlign: 'right' }}
            />
          </DataTable>
        </div>
      );
}

export default Home;
