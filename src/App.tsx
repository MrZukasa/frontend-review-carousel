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
    <div className="bg-gray-900 text-white h-screen grid grid-cols-[1fr_2fr_1fr]">
      {/* colonna sinistra → recensione */}
      <div className="flex flex-col items-center justify-center border-r border-gray-700 space-y-4">
        <h2 className="text-xl font-bold text-gray-200">Recensione Originale</h2>
        {recensioneThumb && (
          <VideoPreview
            thumbnail={recensioneThumb}
            href={selectedGame?.recensioneOriginale}
            alt={`${selectedGame?.nomeGioco} recensione`}
          />
        )}
      </div>

      {/* colonna centrale → lista scrollabile */}
      <div className="overflow-y-auto p-6 space-y-6">
        <div className="text-3xl font-bold text-center mb-6">🎮 Game Selector</div>
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`cursor-pointer transition transform ${selectedGame?.id === game.id
              ? "scale-105 ring-4 ring-blue-500"
              : "hover:scale-105"
              }`}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* colonna destra → analisi */}
      <div className="flex flex-col items-center justify-center border-l border-gray-700 space-y-4">
        <h2 className="text-xl font-bold text-gray-200">Analisi Aggiornata</h2>
        {analisiThumb && (
          <VideoPreview
            thumbnail={analisiThumb}
            href={selectedGame?.analisiAggiornata}
            alt={`${selectedGame?.nomeGioco} analisi`}
          />
        )}
      </div>
    </div>
  );
};

export default App;
