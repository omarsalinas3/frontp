import { Component, OnInit } from '@angular/core';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'app-medico-dashboard',
  templateUrl: './medico-dashboard.component.html',
  styleUrls: ['./medico-dashboard.component.css']
})
export class MedicoDashboardComponent implements OnInit {
  citas: any[] = [];
  citasFiltradas: any[] = [];
  citaSeleccionada: any = null;
  historialMedico: any = {
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  };
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private datesService: DatesService) { }

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    const medicoId = localStorage.getItem('medicoId');
    if (medicoId) {
      this.datesService.getCitasByMedico(medicoId).subscribe(
        (citas) => {
          this.citas = citas.map(cita => ({
            ...cita,
            nombreCompleto: `${cita.nombre || ''} ${cita.apePaterno || ''} ${cita.apeMaterno || ''}`.trim(),
            fechaFormateada: cita.fechaFormateada || 'No disponible',
            horaFormateada: cita.horaFormateada || 'No disponible',
          }));
          this.citasFiltradas = [...this.citas]; // Inicializa las citas filtradas con todas las citas
          console.log('Citas cargadas:', this.citas);
        },
        (error) => console.error('Error al cargar citas:', error)
      );
    }
  }

  confirmarCita(idCita: number) {
    this.datesService.confirmarCita(idCita).subscribe(
      () => {
        console.log('Cita confirmada');
        this.cargarCitas();
      },
      (error) => console.error('Error al confirmar cita:', error)
    );
  }

  seleccionarCita(cita: any) {
    this.citaSeleccionada = cita;
    this.historialMedico = {
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    };
  }

  finalizarCita() {
    if (this.citaSeleccionada) {
      const historialMedico = {
        diagnostico: this.historialMedico.diagnostico || '',
        tratamiento: this.historialMedico.tratamiento || '',
        observaciones: this.historialMedico.observaciones || ''
      };

      this.datesService.finalizarCita(this.citaSeleccionada.idcita, historialMedico).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          this.cargarCitas();
          this.citaSeleccionada = null;
        },
        (error) => console.error('Error al finalizar cita:', error)
      );
    }
  }

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
        this.citasFiltradas = this.citas.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          return fechaCita >= fechaInicio && fechaCita <= fechaFin;
        });
      }
    } else {
      this.citasFiltradas = [...this.citas]; // Si no se seleccionan fechas, mostrar todas las citas
    }
  }
}
