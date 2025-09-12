import { useEffect, useState } from "react";
import GameCard from "./components/GameCard";
import { GameDetailProps } from "./interfaces";
import axios, { AxiosResponse } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

const App: React.FC = (): React.ReactElement => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameDetailProps | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  // Funzione per generare URL thumbnail da YouTube
  const youtubeThumbnail = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

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

  useEffect(() => {
    if (selectedGame) {
      setShowVideo(false);
      const timer = setTimeout(() => setShowVideo(true), 2000); // 2 secondi
      return () => clearTimeout(timer);
    }
  }, [selectedGame]);

  if (loading) return <p className="text-white text-lg">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const recensioneId = selectedGame?.recensioneOriginale?.split("/").pop();
  const analisiId = selectedGame?.analisiAggiornata?.split("/").pop();

  const iframeClasses =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-[177.77vh]";

  const OverlayLink: React.FC<{ href?: string }> = ({ href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 z-30 bg-black/50 hover:bg-black/20 transition-colors duration-300"
    />
  );

  return (
    <div className="bg-black text-white h-screen grid grid-cols-[1fr_auto_1fr]">
      {/* Colonna sinistra: Recensione Originale */}
      <div className="flex flex-col items-center h-screen relative overflow-hidden">
        <div className="absolute top-12 left-0 w-full flex items-start justify-center z-20 pointer-events-none">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
            RECENSIONE ORIGINALE
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-black via-black/40 to-transparent z-10 pointer-events-none" />
        <div className="flex-1 w-full h-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!showVideo && recensioneId && (
              <motion.img
                key="thumbnail-left"
                src={youtubeThumbnail(recensioneId)}
                alt={`${selectedGame.nomeGioco} recensione`}
                className="absolute inset-0 m-auto max-w-full max-h-full object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            )}
            {showVideo && recensioneId && (
              <motion.iframe
                key="video-left"
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
              />
            )}
          </AnimatePresence>
          <OverlayLink href={selectedGame?.recensioneOriginale} />
        </div>
      </div>

      {/* Colonna centrale: header sopra e lista card centrata */}
      <div className="flex flex-col h-screen w-full max-w-[500px] mx-auto relative">
        {/* Header sempre sopra, attaccato al margine superiore */}
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
        {/* Scroll delle card */}
        <div className="overflow-y-auto p-6 pt-36 flex-1 flex flex-col items-center space-y-6">
          {games.map((game) => (
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

      {/* Colonna destra: Analisi Aggiornata */}
      <div className="flex flex-col items-center h-screen relative overflow-hidden">
        <div className="absolute top-12 left-0 w-full flex items-start justify-center z-20 pointer-events-none">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg text-center">
            ANALISI AGGIORNATA
          </p>
        </div>
        <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-black via-black/40 to-transparent z-10 pointer-events-none" />
        <div className="flex-1 w-full h-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!showVideo && analisiId && (
              <motion.img
                key="thumbnail-right"
                src={youtubeThumbnail(analisiId)}
                alt={`${selectedGame.nomeGioco} analisi`}
                className="absolute inset-0 m-auto max-w-full max-h-full object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            )}
            {showVideo && analisiId && (
              <motion.iframe
                key="video-right"
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
              />
            )}
          </AnimatePresence>
          <OverlayLink href={selectedGame?.analisiAggiornata} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
