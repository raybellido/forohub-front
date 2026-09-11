import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CursoDetalle } from '../../../models/curso';
import { StatusTopico, STATUS_TOPICO_LABEL, TopicoDetalle } from '../../../models/topico';
import { CursoService } from '../../../services/curso.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { TopicoService } from '../../../services/topico.service';
import { extraerError } from '../../../utils/errores';
import { errorCampo } from '../../../utils/form-error';

@Component({
  selector: 'app-topico-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './topico-form-page.html',
  styleUrl: './topico-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicoFormPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly topicoService = inject(TopicoService);
  private readonly cursoService = inject(CursoService);
  private readonly notificacion = inject(NotificacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly formulario: FormGroup<{
    titulo: FormControl<string>;
    mensaje: FormControl<string>;
    cursoId: FormControl<number | null>;
    status: FormControl<StatusTopico>;
  }> = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
    cursoId: [null as number | null, Validators.required],
    status: ['ABIERTO' as StatusTopico],
  });

  readonly statuses: StatusTopico[] = ['ABIERTO', 'CERRADO', 'RESUELTO'];
  readonly STATUS_TOPICO_LABEL = STATUS_TOPICO_LABEL;

  readonly cargandoInicial = signal(false);
  readonly cargando = signal(false);
  readonly errorGeneral = signal('');
  readonly errorCampos = signal<Record<string, string>>({});
  readonly cursos = signal<CursoDetalle[]>([]);
  readonly topicoCargado = signal<TopicoDetalle | null>(null);

  readonly esEdicion = computed(() => this.idDeRuta() !== null);

  private idDeRuta(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id === null ? null : Number(id);
  }

  constructor() {
    void this.inicializar();
  }

  async inicializar(): Promise<void> {
    try {
      const cursos = await this.cursoService.listarTodos();
      this.cursos.set(cursos.filter((c) => c.activo));

      const id = this.idDeRuta();
      if (id !== null) {
        this.cargandoInicial.set(true);
        const topico = await this.topicoService.detalle(id);
        this.topicoCargado.set(topico);
        const curso = cursos.find((c) => c.nombre === topico.cursoNombre);
        this.formulario.patchValue({
          titulo: topico.titulo,
          mensaje: topico.mensaje,
          cursoId: curso?.id ?? null,
          status: topico.status,
        });
      }
    } catch (error) {
      this.errorGeneral.set(extraerError(error).mensaje);
    } finally {
      this.cargandoInicial.set(false);
    }
  }

  campoError(campo: string): string | undefined {
    return errorCampo(this.formulario.get(campo), this.errorCampos()[campo]);
  }

  async guardar(): Promise<void> {
    this.errorGeneral.set('');
    this.errorCampos.set({});
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    try {
      const id = this.idDeRuta();
      const valor = this.formulario.getRawValue();
      if (id !== null) {
        await this.topicoService.actualizar(id, {
          titulo: valor.titulo,
          mensaje: valor.mensaje,
          status: valor.status,
          cursoId: valor.cursoId ?? undefined,
        });
        await this.router.navigate(['/topicos', id]);
        this.notificacion.exito('Cambios guardados.');
      } else {
        const topico = await this.topicoService.crear({
          titulo: valor.titulo,
          mensaje: valor.mensaje,
          cursoId: valor.cursoId!,
        });
        await this.router.navigate(['/topicos', topico.id]);
        this.notificacion.exito('Tópico publicado.');
      }
    } catch (error) {
      const extraido = extraerError(error);
      this.errorGeneral.set(extraido.mensaje);
      this.errorCampos.set(extraido.campos);
    } finally {
      this.cargando.set(false);
    }
  }
}