import { Injectable, signal } from '@angular/core';

export interface OpcionesConfirmacion {
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'primario' | 'peligro';
}

const POR_DEFECTO: OpcionesConfirmacion = {
  titulo: '¿Estás seguro?',
  mensaje: '',
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  variante: 'peligro',
};

@Injectable({ providedIn: 'root' })
export class ConfirmacionService {
  private readonly visibleSignal = signal<OpcionesConfirmacion | null>(null);
  private respondedor?: (acepta: boolean) => void;

  readonly visible = this.visibleSignal.asReadonly();

  confirmar(opciones: OpcionesConfirmacion): Promise<boolean> {
    this.visibleSignal.set({ ...POR_DEFECTO, ...opciones });
    return new Promise<boolean>((resolve) => {
      this.respondedor = resolve;
    });
  }

  aceptar(): void {
    this.cerrar(true);
  }

  cancelar(): void {
    this.cerrar(false);
  }

  private cerrar(acepta: boolean): void {
    this.visibleSignal.set(null);
    this.respondedor?.(acepta);
    this.respondedor = undefined;
  }
}