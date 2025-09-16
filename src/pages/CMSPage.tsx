import { useState, useEffect } from "react";
import { GameDetailProps } from "../utilities/interfaces";
import GameCard from "../components/GameCard";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useAuth } from "../utilities/useAuth";
import { supabase } from "../utilities/supabaseClient";
import { useNavigate } from "react-router-dom";

const CMSPage: React.FC = (): React.ReactElement => {
  const [formData, setFormData] = useState<Omit<GameDetailProps, "id">>({
    nomeGioco: "",
    votoLancio: undefined,
    votoAggiornato: undefined,
    recensioneOriginale: undefined,
    analisiAggiornata: undefined,
    ultimaRevisione: null,
  });
  const [submittedData, setSubmittedData] = useState<GameDetailProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<GameDetailProps[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔹 Fetch giochi già presenti in DB
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<GameDetailProps[]>(
          import.meta.env.VITE_LOCAL_URL_API
        );
        setGames(response.data);
      } catch (error) {
        console.error("Errore caricamento giochi:", error);
      }
    };
    fetchGames();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null
        : name.includes("voto") ? Number(value)
          : value,
    }));
  };

  const normalizeUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) return `http://${url}`;
    return url;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔹 POST protetto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomeGioco) {
      setSubmitMsg({ type: "error", text: "Inserisci almeno il nome del gioco!" });
      return;
    }

    try {
      setLoading(true);
      setSubmitMsg(null);

      const payload = {
        ...formData,
        recensioneOriginale: normalizeUrl(formData.recensioneOriginale ?? ""),
        analisiAggiornata: normalizeUrl(formData.analisiAggiornata ?? ""),
      };

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await axios.post<GameDetailProps>(
        import.meta.env.VITE_LOCAL_URL_API,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      setSubmittedData((prev) => [...prev, response.data]);
      setGames((prev) => [...prev, response.data]);

      setFormData({
        nomeGioco: "",
        votoLancio: undefined,
        votoAggiornato: undefined,
        recensioneOriginale: undefined,
        analisiAggiornata: undefined,
        ultimaRevisione: null,
      });

      setSubmitMsg({ type: "success", text: "Gioco aggiunto correttamente!" });
    } catch {
      setSubmitMsg({ type: "error", text: "Errore durante l'invio del gioco!" });
    } finally {
      setLoading(false);
    }
  };

  // 🔹DELETE protetta
  const handleDelete = async () => {
    if (!selectedGameId) {
      setDeleteMsg({ type: "error", text: "Seleziona un gioco da eliminare!" });
      return;
    }

    if (!confirm("Sei sicuro di voler eliminare questo gioco?")) return;

    try {
      setDeleteMsg(null);

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      await axios.delete(`${import.meta.env.VITE_LOCAL_URL_API}${selectedGameId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setGames((prev) => prev.filter((game) => game.id !== selectedGameId));
      setSelectedGameId(null);
      setDeleteMsg({ type: "success", text: "Gioco eliminato correttamente!" });
    } catch {
      setDeleteMsg({ type: "error", text: "Errore durante l'eliminazione del gioco!" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Devi effettuare il login per accedere al CMS</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg whitespace-nowrap">
        Inserimento Titoli Analizzati
      </span>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl p-6 shadow-md/30 shadow-indigo-400 space-y-4"
      >
        <input
          type="text"
          name="nomeGioco"
          placeholder="Nome Gioco"
          value={formData.nomeGioco || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
        />
        <input
          type="number"
          name="votoLancio"
          placeholder="Voto Lancio"
          value={formData.votoLancio ?? ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
          min={0}
          max={10}
        />
        <input
          type="number"
          name="votoAggiornato"
          placeholder="Voto Aggiornato"
          value={formData.votoAggiornato ?? ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
          min={0}
          max={10}
        />
        <input
          type="text"
          name="recensioneOriginale"
          placeholder="Link Recensione Originale"
          value={formData.recensioneOriginale || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
        />
        <input
          type="text"
          name="analisiAggiornata"
          placeholder="Link Analisi Aggiornata"
          value={formData.analisiAggiornata || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
        />
        <DatePicker
          selected={
            formData.ultimaRevisione ? new Date(formData.ultimaRevisione) : null
          }
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              ultimaRevisione: date ? date.toISOString().split("T")[0] : null,
            }))
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="Seleziona una data"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500"
          calendarClassName="dark-calendar"
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition"
          disabled={loading}
        >
          {loading ? "Caricamento..." : "Aggiungi"}
        </button>
      </form>
      {/* Messaggio post */}
      {submitMsg && (
        <p className={`mt-2 text-sm ${submitMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
          {submitMsg.text}
        </p>
      )}

      {/* SELEZIONE GIOCO DA ELIMINARE */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
        className="w-full max-w-lg rounded-xl p-6 shadow-md/30 shadow-red-400 space-y-4 mt-8"
      >
        <h2 className="text-xl font-semibold text-red-400">Elimina un gioco</h2>
        <select
          value={selectedGameId ?? ""}
          onChange={(e) => setSelectedGameId(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:border-red-500 text-white"
        >
          <option value="">-- Seleziona un gioco --</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.nomeGioco}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
        >
          Elimina
        </button>
      </form>
      {/* Messaggio delete */}
      {deleteMsg && (
        <p className={`mt-2 text-sm ${deleteMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
          {deleteMsg.text}
        </p>
      )}
      <div className="mt-4 !items-start text-sm">
        <button
          onClick={handleLogout}
          className="text-sm text-yellow-300 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* LISTA INSERIMENTI LOCALI */}
      <div className="mt-10 w-full max-w-lg space-y-6">
        <button
          onClick={() => setIsPreviewOpen(prev => !prev)}
          className="flex items-center justify-between w-full text-2xl font-semibold mb-4 focus:outline-none"
        >
          <span>Anteprima giochi inseriti (solo sessione)</span>
          <span className="text-yellow-300">
            {isPreviewOpen ? "⤴" : "⤵"}
          </span>
        </button>

        {isPreviewOpen && (
          <>
            {submittedData.length === 0 ? (
              <p className="text-gray-400">Nessun gioco inserito in questa sessione.</p>
            ) : (
              submittedData.map((game) => <GameCard key={game.id} game={game} />)
            )}
          </>
        )}
      </div>    </div>
  );
};

export default CMSPage;
