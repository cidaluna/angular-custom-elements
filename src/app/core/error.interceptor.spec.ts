import { errorInterceptor } from './error.interceptor';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ErrorInterceptor', () => {
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    // Criamos um mock do MatSnackBar
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Criamos um spy para simular o HttpHandlerFn
    mockNext = jasmine.createSpy('mockNext');
  });

  it('deve exibir o Snackbar quando ocorrer erro 500', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Simula uma requisição falhando com erro 500
    mockNext.and.returnValue(throwError(() => errorResponse));

    errorInterceptor({} as HttpRequest<any>, mockNext).subscribe({
      error: () => {
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erro interno no servidor. Tente novamente mais tarde.',
          'Fechar',
          jasmine.any(Object) // Qualquer configuração do Snackbar
        );
        done();
      },
    });
  });

  it('não deve exibir o Snackbar para erro 404', (done) => {
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    // Simula um erro 404 (não deve exibir o Snackbar)
    mockNext.and.returnValue(throwError(() => errorResponse));

    errorInterceptor({} as HttpRequest<any>, mockNext).subscribe({
      error: () => {
        expect(mockSnackBar.open).not.toHaveBeenCalled(); // Verifica que o Snackbar NÃO foi chamado
        done();
      },
    });
  });

  it('deve permitir que requisições bem-sucedidas passem pelo interceptor sem alteração', (done) => {
    const successResponse = new HttpResponse({ status: 200, body: { success: true } });

    // Simula uma requisição bem-sucedida
    mockNext.and.returnValue(of(successResponse));

    errorInterceptor({} as HttpRequest<any>, mockNext).subscribe({
      next: (response) => {
        expect(response).toEqual(successResponse); // Verifica que a resposta não foi alterada
        expect(mockSnackBar.open).not.toHaveBeenCalled(); // Verifica que o Snackbar NÃO foi chamado
        done();
      },
    });
  });
});
