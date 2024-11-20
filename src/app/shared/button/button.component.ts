import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export interface ButtonConfig{
  btnText: string,
  btnColor: 'primary' | 'accent' | 'warn' | string,
  isOutlined: boolean,  // Tipo de botão
  isDisabled: boolean,
  action: () => void;
}
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  //isFull: boolean = false;

  private _listButtons: ButtonConfig[] = [];

  @Input()
  set btnConfig(arrayBtn: ButtonConfig[]){
    this._listButtons = arrayBtn;
   // this.isFull = (this._listButtons.length === 1) ? true : false;
  }

  get btnConfig(){
    return this._listButtons;
  }

  @Output() buttonClick = new EventEmitter<number>();

  // Validar a cor
  getValidatedColor(index: number): string {
    const allowedColors = ['primary', 'accent', 'warn'];
    const color = this.btnConfig[index].btnColor;
    return allowedColors.includes(color) ? color : 'primary';
  }

  // Emite o evento se não estiver desabilitado
  onClick(indexBtn: number): void {
    const button = this._listButtons[indexBtn];

    if (button && !button.isDisabled) {
      this.buttonClick.emit(indexBtn);

      console.log(`Botão clicado:`, {
        index: indexBtn,
        text: button.btnText,
        color: button.btnColor,
        isOutlined: button.isOutlined,
        event: button.action.toString(),
      });

      // chama a ação associada ao botão
      button.action();
    }
  }
}
