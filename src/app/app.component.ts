import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "./shared/button/button.component";
import { DisplayTextComponent } from './shared/display-text/display-text.component';
import { DisplayImageComponent } from './shared/display-image/display-image.component';
import { IFluxoResponse } from './models/fluxoResponse.interface';
import { FluxoResponseService } from './services/fluxoReponse.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, ButtonComponent,
    DisplayTextComponent, DisplayImageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None, // para aplicar a borda customizada no outlined
})
export class AppComponent implements OnInit {

  public infos!: IFluxoResponse;

  constructor(private _fluxoResponseService: FluxoResponseService) {}

  public ngOnInit() {
    this.getFluxoSuccess();
  }


  getFluxoSuccess(): void {
    this._fluxoResponseService.getFluxoResponse().subscribe({
      next: (data) => {
        this.infos = data;
        console.log("Entrou no método getFluxoSuccess: ", this.infos);
        //this._router.navigate(['/rota-abcd']);
      },
      error: (e) => console.error(e)
    });
  }

  // Teste dados chumbados
  imageTest = `./../assets/icons/success.svg`;
  textTitleTest = "Teste Título Chumbado";
  textDescriptionTest = `Teste Descrição Chumbada - Lorem Ipsum is simply dummy text of the printing
  and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the
  1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;
  buttonsTest = [
    { isOutlined: true, isDisabled: false, btnColor: 'accent',
      btnText: 'Cancelar', action: () => this.handleBack() },
    { isOutlined: false, isDisabled: false, btnColor: 'accent',
      btnText: 'Continuar', action: () => this.handleNext() }
  ]

  // teste botoes
  handleNext() {
    console.log('Clicou em Continuar!');
  }

  handleBack() {
    console.log('Clicou em Cancelar!');
  }

}
