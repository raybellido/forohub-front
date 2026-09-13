import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { Navbar } from './components/navbar/navbar';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Toast, ConfirmDialog],
  template: `
    <app-navbar />
    <h1 >hola mundoooo</h1>
    <main class="min-h-[calc(100dvh-4rem)]">
      <router-outlet />
    </main>
    <app-toast />
    <app-confirm-dialog />
  `,
})
export class App {}