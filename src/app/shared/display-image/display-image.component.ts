import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-image',
  standalone: true,
  imports: [],
  templateUrl: './display-image.component.html',
  styleUrl: './display-image.component.scss'
})
export class DisplayImageComponent {
  private _image!: string;

  @Input() set imageConfig(value: string) {
    this._image = value;
  }

  get imageConfig(){
    return this._image;
  }

}
