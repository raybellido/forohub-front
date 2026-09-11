import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { extraerError } from '../../utils/errores';
import { errorCampo } from '../../utils/form-error';

@Component({
  selector: 'app-registro-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-page.html',
  styleUrl: './registro-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly formulario: FormGroup<{
    nombre: FormControl<string>;
    email: FormControl<string>;
    contrasena: FormControl<string>;
  }> = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly cargando = signal(false);
  readonly errorGeneral = signal('');
  readonly errorCampos = signal<Record<string, string>>({});

  campoError(campo: string): string | undefined {
    return errorCampo(this.formulario.get(campo), this.errorCampos()[campo]);
  }

  async registrar(): Promise<void> {
    this.errorGeneral.set('');
    this.errorCampos.set({});
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    try {
      const valor = this.formulario.getRawValue();
      await this.authService.registrar({ ...valor });
      await this.router.navigate(['/login'], { queryParams: { registro: 'exitoso' } });
    } catch (error) {
      const extraido = extraerError(error);
      this.errorGeneral.set(extraido.mensaje);
      this.errorCampos.set(extraido.campos);
    } finally {
      this.cargando.set(false);
    }
  }
}