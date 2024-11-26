import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-text.component.html',
  styleUrl: './display-text.component.scss'
})
export class DisplayTextComponent {

  private _text!: string;
  @Input() styleType!: string;

  @Input() set textConfig(value: string | undefined) {
    this._text = value ?? '';
  }

  get textConfig(){
    return this._text;
  }

}
