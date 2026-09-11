import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Avatar } from '../avatar/avatar';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Avatar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly autenticado = this.authService.autenticado;
  readonly esAdmin = this.authService.esAdmin;
  readonly miPerfil = this.authService.miPerfil;

  readonly menuAbierto = signal(false);

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/login']);
  }
}