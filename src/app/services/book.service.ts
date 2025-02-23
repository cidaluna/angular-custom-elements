import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly apiUrl = 'http://localhost:3000/books'; // URL do json-server
  res: any;
  err: any;
  constructor(private readonly http: HttpClient) {}

  getBooks(page: number = 1, limit: number = 10): Observable<HttpResponse<Book[]>> {
    const url = `${this.apiUrl}?_page=${page}&_limit=${limit}`;
    return this.http.get<Book[]>(url, { observe: 'response' });
  }


  // Método para obter os livros paginados
  // getBooks(page: number, limit: number): Observable<HttpResponse<Book[]>> {
  //   const params = new HttpParams()
  //     .set('_page', page.toString())
  //     .set('_limit', limit.toString());

  //   return this.http.get<any>(this.apiUrl, { params });
  // }


  getBooksByHeaderTeste(param: string, value: string): Observable<any> {
    let headers = new HttpHeaders();

    // Adicionando um cabeçalho de autenticação (se necessário)
    // headers = headers.set('Authorization', 'Basic');  // Altere para o seu token real

    // Adiciona o parâmetro e seu valor no cabeçalho
    headers = headers.set(param, value);

    // Realiza a requisição GET com o cabeçalho modificado
    return this.http.get<any>(this.apiUrl, { headers });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // busca todos (montar paginção)
  }

  getBooksByParam(param: string, value: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.filter(item => item[param] &&  item[param].toLowerCase().includes(value.toLowerCase())))
    );
  }

   // Método para buscar livros com filtros via Header
   getBooksWithFilters(filters: { [key: string]: string }): Observable<any[]> {
    // Criação dos cabeçalhos com filtros
    let headers = new HttpHeaders();

    // Itera sobre os filtros e adiciona cada um ao cabeçalho
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value) {
        // Aqui, 'Filtro-Campo' será a chave do filtro e 'Filtro-Valor' será o valor
        headers = headers.set(`Filtro-Campo-${key}`, key);  // Exemplo: Filtro-Campo-nomeCampanha
        headers = headers.set(`Filtro-Valor-${key}`, value);  // Exemplo: Filtro-Valor-nomeCampanha
      }
    });

    // Realiza a requisição GET enviando os cabeçalhos
    return this.http.get<any[]>(this.apiUrl, { headers });
  }


  getBooksByParamsTeste(params: { [key: string]: string }): Observable<Book[]> {
    let httpParams = new HttpParams();

    // Adicionando os parâmetros à requisição
    Object.keys(params).forEach(res => {
      if (params[res]) {
        httpParams = httpParams.set(res, params[res]);
      }
    });

    return this.http.get<Book[]>(`${this.apiUrl}`, { params: httpParams });
  }

  // Método para buscar livros com base nos parâmetros passados
  getBooksByHeader(formData: any): Observable<any> {
    let headers = new HttpHeaders();

    // Adicionando parâmetros ao cabeçalho
    if (formData.nomeCampanha) {
      headers = headers.set('nomeCampanha', formData.nomeCampanha);
      console.log('Entrou getBooksByHeader com headers nomeCampanha: ',headers);
    }
    if (formData.nomeRelatorio) {
      headers = headers.set('nomeRelatorio', formData.nomeRelatorio);
      console.log('Entrou getBooksByHeader com headers nomeRelatorio: ',headers);
    }
    if (formData.nomeDocumento) {
      headers = headers.set('nomeDocumento', formData.nomeDocumento);
      console.log('Entrou getBooksByHeader com headers nomeDocumento: ',headers);
    }
    if (formData.possuiContrato) {
      headers = headers.set('possuiContrato', formData.possuiContrato);
      console.log('Entrou getBooksByHeader com headers possuiContrato: ',headers);
    }
    if (formData.dataInicio) {
      headers = headers.set('dataInicio', formData.dataInicio);
      console.log('Entrou getBooksByHeader com headers dataInicio: ',headers);
    }
    if (formData.dataFim) {
      headers = headers.set('dataFim', formData.dataFim);
      console.log('Entrou getBooksByHeader com headers dataFim: ',headers);
    }

    // Requisição GET com cabeçalho configurado
    return this.http.get(this.apiUrl, { headers });
  }


}
