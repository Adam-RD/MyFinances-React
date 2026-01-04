import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { incomesService } from "../../services/incomes.service";
import { mapApiError } from "../../services/http";
import { BalanceContext } from "./BalanceContext";
import { AuthContext } from "./AuthContext";
import type { IBalanceResponse } from "../../interfaces/income.interfaces";
import { savingsService } from "../../services/savings.service";

const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const [balance, setBalance] = useState<IBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingsTotal, setSavingsTotal] = useState(0);

  const refreshBalance = useCallback(async () => {
    if (!auth?.isAuthenticated) {
      setBalance(null);
      setSavingsTotal(0);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const [res, savings] = await Promise.all([incomesService.balance(), savingsService.getAll()]);
      const totalSavings = savings.reduce((acc, s) => acc + s.amount, 0);
      setBalance(res);
      setSavingsTotal(totalSavings);
      setError(null);
    } catch (err) {
      setError(mapApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [auth?.isAuthenticated]);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  const value = useMemo(
    () => {
      const netBalance =
        (balance?.balance ?? 0) - savingsTotal;
      return {
        balance,
        loading,
        error,
        savingsTotal,
        netBalance,
        refreshBalance,
      };
    },
    [balance, error, loading, refreshBalance, savingsTotal]
  );

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};

export default BalanceProvider;
