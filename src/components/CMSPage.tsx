import { useState } from "react";
import { GameDetailProps } from "../interfaces";
import GameCard from "../components/GameCard";
import DatePicker from "react-datepicker";
import axios from "axios";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? null
          : name.includes("voto")
            ? Number(value)
            : value,
    }));
  };

  // Funzione per aggiungere automaticamente http:// se manca
  const normalizeUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomeGioco) {
      alert("Inserisci almeno il nome del gioco!");
      return;
    }

    try {
      setLoading(true);

      // Prepara i dati con URL normalizzati
      const payload = {
        ...formData,
        recensioneOriginale: normalizeUrl(formData.recensioneOriginale ?? ''),
        analisiAggiornata: normalizeUrl(formData.analisiAggiornata ?? ''),
      };

      // POST al backend
      const response = await axios.post<GameDetailProps>(
        import.meta.env.VITE_LOCAL_URL_API,
        payload
      );

      // aggiorna lista locale con risposta dal server
      setSubmittedData((prev) => [...prev, response.data]);

      // reset form
      setFormData({
        nomeGioco: "",
        votoLancio: undefined,
        votoAggiornato: undefined,
        recensioneOriginale: undefined,
        analisiAggiornata: undefined,
        ultimaRevisione: null,
      });
    } catch (error) {
      console.error(error);
      alert("Errore durante l'invio del gioco!");
    } finally {
      setLoading(false);
    }
  };

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
          selected={formData.ultimaRevisione ? new Date(formData.ultimaRevisione) : null}
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

      {/* LISTA INSERIMENTI */}
      <div className="mt-10 w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Anteprima giochi inseriti</h2>
        {submittedData.length === 0 ? (
          <p className="text-gray-400">Nessun gioco inserito.</p>
        ) : (
          submittedData.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        )}
      </div>
    </div>
  );
};

export default CMSPage;
