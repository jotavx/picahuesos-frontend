import { CategoriaTotal } from './categoria-total.model';

export interface DatosMensuales {
  [key: string]: {
    categorias: CategoriaTotal[];
    totalGeneral: number;
  };
}
