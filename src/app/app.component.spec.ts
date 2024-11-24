import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // it('should call handleNext when clicking on the "Continuar" button', () => {
  //   // Spy on the handleNext method
  //   const handleNextSpy = spyOn(component, 'handleNext');

  //   // Set buttons2 to the component, which has a "Continuar" button
  //   component.buttons2 = [
  //     { isOutlined: true, isDisabled: false, btnColor: 'primary', btnText: 'Cancelar', action: () => component.handleBack() },
  //     { isOutlined: false, isDisabled: false, btnColor: 'primary', btnText: 'Continuar', action: () => component.handleNext() }
  //   ];

  //   // Simulate clicking the "Continuar" button
  //   component.buttons2[1].action();

  //   // Check if handleNext is called
  //   expect(handleNextSpy).toHaveBeenCalled();
  // });


  // it('should call handleNext and handleBack based on button actions', () => {
  //   // Spy on handleNext and handleBack methods
  //   const handleNextSpy = spyOn(component, 'handleNext').and.callThrough();
  //   const handleBackSpy = spyOn(component, 'handleBack').and.callThrough();

  //   component.buttons1.forEach(button => {
  //     button.action();
  //     expect(handleNextSpy).toHaveBeenCalled();
  //   });

  //   // Test buttons2 (two buttons, one enabled to call handleBack, one to call handleNext)
  //   component.buttons2.forEach((button, index) => {
  //     button.action();
  //     if (index === 0) {
  //       expect(handleBackSpy).toHaveBeenCalled();
  //     } else {
  //       expect(handleNextSpy).toHaveBeenCalled();
  //     }
  //   });

  //   component.buttons3.forEach((button, index) => {
  //     button.action();
  //     if (index === 0) {
  //       expect(handleBackSpy).toHaveBeenCalled();
  //     } else {
  //       expect(handleNextSpy).toHaveBeenCalled();
  //     }
  //   });
  // });

  // it('should log "Clicou em Continuar!" when handleNext is called', () => {
  //   // Spy on console.log to intercept the log output
  //   const consoleSpy = spyOn(console, 'log');
  //   component.handleNext();
  //   expect(consoleSpy).toHaveBeenCalledWith('Clicou em Continuar!');
  // });

  // it('should log "Clicou em Cancelar!" when handleNext is called', () => {
  //   const consoleSpy = spyOn(console, 'log');
  //   component.handleBack();
  //   expect(consoleSpy).toHaveBeenCalledWith('Clicou em Cancelar!');
  // });
});
