import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();
  let solicitud = req;
  if (token) {
    solicitud = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(solicitud).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const url = router.url;
        const enArranque = url.length === 0;
        const esRutaPublica = url.startsWith('/login') || url.startsWith('/registro');
        if (!enArranque && !esRutaPublica) {
          authService.cerrarSesion();
          void router.navigate(['/login'], { queryParams: { sesion: 'expirada' } });
        }
      }
      return throwError(() => error);
    }),
  );
};