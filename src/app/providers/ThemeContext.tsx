import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeKey = "slate" | "ocean" | "forest" | "sunset" | "midnight";

interface ThemeOption {
  key: ThemeKey;
  label: string;
}

interface ThemeContextValue {
  theme: ThemeKey;
  options: ThemeOption[];
  setTheme: (theme: ThemeKey) => void;
}

const THEME_STORAGE_KEY = "mf_theme";

const THEME_OPTIONS: ThemeOption[] = [
  { key: "slate", label: "Slate" },
  { key: "ocean", label: "Ocean" },
  { key: "forest", label: "Forest" },
  { key: "sunset", label: "Sunset" },
  { key: "midnight", label: "Midnight" },
];

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeKey | null;
    return saved ?? "slate";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      options: THEME_OPTIONS,
      setTheme: (key: ThemeKey) => setThemeState(key),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
