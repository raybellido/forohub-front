import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export function authGuard(): boolean {
  return inject(AuthService).redirigirSiNoAutenticado();
}