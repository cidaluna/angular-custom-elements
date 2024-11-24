import { ButtonConfig } from "../shared/button/button.component";

export interface IFluxoResponse{
  status?: string;
  image?: string;
  title?: string;
  text?: string;
  buttons?: ButtonConfig[];
}

