import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import { AuthContext } from "../../../app/providers/AuthContext";
import { mapApiError } from "../../../services/http";
import { notifyError, notifySuccess } from "../../../utils/notify";

const LoginForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ username, password });
      auth?.setToken(res.token);
      notifySuccess("Sesion iniciada");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl bg-linear-to-br from-white/85 via-indigo-50/70 to-emerald-50/70 p-4 shadow-inner ring-1 ring-indigo-100 backdrop-blur-sm"
    >
      <div className="space-y-1.5">
        <label htmlFor="username" className="label">
          Usuario
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-xs font-semibold uppercase tracking-wide text-indigo-500">
            U
          </div>
          <input
            id="username"
            className="input pl-10 border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-emerald-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu usuario"
            autoComplete="username"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="label">
          Contrasena
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-xs font-semibold uppercase tracking-wide text-emerald-600">
            *
          </div>
          <input
            id="password"
            className="input pl-10 border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-emerald-100"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="current-password"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <button
          className="w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
    
      </div>
    </form>
  );
};

export default LoginForm;
