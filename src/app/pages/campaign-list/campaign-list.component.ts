import { Component, OnInit } from '@angular/core';
import { Campaign } from '../../models/campaign.interface';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { saveAs } from 'file-saver';
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
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatDatepickerModule],
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


  constructor(private readonly fb: FormBuilder,
              private readonly campaignService: CampaignService,
              private readonly dialog: MatDialog
  ) {
    // Set the minimum to January 1st 5 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDateRule = new Date(currentYear - 5, 0, 1);
    this.maxDateRule = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {
    this.startFields();
    this.startCampaigns();
  }

  startFields(): void {
    // Inicializa o form com os campos vazios
    this.campaignForm = this.fb.group({
      nomeCampanha: [''],
      nomeRelatorio: [''],
      dataInicio: [null],
      dataFim: [null],
      documentosClientes: this.fb.group({
        possuiContrato: [''],
        nomeDocumento: [''],
      })
    });
  }

  onSubmit(): void {
    console.log('Clicou em Pesquisar');

    if(this.campaignForm.valid){
      this.loading = true;

      //Pega os valores do form e organiza para passar como filtros
      const filters: any = {
        nomeCampanha: this.campaignForm.value.nomeCampanha,
        nomeRelatorio: this.campaignForm.value.nomeRelatorio,
        nomeDocumento: this.campaignForm.value.documentosClientes.nomeDocumento,
        possuiContrato: this.campaignForm.value.documentosClientes.possuiContrato,
        dataInicio: this.campaignForm.value.dataInicio ? moment(this.campaignForm.value.dataInicio).format('YYYY-MM-DD') : null,
        dataFim: this.campaignForm.value.dataFim ? moment(this.campaignForm.value.dataFim).format('YYYY-MM-DD') : null
      };

      // Remove filtros vazios
      Object.keys(filters).forEach((key: any) => {
        if(!filters[key]) {
          delete filters[key];
        }
      });

      console.log('Filters: ', filters);

      this.campaignService.getCampaigns(filters).subscribe({
        next: (data) => {
          this.filteredCampaigns = data.map(campaign => ({
            ...campaign,
            dataInicio: moment(campaign.dataInicio, 'YYYY-MM-DD').toDate(),
            dataFim: moment(campaign.dataFim, 'YYYY-MM-DD').toDate(),
            documentosClientes: campaign.documentosClientes.map((doc: any) => ({
              ...doc,
              possuiContrato: doc.possuiContrato ? 'Sim' : 'Não'
            }))
          }));

          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao realizar a busca: ',err);
          this.loading = false;
        }
      });
    }
  }

  startCampaigns(){
    console.log('Chamou todas as campanhas');
    this.campaignService.getAll().subscribe(
      data => {
        this.allCampaigns = data;
        this.filteredCampaigns = data;
      }
    );
  }

  openDetails(campaign: Campaign) {
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
