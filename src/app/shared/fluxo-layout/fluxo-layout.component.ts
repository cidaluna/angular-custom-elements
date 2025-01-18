import { Component, Input, OnChanges } from '@angular/core';
import { IFluxoLayout } from './fluxo-layout.interface';
import arquivoJson from './fluxoLayout.json';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent, ButtonConfig } from '../button/button.component';

@Component({
  selector: 'app-fluxo-layout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonComponent],
  templateUrl: './fluxo-layout.component.html',
  styleUrl: './fluxo-layout.component.scss'
})
export class FluxoLayoutComponent implements OnChanges {
  // Propriedade para armazenar os dados do JSON que serão renderizados
  response: IFluxoLayout | null = null;

  // Propriedade de entrada para receber o nome do objeto do JSON
  @Input() status: string = '';

  // Método que carrega o dado correspondente do JSON
  load(): void {
    const dataResponse = (arquivoJson as any)[this.status] || null;

  if (dataResponse) {
    // Adiciona uma função básica (ou mock) para a ação de cada botão
    dataResponse.buttons = dataResponse.buttons.map((button: ButtonConfig) => ({
      ...button,
      action: () => {} //jasmine.createSpy('action') // Usando jasmine.createSpy para simular a função
    }));
  }

  this.response = dataResponse;
  }

  // Detecta mudanças no valor de `status` para recarregar os dados
  ngOnChanges(): void {
    this.load();
  }

  // Criando arrays de botões
  buttons1: ButtonConfig[] = [
    { isOutlined: false, isDisabled: true, btnColor: 'primary', btnText: 'Teste Cida', action: () => this.handleNext() },
  ];
  buttons2: ButtonConfig[] = [
    { isOutlined: true, isDisabled: false, btnColor: 'primary', btnText: 'Cancelar', action: () => this.handleBack()},
    { isOutlined: false, isDisabled: false, btnColor: 'primary', btnText: 'Continuar', action: () => this.handleNext() }
  ];

  // teste botoes
  handleNext() {
    console.log('Clicou em Continuar!');
  }

  handleBack() {
    console.log('Clicou em Cancelar!');
  }

}
