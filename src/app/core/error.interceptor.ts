import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CoreService } from './core.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 500) {
        // Garante que o CoreService seja injetado corretamente
        runInInjectionContext(inject(Injector), () => {
          const coreService = inject(CoreService);
          coreService.openSnackBar('Erro interno no servidor (500). Tente novamente mais tarde.');
        });
      }

      console.error('Erro interceptado:', error);
      return throwError(() => error);
    })
  );
};
