import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'angular-custom-elements'`, () => {
    expect(component.title).toBe('angular-custom-elements');
  });

  describe('buttons1', () => {
    it('should initialize buttons1 with correct properties', () => {
      expect(component.buttons1).toEqual([
        {
          isOutlined: false,
          isDisabled: true,
          btnColor: 'primary',
          btnText: 'Teste Cida',
          onClick: jasmine.any(Function), // Verifica se onClick é uma função
        },
      ]);
    });

    it('should call handleNext when buttons1[0].onClick is invoked', () => {
      spyOn(component, 'handleNext');
      component.buttons1[0].onClick();
      expect(component.handleNext).toHaveBeenCalled();
    });
  });

  describe('buttons2', () => {
    it('should initialize buttons2 with correct properties', () => {
      expect(component.buttons2.length).toBe(2);
      expect(component.buttons2[0]).toEqual({
        isOutlined: true,
        isDisabled: false,
        btnColor: 'primary',
        btnText: 'Cancelar',
        onClick: jasmine.any(Function),
      });
      expect(component.buttons2[1]).toEqual({
        isOutlined: false,
        isDisabled: false,
        btnColor: 'primary',
        btnText: 'Continuar',
        onClick: jasmine.any(Function),
      });
    });

    it('should call handleBack when buttons2[0].onClick is invoked', () => {
      spyOn(component, 'handleBack');
      component.buttons2[0].onClick();
      expect(component.handleBack).toHaveBeenCalled();
    });

    it('should call handleNext when buttons2[1].onClick is invoked', () => {
      spyOn(component, 'handleNext');
      component.buttons2[1].onClick();
      expect(component.handleNext).toHaveBeenCalled();
    });
  });

  describe('buttons3', () => {
    it('should initialize buttons3 with correct properties and color "accent"', () => {
      expect(component.buttons3.length).toBe(2);
      component.buttons3.forEach(button => {
        expect(button.btnColor).toBe('accent');
      });
    });

    it('should call handleBack when buttons3[0].onClick is invoked', () => {
      spyOn(component, 'handleBack');
      component.buttons3[0].onClick();
      expect(component.handleBack).toHaveBeenCalled();
    });

    it('should call handleNext when buttons3[1].onClick is invoked', () => {
      spyOn(component, 'handleNext');
      component.buttons3[1].onClick();
      expect(component.handleNext).toHaveBeenCalled();
    });
  });

  describe('handleNext', () => {
    it('should log "Clicou em Continuar!" when handleNext is called', () => {
      spyOn(console, 'log');
      component.handleNext();
      expect(console.log).toHaveBeenCalledWith('Clicou em Continuar!');
    });
  });

  describe('handleBack', () => {
    it('should log "Clicou em Cancelar!" when handleBack is called', () => {
      spyOn(console, 'log');
      component.handleBack();
      expect(console.log).toHaveBeenCalledWith('Clicou em Cancelar!');
    });
  });
});
