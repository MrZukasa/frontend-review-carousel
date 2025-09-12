export interface GameDetailProps {
  id: number;
  nomeGioco: string;
  votoLancio: number | null;
  votoAggiornato: number | null;
  recensioneOriginale: string | null;
  analisiAggiornata: string | null;
  ultimaRevisione: string | null;
};

export interface GameCardProps {
  game: GameDetailProps;
}

export interface OverlayLinkProps {
  href?: string;
}

export interface VideoColumnProps {
  title: string;
  videoUrl?: string;
  showVideo: boolean;
  iframeClasses: string;
}

export interface CenterColumnProps {
  games: GameDetailProps[];
  selectedGame: GameDetailProps | null;
  setSelectedGame: React.Dispatch<React.SetStateAction<GameDetailProps | null>>;
}
