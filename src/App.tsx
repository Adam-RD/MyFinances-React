import { useContext } from "react";
import AppRouter from "./app/router/AppRouter";
import Navbar from "./components/layout/Navbar";
import { AuthContext } from "./app/providers/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      {isAuthenticated && <Navbar />}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <AppRouter />
      </main>
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:justify-between">
          <span className="font-semibold text-slate-800">MyFinances</span>
          <span className="text-xs sm:text-sm">
            Desarrollado por <span className="font-semibold text-indigo-700">Adam Diaz</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
