import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatusTopico, STATUS_TOPICO_LABEL } from '../../models/topico';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<StatusTopico>();

  readonly STATUS_TOPICO_LABEL = STATUS_TOPICO_LABEL;

  clases(): string {
    switch (this.status()) {
      case 'ABIERTO':
        return 'bg-mint/10 text-mint';
      case 'CERRADO':
        return 'bg-dim/10 text-dim';
      case 'RESUELTO':
        return 'bg-sky/10 text-sky';
    }
  }

  punto(): string {
    switch (this.status()) {
      case 'ABIERTO':
        return 'bg-mint';
      case 'CERRADO':
        return 'bg-dim';
      case 'RESUELTO':
        return 'bg-sky';
    }
  }
}