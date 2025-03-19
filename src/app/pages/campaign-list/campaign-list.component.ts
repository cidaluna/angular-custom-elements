import { Component, OnInit } from '@angular/core';
import { Campaign } from '../../models/campaign.interface';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import {provideNativeDateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import moment from 'moment';
import localePt from '@angular/common/locales/pt';
import { CampaignDetailsComponent } from './modal/campaign-details/campaign-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router'; // Importado para query params
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { saveAs } from 'file-saver';
import { PageEvent, MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
registerLocaleData(localePt);

export interface Contrato {
  value: boolean,
  viewValue: string,
}
@Component({
  selector: 'app-campaign-list',
  standalone: true,
  providers: [provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatDatepickerModule, MatPaginatorModule
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent implements OnInit {
  campaignForm!: FormGroup;
  allCampaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  error: any;
  loading = false;
  minDateRule: Date;
  maxDateRule: Date;
  contratos: Contrato[] = [
    {value: true, viewValue: 'Sim'},
    {value: false, viewValue: 'Não'},
  ];
  statusOptions = ['CLICKED', 'ANOTHER', 'NEW'];
  selectedStatus: string = '';
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 5; // Número de itens por página

  constructor(private readonly fb: FormBuilder,
              private readonly campaignService: CampaignService,
              private readonly dialog: MatDialog,
              private readonly route: ActivatedRoute, //Rota atual para query params
              private readonly router: Router, //Router para atualizar a URL
  ) {
    // Set the minimum to January 1st 5 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateRule = new Date(currentYear - 5, 0, 1);
    this.maxDateRule = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {
    this.startFields();
    this.startCampaigns();
    this.loadFiltersFromQueryParams(); // Carrega filtros da URL
  }

  startFields(): void {
    console.log('Entrou startFields');
    // Inicializa o form com os campos vazios
    this.campaignForm = this.fb.group({
      nomeCampanha: [''],
      nomeRelatorio: ['', [Validators.maxLength(10)]],
      dataInicio: [null],
      dataFim: [null],
      status: [''],
      documentosClientes: this.fb.group({
        possuiContrato: [''],
        nomeDocumento: [''],
      })
    });
  }

  clearFilters(): void {
    console.log('Clicou em Limpar');

    this.campaignForm.reset(); // Reseta os campos do formulário para os valores iniciais

    // Remove os filtros da URL
    this.router.navigate([], {
      queryParams: {}, // Remove todos os query params
    });

    this.filteredCampaigns = [...this.allCampaigns]; // Restaura os dados completos
  }

  /**  Atualiza os filtros com base nos query params da URL */
  loadFiltersFromQueryParams(): void {
    console.log('Entrou loadFiltersFromQueryParams');
    // O route faz apenas a leitura dos parâmetros na url atual
    //  todos os filtros sejam carregados de uma vez sem precisar de várias chamadas.
    this.route.queryParams.subscribe(params => {
      const filters = {
        status: params['status'] || '',
        nomeCampanha: params['nomeCampanha'] || '',
        nomeRelatorio: params['nomeRelatorio'] || '',
        documentosClientes: {
          possuiContrato: params['possuiContrato'] || '',
          nomeDocumento: params['nomeDocumento'] || '',
        },
        dataInicio: params['dataInicio'] ? moment(params['dataInicio']).toDate() : null,
        dataFim: params['dataFim'] ? moment(params['dataFim']).toDate() : null
      };

      this.campaignForm.patchValue(filters);
    });
  }

  fetchCampaigns() {
    this.campaignService.getCampaignsWithError().subscribe({
      next: (data) => console.log('Dados recebidos:', data),
      error: (err) => console.log('Erro tratado pelo interceptor:', err),
    });
  }

  onPageChange(event: PageEvent): void {
    console.log('Mudou de página:', event);
    this.currentPage = event.pageIndex + 1; // MatPaginator usa índice baseado em 0
    this.pageSize = event.pageSize;

    // Obtém os filtros atuais do formulário para manter os critérios de pesquisa ao mudar de página
    const filters: any = {
      nomeCampanha: this.campaignForm.value.nomeCampanha,
      nomeRelatorio: this.campaignForm.value.nomeRelatorio,
      nomeDocumento: this.campaignForm.value.documentosClientes?.nomeDocumento,
      possuiContrato: this.campaignForm.value.documentosClientes?.possuiContrato,
      dataInicio: this.campaignForm.value.dataInicio ? moment(this.campaignForm.value.dataInicio).format('YYYY-MM-DD') : null,
      dataFim: this.campaignForm.value.dataFim ? moment(this.campaignForm.value.dataFim).format('YYYY-MM-DD') : null,
      status: this.campaignForm.value.status
    };

    // Remove filtros vazios
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    // Atualiza os query params na URL para refletir a nova página
    this.router.navigate([], {
      queryParams: { ...filters, page: this.currentPage, limit: this.pageSize },
      queryParamsHandling: 'merge' // Mantém os outros parâmetros da URL
    });

    // Busca os novos dados com base na nova página
    this.getCampaigns(filters, this.currentPage, this.pageSize);
  }


  get totalPages(): number {
    console.log('Entrou totalPages');
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onSubmit(): void {
    console.log('Clicou em Pesquisar');

    if(this.campaignForm.valid){
      this.loading = true;

      //Pega os valores do form e organiza para passar como filtros
      const filters: any = {
        nomeCampanha: this.campaignForm.value.nomeCampanha,
        nomeRelatorio: this.campaignForm.value.nomeRelatorio,
        nomeDocumento: this.campaignForm.value.documentosClientes?.nomeDocumento,
        possuiContrato: this.campaignForm.value.documentosClientes?.possuiContrato,
        dataInicio: this.campaignForm.value.dataInicio ? moment(this.campaignForm.value.dataInicio).format('YYYY-MM-DD') : null,
        dataFim: this.campaignForm.value.dataFim ? moment(this.campaignForm.value.dataFim).format('YYYY-MM-DD') : null,
        status: this.campaignForm.value.status
      };

      console.log('Nome Doc:', filters.nomeDocumento);

      // Remove filtros vazios
      Object.keys(filters).forEach((key: any) => {
        if(!filters[key]) {
          delete filters[key];
        }
      });

      console.log('Filters: ', filters);

      // Atualiza os query params
      // Usamos o router para modificar query params e atualizar a URL dinamicamente
      // Exemplo: Quando você seleciona um novo status, queremos atualizar a URL com esse status sem recarregar a página.
      this.router.navigate([], {
        queryParams: filters, // Define os novos query params com base nos filtros selecionados
  queryParamsHandling: 'merge' // Mantém os query params antigos e só substitui os novos
      });

      this.getCampaigns(filters, this.currentPage, this.pageSize);
    }
  }

  getCampaigns(filters: any, currentPage: number, pageSize: number): void {
    this.loading = true;

    this.campaignService.getCampaigns(filters, currentPage, pageSize).subscribe({
      next: (response) => {
        if (!response.body) {
          console.warn('Nenhum dado recebido.');
          this.filteredCampaigns = [];
          this.totalItems = 0;
          this.loading = false;
          return;
        }

        // verifica se existe body antes de acessar
        const campaigns = response.body || [];

        this.filteredCampaigns = campaigns.map(campaign => ({
          ...campaign,
          dataInicio: moment(campaign.dataInicio,  'YYYY-MM-DD').toDate(),
          dataFim: moment(campaign.dataFim, 'YYYY-MM-DD').toDate(),
          documentosClientes: campaign.documentosClientes.map((doc: any) => ({
            ...doc,
            possuiContrato: doc.possuiContrato ? 'Sim' : 'Não'
          }))
        }));
        this.totalItems = Number(response.headers.get('X-Total-Count')); // Captura o total de itens
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao realizar a busca: ',err);
        this.filteredCampaigns = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  startCampaigns(){
    console.log('Chamou todas as campanhas');
    this.campaignService.getAll().subscribe((data) => {
        this.allCampaigns = data;
        this.filteredCampaigns = data;
      }
    );
  }

  openDetails(campaign: Campaign) {
    console.log('Clicou em Detalhes:', campaign);
    this.dialog.open(CampaignDetailsComponent, {
      width: '450px',
      data: campaign
    });
  }

  exportToCSV() {
    if (!this.filteredCampaigns || this.filteredCampaigns.length === 0) {
        console.warn('Nenhum dado disponível para exportação.');
        return;
      }

      // Obtém todas as chaves do primeiro item, ignorando `documentosClientes` (será tratado separadamente)
      const baseColumns = Object.keys(this.filteredCampaigns[0]).filter((col: any) => col !== 'documentosClientes');

      // Descobre dinamicamente os campos dentro de documentosClientes
      const documentosKeys = ['idDocumento', 'nomeDocumento', 'possuiContrato'];

      // Define todas as colunas do CSV
      const columns = [...baseColumns, ...documentosKeys];

      // Cria o cabeçalho CSV usando as chaves do primeiro objeto
      const header = columns.join(';');

       // Mapeia os dados para gerar as linhas do CSV, considerando múltiplos documentos
      const rows = this.filteredCampaigns.flatMap(item => {
        // Se a campanha não tiver documentos, criamos uma linha sem dados de documentosClientes
        if (!Array.isArray(item.documentosClientes) || item.documentosClientes.length === 0) {
          return [columns.map(col => this.formatFieldToCSV(col, item)).join(';')];
        }

        // Se houver documentos, criamos uma linha para cada documento
        return item.documentosClientes.map(doc =>
          columns.map(col => this.formatFieldToCSV(col, item, doc)).join(';')
        );
      }).join('\n');


      // Concatena o cabeçalho e as linhas para formar o conteúdo completo do CSV
      const csvContent = header + '\n' + rows;

      // Adiciona o BOM para evitar problemas com caracteres acentuados no Excel
      const bom = '\uFEFF';

      // Cria um Blob com o conteúdo CSV e especifica o tipo de arquivo como UTF-8
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

      // Faz o download do arquivo CSV
      saveAs(blob, 'dados-filtrados.csv');
    }

/**
 * Formata os valores das colunas corretamente, incluindo os documentosClientes.
 */
  formatFieldToCSV(col: string, item: any, doc: any = {}): string {
    if (col === 'dataInicio' || col === 'dataFim') {
      return item[col] ? moment(item[col]).format('DD/MM/YYYY') : '';
    }

    if (col === 'possuiContrato') {
      return doc.possuiContrato ? 'Sim' : 'Não';
    }

    if (col === 'idDocumento' || col === 'nomeDocumento') {
      return doc[col] ?? '';
    }

    return item[col] ?? '';
  }
}
