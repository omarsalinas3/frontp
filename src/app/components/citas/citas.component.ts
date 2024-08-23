import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatesService } from '../../services/dates.service';
import { Citas } from '../../models/Citas';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  modalAbierto = false;
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  medicoSeleccionado: any = {};
  idPaciente: string = '';
  nombrePaciente: string = '';
  errorMessage: string = '';
  welcomeMessage: string = '';
  citaGenerada: boolean = false;
  historialCitas: Citas[] = [];
  mostrarHistorial: boolean = false;

  medicos = [
    { id: 1, nombre: 'Dr. Juan Pérez', hospital: 'Hospital Central', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Cardiología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorJuanPerez.jpg' },

    { id: 2, nombre: 'Dra. María García', hospital: 'Clínica Santa María', ciudad: 'San Miguel de Allende',
       especialidad: 'Pediatría', disponibilidad: 'No Disponible', imagen: 'assets/Doctores/doctoraMariaGarcia.jpg' },

    { id: 3, nombre: 'Dr. Carlos López', hospital: 'Hospital La Paz', ciudad: 'San Luis de la paz', 
      especialidad: 'Neurología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorCarlosLopez.jpg' },

    { id: 4, nombre: 'Dra. Ana Martínez', hospital: 'Hospital Clínico', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Dermatología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctoraAnaMartinez.jpg' },

    { id: 5, nombre: 'Dra. Sandra Martínez', hospital: 'Hospital Clínico', ciudad: 'Queretaro',
       especialidad: 'Neurología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctoraSandraMartinez.jpg' },

    { id: 6, nombre: 'Dr. Pedro Esparza', hospital: 'Hospital Los Angeles', ciudad: 'CDMX', 
      especialidad: 'Cardiología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorPedroEsparza.jpg' },

    { id: 7, nombre: 'Dr. Antonio Gomez', hospital: 'Hospital Los San Jose', ciudad: 'Tijuana', 
      especialidad: 'Ginecologia', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorAntonioGomez.jpg' },

    { id: 8, nombre: 'Dra. Paulina Delgado', hospital: 'Hospital Los Angeles', ciudad: 'Queretaro', 
      especialidad: 'Psicologia', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctoraPaulinaDelgado.jpg' },

    { id: 9, nombre: 'Dr. Xavie Sinue', hospital: 'Hospital la Paz', ciudad: 'CDMX', 
      especialidad: 'Dermatología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorXavierSinue.jpg' },

    { id: 10, nombre: 'Dr. Calos Carrillo', hospital: 'Hospital Queretano', ciudad: 'Queretaro', 
      especialidad: 'Cirujano', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorCarlosCarrillo.jpg' },

    { id: 11, nombre: 'Dr. Jesus Hernandez', hospital: 'Hospital de la Mujer', ciudad: 'CDMX', 
      especialidad: 'Anestesiólogo', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorJesusHernandez.jpg' },

    { id: 12, nombre: 'Dr. José Martínez', hospital: 'Hospital Queretano', ciudad: 'Queretaro', 
      especialidad: 'Psicologia', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorJoseMartinez.jpg' },

    { id: 13, nombre: 'Dr. Diego Cruz', hospital: 'Hospital San Jose', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Dermatología', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorDiegoCruz.jpg' },

    { id: 14, nombre: 'Dr. María Cruz', hospital: 'Hospital La Paz', ciudad: 'San Luis de la paz', 
      especialidad: 'Cirujano', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctoraMariaCruz.jpg' },

    { id: 15, nombre: 'Dr. Miguel García', hospital: 'Hospital Las Torres', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Psicologia', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorMiguelGarcia.jpg' },

    { id: 16, nombre: 'Dr. Pedro Gómez', hospital: 'Hospital La Paz', ciudad: 'San Luis de la paz', 
      especialidad: 'Cirujano', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorPedroGomez.jpg' },

    { id: 17, nombre: 'Dr. Hernan Martínez', hospital: 'Hospital San Jose', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Cirujano', disponibilidad: 'No Disponible', imagen: 'assets/Doctores/doctorHernanMartinez.jpg' },

    { id: 18, nombre: 'Dr. Diego Gómez', hospital: 'Hospital Las Torres', ciudad: 'Dolores Hidalgo', 
      especialidad: 'Psicologia', disponibilidad: 'Disponible', imagen: 'assets/Doctores/doctorDiegoGomez.jpg' },
  ];

  
  citas: Citas[] | undefined;

  medicosFiltrados: any[] = [];

  searchNombre: string = '';
  searchEspecialidad: string = '';
  searchHospital: string = '';
  searchCiudad: string = '';

  especialidades: string[] = [];
  hospitales: string[] = [];
  ciudades: string[] = [];

  constructor(
    private datesService: DatesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idPaciente = params.get('userId') || '';
      this.nombrePaciente = params.get('userName') || '';
      console.log('ID del paciente en CitasComponent:', this.idPaciente);
      console.log('Nombre del paciente en CitasComponent:', this.nombrePaciente);
      if (this.nombrePaciente) {
        this.welcomeMessage = `Bienvenido, ${this.nombrePaciente}!`;
        this.medicosFiltrados = this.medicos;
        this.inicializarFiltros();

      }

      
    });

    if (!this.idPaciente) {
      this.idPaciente = localStorage.getItem('userId') || '';
      this.nombrePaciente = localStorage.getItem('userName') || '';
    }

    if (!this.idPaciente) {
      console.error('No se encontró ID de paciente');
      this.router.navigate(['/login']);
    } else {
      this.cargarHistorialCitas();
    }


  this.cargarCitas();
  }

  cargarCitas() {
    this.datesService.getCitasByPaciente(this.idPaciente).subscribe(
      (citas: Citas[]) => {
        this.citas = citas.map(cita => ({
          ...cita,
          especialidad: cita.especialidad || 'No especificada',
          hospital: cita.hospital || 'No especificada',
          duracionEstimada: '30 minutos',
          telefonoMedico: cita.telefonoMedico || 'No disponible',
          correoMedico: cita.correoMedico || 'No disponible',
          imagenMedico: cita.imagenMedico || 'assets/default-doctor-image.jpg' 
        }));
        console.log('Citas cargadas:', this.citas);
      },
      error => console.error('Error al cargar citas:', error)
    );
  }

  

  abrirModal(medico: any): void {
    this.medicoSeleccionado = medico;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.medicoSeleccionado = {};
    this.citaGenerada = false;
  }

  onFechaChange(event: any): void {
    this.fechaSeleccionada = event.target.value;
  }

  onHoraChange(event: any): void {
    this.horaSeleccionada = event.target.value;
  }

  generarCita(): void {
    if (!this.fechaSeleccionada || !this.horaSeleccionada || !this.medicoSeleccionado.id) {
      alert('Por favor, complete todos los campos');
      return;
    }
    

    const nuevaCita: Citas = {
      idcita: 0,
      IdMedico: this.medicoSeleccionado.id,
      idPaciente: this.idPaciente,
      nombrePaciente: this.nombrePaciente,
      descripcion: `Consulta con ${this.medicoSeleccionado.nombre} - ${this.medicoSeleccionado.especialidad}`,
      fecha: this.fechaSeleccionada,
      hora: this.horaSeleccionada,
      nombreMedico: this.medicoSeleccionado.nombre,
      especialidad: this.medicoSeleccionado.especialidad,
      hospital: this.medicoSeleccionado.hospital,
      telefonoMedico: this.medicoSeleccionado.telefono,
      correoMedico: this.medicoSeleccionado.correo,
      duracionEstimada: undefined,
      estado: 'pendiente' // borrar si es nesesacrio 
    };

    console.log('Generando cita:', nuevaCita);

    this.datesService.saveCita(nuevaCita).subscribe(
      (resp: any) => {
        console.log('Cita guardada con éxito', resp);
        this.citaGenerada = true;
        alert('Cita generada con éxito');
        
        const citaConFormato = {
          ...nuevaCita,
          fechaFormateada: this.formatearFecha(nuevaCita.fecha),
          horaFormateada: this.formatearHora(nuevaCita.hora)
        };
        this.historialCitas.unshift(citaConFormato);
        
        this.cerrarModal();
      },
      error => {
        console.error('Error al guardar la cita', error);
        alert('Error al generar la cita');
      }
    );
  }

  verHistorialCitas(): void {
    this.mostrarHistorial = !this.mostrarHistorial;
    if (this.mostrarHistorial && this.historialCitas.length === 0) {
      this.cargarHistorialCitas();
    }
  }

  cargarHistorialCitas(): void {
    if (this.idPaciente) {
      console.log('Cargando historial de citas para el paciente:', this.idPaciente);
      this.datesService.getCitasByPaciente(this.idPaciente).subscribe(
        (citas: Citas[]) => {
          console.log('Citas recibidas del servidor:', citas);
          this.historialCitas = citas.map(cita => ({
            ...cita,
            fechaFormateada: this.formatearFecha(cita.fecha),
            horaFormateada: this.formatearHora(cita.hora)
          }));
          console.log('Historial de citas formateado:', this.historialCitas);
          if (this.historialCitas.length === 0) {
            console.log('No se encontraron citas para este paciente');
          }
        },
        error => {
          console.error('Error al cargar el historial de citas', error);
          this.errorMessage = 'Error al cargar el historial de citas';
        }
      );
    } else {
      console.error('No hay ID de paciente para cargar el historial');
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5);
  }

  downloadCitas(): void {
    this.errorMessage = '';
    this.datesService.getAllCitas().subscribe({
      next: (citas: Citas[]) => {
        this.datesService.downloadCitasAsJson(citas);
      },
      error: (error) => {
        this.errorMessage = 'Error al descargar las citas: ' + error.message;
        console.error('Error al descargar las citas', error);
      }
    });
  }
  inicializarFiltros(): void {
    this.especialidades = [...new Set(this.medicos.map(m => m.especialidad))];
    this.hospitales = [...new Set(this.medicos.map(m => m.hospital))];
    this.ciudades = [...new Set(this.medicos.map(m => m.ciudad))];
  }

  aplicarFiltros(): void {
    this.medicosFiltrados = this.medicos.filter(medico => 
      medico.nombre.toLowerCase().includes(this.searchNombre.toLowerCase()) &&
      (this.searchEspecialidad === '' || medico.especialidad === this.searchEspecialidad) &&
      (this.searchHospital === '' || medico.hospital === this.searchHospital) &&
      (this.searchCiudad === '' || medico.ciudad === this.searchCiudad)
    );
  }
}