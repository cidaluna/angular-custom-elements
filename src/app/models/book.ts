export interface Book {
  // nao utilizar essa
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
