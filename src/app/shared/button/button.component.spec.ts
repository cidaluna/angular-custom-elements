import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { ButtonComponent, ButtonConfig } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonComponent,MatButtonModule, CommonModule],
    });

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create button component', () => {
    expect(component).toBeTruthy();
  });

  it('should set btnConfig correctly and update isFull', () => {
    const arrayButtonsMock: ButtonConfig[] = [
      { btnText: 'Button 1', btnColor: 'primary', isOutlined: false, isDisabled: false, action: () => {} }
    ];
    // Define o btnConfig
    component.btnConfig = arrayButtonsMock;
    // Verifica se o _listButtons foi atualizado
    expect(component['btnConfig']).toEqual(arrayButtonsMock);
    // Verifica se isFull foi atualizado corretamente
    expect(component.isFull).toBeTrue();
    // Testa com mais de 1 botão
    component.btnConfig = [
      { btnText: 'Button 1', btnColor: 'primary', isOutlined: false, isDisabled: false, action: () => {} },
      { btnText: 'Button 2', btnColor: 'accent', isOutlined: true, isDisabled: true, action: () => {} }
    ];
    // Verifica se isFull foi ajustado corretamente para false
    expect(component.isFull).toBeFalse();
  });

  it('should return the correct validated color', () => {
    const mockButtons: ButtonConfig[] = [
      { btnText: 'Button 1', btnColor: 'primary', isOutlined: false, isDisabled: false, action: () => {} },
      { btnText: 'Button 2', btnColor: 'accent', isOutlined: false, isDisabled: false, action: () => {} },
      { btnText: 'Button 3', btnColor: 'warn', isOutlined: false, isDisabled: false, action: () => {} },
      { btnText: 'Button 4', btnColor: 'invalidColor', isOutlined: false, isDisabled: false, action: () => {} }
    ];

    component.btnConfig = mockButtons;

    expect(component.getValidatedColor(0)).toBe('primary');
    expect(component.getValidatedColor(1)).toBe('accent');
    expect(component.getValidatedColor(2)).toBe('warn');
    // Testa com um botão que tem cor inválida, deve retornar 'primary'
    expect(component.getValidatedColor(3)).toBe('primary');
  });

  it('should emit buttonClick event and call the button action when the button is enabled', () => {
    // Spying on the button action
    const buttonActionSpy = jasmine.createSpy();

    // Setup: criando o botão configurado
    const mockButtons: ButtonConfig[] = [
      { btnText: 'Button 1', btnColor: 'primary', isOutlined: false, isDisabled: false, action: buttonActionSpy },
    ];

    component.btnConfig = mockButtons;

    // Spy no método emit do EventEmitter output
    spyOn(component.buttonClick, 'emit');

    // Chamando o método onClick no primeiro botão
    component.onClick(0);

    // Verificando se o método emit foi chamado
    expect(component.buttonClick.emit).toHaveBeenCalledWith(0);

    // Verificando se a ação do botão foi chamada
    expect(buttonActionSpy).toHaveBeenCalled();
  });

});
