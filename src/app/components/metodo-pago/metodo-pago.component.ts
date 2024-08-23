import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatesService } from 'src/app/services/dates.service';

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css']
})
export class MetodoPagoComponent implements OnInit {
  tarjeta = {
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    codigoSeguridad: '',
    monto: 0,
    idHospital: '' // Nueva propiedad para almacenar el ID del hospital
  };
  mensaje: string = '';
  modalVisible: boolean = false;
  validarTarjetaNumero: boolean = true;
  validarFecha: boolean = true;
  validarCvv: boolean = true;
  validarNombreTitular: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datesService: DatesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const monto = params['monto'];
      const idHospital = params['idHospital']; // Obtén el ID del hospital de los parámetros de la ruta
      if (monto) {
        this.tarjeta.monto = +monto;
      }
      if (idHospital) {
        this.tarjeta.idHospital = idHospital; // Asigna el ID del hospital a la propiedad
      }
    });
  }

  procesarPago(): void {
    if (this.validarTarjeta()) {
      this.datesService.procesarPago(this.tarjeta).subscribe(
        response => {
          this.mensaje = 'Pago realizado con éxito.';
          this.modalVisible = true;
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000); // Espera 2 segundos antes de redirigir
        },
        error => {
          this.mensaje = 'Ocurrió un error al procesar el pago. Por favor, inténtelo de nuevo.';
          this.modalVisible = true;
        }
      );
    } else {
      this.mensaje = 'Por favor, corrige los errores en el formulario.';
      this.modalVisible = true;
    }
  }

  validarTarjeta(): boolean {
    const regexNumero = /^\d{16}$/;
    const regexFecha = /^(0[1-9]|1[0-2])\/[2-9][0-9]$/; // Ajustado a MM/AA
    const regexCvv = /^\d{3}$/;

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear() % 100; // Obtiene el año actual en formato AA

    const [mes, anio] = this.tarjeta.fechaExpiracion.split('/').map(num => parseInt(num, 10));

    this.validarTarjetaNumero = regexNumero.test(this.tarjeta.numeroTarjeta);
    this.validarFecha = (anio && mes) ? (anio > anioActual || (anio === anioActual && mes >= mesActual)) : false;
    this.validarCvv = regexCvv.test(this.tarjeta.codigoSeguridad);
    this.validarNombreTitular = this.tarjeta.nombreTitular.trim().length > 0;

    return this.validarTarjetaNumero &&
           this.validarFecha &&
           this.validarCvv &&
           this.validarNombreTitular &&
           this.tarjeta.monto > 0 &&
           this.tarjeta.idHospital !== ''; // Verifica que el ID del hospital sea válido
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  formatearFecha(event: any): void {
    let valor = event.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (valor.length > 2) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}`;
    }
    event.target.value = valor;
    this.tarjeta.fechaExpiracion = valor; // Actualiza el modelo
  }
}
