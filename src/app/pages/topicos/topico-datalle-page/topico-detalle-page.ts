import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { StatusBadge } from '../../../components/status-badge/status-badge';
import { PostAuthor } from '../../../components/post-author/post-author';
import { RespuestaDetalle } from '../../../models/respuesta';
import { TopicoDetalle } from '../../../models/topico';
import { AuthService } from '../../../services/auth.service';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { RespuestaService } from '../../../services/respuesta.service';
import { TopicoService } from '../../../services/topico.service';
import { formatearFecha } from '../../../utils/fecha';
import { extraerError } from '../../../utils/errores';
import { obtenerTodasLasPaginas } from '../../../utils/paginacion';

@Component({
  selector: 'app-topico-detalle-page',
  imports: [ReactiveFormsModule, RouterLink, StatusBadge, PostAuthor],
  templateUrl: './topico-detalle-page.html',
  styleUrl: './topico-detalle-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicoDetallePage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly topicoService = inject(TopicoService);
  private readonly respuestaService = inject(RespuestaService);
  private readonly authService = inject(AuthService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);

  readonly topico = signal<TopicoDetalle | null>(null);
  readonly respuestas = signal<RespuestaDetalle[]>([]);
  readonly cargando = signal(true);
  readonly respuestasCargando = signal(false);
  readonly error = signal('');
  readonly respuestaError = signal('');
  readonly enviandoRespuesta = signal(false);

  readonly formularioRespuesta: FormGroup<{ mensaje: FormControl<string> }> = this.fb.group({
    mensaje: ['', [Validators.required, Validators.minLength(5)]],
  });

  readonly esAdmin = this.authService.esAdmin;
  readonly formatearFecha = formatearFecha;

  readonly puedo = computed(() => {
    const topico = this.topico();
    if (!topico) return { editarTopico: false, esAutor: false };
    const esAutor = this.authService.esAutorDe(topico.autorNombre);
    return { editarTopico: esAutor || this.esAdmin(), esAutor };
  });

  readonly puedeEditarTopico = computed(() => this.puedo().editarTopico);
  readonly esAutorDelTopico = computed(() => this.puedo().esAutor);

  private readonly topicoId = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    void this.cargar();
  }

  puedeGestionarSolucion(respuesta: RespuestaDetalle): boolean {
    return this.esAutorDelTopico() && this.authService.esAutorDe(respuesta.autorNombre);
  }

  puedeEliminarRespuesta(respuesta: RespuestaDetalle): boolean {
    return this.esAdmin() || this.authService.esAutorDe(respuesta.autorNombre);
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const topico = await this.topicoService.detalle(this.topicoId);
      this.topico.set(topico);
      await this.cargarRespuestas();
    } catch (error) {
      this.error.set(extraerError(error).mensaje);
    } finally {
      this.cargando.set(false);
    }
  }

  private async cargarRespuestas(): Promise<void> {
    this.respuestasCargando.set(true);
    try {
      this.respuestas.set(await this.obtenerTodasLasRespuestas());
    } catch (error) {
      this.respuestaError.set(extraerError(error).mensaje);
    } finally {
      this.respuestasCargando.set(false);
    }
  }

  private async obtenerTodasLasRespuestas(): Promise<RespuestaDetalle[]> {
    const todas = await obtenerTodasLasPaginas((pagina) =>
      this.respuestaService.listarPorTopico(this.topicoId, pagina, 20),
    );
    return todas.sort((a, b) => {
      if (a.solucion !== b.solucion) return a.solucion ? -1 : 1;
      return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
    });
  }

  async enviarRespuesta(): Promise<void> {
    this.respuestaError.set('');
    if (this.formularioRespuesta.invalid) {
      this.formularioRespuesta.markAllAsTouched();
      return;
    }
    this.enviandoRespuesta.set(true);
    try {
      const mensaje = this.formularioRespuesta.getRawValue().mensaje;
      await this.respuestaService.crear({ mensaje, topicoId: this.topicoId });
      this.formularioRespuesta.reset();
      await this.cargar();
      this.notificacion.exito('Respuesta publicada.');
    } catch (error) {
      this.respuestaError.set(extraerError(error).mensaje);
    } finally {
      this.enviandoRespuesta.set(false);
    }
  }

  async alternarSolucion(respuesta: RespuestaDetalle): Promise<void> {
    this.respuestaError.set('');
    try {
      await this.respuestaService.actualizar(respuesta.id, { solucion: !respuesta.solucion });
      await this.cargar();
      this.notificacion.exito(respuesta.solucion ? 'Se quitó la mejor respuesta.' : 'Marcada como mejor respuesta.');
    } catch (error) {
      this.respuestaError.set(extraerError(error).mensaje);
    }
  }

  async eliminarRespuesta(id: number): Promise<void> {
    const acepta = await this.confirmacion.confirmar({
      titulo: 'Eliminar respuesta',
      mensaje: 'Esta acción no se puede deshacer.',
      textoConfirmar: 'Eliminar',
    });
    if (!acepta) return;
    this.respuestaError.set('');
    try {
      await this.respuestaService.eliminar(id);
      await this.cargar();
      this.notificacion.exito('Respuesta eliminada.');
    } catch (error) {
      this.respuestaError.set(extraerError(error).mensaje);
    }
  }

  async eliminarTopico(): Promise<void> {
    const acepta = await this.confirmacion.confirmar({
      titulo: 'Eliminar tópico',
      mensaje: 'Esta acción no se puede deshacer. El tópico y sus respuestas se eliminarán.',
      textoConfirmar: 'Eliminar',
    });
    if (!acepta) return;
    this.error.set('');
    try {
      await this.topicoService.eliminar(this.topicoId);
      await this.router.navigate(['/topicos']);
      this.notificacion.exito('Tópico eliminado.');
    } catch (error) {
      this.error.set(extraerError(error).mensaje);
    }
  }
}