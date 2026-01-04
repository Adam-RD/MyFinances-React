const CURRENCY_KEY = "mf_currency";
const LOCALE_KEY = "mf_currency_locale";

export const currencyStorage = {
  getCurrency(): string | null {
    return localStorage.getItem(CURRENCY_KEY);
  },
  getLocale(): string | null {
    return localStorage.getItem(LOCALE_KEY);
  },
  set(currency: string, locale: string): void {
    localStorage.setItem(CURRENCY_KEY, currency);
    localStorage.setItem(LOCALE_KEY, locale);
  },
  clear(): void {
    localStorage.removeItem(CURRENCY_KEY);
    localStorage.removeItem(LOCALE_KEY);
  },
};
