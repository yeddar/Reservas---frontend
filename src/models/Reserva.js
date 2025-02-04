export class Reserva {
    constructor(id_reserva, dia_semana, hora, clase, centro, activa, confirmada) {
      this.id_reserva = id_reserva;
      this.dia_semana = dia_semana;
      this.hora = hora;
      this.clase = clase;
      this.centro = centro;
      this.activa = activa;
      this.confirmada = confirmada;
    }
  
    static fromApi(data) {

      // Formato del campo dia_semana
      const diasSemana = {
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mié",
        thursday: "Jue",
        friday: "Vie",
        saturday: "Sáb",
        sunday: "Dom",
      };

      // Formato del campo 
      const centros = {
        "134": "Platero"
      }

      return new Reserva(
        data.id_reserva,
        diasSemana[data.dia_semana],
        data.hora,
        data.clase,
        centros[data.centro],
        data.activa,
        data.confirmada
      );
    }

    static ordenarReservas(reservas) {
      const diasSemanaOrden = {
        Lun: 1,
        Mar: 2,
        Mié: 3,
        Jue: 4,
        Vie: 5,
        Sáb: 6,
        Dom: 7,
      };
  
      return reservas.sort((a, b) => {
        const diaA = diasSemanaOrden[a.dia_semana];
        const diaB = diasSemanaOrden[b.dia_semana];
  
        // Primero por el día de la semana
        if (diaA !== diaB) {
          return diaA - diaB;
        }
  
        // Luego por la hora
        return a.hora.localeCompare(b.hora);
      });
    }
    
      
     
  }
  