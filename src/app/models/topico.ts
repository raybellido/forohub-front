import { Perfil } from './usuario';

export type StatusTopico = 'ABIERTO' | 'CERRADO' | 'RESUELTO';

export const STATUS_TOPICO_LABEL: Record<StatusTopico, string> = {
  ABIERTO: 'Abierto',
  CERRADO: 'Cerrado',
  RESUELTO: 'Resuelto',
};

export interface TopicoCrearRequest {
  titulo: string;
  mensaje: string;
  cursoId: number;
}

export interface TopicoActualizarRequest {
  titulo?: string;
  mensaje?: string;
  status?: StatusTopico;
  cursoId?: number;
}

export interface TopicoDetalle {
  id: number;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  status: StatusTopico;
  autorNombre: string;
  cursoNombre: string;
  totalRespuestas: number;
  autorAvatar: string | null;
  autorPerfil: Perfil;
  autorIngreso: string;
}

export interface TopicoResumen {
  id: number;
  titulo: string;
  fechaCreacion: string;
  status: StatusTopico;
  autorNombre: string;
  cursoNombre: string;
  autorAvatar: string | null;
  autorPerfil: Perfil;
  autorIngreso: string;
}