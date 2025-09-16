import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { GameDetailProps } from "../utilities/interfaces";
import VideoColumn from "../components/VideoColumn";
import CenterColumn from "../components/CenterColumn";
import Footer from "../components/Footer";


const MainLayout = (): React.ReactElement => {
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameDetailProps | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchGames = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response: AxiosResponse<GameDetailProps[]> = await axios.get(
          import.meta.env.VITE_LOCAL_URL_API
        );

        if (isMounted) {
          setGames(response.data);
          setSelectedGame(response.data[0] || null); // protezione se array vuoto
        }
      } catch (err) {
        console.error("Errore nel recupero dei giochi:", err);
        if (isMounted) setError("Errore nel recupero dei giochi");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGames();

    return () => {
      isMounted = false;
    };
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
