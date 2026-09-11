import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  tipo: 'exito' | 'error' | 'info';
  mensaje: string;
}

const DURACION_MS = 3500;

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly notificacionesSignal = signal<Notificacion[]>([]);
  private proximoId = 1;

  readonly notificaciones = this.notificacionesSignal.asReadonly();

  exito(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }

  cerrar(id: number): void {
    this.notificacionesSignal.update((actuales) => actuales.filter((n) => n.id !== id));
  }

  private mostrar(tipo: Notificacion['tipo'], mensaje: string): void {
    const id = this.proximoId++;
    this.notificacionesSignal.update((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), DURACION_MS);
  }
}