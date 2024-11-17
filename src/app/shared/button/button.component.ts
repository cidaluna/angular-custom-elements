import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() btnColor: 'primary' | 'accent' | 'warn' | string = 'primary';
  @Input() btnText: string = 'Button';
  @Input() isOutlined!: boolean;  // Tipo de botão
  @Input() isDisabled!: boolean;

  @Output() buttonClick = new EventEmitter<void>();

  // Validar a cor
  getValidatedColor(): 'primary' | 'accent' | 'warn' {
    const allowedColors: Record<string, 'primary' | 'accent' | 'warn'> = {
      primary: 'primary',
      accent: 'accent',
      warn: 'warn'
    };

    return allowedColors[this.btnColor] || 'primary'; // fallback para 'primary'
  }

  // Emite o evento se não estiver desabilitado
  onClick() {
    if (!this.isDisabled) {
      this.buttonClick.emit();
    }
  }
}
