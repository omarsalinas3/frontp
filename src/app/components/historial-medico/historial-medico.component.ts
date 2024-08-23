import { Component, OnInit } from '@angular/core';
import { DatesService } from '../../services/dates.service';
import { Router } from '@angular/router'; // Importa Router si necesitas redirigir

@Component({
  selector: 'app-historial-medico',
  templateUrl: './historial-medico.component.html',
  styleUrls: ['./historial-medico.component.css']
})
export class HistorialMedicoComponent implements OnInit {
  historialMedico: any[] = [];
  idPaciente: string = '';
  nombrePaciente: string = '';
  errorMessage: string = '';

  constructor(private datesService: DatesService, private router: Router) { } // Inyecta Router

  ngOnInit(): void {
    this.idPaciente = localStorage.getItem('userId') || '';
    this.nombrePaciente = localStorage.getItem('userName') || '';
    console.log('ID del paciente:', this.idPaciente);
    if (this.idPaciente) {
      this.cargarHistorialMedico();
    } else {
      this.errorMessage = 'No se encontró ID de paciente';
      console.error(this.errorMessage);
    }
  }

  cargarHistorialMedico(): void {
    console.log('Cargando historial médico para el paciente:', this.idPaciente);
    this.datesService.getHistorialMedico(this.idPaciente).subscribe(
      (historial: any[]) => {
        console.log('Historial médico recibido:', historial);
        this.historialMedico = historial.map(registro => ({
          ...registro,
          fechaFormateada: this.formatearFecha(registro.fecha_cita),
          horaFormateada: this.formatearHora(registro.hora_cita),
          editing: false // Añade un estado de edición para cada registro
        }));
        console.log('Historial médico formateado:', this.historialMedico);
        if (this.historialMedico.length === 0) {
          this.errorMessage = 'No se encontraron registros en el historial médico.';
        }
      },
      error => {
        this.errorMessage = 'Error al cargar el historial médico';
        console.error('Error al cargar el historial médico:', error);
      }
    );
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5); // Asumiendo que la hora viene en formato HH:MM:SS
  }

  modificarRegistro(registro: any): void {
    registro.editing = true; 
  }

  guardarCambios(registro: any): void {
    registro.editing = false; 


    this.datesService.actualizarHistorial(registro.id, {
      diagnostico: registro.diagnostico,
      tratamiento: registro.tratamiento,
      observaciones: registro.observaciones
    }).subscribe(
      response => {
        alert('Registro actualizado con éxito');
        console.log('Registro actualizado:', response);
      },
      error => {
        console.error('Error al actualizar el registro:', error);
        alert('Hubo un error al actualizar el registro');
      }
    );
  }

  cancelarEdicion(registro: any): void {
    registro.editing = false; // Deshabilita el modo de edición sin guardar cambios

    this.cargarHistorialMedico();
  }

  eliminarRegistro(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.datesService.eliminarHistorial(id).subscribe(
        () => {
          this.historialMedico = this.historialMedico.filter(registro => registro.id !== id);
          alert('Registro eliminado correctamente');
        },
        error => {
          console.error('Error al eliminar el registro:', error);
          alert('Hubo un error al eliminar el registro');
        }
      );
    }
  }
}
