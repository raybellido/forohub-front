import { AbstractControl } from '@angular/forms';

export function errorCampo(
  control: AbstractControl | null,
  mensajeServidor?: string,
): string | undefined {
  if (!control || !control.invalid || !control.touched) return mensajeServidor;
  if (control.hasError('required')) return 'Este campo es obligatorio.';
  if (control.hasError('email')) return 'El formato de email es inválido.';
  const minlength = control.getError('minlength') as { requiredLength?: number } | undefined;
  if (minlength?.requiredLength) return `Debe tener al menos ${minlength.requiredLength} caracteres.`;
  const maxlength = control.getError('maxlength') as { requiredLength?: number } | undefined;
  if (maxlength?.requiredLength) return `Debe tener como máximo ${maxlength.requiredLength} caracteres.`;
  return mensajeServidor;
}