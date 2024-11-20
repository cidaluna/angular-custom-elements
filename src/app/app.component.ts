import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "./shared/button/button.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None, // para aplicar a borda customizada no outlined
})
export class AppComponent {
  title = 'angular-custom-elements';

  // Criando arrays de botões
  buttons1 = [
    { isOutlined: false, isDisabled: true, btnColor: 'primary', btnText: 'Teste Cida', action: () => this.handleNext() },
  ];

  buttons2 = [
    { isOutlined: true, isDisabled: false, btnColor: 'primary', btnText: 'Cancelar', action: () => this.handleBack()},
    { isOutlined: false, isDisabled: false, btnColor: 'primary', btnText: 'Continuar', action: () => this.handleNext() }
  ];

  buttons3 = [
    { isOutlined: true, isDisabled: false, btnColor: 'accent', btnText: 'Cancelar', action: () => this.handleBack() },
    { isOutlined: false, isDisabled: true, btnColor: 'accent', btnText: 'Continuar', action: () => this.handleNext() }
  ];

  handleNext() {
    console.log('Clicou em Continuar!');
  }

  handleBack() {
    console.log('Clicou em Cancelar!');
  }

}
