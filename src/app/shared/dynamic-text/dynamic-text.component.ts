import { Component, OnInit } from '@angular/core';

export interface DynamicText {
  tag: string;
  content: string;
  class?: string;
}

@Component({
  selector: 'app-dynamic-text',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-text.component.html',
  styleUrl: './dynamic-text.component.scss'
})
export class DynamicTextComponent implements OnInit {
  // VERIFICAR esta renderizando 2 vezes na tela
  // deveria buscar os dados no JSON
  texts: DynamicText[] = [];

  ngOnInit(): void {
    this.texts = [
      { tag: 'h1', content: 'Título Principal' },
      { tag: 'p', content: 'Este é um parágrafo descritivo.' },
    ]
  }
}
