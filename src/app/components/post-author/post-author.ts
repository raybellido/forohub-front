import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Perfil, PERFIL_CLASES, PERFIL_LABEL } from '../../models/usuario';
import { formatearFecha } from '../../utils/fecha';
import { Avatar } from '../avatar/avatar';

@Component({
  selector: 'app-post-author',
  imports: [Avatar],
  templateUrl: './post-author.html',
  styleUrl: './post-author.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostAuthor {
  readonly imagen = input<string | null | undefined>();
  readonly nombre = input.required<string>();
  readonly perfil = input<Perfil>('ESTUDIANTE');
  readonly ingreso = input.required<string>();
  readonly fecha = input.required<string>();
  readonly esRespuesta = input(false);

  readonly PERFIL_LABEL = PERFIL_LABEL;
  readonly PERFIL_CLASES = PERFIL_CLASES;
  readonly formatearFecha = formatearFecha;
}