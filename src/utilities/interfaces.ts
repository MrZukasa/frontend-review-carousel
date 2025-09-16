import type { User } from "@supabase/supabase-js"

export interface GameDetailProps {
  id: number;
  nomeGioco: string;
  votoLancio: number | undefined;
  votoAggiornato: number | undefined;
  recensioneOriginale: string | undefined;
  analisiAggiornata: string | undefined;
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
  position: string,
}

export interface CenterColumnProps {
  games: GameDetailProps[];
  selectedGame: GameDetailProps | null;
  setSelectedGame: React.Dispatch<React.SetStateAction<GameDetailProps | null>>;
}

export interface ProtectedRouteProps {
  user: User | null
  children: React.ReactNode
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
};

