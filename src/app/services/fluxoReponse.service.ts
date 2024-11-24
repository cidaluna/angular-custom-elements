import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { IFluxoResponse } from '../models/fluxoResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class FluxoResponseService {

  private apiUrl = `${environment.apiUrl}/fluxoResponseSuccess`; // Usar a URL do environment

  constructor(private _http: HttpClient) { }

  getFluxoResponse(): Observable<IFluxoResponse>{
    console.log("Entrou no service");
    return this._http.get<IFluxoResponse>(this.apiUrl);
  }


}
