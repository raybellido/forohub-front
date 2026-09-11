import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pagina } from '../models/pagina';
import { CursoActualizarRequest, CursoCrearRequest, CursoDetalle } from '../models/curso';
import { obtenerTodasLasPaginas } from '../utils/paginacion';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly http = inject(HttpClient);

  listar(pagina = 0, tamanio = 50, orden = 'nombre'): Promise<Pagina<CursoDetalle>> {
    const params = new HttpParams()
      .set('page', String(pagina))
      .set('size', String(tamanio))
      .set('sort', orden);
    return lastValueFrom(
      this.http.get<Pagina<CursoDetalle>>(`${environment.apiUrl}/cursos`, { params }),
    );
  }

  detalle(id: number): Promise<CursoDetalle> {
    return lastValueFrom(
      this.http.get<CursoDetalle>(`${environment.apiUrl}/cursos/${id}`),
    );
  }

  crear(request: CursoCrearRequest): Promise<CursoDetalle> {
    return lastValueFrom(
      this.http.post<CursoDetalle>(`${environment.apiUrl}/cursos`, request),
    );
  }

  actualizar(id: number, request: CursoActualizarRequest): Promise<CursoDetalle> {
    return lastValueFrom(
      this.http.put<CursoDetalle>(`${environment.apiUrl}/cursos/${id}`, request),
    );
  }

  desactivar(id: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/cursos/${id}`),
    );
  }

  async listarTodos(): Promise<CursoDetalle[]> {
    return obtenerTodasLasPaginas((pagina) => this.listar(pagina, 50));
  }
}