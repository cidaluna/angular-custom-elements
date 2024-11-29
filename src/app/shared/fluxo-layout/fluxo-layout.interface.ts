import { ButtonConfig } from "../button/button.component";
import { ImageConfig } from "../display-image/display-image.component";

export interface IFluxoLayout {
  title: string;
  text: string;
  image: ImageConfig;
  buttons: ButtonConfig[];
}
