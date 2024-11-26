import { Component, Input } from '@angular/core';

export interface ImageConfig{
  imgSrc: string;
  imgAlt: string;
}

@Component({
  selector: 'app-display-image',
  standalone: true,
  imports: [],
  templateUrl: './display-image.component.html',
  styleUrl: './display-image.component.scss'
})
export class DisplayImageComponent {
  @Input() imageConfig!: ImageConfig | undefined;

}
