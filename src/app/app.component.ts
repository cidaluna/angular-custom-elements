import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./shared/layout/layout.component";
import { FluxoLayoutComponent } from "./shared/fluxo-layout/fluxo-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FluxoLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None, // para aplicar a borda customizada no outlined
})
export class AppComponent implements OnInit {

  ngOnInit(): void {}


  }
