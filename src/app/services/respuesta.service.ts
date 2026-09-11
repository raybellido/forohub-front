import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pagina } from '../models/pagina';
import { RespuestaActualizarRequest, RespuestaCrearRequest, RespuestaDetalle } from '../models/respuesta';

@Injectable({ providedIn: 'root' })
export class RespuestaService {
  private readonly http = inject(HttpClient);

  listarPorTopico(topicoId: number, pagina = 0, tamanio = 20, orden = 'fechaCreacion'): Promise<Pagina<RespuestaDetalle>> {
    const params = new HttpParams()
      .set('page', String(pagina))
      .set('size', String(tamanio))
      .set('sort', orden);
    return lastValueFrom(
      this.http.get<Pagina<RespuestaDetalle>>(`${environment.apiUrl}/respuestas/topico/${topicoId}`, { params }),
    );
  }

  crear(request: RespuestaCrearRequest): Promise<RespuestaDetalle> {
    return lastValueFrom(
      this.http.post<RespuestaDetalle>(`${environment.apiUrl}/respuestas`, request),
    );
  }

  actualizar(id: number, request: RespuestaActualizarRequest): Promise<RespuestaDetalle> {
    return lastValueFrom(
      this.http.put<RespuestaDetalle>(`${environment.apiUrl}/respuestas/${id}`, request),
    );
  }

  eliminar(id: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/respuestas/${id}`),
    );
  }
}