import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from '../../components/avatar/avatar';
import { ESTILO_POR_DEFECTO, ESTILOS_AVATAR, componerAvatarUrl, inicialesDe } from '../../models/avatar';
import { PERFIL_CLASES, PERFIL_LABEL } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { formatearFecha } from '../../utils/fecha';
import { extraerError } from '../../utils/errores';

type Modo = 'generador' | 'url';

@Component({
  selector: 'app-perfil-page',
  imports: [Avatar, RouterLink],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPage {
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificacion = inject(NotificacionService);

  readonly ESTILOS_AVATAR = ESTILOS_AVATAR;
  readonly PERFIL_LABEL = PERFIL_LABEL;
  readonly PERFIL_CLASES = PERFIL_CLASES;
  readonly formatearFecha = formatearFecha;
  readonly inicialesDe = inicialesDe;

  readonly miPerfil = this.authService.miPerfil;
  readonly modo = signal<Modo>('generador');
  readonly seed = signal(this.authService.miPerfil()?.nombre ?? 'usuario');
  readonly estilo = signal(ESTILO_POR_DEFECTO);
  readonly urlLibre = signal(this.authService.miPerfil()?.avatarUrl ?? '');
  readonly guardando = signal(false);
  readonly guardado = signal(false);
  readonly error = signal('');

  readonly previewUrl = computed(() => {
    if (this.modo() === 'generador') {
      return this.seed().trim() ? componerAvatarUrl(this.estilo(), this.seed().trim()) : null;
    }
    const url = this.urlLibre().trim();
    return url ? url : null;
  });

  readonly urlPreviewDescripcion = computed(() => {
    if (this.modo() === 'generador') {
      return `Se generará un avatar único a partir de “${this.seed().trim() || '...'}” con el estilo elegido.`;
    }
    return this.urlLibre().trim() ? 'Se usará la imagen de la URL que pegaste.' : 'Escribe o pega una URL de imagen.';
  });

  constructor() {
    const url = this.authService.miPerfil()?.avatarUrl;
    if (url) {
      const coincidencia = url.match(/^https:\/\/api\.dicebear\.com\/9\.x\/([a-z0-9-]+)\/svg\?seed=(.+)$/);
      if (coincidencia) {
        this.estilo.set(coincidencia[1]);
        this.seed.set(decodeURIComponent(coincidencia[2]));
        this.modo.set('generador');
      } else {
        this.urlLibre.set(url);
        this.modo.set('url');
      }
    }
  }

  miniUrl(estilo: string): string {
    return componerAvatarUrl(estilo, this.seed().trim() || 'usuario');
  }

  async guardar(): Promise<void> {
    const perfil = this.miPerfil();
    const url = this.previewUrl();
    if (!perfil || !url) {
      this.error.set('Ingresa un nombre o una URL de imagen para tu avatar.');
      return;
    }

    this.guardando.set(true);
    this.error.set('');
    this.guardado.set(false);
    try {
      await this.usuarioService.actualizar(perfil.id, { avatarUrl: url });
      await this.authService.cargarMiPerfil();
      this.guardado.set(true);
      this.notificacion.exito('Avatar guardado.');
    } catch (error) {
      this.error.set(extraerError(error).mensaje);
    } finally {
      this.guardando.set(false);
    }
  }
}