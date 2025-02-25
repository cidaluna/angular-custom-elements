import { Component, OnInit } from '@angular/core';
import { Campaign } from '../../models/campaign.interface';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
// Importar localidade para pt-BR
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  providers: [provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
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


  constructor(private readonly fb: FormBuilder,
              private readonly campaignService: CampaignService,
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

  onSubmit(){
    console.log('Clicou');
    this.testStartEndDate(); // teste Cida

  }

  testStartEndDate(){
    // Se existir dataInicio recupera e formata
    if(this.campaignForm.value.dataInicio){
      const dataInicio = this.campaignForm.value.dataInicio;
      if(dataInicio){
        const testFormttedDate: moment.Moment = moment.utc(dataInicio).local();
        const formatted = testFormttedDate.format("DD-MM-YYYY");
        console.log(formatted);
      }
    }
    // Se existir dataFim recupera e formata
    if(this.campaignForm.value.dataFim){
      const dataFim = this.campaignForm.value.dataFim;
      if(dataFim){
        const testFormttedDate: moment.Moment = moment.utc(dataFim).local();
        const formatted = testFormttedDate.format("DD-MM-YYYY");
        console.log(formatted);
      }
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
}
