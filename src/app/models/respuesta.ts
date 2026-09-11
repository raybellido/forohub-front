import { Perfil } from './usuario';

export interface RespuestaCrearRequest {
  mensaje: string;
  topicoId: number;
}

export interface RespuestaActualizarRequest {
  mensaje?: string;
  solucion?: boolean;
}

export interface RespuestaDetalle {
  id: number;
  mensaje: string;
  topicoId: number;
  topticoTitulo: string;
  fechaCreacion: string;
  autorNombre: string;
  solucion: boolean;
  autorAvatar: string | null;
  autorPerfil: Perfil;
  autorIngreso: string;
}