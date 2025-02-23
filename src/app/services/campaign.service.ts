import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
}
