import { Link } from "react-router-dom";
import { GameCardProps } from "../utilities/interfaces";
import { motion } from "framer-motion";

const GameCard: React.FC<GameCardProps> = ({ game }: GameCardProps): React.ReactElement => {
  // Funzione per determinare il colore del badge in base al voto
  const getBadgeColor = (vote?: number) => {
    if (vote === undefined || vote === null) return "bg-gray-500"; // N/D
    if (vote >= 8) return "bg-green-500";
    if (vote >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-2xl w-full cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Sfondo gradiente e overlay leggero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10 pointer-events-none" />

      <div className="p-4 relative z-20 flex flex-col justify-between h-full text-center">
        {/* Titolo con gradient e ombra */}
        <p className="text-2xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-lg">
          {game.nomeGioco}
        </p>

        {/* Voti con badge colorati */}
        <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 mb-2">
          <p className="text-lg text-gray-200 flex items-center justify-center gap-2">
            Voto al lancio:
            {game.votoLancio !== undefined && (
              <span
                className={`${getBadgeColor(game.votoLancio)} text-black px-2 py-0.5 rounded-full text-xs font-bold`}
              >
                {game.votoLancio}
              </span>
            )}
          </p>
          <p className="text-lg text-gray-200 flex items-center justify-center gap-2">
            Voto aggiornato:
            {game.votoAggiornato !== undefined && (
              <span
                className={`${getBadgeColor(game.votoAggiornato)} text-black px-2 py-0.5 rounded-full text-xs font-bold`}
              >
                {game.votoAggiornato}
              </span>
            )}
          </p>
        </div>

        {/* Ultima revisione con icona */}
        <p className="text-sm text-gray-300 mb-2 flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Ultima revisione: {game.ultimaRevisione || "N/D"}
        </p>

        {/* Link animati */}
        <div className="flex justify-center gap-4">
          {game.recensioneOriginale && (
            <Link
              className="text-sm text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
              to={game.recensioneOriginale}
              target="_blank"
              rel="noopener noreferrer"
            >
              Recensione originale
            </Link>
          )}
          {game.analisiAggiornata && (
            <Link
              className="text-sm text-blue-400 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
              to={game.analisiAggiornata}
              target="_blank"
              rel="noopener noreferrer"
            >
              Analisi aggiornata
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
