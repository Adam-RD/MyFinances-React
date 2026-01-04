import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../app/providers/AuthContext";
import { notifySuccess } from "../../utils/notify";
import { useBalance } from "../../app/providers/BalanceContext";
import { useCurrency } from "../../app/providers/CurrencyContext";
import { useTheme } from "../../app/providers/ThemeContext";

type NavThemeKey = "slate" | "ocean" | "forest" | "sunset" | "midnight";

const NAV_THEMES: Record<
  NavThemeKey,
  {
    label: string;
    navWrapperClass: string;
    activeLinkClass: string;
    hoverLinkClass: string;
  }
> = {
  slate: {
    label: "Slate",
    navWrapperClass: "sticky top-0 z-30 bg-slate-50/95 border-b border-slate-200 shadow-sm backdrop-blur",
    activeLinkClass: "text-indigo-700 border-b-2 border-indigo-500",
    hoverLinkClass: "hover:text-indigo-700",
  },
  ocean: {
    label: "Ocean",
    navWrapperClass: "sticky top-0 z-30 bg-linear-to-r from-sky-50 via-white to-indigo-50 border-b border-sky-100 shadow-sm backdrop-blur",
    activeLinkClass: "text-sky-700 border-b-2 border-sky-500",
    hoverLinkClass: "hover:text-sky-700",
  },
  forest: {
    label: "Forest",
    navWrapperClass: "sticky top-0 z-30 bg-linear-to-r from-emerald-50 via-white to-lime-50 border-b border-emerald-100 shadow-sm backdrop-blur",
    activeLinkClass: "text-emerald-700 border-b-2 border-emerald-500",
    hoverLinkClass: "hover:text-emerald-700",
  },
  sunset: {
    label: "Sunset",
    navWrapperClass: "sticky top-0 z-30 bg-linear-to-r from-rose-50 via-white to-amber-50 border-b border-rose-100 shadow-sm backdrop-blur",
    activeLinkClass: "text-rose-700 border-b-2 border-rose-500",
    hoverLinkClass: "hover:text-rose-700",
  },
  midnight: {
    label: "Midnight",
    navWrapperClass: "sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 shadow-md backdrop-blur",
    activeLinkClass: "text-indigo-100 border-b-2 border-indigo-300",
    hoverLinkClass: "hover:text-indigo-100",
  },
};

const navLinkClassName =
  (activeClass: string, hoverClass: string) =>
  ({ isActive }: { isActive: boolean }) =>
    [
      "whitespace-nowrap font-semibold transition",
      "px-2 py-1 text-xs sm:text-sm rounded-lg",
      isActive ? activeClass : ["text-slate-700", hoverClass].join(" "),
    ].join(" ");

const Navbar = () => {
  const auth = useContext(AuthContext);
  const { balance, netBalance, error: balanceError } = useBalance();
  const { formatCurrency, currency, options, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme: navTheme, options: themeOptions, setTheme } = useTheme();

  return (
    <nav className={NAV_THEMES[navTheme].navWrapperClass}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div
          className={[
            "flex flex-col gap-0.5 rounded-2xl px-2.5 py-1.5 transition",
            "bg-white border border-slate-200 shadow-sm",
          ].join(" ")}
        >
          <Link
            to="/"
            className="group flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-sm hover:bg-white/70"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-inner transition group-hover:scale-[1.05]">
              <img src="/MyFinances.svg" alt="MyFinances" className="h-6 w-6" />
            </span>
            <span className="bg-linear-to-r from-indigo-700 to-emerald-600 bg-clip-text text-transparent transition group-hover:tracking-wide">
              MyFinances
            </span>
          </Link>

        </div>

        <button
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 sm:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          Menu
          <span className="text-[10px]">{menuOpen ? "▲" : "▼"}</span>
        </button>

        <div
          className={[
            "flex flex-1 flex-wrap items-center gap-1 px-2 py-1",
            "rounded-xl bg-white border border-slate-200 shadow-inner",
            menuOpen ? "flex-col sm:flex-row" : "hidden sm:flex",
          ].join(" ")}
        >
          <NavLink to="/" className={navLinkClassName(NAV_THEMES[navTheme].activeLinkClass, NAV_THEMES[navTheme].hoverLinkClass)} onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={navLinkClassName(NAV_THEMES[navTheme].activeLinkClass, NAV_THEMES[navTheme].hoverLinkClass)} onClick={() => setMenuOpen(false)}>
            Gastos
          </NavLink>
          <NavLink to="/incomes" className={navLinkClassName(NAV_THEMES[navTheme].activeLinkClass, NAV_THEMES[navTheme].hoverLinkClass)} onClick={() => setMenuOpen(false)}>
            Ingresos
          </NavLink>
          <NavLink to="/savings" className={navLinkClassName(NAV_THEMES[navTheme].activeLinkClass, NAV_THEMES[navTheme].hoverLinkClass)} onClick={() => setMenuOpen(false)}>
            Ahorros
          </NavLink>
          <NavLink to="/goals" className={navLinkClassName(NAV_THEMES[navTheme].activeLinkClass, NAV_THEMES[navTheme].hoverLinkClass)} onClick={() => setMenuOpen(false)}>
            Metas
          </NavLink>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {auth?.isAuthenticated && (
            <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow-lg shadow-indigo-50 sm:flex">
              <div className="flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 shadow-inner">
                <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Balance
                </span>
                <span className="text-sm font-bold text-emerald-800">
                  {balanceError ? "-" : formatCurrency(typeof netBalance === "number" ? netBalance : balance?.balance)}
                </span>
              </div>
              <select
                className="input h-9 w-auto rounded-full border-indigo-100 bg-white/80 text-xs font-semibold text-slate-700 shadow-inner"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {options.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.code}
                  </option>
                ))}
              </select>
              <select
                className="input h-9 w-auto rounded-full border-indigo-100 bg-white/80 text-xs font-semibold text-slate-700 shadow-inner"
                value={navTheme}
                onChange={(e) => setTheme(e.target.value as NavThemeKey)}
              >
                {themeOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {auth?.isAuthenticated ? (
            <button
              className="group inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm shadow-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-50 hover:ring-2 hover:ring-rose-200 hover:ring-offset-1 hover:ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 cursor-pointer sm:px-4 sm:text-sm"
              onClick={() => {
                auth.logout();
                notifySuccess("Sesion cerrada");
              }}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-linear-to-br from-rose-500 to-amber-400 text-[11px] font-black text-white shadow-inner transition group-hover:scale-110">
                {"<-"}
              </span>
              <span className="pr-1 sm:inline hidden">Salir</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <Link className="btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
