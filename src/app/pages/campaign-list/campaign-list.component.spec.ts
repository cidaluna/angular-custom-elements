import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignListComponent } from './campaign-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CampaignService } from '../../services/campaign.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Campaign } from '../../models/campaign.interface';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { saveAs } from 'file-saver';
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorInterceptor } from '../../core/error.interceptor';

describe('CampaignListComponent', () => {
  let component: CampaignListComponent;
  let fixture: ComponentFixture<CampaignListComponent>;
  let campaignService: jasmine.SpyObj<CampaignService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockCampaignService = {
    getCampaigns: jasmine.createSpy('getCampaigns').and.returnValue(of([])),
    getAll: jasmine.createSpy('getAll').and.returnValue(of([])),
  };
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        CampaignListComponent,
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CampaignService, useValue: mockCampaignService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              status: 'NEW',
              nomeCampanha: 'Test Campaign',
              nomeRelatorio: 'Test Report',
              dataInicio: '2024-01-01',
              dataFim: '2024-12-31',
            }),
          },
        },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignListComponent);
    component = fixture.componentInstance;
    campaignService = TestBed.inject(CampaignService) as jasmine.SpyObj<CampaignService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on startFields()', () => {
    component.startFields();
    expect(component.campaignForm).toBeDefined();
    expect(component.campaignForm.get('nomeCampanha')).toBeTruthy();
    expect(component.campaignForm.get('status')).toBeTruthy();
  });

  it('should reset form and update query params on clearFilters()', () => {
    component.campaignForm.patchValue({ nomeCampanha: 'Teste' });
    component.clearFilters();
    expect(component.campaignForm.value).toEqual({
      nomeCampanha: null,
      nomeRelatorio: null,
      dataInicio: null,
      dataFim: null,
      status: null,
      documentosClientes: { possuiContrato: null, nomeDocumento: null },
    });
    expect(router.navigate).toHaveBeenCalledWith([], { queryParams: {} });
  });

  it('should load filters from query params on loadFiltersFromQueryParams()', () => {
    component.loadFiltersFromQueryParams();
    expect(component.campaignForm.value.nomeCampanha).toEqual('Test Campaign');
    expect(component.campaignForm.value.status).toEqual('NEW');
    expect(component.campaignForm.value.dataInicio).toEqual(moment('2024-01-01').toDate());
  });

  it('should call campaignService.getCampaigns() on onSubmit()', () => {
    component.campaignForm.patchValue({ nomeCampanha: 'Teste' });

    mockCampaignService.getCampaigns.and.returnValue(of([]));
    component.onSubmit();

    expect(mockCampaignService.getCampaigns).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should call campaignService.getCampaigns() with all filters values', () => {
    // Preenche os campos do formulário com valores simulados
    component.campaignForm.setValue({
      nomeCampanha: 'Campanha Teste',
      nomeRelatorio: 'Relatório 2025',
      dataInicio: moment('2020-01-01').toDate(),
      dataFim: moment('2026-12-31').toDate(),
      status: 'CLICKED',
      documentosClientes: {
        nomeDocumento: 'Contrato Assinado',
        possuiContrato: true,
      },
    });

    // Chama o método de submissão
    component.onSubmit();

    // Cria o objeto esperado de filtros
    const expectedFilters = {
      nomeCampanha: 'Campanha Teste',
      nomeRelatorio: 'Relatório 2025',
      dataInicio: '2020-01-01',
      dataFim: '2026-12-31',
      status: 'CLICKED',
      nomeDocumento: 'Contrato Assinado',
      possuiContrato: true,
    };

    // Verifica se o método getCampaigns foi chamado com os filtros corretos
    expect(mockCampaignService.getCampaigns).toHaveBeenCalledWith(expectedFilters);

    // Verifica se o método navigate foi chamado para atualizar os query params
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: expectedFilters,
      queryParamsHandling: 'merge',
    });
  });

  it('should fetch all campaigns on startCampaigns()', () => {
    const mockData: Campaign[] = [{ id: '1', nomeCampanha: 'Mock Campaign' } as Campaign];

    mockCampaignService.getAll.and.returnValue(of(mockData));
    component.startCampaigns();

    expect(mockCampaignService.getAll).toHaveBeenCalled();
    expect(component.allCampaigns).toEqual(mockData);
    expect(component.filteredCampaigns).toEqual(mockData);
  });

  it('should open dialog on openDetails()', () => {
    const mockCampaign: Campaign = { id: '1', nomeCampanha: 'Mock Campaign' } as Campaign;

    component.openDetails(mockCampaign);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should format CSV data correctly in exportToCSV()', () => {
    component.filteredCampaigns = [
      {
        id: 1,
        nomeCampanha: 'Test Campaign',
        dataInicio: new Date('2024-01-01'),
        dataFim: new Date('2024-12-31'),
        documentosClientes: [
          { idDocumento: 101, nomeDocumento: 'Doc 1', possuiContrato: true },
        ],
      } as any
    ];

    spyOn(component, 'formatFieldToCSV').and.callThrough();
    spyOn(saveAs, 'saveAs');

    component.exportToCSV();

    expect(component.formatFieldToCSV).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalled();
  });

  it('should format fields correctly using formatFieldToCSV()', () => {
    const item = { dataInicio: moment('2024-01-01')}; // Garante UTC
    const formattedDate = component.formatFieldToCSV('dataInicio', item);
    expect(formattedDate).toBe('01/01/2024');
  });

});
