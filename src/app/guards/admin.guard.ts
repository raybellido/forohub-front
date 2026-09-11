import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export function adminGuard(): boolean {
  return inject(AuthService).redirigirSiNoAdmin();
}