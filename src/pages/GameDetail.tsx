import { useEffect, useState } from "react";
import { GameDetailProps } from "../interfaces";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameDetail: React.FC = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<GameDetailProps | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3001/api/${id}`).then(res => setGame(res.data));
  }, [id]);

  if (!game) return <p className="text-white">Caricamento...</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold">{game.nomeGioco}</h1>
      <p>Voto lancio: {game.votoLancio ?? "N/D"}</p>
      <p>Voto aggiornato: {game.votoAggiornato ?? "N/D"}</p>

      <div className="mt-4 space-y-2">
        <a
          href={game.recensioneOriginale}
          target="_blank"
          className="text-blue-400 underline"
        >
          Recensione originale
        </a>
        {game.analisiAggiornata && (
          <a
            href={game.analisiAggiornata}
            target="_blank"
            className="text-blue-400 underline"
          >
            Analisi aggiornata
          </a>
        )}
      </div>
    </div>
  )
}

export default GameDetail
