import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrase: string = '';
  errorMessage: string = '';

  constructor(private datesService: DatesService, private router: Router) { }

  onLogin(): void {
    this.datesService.login({ correo: this.correo, contrase: this.contrase }).subscribe(
      (response: any) => {
        if (response.isAuthenticated) {
          console.log('Usuario autenticado exitosamente');
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.userName);
          this.router.navigate(['/citas', { userId: response.userId, userName: response.userName }]);
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos';
        }
      },
      (error) => {
        console.error('Error al autenticar usuario:', error);
        this.errorMessage = 'Error al autenticar usuario: ' + error.message;
      }
    );
  }
}