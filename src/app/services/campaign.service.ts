import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Campaign } from '../models/campaign.interface';
import { Observable } from 'rxjs';

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

    // Adiciona os filtros na url se forem preenchidos
    Object.keys(filters).forEach(key => {
      if(filters[key]){
        params = params.append(key, filters[key]);
      }
    });

    return this.httpClient.get<any[]>(this.apiUrl, { params });
  }
}
