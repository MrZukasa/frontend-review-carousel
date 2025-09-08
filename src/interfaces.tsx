export interface GameDetailProps {
  id: number;
  nomeGioco: string;
  votoLancio: number | null;
  votoAggiornato: number | null;
  recensioneOriginale: string;
  analisiAggiornata: string | null;
  ultimaRevisione: string | null;
};

export interface GameCardProps {
  game: GameDetailProps;
}
