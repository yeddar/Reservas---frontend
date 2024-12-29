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
        wednesday: "Mie",
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

    
      
     
  }
  