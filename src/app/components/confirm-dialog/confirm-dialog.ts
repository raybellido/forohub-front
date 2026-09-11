import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';

import { ConfirmacionService } from '../../services/confirmacion.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly servicio = inject(ConfirmacionService);

  readonly opciones = this.servicio.visible;

  aceptar(): void {
    this.servicio.aceptar();
  }

  cancelar(): void {
    this.servicio.cancelar();
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    if (this.opciones()) this.cancelar();
  }
}