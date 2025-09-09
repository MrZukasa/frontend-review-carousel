import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import { GameDetailProps } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { getThumbnailName } from "./utilities";
import { motion, AnimatePresence } from "framer-motion";

const App: React.FC = (): React.ReactElement => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameDetailProps | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [currentGameForVideo, setCurrentGameForVideo] = useState<GameDetailProps | null>(null);

  useEffect(() => {
    axios
      .get<GameDetailProps[]>(import.meta.env.VITE_LOCAL_URL_API)
      .then((res: AxiosResponse<GameDetailProps[]>) => {
        setGames(res.data);
        setSelectedGame(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Errore nel recupero dei giochi");
        setLoading(false);
      });
  }, []);

  // Gestione transizione thumbnail → video
  useEffect(() => {
    if (selectedGame) {
      setShowVideo(false);
      const timer = setTimeout(() => {
        setCurrentGameForVideo(selectedGame);
        setShowVideo(true);
      }, 2000); // 2 secondi
      return () => clearTimeout(timer);
    }
  }, [selectedGame]);

  if (loading) return <p className="text-white text-lg">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const recensioneId = selectedGame?.recensioneOriginale?.split("/").pop();
  const analisiId = selectedGame?.analisiAggiornata?.split("/").pop();

  const iframeClasses =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-[177.77vh]";

  return (
    <div className="bg-black text-white h-screen grid grid-cols-[1fr_2fr_1fr]">
      {/* Colonna sinistra: Recensione Originale */}
      <div className="flex flex-col h-screen relative">
        {/* Overlay sfumatura interna solo quando parte il video */}
        {showVideo && currentGameForVideo?.id === selectedGame?.id && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 to-transparent z-10 pointer-events-none"></div>
        )}
        {/* Titolo fisso */}
        <div className="absolute top-0 left-0 w-full flex items-start justify-center z-20 pointer-events-none">
          <p className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
            RECENSIONE ORIGINALE
          </p>
        </div>
        <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Thumbnail */}
            {(!showVideo || currentGameForVideo?.id !== selectedGame?.id) && selectedGame?.recensioneOriginale && (
              <motion.img
                key={`thumb-left-${selectedGame.id}`}
                src={`/thumbnail/${getThumbnailName(selectedGame.recensioneOriginale)}`}
                alt={`${selectedGame.nomeGioco} recensione`}
                className="absolute inset-0 m-auto max-w-full max-h-full object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
            {/* Video */}
            {showVideo && currentGameForVideo?.id === selectedGame?.id && recensioneId && (
              <motion.iframe
                key={`video-left-${selectedGame.id}`}
                src={`https://www.youtube.com/embed/${recensioneId}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={iframeClasses}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              ></motion.iframe>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Colonna centrale: header fisso + lista scrollabile */}
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-center gap-4 py-4 bg-black z-10">
          <img
            src="/profilePic.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg">
            TITOLI ANALIZZATI
          </span>
        </div>
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={`cursor-pointer transition transform ${selectedGame?.id === game.id
                ? "scale-105 border-4 border-blue-500 rounded-2xl"
                : "hover:scale-105 hover:animate-pulse"
                }`}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {/* Colonna destra: Analisi Aggiornata */}
      <div className="flex flex-col h-screen relative">
        {/* Overlay sfumatura interna solo quando parte il video */}
        {showVideo && currentGameForVideo?.id === selectedGame?.id && (
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/70 to-transparent z-10 pointer-events-none"></div>
        )}
        {/* Titolo fisso */}
        <div className="absolute top-0 left-0 w-full flex items-start justify-center z-20 pointer-events-none">
          <p className="mt-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
            ANALISI AGGIORNATA
          </p>
        </div>
        <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Thumbnail */}
            {(!showVideo || currentGameForVideo?.id !== selectedGame?.id) && selectedGame?.analisiAggiornata && (
              <motion.img
                key={`thumb-right-${selectedGame.id}`}
                src={`/thumbnail/${getThumbnailName(selectedGame.analisiAggiornata)}`}
                alt={`${selectedGame.nomeGioco} analisi`}
                className="absolute inset-0 m-auto max-w-full max-h-full object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
            {/* Video */}
            {showVideo && currentGameForVideo?.id === selectedGame?.id && analisiId && (
              <motion.iframe
                key={`video-right-${selectedGame.id}`}
                src={`https://www.youtube.com/embed/${analisiId}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className={iframeClasses}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              ></motion.iframe>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;
