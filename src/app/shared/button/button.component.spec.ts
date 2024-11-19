import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


describe('Input Properties', () => {
  it('deve ter "btnColor" definido como "primary" por padrão', () => {
    expect(component.btnColor).toBe('primary');
  });

  it('deve aceitar um valor para "btnColor"', () => {
    component.btnColor = 'accent';
    expect(component.btnColor).toBe('accent');
  });

  it('deve aceitar um valor para "btnText"', () => {
    component.btnText = 'Submit';
    expect(component.btnText).toBe('Submit');
  });

  it('deve aceitar valores para "isOutlined" e "isDisabled"', () => {
    component.isOutlined = true;
    component.isDisabled = false;

    expect(component.isOutlined).toBeTrue();
    expect(component.isDisabled).toBeFalse();
  });
});

describe('getValidatedColor()', () => {
  it('deve retornar "primary" se "btnColor" for "primary"', () => {
    component.btnColor = 'primary';
    expect(component.getValidatedColor()).toBe('primary');
  });

  it('deve retornar "accent" se "btnColor" for "accent"', () => {
    component.btnColor = 'accent';
    expect(component.getValidatedColor()).toBe('accent');
  });

  it('deve retornar "warn" se "btnColor" for "warn"', () => {
    component.btnColor = 'warn';
    expect(component.getValidatedColor()).toBe('warn');
  });

  it('deve retornar "primary" para cores inválidas', () => {
    component.btnColor = 'invalid';
    expect(component.getValidatedColor()).toBe('primary');
  });

});

describe('onClick()', () => {
  it('deve emitir "buttonClick" quando o botão não estiver desabilitado', () => {
    spyOn(component.buttonClick, 'emit');
    component.isDisabled = false;
    component.onClick();
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });

  it('não deve emitir "buttonClick" quando o botão estiver desabilitado', () => {
    spyOn(component.buttonClick, 'emit');
    component.isDisabled = true;
    component.onClick();
    expect(component.buttonClick.emit).not.toHaveBeenCalled();
  });
});

describe('EventEmitter', () => {
  it('deve inicializar "buttonClick" como um EventEmitter', () => {
    expect(component.buttonClick).toBeInstanceOf(EventEmitter);
  });

  it('deve emitir o evento buttonClick ao clicar no botão', () => {
    spyOn(component.buttonClick, 'emit');
    component.isDisabled = false;
    component.onClick();
    expect(component.buttonClick.emit).toHaveBeenCalled();
  });
});

});
