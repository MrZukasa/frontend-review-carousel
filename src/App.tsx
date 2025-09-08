import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import { GameDetailProps } from "./interfaces";
import axios from "axios";

const App: React.FC = (): React.ReactElement => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<GameDetailProps[]>("http://localhost:3001/api/")
      .then((res) => {
        setGames(res.data);
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

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold my-6">🎮 Game Reviews</h1>
      <div className="flex flex-col space-y-6 w-full max-w-3xl">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default App;
