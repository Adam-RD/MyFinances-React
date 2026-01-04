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
    </div>
  );
};

export default App;
