export type Perfil = 'ADMIN' | 'ESTUDIANTE' | 'MODERADOR';

export const PERFIL_LABEL: Record<Perfil, string> = {
  ADMIN: 'Administrador',
  ESTUDIANTE: 'Estudiante',
  MODERADOR: 'Moderador',
};

export const PERFIL_CLASES: Record<Perfil, string> = {
  ADMIN: 'bg-accent/10 text-accent',
  MODERADOR: 'bg-violet/10 text-violet',
  ESTUDIANTE: 'bg-line text-paper/80',
};

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface TokenResponse {
  token: string;
  tipo: string;
  expiracion: number;
}

export interface UsuarioRegistroRequest {
  nombre: string;
  email: string;
  contrasena: string;
}

export interface UsuarioActualizarRequest {
  nombre?: string;
  email?: string;
  contrasena?: string;
  avatarUrl?: string;
}

export interface UsuarioDetalle {
  id: number;
  nombre: string;
  email: string;
  perfil: Perfil;
  activo: boolean;
  avatarUrl: string | null;
  fechaIngreso: string;
}

export interface UsuarioAutenticado {
  id: number;
  email: string;
  perfil: Perfil;
}