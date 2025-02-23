// Preparando as Campanhas
export interface Campaign {
  idCampanha: string,
  nomeCampanha: string,
  nomeRelatorio: string,
  dataInicio: Date,
  dataFim: Date,
  dataInicioExibicao: Date,
  dataFimExibicao: Date,
  documentosClientes: DocsCustomer[]
}

export interface DocsCustomer {
  possuiContrato: boolean,
  idDocumento: string,
  nomeDocumento: string,
}
