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
    console.log('Entrou getCampaigns com filters :: ', filters);
    let params = new HttpParams();

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

    return this.httpClient.get<any[]>(this.apiUrl, { params });
  }
}
