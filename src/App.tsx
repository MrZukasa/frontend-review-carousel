import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import VideoPreview from "./components/VideoPreview";
import { GameDetailProps } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { getThumbnailName } from "./utilities";

const App: React.FC = (): React.ReactElement => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameDetailProps | null>(null);

  useEffect(() => {
    axios
      .get<GameDetailProps[]>(import.meta.env.VITE_LOCAL_URL_API)
      .then((res: AxiosResponse<GameDetailProps[]>) => {
        setGames(res.data);
        setSelectedGame(res.data[0]); // default: primo gioco selezionato
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Errore nel recupero dei giochi");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white text-lg">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const recensioneThumb =
    selectedGame?.recensioneOriginale
      ? `/thumbnail/${getThumbnailName(selectedGame.recensioneOriginale)}`
      : "";
  const analisiThumb =
    selectedGame?.analisiAggiornata
      ? `/thumbnail/${getThumbnailName(selectedGame.analisiAggiornata)}`
      : "";

  return (
    <div className="bg-black text-white h-screen grid grid-rows-[auto_1fr] grid-cols-[1fr_2fr_1fr]">
      {/* riga superiore: titoli fissi */}
      <div className="col-span-1 flex items-center justify-center border-r border-gray-700 py-4">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
          RECENSIONE ORIGINALE
        </p>
      </div>

      <div className="col-span-1 flex items-center justify-center py-4 gap-4">
        <img
          src="/profilePic.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg">
          TITOLI ANALIZZATI
        </span>
      </div>

      <div className="col-span-1 flex items-center justify-center border-l border-gray-700 py-4">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
          ANALISI AGGIORNATA
        </p>
      </div>

      {/* riga inferiore: contenuto */}
      <div className="flex flex-col items-center justify-center border-r border-gray-700">
        <div className="flex-1 flex items-center justify-center">
          {recensioneThumb && (
            <VideoPreview
              thumbnail={recensioneThumb}
              href={selectedGame?.recensioneOriginale}
              alt={`${selectedGame?.nomeGioco} recensione`}
            />
          )}
        </div>
      </div>

      <div className="overflow-y-auto p-6 space-y-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`cursor-pointer transition transform ${selectedGame?.id === game.id
                ? "scale-105 border-4 border-yellow-500 rounded-2xl"
                : "hover:scale-105 hover:animate-pulse"
              }`}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center border-l border-gray-700">
        <div className="flex-1 flex items-center justify-center">
          {analisiThumb && (
            <VideoPreview
              thumbnail={analisiThumb}
              href={selectedGame?.analisiAggiornata}
              alt={`${selectedGame?.nomeGioco} analisi`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
