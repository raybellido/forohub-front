import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pagina } from '../models/pagina';
import { UsuarioActualizarRequest, UsuarioDetalle } from '../models/usuario';
import { obtenerTodasLasPaginas } from '../utils/paginacion';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  listar(pagina = 0, tamanio = 50, orden = 'nombre'): Promise<Pagina<UsuarioDetalle>> {
    const params = new HttpParams()
      .set('page', String(pagina))
      .set('size', String(tamanio))
      .set('sort', orden);
    return lastValueFrom(
      this.http.get<Pagina<UsuarioDetalle>>(`${environment.apiUrl}/usuarios`, { params }),
    );
  }

  listarTodos(): Promise<UsuarioDetalle[]> {
    return obtenerTodasLasPaginas((pagina) => this.listar(pagina, 50));
  }

  detalle(id: number): Promise<UsuarioDetalle> {
    return lastValueFrom(
      this.http.get<UsuarioDetalle>(`${environment.apiUrl}/usuarios/${id}`),
    );
  }

  actualizar(id: number, request: UsuarioActualizarRequest): Promise<UsuarioDetalle> {
    return lastValueFrom(
      this.http.put<UsuarioDetalle>(`${environment.apiUrl}/usuarios/${id}`, request),
    );
  }

  desactivar(id: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/usuarios/${id}`),
    );
  }
}