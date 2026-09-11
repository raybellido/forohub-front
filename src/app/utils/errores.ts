import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '../models/api-error';

export interface ErrorExtraido {
  mensaje: string;
  campos: Record<string, string>;
}

const MENSAJES_POR_ESTADO: Record<number, string> = {
  0: 'No se pudo conectar con el servidor.',
  400: 'Los datos enviados no son válidos.',
  401: 'Credenciales inválidas o sesión expirada.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
  409: 'Ya existe un registro con esos datos.',
  422: 'No se pudieron validar los datos enviados.',
  500: 'Ocurrió un error en el servidor. Inténtalo de nuevo.',
};

export function extraerError(error: unknown): ErrorExtraido {
  if (error instanceof HttpErrorResponse) {
    const cuerpo = error.error as ApiError | string | null;
    const estado = error.status;
    const esObjeto = typeof cuerpo === 'object' && cuerpo !== null;
    const mensaje = esObjeto && cuerpo.error
      ? cuerpo.error
      : (MENSAJES_POR_ESTADO[estado] ?? 'Ocurrió un error inesperado.');
    const campos = esObjeto ? (cuerpo.campos ?? {}) : {};
    return { mensaje, campos };
  }
  return { mensaje: 'Ocurrió un error inesperado.', campos: {} };
}