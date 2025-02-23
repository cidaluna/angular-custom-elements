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
    // console.log("Ano atual = " + currentYear); // 2025
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
    this.testStartDate(); // teste Cida

  }

  testStartDate(){
    // Se existir dataInicio recupera e formata
    if(this.campaignForm.value.dataInicio){
      const testFormttedDate: moment.Moment = moment.utc(this.campaignForm.value.dataInicio).local();
      this.campaignForm.value.dataInicio = testFormttedDate.format("DD-MM-YYYY") + "T:00:00:00";
      console.log(this.campaignForm.value.dataInicio);
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
