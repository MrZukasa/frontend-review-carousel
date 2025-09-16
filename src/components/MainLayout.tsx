import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { GameDetailProps } from "../interfaces";
import VideoColumn from "./VideoColumn";
import CenterColumn from "./CenterColumn";
import Footer from "./Footer";


const MainLayout = () => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameDetailProps | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);

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
      const timer = setTimeout(() => setShowVideo(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedGame]);

  if (loading) return <p className="text-white text-lg">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const iframeClasses =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-[177.77vh]";

  return (
    <div className="bg-black text-white h-screen grid grid-cols-[1fr_auto_1fr]">
      <VideoColumn
        title="RECENSIONE ORIGINALE"
        videoUrl={selectedGame?.recensioneOriginale}
        showVideo={showVideo}
        iframeClasses={iframeClasses}
        position="right"
      />

      <CenterColumn
        games={games}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
      />

      <VideoColumn
        title="ANALISI AGGIORNATA"
        videoUrl={selectedGame?.analisiAggiornata}
        showVideo={showVideo}
        iframeClasses={iframeClasses}
        position="left"
      />

      <Footer />
    </div>
  )

}

export default MainLayout
