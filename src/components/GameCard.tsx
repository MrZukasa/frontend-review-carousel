import { Link } from "react-router-dom";
import { GameCardProps } from "../interfaces";

const GameCard: React.FC<GameCardProps> = ({ game }: GameCardProps): React.ReactElement => {
  return (
    <div className="bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-10 hover:bg-zinc-700 transition w-full">
      <p className="text-3xl font-extrabold mb-3">{game.nomeGioco}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mb-4">
        <p className="text-lg text-gray-300">Voto al lancio: {game.votoLancio ?? "N/D"}</p>
        <p className="text-lg text-gray-300">Voto aggiornato: {game.votoAggiornato ?? "N/D"}</p>
      </div>

      <p className="text-sm text-gray-400 mb-6">Ultima revisione: {game.ultimaRevisione || "N/D"}</p>

      <div className="flex gap-4">
        {game.recensioneOriginale && (
          <Link
            className="text-sm text-blue-400 hover:underline"
            to={game.recensioneOriginale}
            target="_blank"
            rel="noopener noreferrer"
          >
            Recensione originale
          </Link>
        )}
        {game.analisiAggiornata && (
          <Link
            className="text-sm text-blue-400 hover:underline"
            to={game.analisiAggiornata}
            target="_blank"
            rel="noopener noreferrer"
          >
            Analisi aggiornata
          </Link>
        )}
      </div>
    </div>
  );
};

export default GameCard;
