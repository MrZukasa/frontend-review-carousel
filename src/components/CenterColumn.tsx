import { CenterColumnProps, GameDetailProps } from "../interfaces";
import GameCard from "./GameCard";

const CenterColumn: React.FC<CenterColumnProps> = ({ games, selectedGame, setSelectedGame }: CenterColumnProps): React.ReactElement => {
  return (
    <div className="flex flex-col h-screen w-full max-w-[500px] mx-auto relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 py-2 z-40 pointer-events-none
        bg-black/40 backdrop-blur-md rounded-xl px-4">
        <img
          src="/profilePic.jpg"
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
        />
        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg whitespace-nowrap">
          TITOLI ANALIZZATI
        </span>
      </div>

      <div className="overflow-y-auto p-6 pt-36 flex-1 flex flex-col items-center space-y-6">
        {games.map((game: GameDetailProps): React.ReactElement => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`cursor-pointer transition transform ${selectedGame?.id === game.id
              ? "scale-105 border-4 border-blue-500 rounded-2xl animate-pulse"
              : "hover:scale-105 hover:animate-pulse rounded-2xl"
              }`}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterColumn;
