import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    //provideAnimationsAsync(),
    provideAnimations(),
    BrowserModule,
    HttpClientModule, // Importação necessária para requisições HTTP
    MatSnackBarModule, // Importação do Material Snackbar
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
  ]
};
