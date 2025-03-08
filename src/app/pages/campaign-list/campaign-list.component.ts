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
    //this.startCampaigns();
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
          // Converte `true` para `"Sim"` e `false` para `"Não"`
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
}
