import { ButtonConfig } from "../shared/button/button.component";
import { ImageConfig } from "../shared/display-image/display-image.component";

export interface IFluxoResponse{
  status: string;
  image: ImageConfig;
  title: string;
  text: string;
  buttons: ButtonConfig[];
}
