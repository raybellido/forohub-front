import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Avatar } from '../../../components/avatar/avatar';
import { PERFIL_CLASES, PERFIL_LABEL, UsuarioDetalle } from '../../../models/usuario';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { UsuarioService } from '../../../services/usuario.service';
import { extraerError } from '../../../utils/errores';

@Component({
  selector: 'app-usuarios-page',
  imports: [Avatar],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosPage {
  private readonly usuarioService = inject(UsuarioService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);

  readonly PERFIL_LABEL = PERFIL_LABEL;
  readonly PERFIL_CLASES = PERFIL_CLASES;

  readonly usuarios = signal<UsuarioDetalle[]>([]);
  readonly cargando = signal(true);
  readonly errorGeneral = signal('');

  constructor() {
    void this.cargarUsuarios();
  }

  private async cargarUsuarios(): Promise<void> {
    this.cargando.set(true);
    this.errorGeneral.set('');
    try {
      this.usuarios.set(await this.usuarioService.listarTodos());
    } catch (error) {
      this.errorGeneral.set(extraerError(error).mensaje);
    } finally {
      this.cargando.set(false);
    }
  }

  async desactivarUsuario(usuario: UsuarioDetalle): Promise<void> {
    const acepta = await this.confirmacion.confirmar({
      titulo: 'Desactivar usuario',
      mensaje: `La cuenta de “${usuario.nombre}” dejará de poder iniciar sesión.`,
      textoConfirmar: 'Desactivar',
    });
    if (!acepta) return;
    this.errorGeneral.set('');
    try {
      await this.usuarioService.desactivar(usuario.id);
      await this.cargarUsuarios();
      this.notificacion.exito('Usuario desactivado.');
    } catch (error) {
      this.errorGeneral.set(extraerError(error).mensaje);
    }
  }
}