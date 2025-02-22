import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list.component';
import { FluxoLayoutComponent } from './shared/fluxo-layout/fluxo-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'fluxo',
    component: FluxoLayoutComponent
  }
];
