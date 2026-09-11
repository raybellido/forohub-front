import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Avatar } from '../../../components/avatar/avatar';
import { StatusBadge } from '../../../components/status-badge/status-badge';
import { CursoDetalle } from '../../../models/curso';
import { StatusTopico, STATUS_TOPICO_LABEL, TopicoResumen } from '../../../models/topico';
import { CursoService } from '../../../services/curso.service';
import { TopicoService } from '../../../services/topico.service';
import { extraerError } from '../../../utils/errores';
import { fechaRelativa } from '../../../utils/fecha';

const TAMANIO_PAGINA = 8;

type Orden = 'recientes' | 'antiguos';

@Component({
  selector: 'app-topicos-page',
  imports: [RouterLink, StatusBadge, Avatar],
  templateUrl: './topicos-page.html',
  styleUrl: './topicos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicosPage {
  private readonly topicoService = inject(TopicoService);
  private readonly cursoService = inject(CursoService);

  readonly cargando = signal(true);
  readonly error = signal('');
  readonly todos = signal<TopicoResumen[]>([]);
  readonly cursos = signal<CursoDetalle[]>([]);
  readonly cursoIdFiltro = signal<number | null>(null);
  readonly statusFiltro = signal<StatusTopico | null>(null);
  readonly tituloBusqueda = signal('');
  readonly orden = signal<Orden>('recientes');
  readonly pagina = signal(0);

  readonly statuses: StatusTopico[] = ['ABIERTO', 'CERRADO', 'RESUELTO'];
  readonly STATUS_TOPICO_LABEL = STATUS_TOPICO_LABEL;
  readonly ordenes = [
    { id: 'recientes' as const, label: 'Más recientes' },
    { id: 'antiguos' as const, label: 'Más antiguos' },
  ];
  readonly fechaRelativa = fechaRelativa;

  readonly filtrados = computed(() => {
    const cursoId = this.cursoIdFiltro();
    const status = this.statusFiltro();
    const busqueda = this.tituloBusqueda().trim().toLowerCase();
    const curso = this.cursos().find((c) => c.id === cursoId);
    return this.todos().filter((t) => {
      if (curso && t.cursoNombre !== curso.nombre) return false;
      if (status && t.status !== status) return false;
      if (busqueda && !t.titulo.toLowerCase().includes(busqueda)) return false;
      return true;
    });
  });

  readonly ordenados = computed(() => {
    const factor = this.orden() === 'antiguos' ? 1 : -1;
    return [...this.filtrados()].sort(
      (a, b) => factor * (new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()),
    );
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.ordenados().length / TAMANIO_PAGINA)));

  readonly paginaActual = computed(() => {
    const inicio = this.pagina() * TAMANIO_PAGINA;
    return this.ordenados().slice(inicio, inicio + TAMANIO_PAGINA);
  });

  constructor() {
    void this.cargar();
  }

  setCursoFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.cursoIdFiltro.set(valor === '' ? null : Number(valor));
    this.pagina.set(0);
  }

  setStatusFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.statusFiltro.set((valor === '' ? null : valor) as StatusTopico | null);
    this.pagina.set(0);
  }

  setTituloBusqueda(event: Event): void {
    this.tituloBusqueda.set((event.target as HTMLInputElement).value);
    this.pagina.set(0);
  }

  setOrden(event: Event): void {
    this.orden.set((event.target as HTMLSelectElement).value as Orden);
    this.pagina.set(0);
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const [topicos, cursos] = await Promise.all([
        this.topicoService.listarTodos(),
        this.cursoService.listarTodos(),
      ]);
      this.todos.set(topicos);
      this.cursos.set(cursos);
    } catch (error) {
      this.error.set(extraerError(error).mensaje);
    } finally {
      this.cargando.set(false);
    }
  }
}