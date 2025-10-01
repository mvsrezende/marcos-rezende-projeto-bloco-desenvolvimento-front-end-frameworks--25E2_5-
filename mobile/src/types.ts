export type Evento = {
  id: number;
  nome: string;
  data: string;
  local: string;
  tenant?: string;
  arquivado?: boolean;
};

export type Ingresso = {
  id: number;
  eventoId: number;
  nomeEvento: string;
  data: string;
  local: string;
  foto?: string;
};
