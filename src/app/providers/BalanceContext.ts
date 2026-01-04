import { createContext, useContext } from "react";
import type { IBalanceResponse } from "../../interfaces/income.interfaces";

export interface IBalanceContext {
  balance: IBalanceResponse | null;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  savingsTotal?: number;
  netBalance?: number;
}

export const BalanceContext = createContext<IBalanceContext | null>(null);

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance debe usarse dentro de un BalanceProvider");
  return ctx;
};
