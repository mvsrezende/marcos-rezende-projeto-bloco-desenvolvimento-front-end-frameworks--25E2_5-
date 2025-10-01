export type EventItem = {
  id: number;
  nome: string;
  data: string;
  local: string;
  arquivado?: boolean;
};

export type Ticket = {
  id: number;
  eventId: number;
  nomeEvento: string;
  data: string;
  local: string;
  foto?: string;
};
