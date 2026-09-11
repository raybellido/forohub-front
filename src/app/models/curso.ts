export type Categoria =
  | 'PROGRAMACION'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DEVOPS'
  | 'DATA_SCIENCE'
  | 'MOBILE'
  | 'IA'
  | 'OTROS';

export const CATEGORIAS: Categoria[] = [
  'PROGRAMACION',
  'FRONTEND',
  'BACKEND',
  'DEVOPS',
  'DATA_SCIENCE',
  'MOBILE',
  'IA',
  'OTROS',
];

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  PROGRAMACION: 'Programación',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DEVOPS: 'DevOps',
  DATA_SCIENCE: 'Data Science',
  MOBILE: 'Mobile',
  IA: 'IA',
  OTROS: 'Otros',
};

export interface CursoCrearRequest {
  nombre: string;
  categoria: Categoria;
}

export interface CursoActualizarRequest {
  nombre?: string;
  categoria?: Categoria;
}

export interface CursoDetalle {
  id: number;
  nombre: string;
  categoria: Categoria;
  activo: boolean;
}