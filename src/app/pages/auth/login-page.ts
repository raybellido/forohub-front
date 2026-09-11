import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { extraerError } from '../../utils/errores';
import { errorCampo } from '../../utils/form-error';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly formulario: FormGroup<{
    email: FormControl<string>;
    contrasena: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  readonly cargando = signal(false);
  readonly errorGeneral = signal('');
  readonly errorCampos = signal<Record<string, string>>({});
  readonly mensajeExito = signal(
    this.route.snapshot.queryParamMap.get('registro') === 'exitoso'
      ? 'Tu cuenta se creó correctamente.'
      : '',
  );
  readonly mensajeSesionExpirada = signal(this.route.snapshot.queryParamMap.get('sesion') === 'expirada');

  campoError(campo: string): string | undefined {
    return errorCampo(this.formulario.get(campo), this.errorCampos()[campo]);
  }

  async iniciarSesion(): Promise<void> {
    this.errorGeneral.set('');
    this.errorCampos.set({});
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    try {
      const { email, contrasena } = this.formulario.getRawValue();
      await this.authService.login({ email, contrasena });
      await this.router.navigate(['/topicos']);
    } catch (error) {
      const extraido = extraerError(error);
      this.errorGeneral.set(extraido.mensaje);
      this.errorCampos.set(extraido.campos);
    } finally {
      this.cargando.set(false);
    }
  }
}