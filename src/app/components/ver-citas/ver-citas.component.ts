import { Component, OnInit } from '@angular/core';
import { DatesService } from '../../services/dates.service';
import { Citas } from 'src/app/models/Citas';

@Component({
  selector: 'app-ver-citas',
  templateUrl: './ver-citas.component.html',
  styleUrls: ['./ver-citas.component.css']
})
export class VerCitasComponent implements OnInit {
  citas: Citas[] = [];
  modalModificarAbierto = false;
  citaSeleccionada: Citas | null = null;
  nuevaFecha: string = '';
  nuevaHora: string = '';
  filtroEstado: string | undefined;

  constructor(private datesService: DatesService) { }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    const idPaciente = localStorage.getItem('userId');
    if (idPaciente) {
      this.datesService.getCitasByPaciente(idPaciente).subscribe(
        (citas: Citas[]) => {
          this.citas = citas.map(cita => ({
            ...cita,
            fechaFormateada: this.formatearFecha(cita.fecha),
            horaFormateada: this.formatearHora(cita.hora),
            puedeModificar: cita.estado === 'pendiente',
            estaFinalizada: cita.estado === 'finalizada'
          }));
          console.log('Citas cargadas:', this.citas);
        },
        error => {
          console.error('Error al cargar citas:', error);
        }
      );
    }
  }

  cambiarFiltro(nuevoFiltro: string) {
    this.filtroEstado = nuevoFiltro;
    this.cargarCitas();
  }


  modificarCita(cita: Citas): void {
    if (!cita.puedeModificar) {
      alert('Esta cita ya no puede ser modificada.');
      return;
    }
    console.log('Modificar cita llamado con:', cita);
    this.citaSeleccionada = cita;
    this.nuevaFecha = cita.fecha;
    this.nuevaHora = cita.hora;
    this.modalModificarAbierto = true;
  }

  confirmarModificacion(): void {
    console.log('Confirmar modificación llamado');
    if (this.citaSeleccionada && this.nuevaFecha && this.nuevaHora) {
      const citaModificada: Citas = {
        ...this.citaSeleccionada,
        fecha: this.nuevaFecha,
        hora: this.nuevaHora
      };
      console.log('Enviando solicitud de modificación:', citaModificada);
      this.datesService.updateCita(citaModificada).subscribe(
        () => {
          console.log('Cita modificada exitosamente');
          this.cargarCitas();
          this.cerrarModal();
        },
        error => {
          console.error('Error al modificar la cita:', error);
        }
      );
    } else {
      console.log('Datos inválidos para modificar la cita');
    }
  }
  

  cancelarCita(cita: Citas): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.datesService.deleteCita(cita.idcita).subscribe(
        () => {
          this.cargarCitas();
        },
        error => {
          console.error('Error al cancelar la cita:', error);
        }
      );
    }
  }

  cerrarModal(): void {
    this.modalModificarAbierto = false;
    this.citaSeleccionada = null;
    this.nuevaFecha = '';
    this.nuevaHora = '';
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5); // Asumiendo que la hora viene en formato HH:MM:SS
  }
}