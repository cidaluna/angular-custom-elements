import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list.component';
import { FluxoLayoutComponent } from './shared/fluxo-layout/fluxo-layout.component';
import { CampaignListComponent } from './pages/campaign-list/campaign-list.component';
import { PeriodicElementListComponent } from './pages/periodic-element-list/periodic-element-list.component';

export const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent
  },
  {
    path: 'books-test',
    component: BookListComponent
  },
  {
    path: 'periodic-test',
    component: PeriodicElementListComponent
  },
  {
    path: 'fluxo',
    component: FluxoLayoutComponent
  }
];
