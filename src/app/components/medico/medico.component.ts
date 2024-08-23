import { Component } from '@angular/core';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css'
})
export class MedicoComponent {

}

class Calendar {
  private currentDate: Date;
  private monthYearElement: HTMLElement;
  private datesElement: HTMLElement;

  constructor() {
      this.currentDate = new Date();
      this.monthYearElement = document.getElementById('month-year')!;
      this.datesElement = document.getElementById('calendar-dates')!;
      this.initEventListeners();
      this.render();
  }

  private initEventListeners(): void {
      document.getElementById('prev-month')!.addEventListener('click', () => this.changeMonth(-1));
      document.getElementById('next-month')!.addEventListener('click', () => this.changeMonth(1));
  }

  private changeMonth(delta: number): void {
      this.currentDate.setMonth(this.currentDate.getMonth() + delta);
      this.render();
  }

  private render(): void {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      this.monthYearElement.textContent = `${this.getMonthName(month)} ${year}`;
      this.renderDates(year, month);
  }

  private renderDates(year: number, month: number): void {
      this.datesElement.innerHTML = '';
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
          this.datesElement.appendChild(document.createElement('div'));
      }

      for (let date = 1; date <= lastDate; date++) {
          const dateElement = document.createElement('div');
          dateElement.textContent = date.toString();
          if (this.isToday(year, month, date)) {
              dateElement.classList.add('today');
          }
          this.datesElement.appendChild(dateElement);
      }
  }

  private isToday(year: number, month: number, date: number): boolean {
      const today = new Date();
      return year === today.getFullYear() && month === today.getMonth() && date === today.getDate();
  }

  private getMonthName(month: number): string {
      const monthNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return monthNames[month];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calendar();
});