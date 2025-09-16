import React, { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/admin"); // dopo login vai in /admin
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/profilePic.jpg"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500">
              Login
            </h1>
            <p className="text-sm text-gray-300">Accedi per gestire i titoli</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            autoComplete="current-password"
          />

          {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition disabled:opacity-60"
          >
            {loading ? "Caricamento..." : "Accedi"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <button
            onClick={handleLogout}
            className="text-yellow-300 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
