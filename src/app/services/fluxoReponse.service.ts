import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { IFluxoResponse } from '../models/fluxoResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class FluxoResponseService {

  private readonly apiUrl = `${environment.apiUrl}/fluxoResponseSuccess`; // Usar a URL do environment
  private readonly apiUrlWarning = `${environment.apiUrl}/fluxoResponseWarning`; // Usar a URL do environment

  constructor(private readonly _http: HttpClient) { }

  getFluxoResponseSuccess(): Observable<IFluxoResponse>{
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
      });
    console.log("Entrou no service sucesso");
    return this._http.get<IFluxoResponse>(this.apiUrl, { headers, responseType: 'json' });
  }

  getFluxoResponseWarning(): Observable<IFluxoResponse>{
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
      });
    console.log("Entrou no service warning");
    return this._http.get<IFluxoResponse>(this.apiUrlWarning, { headers, responseType: 'json' });
  }


}
