import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { BtnCustomDirective } from './shared/directives/btn-custom.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, BtnCustomDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-custom-elements';
  isSingleButton(): boolean {
    const groupButtons = document.querySelectorAll('.group-buttons');
    return groupButtons.length === 1 && groupButtons[0].children.length === 1;
  }

}
