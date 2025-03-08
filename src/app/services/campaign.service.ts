import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Campaign } from '../models/campaign.interface';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = 'http://localhost:3000/campaigns'; // URL do json-server

  constructor(private readonly httpClient: HttpClient) { }

  getAll(): Observable<Campaign[]>{
    return this.httpClient.get<Campaign[]>(this.apiUrl);
  }

  getCampaigns(filters: any): Observable<any[]>{
    let params = new HttpParams();

    // Conversao de campo booleano 'Possui contrato'
    if(filters.possuiContrato !== undefined) {
      params = params.append(
      'possuiContrato',
      filters.possuiContrato === 'Sim' ? 'true' : 'false'
      );
    }

     // Verifica se os filtros de data foram preenchidos e formata corretamente
     if (filters.dataInicio) {
      const formattedDate = moment.utc(filters.dataInicio).local().format('YYYY-MM-DD');
      params = params.append('dataInicio', formattedDate);
    }

    if (filters.dataFim) {
      const formattedDate = moment.utc(filters.dataFim).local().format('YYYY-MM-DD');
      params = params.append('dataFim', formattedDate);
    }

    // Adiciona os filtros na url se forem preenchidos
    Object.keys(filters).forEach(key => {
      if(filters[key] &&
         key !== 'possuiContrato' &&
         key !== 'dataInicio' &&
         key !== 'dataFim'){
        params = params.append(key, filters[key]);
      }
    });

    console.log('Params: ', params);
    return this.httpClient.get<any[]>(this.apiUrl, { params });
  }
}
