export interface Equipamento {
  id?: number;
  codigo: string;
  faixa: number;
  tipo: string;
  ativo: number;
  local: string;
  marca: string;
  modelo: string;
  velocidadeLimite: number;
  dataAfericao?: string | Date;
  lacre: string;
  dataRegistroInmetro?: string | Date;
  numeroInmetro?: string;
  integradorId: number;
  municipioId: number;
  createdAt?: string;
  updatedAt?: string;
}
