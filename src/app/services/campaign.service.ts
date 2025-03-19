import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Campaign } from '../models/campaign.interface';
import { catchError, Observable, throwError } from 'rxjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  // O JSON Server suporta paginação nativamente usando os parâmetros _page e _limit.
  // Exemplo:
  // GET http://localhost:3000/campaigns?_page=1&_limit=10
  private readonly apiUrl = 'http://localhost:3000/campaigns';
  private readonly testeApiUrl = '/api'; // para simular erro servidor

  constructor(private readonly httpClient: HttpClient) { }

  getAll(): Observable<Campaign[]>{
    return this.httpClient.get<Campaign[]>(this.apiUrl);
  }

  getCampaigns(filters: any, page: number, limit: number):  Observable<HttpResponse<any[]>>{
    console.log('Entrou getCampaigns com filters :: ', filters);
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());


    if (filters.nomeCampanha) {
      params = params.set('nomeCampanha', filters.nomeCampanha);
    }

    if (filters.nomeRelatorio) {
      params = params.set('nomeRelatorio', filters.nomeRelatorio);
    }

    if(filters.nomeDocumento){
      params = params.set('nomeDocumento', filters.nomeDocumento);
    }

    // Conversao de campo booleano 'Possui contrato'
    if(filters.possuiContrato !== undefined) {
      params = params.set(
      'possuiContrato',
      filters.possuiContrato === 'Sim' ? 'true' : 'false'
      );
    }

     // Verifica se os filtros de data foram preenchidos e formata corretamente
     if (filters.dataInicio) {
      const formattedDate = moment(filters.dataInicio).format('YYYY-MM-DD');
      params = params.set('dataInicio', formattedDate);
    }

    if (filters.dataFim) {
      const formattedDate = moment(filters.dataFim).format('YYYY-MM-DD');
      params = params.set('dataFim', formattedDate);
    }

    // Adiciona os filtros na url se forem preenchidos
    Object.keys(filters).forEach(key => {
      console.log(":::Filters:::",filters);
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    console.log('URL gerada:', this.apiUrl + '?' + params.toString());
    return this.httpClient.get<any[]>(this.apiUrl, { params, observe: 'response' });
    // observe: 'response' permite acessar os cabeçalhos HTTP, incluindo
    // X-Total-Count para obter o total de registros.
  }

  getCampaignsWithError(): Observable<any> {
    return this.httpClient.get(`${this.testeApiUrl}/erro500`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
