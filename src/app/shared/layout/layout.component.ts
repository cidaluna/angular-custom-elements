import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { DisplayTextComponent } from '../display-text/display-text.component';
import { DisplayImageComponent } from '../display-image/display-image.component';
import { IFluxoResponse } from '../../models/fluxoResponse.interface';
import { FluxoResponseService } from '../../services/fluxoReponse.service';
import { DynamicTextComponent } from "../dynamic-text/dynamic-text.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonComponent,
    DisplayImageComponent, DynamicTextComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public infos!: IFluxoResponse;

  constructor(private _fluxoResponseService: FluxoResponseService) {}

  public ngOnInit() {
    this.getFluxoSuccess();
  }

  getFluxoSuccess(): void {
    this._fluxoResponseService.getFluxoResponseSuccess().subscribe({
      next: (data) => {
        this.infos = data;
        console.log("Entrou no método getFluxoSuccess: ", this.infos);
        //this._router.navigate(['/rota-abcd']);
      },
      error: (e) => console.error(e)
    });
  }

  getFluxoWarning(): void {
    this._fluxoResponseService.getFluxoResponseWarning().subscribe({
      next: (data) => {
        this.infos = data;
        console.log("Entrou no método getFluxoWarning: ", this.infos);
        //this._router.navigate(['/rota-abcd']);
      },
      error: (e) => console.error(e)
    });
  }

  // teste botoes
  // handleNext() {
  //   console.log('Clicou em Continuar!');
  // }

  // handleBack() {
  //   console.log('Clicou em Cancelar!');
  // }
}
