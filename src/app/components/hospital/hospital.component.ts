import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatesService } from 'src/app/services/dates.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
  hospital = {
    idHospital: '',
    nombreHospital: '',
    direccion: '',
    estado: '',
    municipio: '',
    numSucursal: 0, // Valor predeterminado de 0
    telefono: '',
    nomRepresHospital: '',
    rfcHospital: '',
    monto: 0
  };
  modalVisible = false;
  mensaje = '';
  telefonoInvalido = false;
  numSucursalInvalido = false; // Nueva propiedad para gestionar la validez de numSucursal
  redirigir = false; // Nueva propiedad para gestionar la redirección

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datesService: DatesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const monto = params['monto'];
      if (monto) {
        this.hospital.monto = Number(monto);
      }
    });
  }

  generarIdHospital(): string {
    return 'HOS-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  procesarFormulario(): void {
    if (!this.hospital.nombreHospital ||
        !this.hospital.direccion ||
        !this.hospital.estado ||
        !this.hospital.municipio ||
        !this.hospital.telefono ||
        !this.hospital.nomRepresHospital ||
        !this.hospital.rfcHospital ||
        this.hospital.monto <= 0) {

      this.mensaje = 'Por favor, complete todos los campos obligatorios';
      this.modalVisible = true;
      return;
    }

    // Validar numSucursal para asegurarse de que sea un número positivo o cero
    if (this.hospital.numSucursal < 0) {
      this.numSucursalInvalido = true;
      this.mensaje = 'El número de sucursal debe ser un número positivo o cero.';
      this.modalVisible = true;
      return;
    } else {
      this.numSucursalInvalido = false;
    }

    // Validar el teléfono
    if (this.hospital.telefono.length !== 10) {
      this.telefonoInvalido = true;
      this.mensaje = 'Por favor, ingrese un número de teléfono válido de 10 dígitos.';
      this.modalVisible = true;
      return;
    } else {
      this.telefonoInvalido = false;
    }

    this.hospital.idHospital = this.generarIdHospital();

    this.datesService.guardarHospital(this.hospital).subscribe({
      next: (response) => {
        if (response.idHospital) {
          this.hospital.idHospital = response.idHospital; // Actualizar el ID del hospital recibido
          this.mensaje = 'Hospital registrado exitosamente';
          this.modalVisible = true;
          this.redirigir = true; // Establecer la bandera para redirigir después de cerrar el modal
        } else {
          this.mensaje = 'Error al registrar el hospital. Inténtelo de nuevo más tarde.';
          this.modalVisible = true;
        }
      },
      error: (err) => {
        this.mensaje = 'Error al guardar la información del hospital. Inténtelo de nuevo más tarde.';
        this.modalVisible = true;
      }
    });
  }

  cerrarModal(): void {
    this.modalVisible = false;
    if (this.redirigir) {
      this.router.navigate(['/metodo-pago'], { queryParams: { monto: this.hospital.monto, idHospital: this.hospital.idHospital } });
    }
  }
}
