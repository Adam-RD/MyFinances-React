import { createContext, useContext, useMemo, useState } from "react";
import { formatCurrency as baseFormatCurrency } from "../../utils/format";
import { currencyStorage } from "../../utils/currencyStorage";

export interface CurrencyOption {
  code: string;
  locale: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "DOP", locale: "es-DO", label: "DOP - Peso dominicano" },
  { code: "USD", locale: "en-US", label: "USD - Dolar estadounidense" },
  { code: "EUR", locale: "es-ES", label: "EUR - Euro" },
];

export interface ICurrencyContext {
  currency: string;
  locale: string;
  options: CurrencyOption[];
  setCurrency: (code: string) => void;
  formatCurrency: (value?: number | null) => string;
}

const DEFAULT_CURRENCY = "DOP";
const DEFAULT_LOCALE = "es-DO";

export const CurrencyContext = createContext<ICurrencyContext | null>(null);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<string>(() => currencyStorage.getCurrency() ?? DEFAULT_CURRENCY);
  const [locale, setLocaleState] = useState<string>(() => currencyStorage.getLocale() ?? DEFAULT_LOCALE);

  const setCurrency = (code: string) => {
    const option = CURRENCY_OPTIONS.find((opt) => opt.code === code);
    const nextLocale = option?.locale ?? DEFAULT_LOCALE;
    setCurrencyState(code);
    setLocaleState(nextLocale);
    currencyStorage.set(code, nextLocale);
  };

  const value = useMemo<ICurrencyContext>(
    () => ({
      currency,
      locale,
      options: CURRENCY_OPTIONS,
      setCurrency,
      formatCurrency: (value?: number | null) => baseFormatCurrency(value, currency, locale),
    }),
    [currency, locale]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): ICurrencyContext => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
