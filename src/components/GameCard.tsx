import { Link } from "react-router-dom";
import { GameCardProps } from "../interfaces";

const GameCard: React.FC<GameCardProps> = ({ game }: GameCardProps): React.ReactElement => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 hover:bg-gray-700 transition">
      <Link to={`/game/${game.id}`}>
        <p className="text-xl font-semibold">{game.nomeGioco}</p>
        <p className="text-sm text-gray-300">
          Voto al lancio: {game.votoLancio ?? "N/D"}
        </p>
        <p className="text-sm text-gray-300">
          Voto aggiornato: {game.votoAggiornato ?? "N/D"}
        </p>
        <p className="text-sm text-gray-400">
          Ultima revisione: {game.ultimaRevisione || "N/D"}
        </p>
      </Link>
    </div>
  );
};

export default GameCard;
