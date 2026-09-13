import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TopicosLista } from '../../../components/topicos-lista/topicos-lista';
import { TopicoResumen } from '../../../models/topico';
import { AuthService } from '../../../services/auth.service';
import { TopicoService } from '../../../services/topico.service';
import { extraerError } from '../../../utils/errores';

@Component({
  selector: 'app-mis-topicos-page',
  imports: [RouterLink, TopicosLista],
  templateUrl: './mis-topicos-page.html',
  styleUrl: './mis-topicos-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisTopicosPage {
  private readonly topicoService = inject(TopicoService);
  private readonly authService = inject(AuthService);

  readonly cargando = signal(true);
  readonly error = signal('');
  readonly todos = signal<TopicoResumen[]>([]);

  readonly misTopicos = computed(() =>
    this.todos().filter((t) => this.authService.esAutorDe(t.autorNombre)),
  );

  constructor() {
    void this.cargar();
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.todos.set(await this.topicoService.listarTodos());
    } catch (error) {
      this.error.set(extraerError(error).mensaje);
    } finally {
      this.cargando.set(false);
    }
  }
}