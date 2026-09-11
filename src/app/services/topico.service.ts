import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pagina } from '../models/pagina';
import { TopicoActualizarRequest, TopicoCrearRequest, TopicoDetalle, TopicoResumen } from '../models/topico';
import { obtenerTodasLasPaginas } from '../utils/paginacion';

@Injectable({ providedIn: 'root' })
export class TopicoService {
  private readonly http = inject(HttpClient);

  listar(pagina = 0, tamanio = 10, orden = 'fechaCreacion,desc'): Promise<Pagina<TopicoResumen>> {
    const params = new HttpParams()
      .set('page', String(pagina))
      .set('size', String(tamanio))
      .set('sort', orden);
    return lastValueFrom(
      this.http.get<Pagina<TopicoResumen>>(`${environment.apiUrl}/topicos`, { params }),
    );
  }

  listarTodos(): Promise<TopicoResumen[]> {
    return obtenerTodasLasPaginas((pagina) => this.listar(pagina, 50));
  }

  detalle(id: number): Promise<TopicoDetalle> {
    return lastValueFrom(
      this.http.get<TopicoDetalle>(`${environment.apiUrl}/topicos/${id}`),
    );
  }

  crear(request: TopicoCrearRequest): Promise<TopicoDetalle> {
    return lastValueFrom(
      this.http.post<TopicoDetalle>(`${environment.apiUrl}/topicos`, request),
    );
  }

  actualizar(id: number, request: TopicoActualizarRequest): Promise<TopicoDetalle> {
    return lastValueFrom(
      this.http.put<TopicoDetalle>(`${environment.apiUrl}/topicos/${id}`, request),
    );
  }

  eliminar(id: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/topicos/${id}`),
    );
  }
}