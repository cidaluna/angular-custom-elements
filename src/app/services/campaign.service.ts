import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Campaign } from '../models/campaign.interface';
import { catchError, Observable, throwError } from 'rxjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = 'http://localhost:3000/campaigns'; // URL do json-server
  private readonly testeApiUrl = '/api'; // para simular erro servidor

  constructor(private readonly httpClient: HttpClient) { }

  getAll(): Observable<Campaign[]>{
    return this.httpClient.get<Campaign[]>(this.apiUrl);
  }

  getCampaigns(filters: any): Observable<any[]>{
    console.log('Entrou getCampaigns com filters :: ', filters);
    let params = new HttpParams();

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
    return this.httpClient.get<any[]>(this.apiUrl, { params });
  }

  getCampaignsWithError(): Observable<any> {
    return this.httpClient.get(`${this.testeApiUrl}/erro500`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
