import { Pagina } from '../models/pagina';

/**
 * Recorre todas las páginas de un endpoint paginado y devuelve todo su contenido.
 * El parámetro `topePaginas` evita un bucle infinito ante respuestas inconsistentes.
 */
export async function obtenerTodasLasPaginas<T>(
  obtenerPagina: (pagina: number) => Promise<Pagina<T>>,
  topePaginas = 1000,
): Promise<T[]> {
  const todos: T[] = [];
  let pagina = 0;
  let ultima = false;
  while (!ultima && pagina < topePaginas) {
    const resultado = await obtenerPagina(pagina);
    todos.push(...resultado.content);
    ultima = resultado.last;
    pagina++;
  }
  return todos;
}