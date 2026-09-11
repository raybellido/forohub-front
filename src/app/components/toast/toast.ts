import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  private readonly servicio = inject(NotificacionService);

  readonly notificaciones = this.servicio.notificaciones;

  cerrar(id: number): void {
    this.servicio.cerrar(id);
  }
}