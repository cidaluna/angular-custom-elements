import { HttpHeaders } from "@angular/common/http";

export interface Book {
  idBook: string
  nomeBook: string,
  nomeRelatorio: string,
  dataInicio: Date,
  dataFim: Date,
  dataInicioExibicao: Date,
  dataFimExibicao: Date,
  documentosClientes: Docs[]
}
export interface Docs {
  possuiContrato: boolean,
  idDocumento: string,
  nomeDocumento: string,
}

export interface BookResponse {
  body: Book[]; // Corpo da resposta (no caso, um array de livros)
  headers: HttpHeaders; // Cabeçalhos da resposta (com informações como X-Total-Count, etc)
  status: number; // Status HTTP da resposta (200, 404, etc)
  statusText: string; // Texto do status HTTP (OK, Not Found, etc)
  url: string | null; // URL da requisição
}
