import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { inicialesDe } from '../../models/avatar';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly imagen = input<string | null | undefined>();
  readonly nombre = input.required<string>();
  readonly tam = input('h-6 w-6 text-xs');

  readonly fallo = signal(false);

  readonly inicialesDe = inicialesDe;
}