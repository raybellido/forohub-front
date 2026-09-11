import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CATEGORIA_LABEL, CATEGORIAS, Categoria, CursoCrearRequest, CursoDetalle } from '../../../models/curso';
import { ConfirmacionService } from '../../../services/confirmacion.service';
import { CursoService } from '../../../services/curso.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { extraerError } from '../../../utils/errores';
import { errorCampo } from '../../../utils/form-error';

@Component({
  selector: 'app-cursos-page',
  imports: [ReactiveFormsModule],
  templateUrl: './cursos-page.html',
  styleUrl: './cursos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cursoService = inject(CursoService);
  private readonly confirmacion = inject(ConfirmacionService);
  private readonly notificacion = inject(NotificacionService);

  readonly formulario: FormGroup<{ nombre: FormControl<string>; categoria: FormControl<Categoria> }> =
    this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      categoria: ['PROGRAMACION' as Categoria],
    });

  readonly categorias = CATEGORIAS;
  readonly CATEGORIA_LABEL = CATEGORIA_LABEL;

  readonly cursos = signal<CursoDetalle[]>([]);
  readonly cargando = signal(false);
  readonly cargandoLista = signal(true);
  readonly errorGeneral = signal('');
  readonly errorCampos = signal<Record<string, string>>({});

  constructor() {
    void this.cargarCursos();
  }

  campoError(campo: string): string | undefined {
    return errorCampo(this.formulario.get(campo), this.errorCampos()[campo]);
  }

  private async cargarCursos(): Promise<void> {
    this.cargandoLista.set(true);
    this.errorGeneral.set('');
    try {
      this.cursos.set(await this.cursoService.listarTodos());
    } catch (error) {
      this.errorGeneral.set(extraerError(error).mensaje);
    } finally {
      this.cargandoLista.set(false);
    }
  }

  async crearCurso(): Promise<void> {
    this.errorGeneral.set('');
    this.errorCampos.set({});
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    try {
      const request: CursoCrearRequest = this.formulario.getRawValue();
      await this.cursoService.crear(request);
      this.formulario.reset({ nombre: '', categoria: 'PROGRAMACION' });
      await this.cargarCursos();
      this.notificacion.exito('Curso creado.');
    } catch (error) {
      const extraido = extraerError(error);
      this.errorGeneral.set(extraido.mensaje);
      this.errorCampos.set(extraido.campos);
    } finally {
      this.cargando.set(false);
    }
  }

  async desactivarCurso(id: number): Promise<void> {
    const acepta = await this.confirmacion.confirmar({
      titulo: 'Desactivar curso',
      mensaje: 'El curso dejará de estar disponible para nuevos tópicos.',
      textoConfirmar: 'Desactivar',
    });
    if (!acepta) return;
    this.errorGeneral.set('');
    try {
      await this.cursoService.desactivar(id);
      await this.cargarCursos();
      this.notificacion.exito('Curso desactivado.');
    } catch (error) {
      this.errorGeneral.set(extraerError(error).mensaje);
    }
  }
}