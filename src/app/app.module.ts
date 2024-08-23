import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DateFormComponent } from './components/date-form/date-form.component';
import { DateListComponent } from './components/date-list/date-list.component';
import { LoginComponent } from './components/login/login.component';
import { ServicesComponent } from './components/services/services.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ContactComponent } from './components/contact/contact.component';
import { SpecialtiesComponent } from './components/specialties/specialties.component';
import { PatientsComponent } from './components/patients/patients.component';
import { MedicoComponent } from './components/medico/medico.component';

import { DatesService } from './services/dates.service';
import { MedicoLoginComponent } from './components/medico-login/medico-login.component';
import { CitasComponent } from './components/citas/citas.component';
import { MisCitasComponent } from './components/mis-citas/mis-citas.component';
import { HistorialMedicoComponent } from './components/historial-medico/historial-medico.component';
import { VerCitasComponent } from './components/ver-citas/ver-citas.component';
import { MedicoDashboardComponent } from './components/medico-dashboard/medico-dashboard.component';
import { PagoComponent } from './components/pago/pago.component';
import { MetodoPagoComponent } from './components/metodo-pago/metodo-pago.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { HistorialPacienteComponent } from './components/historial-paciente/historial-paciente.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DateFormComponent,
    DateListComponent,
    LoginComponent,
    ServicesComponent,
    HomeComponent,
    SignupComponent,
    ContactComponent,
    SpecialtiesComponent,
    PatientsComponent,
    MedicoComponent,
    MedicoLoginComponent,
    CitasComponent,
    MisCitasComponent,
    HistorialMedicoComponent,
    VerCitasComponent,
    MedicoDashboardComponent,
    PagoComponent,
    MetodoPagoComponent,
    HospitalComponent,
    HistorialPacienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  providers: [
    DatesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }