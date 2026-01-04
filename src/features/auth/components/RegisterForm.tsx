import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersService } from "../../../services/users.service";
import { mapApiError } from "../../../services/http";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setError(null);

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await usersService.create({ username, password });
      const successMsg = "Usuario creado. Ahora inicia sesion.";
      setOk(successMsg);
      setUsername("");
      setPassword("");
      setConfirm("");
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (err) {
      setError(mapApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="label" htmlFor="register-username">
          Usuario
        </label>
        <input
          id="register-username"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Crea un usuario"
          autoComplete="username"
        />
      </div>

      <div className="space-y-1.5">
        <label className="label" htmlFor="register-password">
          Contrasena
        </label>
        <div className="relative">
          <input
            id="register-password"
            className="input pr-24"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 my-1 rounded-lg px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label" htmlFor="register-confirm">
          Confirmar contrasena
        </label>
        <input
          id="register-confirm"
          className="input"
          type={showPassword ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="********"
          autoComplete="new-password"
        />
      </div>

      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Creando..." : "Crear"}
      </button>

      {ok && <p className="text-sm font-medium text-green-600">{ok}</p>}
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default RegisterForm;
