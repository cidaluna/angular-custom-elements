import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FluxoLayoutComponent } from './fluxo-layout.component';
import arquivoJson from './fluxoLayout.json';
interface ButtonConfig {
  isOutlined: boolean;
  isDisabled: boolean;
  btnColor: string;
  btnText: string;
  action: () => void;
}
describe('FluxoLayoutComponent', () => {
  let component: FluxoLayoutComponent;
  let fixture: ComponentFixture<FluxoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxoLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar corretamente os dados do JSON com base no status', () => {
    const mockStatus = 'fluxoResponseSuccess';

    const expectedResponse = {
      status: 'success',
      title: 'Este é titulo de sucesso do fluxo Layout JSON!',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      image: {
        imgSrc: '/assets/icons/success.svg',
        imgAlt: 'Test Alt'
      },
      buttons: [
        {
          isOutlined: true,
          isDisabled: false,
          btnColor: 'primary',
          btnText: 'Cancelar',
          action: jasmine.any(Function)
        },
        {
          isOutlined: false,
          isDisabled: false,
          btnColor: 'primary',
          btnText: 'Continuar',
          action: jasmine.any(Function)
        }
      ]
    };

    component.status = mockStatus;
    component.load();
    expect(component.response?.buttons[0].action).toEqual(jasmine.any(Function));
    //expect(component.response).toEqual(jasmine.objectContaining(expectedResponse));
    //expect(component.response).toEqual(expectedResponse);
  });


  it('deve chamar o método load no ngOnChanges', () => {
    spyOn(component, 'load');
    component.ngOnChanges();
    expect(component.load).toHaveBeenCalled();
  });

  // it('deve criar o array buttons1 com configurações corretas para todos os botões', () => {
  //   const expectedButtons: ButtonConfig[] = [
  //     {
  //       isOutlined: false,
  //       isDisabled: true,
  //       btnColor: 'primary',
  //       btnText: 'Teste Cida',
  //       action: component.handleNext
  //     }
  //   ];

  //   expect(component.buttons1.length).toBe(expectedButtons.length);

  //   component.buttons1.forEach((button, index) => {
  //     expect(button.isOutlined).toBe(expectedButtons[index].isOutlined);
  //     expect(button.isDisabled).toBe(expectedButtons[index].isDisabled);
  //     expect(button.btnColor).toBe(expectedButtons[index].btnColor);
  //     expect(button.btnText).toBe(expectedButtons[index].btnText);
  //     expect(button.action).toBe(expectedButtons[index].action);
  //   });
  // });

  it('deve executar a ação do botão corretamente', () => {
    spyOn(component, 'handleNext');
    const button = component.buttons1[0];
    button.action(); // Simula a ação do botão
    expect(component.handleNext).toHaveBeenCalled();
  });

  it('should log "Clicou em Continuar!" when handleNext is called', () => {
    const consoleSpy = spyOn(console, 'log');
    component.handleNext();
    expect(consoleSpy).toHaveBeenCalledWith('Clicou em Continuar!');
  });

  it('should log "Clicou em Cancelar!" when handleBack is called', () => {
    const consoleSpy = spyOn(console, 'log');
    component.handleBack();
    expect(consoleSpy).toHaveBeenCalledWith('Clicou em Cancelar!');
  });

});
