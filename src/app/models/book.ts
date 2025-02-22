export interface Book {
  idCampanha: string
  nomeCampanha: string,
  nomeRelatorio: string,
  dataInicio: Date,
  dataFim: Date,
  dataInicioExibicao: Date,
  dataFimExibicao: Date,
  documentosClientes:{
    possuiContrato: boolean,
    idDocumento: string,
    nomeDocumento: string,
  }
}
