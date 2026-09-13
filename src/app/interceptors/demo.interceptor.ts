import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  actualizarCurso,
  actualizarRespuesta,
  actualizarTopico,
  actualizarUsuario,
  construirToken,
  crearCurso,
  crearRespuesta,
  crearTopico,
  desactivarUsuario,
  detalleTopico,
  detalleUsuario,
  eliminarCurso,
  eliminarRespuesta,
  eliminarTopico,
  listarCursos,
  listarRespuestas,
  listarTopicos,
  listarUsuarios,
  loginMock,
  paginar,
  registrarMock,
} from '../demo/demo-data';
import { Categoria, CursoCrearRequest, CursoActualizarRequest } from '../models/curso';
import { RespuestaCrearRequest, RespuestaActualizarRequest } from '../models/respuesta';
import { StatusTopico, TopicoActualizarRequest, TopicoCrearRequest } from '../models/topico';
import { LoginRequest, UsuarioActualizarRequest, UsuarioRegistroRequest } from '../models/usuario';

const USUARIO_DEMO_ID = 1;

function ruta(reqUrl: string): string {
  const url = new URL(reqUrl, 'https://forohub.demo');
  return url.pathname;
}

function numero(ruta: string): number | null {
  const coincidencia = ruta.match(/\/(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
}

function paginaDe(params: { page: string | null; size: string | null }, porDefectoTamano: number): [number, number] {
  const pagina = Number(params.page ?? 0);
  const tamanio = Number(params.size ?? porDefectoTamano);
  return [Number.isFinite(pagina) ? pagina : 0, Number.isFinite(tamanio) ? tamanio : porDefectoTamano];
}

const correcto = <T>(cuerpo: T) => of(new HttpResponse({ status: 200, body: cuerpo }));
const sinContenido = () => of(new HttpResponse({ status: 204 }));

function rechazar(status: number, error: string) {
  return throwError(() => new HttpErrorResponse({ status, error: { status, error } }));
}

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.demo) return next(req);

  const path = ruta(req.url);
  const metodo = req.method;

  // ── Autenticación ─────────────────────────────────────────────
  if (path === '/auth/login' && metodo === 'POST') {
    const credenciales = req.body as LoginRequest;
    if (!credenciales?.email || !credenciales?.contrasena) {
      return rechazar(400, 'El email y la contraseña son obligatorios.');
    }
    const usuario = loginMock(credenciales);
    return correcto({ token: construirToken(usuario), tipo: 'Bearer', expiracion: 30 * 24 * 60 * 60 });
  }

  if (path === '/auth/registro' && metodo === 'POST') {
    const datos = req.body as UsuarioRegistroRequest;
    if (!datos?.nombre?.trim() || !datos?.email?.trim() || !datos?.contrasena) {
      return rechazar(400, 'Todos los campos son obligatorios.');
    }
    return correcto(registrarMock(datos));
  }

  // ── Cursos ────────────────────────────────────────────────────
  if (path === '/cursos') {
    if (metodo === 'GET') {
      const [pagina, tamanio] = paginaDe({ page: req.params.get('page'), size: req.params.get('size') }, 50);
      return correcto(paginar(listarCursos(), pagina, tamanio));
    }
    if (metodo === 'POST') {
      const datos = req.body as CursoCrearRequest;
      if (!datos?.nombre?.trim() || !datos?.categoria) {
        return rechazar(400, 'El nombre y la categoría son obligatorios.');
      }
      return correcto(crearCurso(datos.nombre.trim(), datos.categoria as Categoria));
    }
  }

  if (/^\/cursos\/\d+$/.test(path)) {
    const id = numero(path) as number;
    if (metodo === 'PUT') {
      const datos = req.body as CursoActualizarRequest;
      const actualizado = actualizarCurso(id, {
        nombre: datos?.nombre?.trim(),
        categoria: datos?.categoria as Categoria | undefined,
      });
      if (!actualizado) return rechazar(404, 'No se encontró el curso.');
      return correcto(actualizado);
    }
    if (metodo === 'DELETE') {
      eliminarCurso(id);
      return sinContenido();
    }
  }

  // ── Usuarios ──────────────────────────────────────────────────
  if (path === '/usuarios' && metodo === 'GET') {
    const [pagina, tamanio] = paginaDe({ page: req.params.get('page'), size: req.params.get('size') }, 50);
    return correcto(paginar(listarUsuarios(), pagina, tamanio));
  }

  if (/^\/usuarios\/\d+$/.test(path)) {
    const id = numero(path) as number;
    if (metodo === 'GET') {
      const usuario = detalleUsuario(id);
      if (!usuario) return rechazar(404, 'No se encontró el usuario.');
      return correcto(usuario);
    }
    if (metodo === 'PUT') {
      const datos = req.body as UsuarioActualizarRequest;
      const actualizado = actualizarUsuario(id, {
        nombre: datos?.nombre?.trim(),
        email: datos?.email?.trim(),
        contrasena: datos?.contrasena,
        avatarUrl: datos?.avatarUrl,
      });
      if (!actualizado) return rechazar(404, 'No se encontró el usuario.');
      return correcto(actualizado);
    }
    if (metodo === 'DELETE') {
      desactivarUsuario(id);
      return sinContenido();
    }
  }

  // ── Tópicos ───────────────────────────────────────────────────
  if (path === '/topicos') {
    if (metodo === 'GET') {
      const [pagina, tamanio] = paginaDe({ page: req.params.get('page'), size: req.params.get('size') }, 10);
      return correcto(listarTopicos(pagina, tamanio));
    }
    if (metodo === 'POST') {
      const datos = req.body as TopicoCrearRequest;
      if (!datos?.titulo?.trim() || !datos?.mensaje?.trim() || !datos?.cursoId) {
        return rechazar(400, 'El título, el mensaje y el curso son obligatorios.');
      }
      return correcto(crearTopico(datos.titulo.trim(), datos.mensaje.trim(), datos.cursoId, USUARIO_DEMO_ID));
    }
  }

  if (/^\/topicos\/\d+$/.test(path)) {
    const id = numero(path) as number;
    if (metodo === 'GET') {
      const topico = detalleTopico(id);
      if (!topico) return rechazar(404, 'No se encontró el tópico.');
      return correcto(topico);
    }
    if (metodo === 'PUT') {
      const datos = req.body as TopicoActualizarRequest;
      const actualizado = actualizarTopico(id, {
        titulo: datos?.titulo?.trim(),
        mensaje: datos?.mensaje?.trim(),
        status: datos?.status as StatusTopico | undefined,
        cursoId: datos?.cursoId,
      });
      if (!actualizado) return rechazar(404, 'No se encontró el tópico.');
      return correcto(actualizado);
    }
    if (metodo === 'DELETE') {
      eliminarTopico(id);
      return sinContenido();
    }
  }

  // ── Respuestas ────────────────────────────────────────────────
  if (/^\/respuestas\/topico\/\d+$/.test(path) && metodo === 'GET') {
    const topicoId = numero(path) as number;
    const [pagina, tamanio] = paginaDe({ page: req.params.get('page'), size: req.params.get('size') }, 20);
    return correcto(listarRespuestas(topicoId, pagina, tamanio));
  }

  if (path === '/respuestas' && metodo === 'POST') {
    const datos = req.body as RespuestaCrearRequest;
    if (!datos?.mensaje?.trim() || !datos?.topicoId) {
      return rechazar(400, 'El mensaje y el tópico son obligatorios.');
    }
    const respuesta = crearRespuesta(datos.mensaje.trim(), datos.topicoId, USUARIO_DEMO_ID);
    if (!respuesta) return rechazar(404, 'No se encontró el tópico.');
    return correcto(respuesta);
  }

  if (/^\/respuestas\/\d+$/.test(path)) {
    const id = numero(path) as number;
    if (metodo === 'PUT') {
      const datos = req.body as RespuestaActualizarRequest;
      const actualizada = actualizarRespuesta(id, {
        mensaje: datos?.mensaje?.trim(),
        solucion: datos?.solucion,
      });
      if (!actualizada) return rechazar(404, 'No se encontró la respuesta.');
      return correcto(actualizada);
    }
    if (metodo === 'DELETE') {
      eliminarRespuesta(id);
      return sinContenido();
    }
  }

  // Cualquier otra ruta del cliente no emulada devuelve 404 con el formato conocido.
  return rechazar(404, 'No se encontró el recurso solicitado.');
};