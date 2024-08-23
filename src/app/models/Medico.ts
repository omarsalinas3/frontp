export interface Medico {
  id: number;
  nombre: string;
  hospital: string;
  ciudad: string;
  especialidad: string;
  disponibilidad: boolean; // un booleano para disponibilidad
  image: string;
  imagen_url: string | null;

}
