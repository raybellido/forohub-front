import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginRequest, Perfil, TokenResponse, UsuarioAutenticado, UsuarioDetalle, UsuarioRegistroRequest } from '../models/usuario';

const TOKEN_KEY = 'forohub_token';

export function decodificarPayload(token: string): UsuarioAutenticado & { exp?: number } {
  const parte = token.split('.')[1];
  const base64 = parte.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  const { id, perfil, sub, exp } = JSON.parse(json) as {
    id: number;
    perfil: Perfil;
    sub: string;
    exp?: number;
  };
  return { id, email: sub, perfil, exp };
}

export function tokenExpirado(token: string): boolean {
  try {
    const { exp } = decodificarPayload(token);
    return exp === undefined || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly perfilSignal = signal<UsuarioDetalle | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly miPerfil = this.perfilSignal.asReadonly();
  readonly autenticado = computed(() => this.tokenSignal() !== null);
  readonly esAdmin = computed(() => this.perfilSignal()?.perfil === 'ADMIN');

  constructor() {
    const token = this.tokenSignal();
    if (!token) return;

    const perfilInicial = this.perfilDesdeClaims(token);
    if (!perfilInicial || tokenExpirado(token)) {
      this.cerrarSesion();
      return;
    }
    this.perfilSignal.set(perfilInicial);
    void this.cargarMiPerfil();
  }

  async login(credenciales: LoginRequest): Promise<void> {
    const respuesta = await lastValueFrom(
      this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, credenciales),
    );
    this.guardarSesion(respuesta.token);
  }

  async registrar(datos: UsuarioRegistroRequest): Promise<UsuarioDetalle> {
    return lastValueFrom(
      this.http.post<UsuarioDetalle>(`${environment.apiUrl}/auth/registro`, datos),
    );
  }

  async cargarMiPerfil(): Promise<void> {
    const token = this.tokenSignal();
    if (!token) {
      this.cerrarSesion();
      return;
    }
    const usuario = this.perfilDesdeClaims(token);
    if (!usuario) {
      this.cerrarSesion();
      return;
    }
    try {
      const perfil = await lastValueFrom(
        this.http.get<UsuarioDetalle>(`${environment.apiUrl}/usuarios/${usuario.id}`),
      );
      this.perfilSignal.set(perfil);
    } catch (error) {
      // Errores transitorios (red, timeout, 5xx) no cierran la sesión.
      // Solo un 401 real implica token inválido/expirado.
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.cerrarSesion();
      }
    }
  }

  private perfilDesdeClaims(token: string): UsuarioDetalle | null {
    try {
      const { id, email, perfil } = decodificarPayload(token);
      if (!id || !email || !perfil) return null;
      return {
        id,
        nombre: email,
        email,
        perfil: perfil as Perfil,
        activo: true,
        avatarUrl: null,
        fechaIngreso: '',
      };
    } catch {
      return null;
    }
  }

  cerrarSesion(): void {
    this.tokenSignal.set(null);
    this.perfilSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  redirigirSiNoAutenticado(): boolean {
    if (this.autenticado()) return true;
    void this.router.navigate(['/login']);
    return false;
  }

  redirigirSiNoAdmin(): boolean {
    if (this.esAdmin()) return true;
    void this.router.navigate(['/topicos']);
    return false;
  }

  esAutorDe(nombreAutor: string): boolean {
    return this.perfilSignal()?.nombre === nombreAutor;
  }

  usuarioActual(): UsuarioAutenticado | null {
    const token = this.tokenSignal();
    if (!token) return null;
    try {
      const { id, email, perfil } = decodificarPayload(token);
      return { id, email, perfil: perfil as Perfil };
    } catch {
      this.cerrarSesion();
      return null;
    }
  }

  private guardarSesion(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
    const perfilInicial = this.perfilDesdeClaims(token);
    if (perfilInicial) this.perfilSignal.set(perfilInicial);
    void this.cargarMiPerfil();
  }
}