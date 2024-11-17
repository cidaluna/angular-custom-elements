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
    { isOutlined: false, isDisabled: true, btnColor: 'primary', btnText: 'Teste Cida', onClick: () => this.handleNext() },
  ];

  buttons2 = [
    { isOutlined: true, isDisabled: false, btnColor: 'primary', btnText: 'Cancelar', onClick: () => this.handleBack()},
    { isOutlined: false, isDisabled: false, btnColor: 'primary', btnText: 'Continuar', onClick: () => this.handleNext() }
  ];

  buttons3 = [
    { isOutlined: true, isDisabled: false, btnColor: 'accent', btnText: 'Cancelar', onClick: () => this.handleBack() },
    { isOutlined: false, isDisabled: false, btnColor: 'accent', btnText: 'Continuar', onClick: () => this.handleNext() }
  ];

  handleNext() {
    console.log('Clicou em Continuar!');
  }

  handleBack() {
    console.log('Clicou em Cancelar!');
  }

}
