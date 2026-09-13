import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TopicoResumen } from '../../models/topico';
import { fechaRelativa } from '../../utils/fecha';
import { Avatar } from '../avatar/avatar';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-topicos-lista',
  imports: [RouterLink, StatusBadge, Avatar],
  templateUrl: './topicos-lista.html',
  styleUrl: './topicos-lista.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicosLista {
  readonly topicos = input.required<TopicoResumen[]>();
  readonly cargando = input(false);
  readonly error = input('');
  readonly vacioTitulo = input('No hay tópicos.');
  readonly vacioMensaje = input('');
  readonly vacioCtaRuta = input('');
  readonly vacioCtaTexto = input('');
  readonly tamanioPagina = input(8);

  readonly pagina = signal(0);
  readonly fechaRelativa = fechaRelativa;

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.topicos().length / this.tamanioPagina())),
  );

  readonly paginaActual = computed(() => {
    const inicio = this.pagina() * this.tamanioPagina();
    return this.topicos().slice(inicio, inicio + this.tamanioPagina());
  });

  numerosDePagina(): (number | null)[] {
    const total = this.totalPaginas();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const actual = this.pagina() + 1;
    const set = new Set<number>();
    set.add(1);
    set.add(total);
    for (let i = Math.max(1, actual - 1); i <= Math.min(total, actual + 1); i++) set.add(i);
    const resultado: (number | null)[] = [];
    let previo = 0;
    for (const n of [...set].sort((a, b) => a - b)) {
      if (n - previo > 1) resultado.push(null);
      resultado.push(n);
      previo = n;
    }
    return resultado;
  }

  constructor() {
    effect(() => {
      this.topicos();
      this.pagina.set(0);
    });
  }
}