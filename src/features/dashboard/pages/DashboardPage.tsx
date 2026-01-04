import { useContext, useEffect, useMemo, useState } from "react";
import { incomesService } from "../../../services/incomes.service";
import { expensesService } from "../../../services/expenses.service";
import { savingsService } from "../../../services/savings.service";
import type { IBalanceResponse, IIncomeResponseDto, IIncomeSummaryDto } from "../../../interfaces/income.interfaces";
import type { IExpenseByCategoryDto, IExpenseResponseDto, IExpenseSummaryDto } from "../../../interfaces/expense.interfaces";
import type { ISavingEntry } from "../../../interfaces/savings.interfaces";
import { mapApiError } from "../../../services/http";
import Spinner from "../../../components/ui/Spinner";
import BalanceCard from "../components/BalanceCard";
import ExpenseSummaryCard from "../components/ExpenseSummaryCard";
import IncomeSummaryCard from "../components/IncomeSummaryCard";
import TrendRangeSelector from "../components/TrendRangeSelector";
import TrendChart, { type TrendPoint } from "../components/TrendChart";
import type { TimeRange } from "../types";
import { AuthContext } from "../../../app/providers/AuthContext";
import { useCurrency } from "../../../app/providers/CurrencyContext";


const monthLabel = (date: Date) =>
  date.toLocaleString("es", { month: "short" }).replace(".", "").replace(/\b\w/g, (c) => c.toUpperCase());

const dayLabel = (date: Date) =>
  date
    .toLocaleDateString("es", { weekday: "short" })
    .replace(".", "")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const DashboardPage = () => {
  const hiddenCategory = "ahorros ocultos";
  const auth = useContext(AuthContext);
  const { formatCurrency } = useCurrency();
  const [balance, setBalance] = useState<IBalanceResponse | null>(null);
  const [expenseSummary, setExpenseSummary] = useState<IExpenseSummaryDto | null>(null);
  const [incomeSummary, setIncomeSummary] = useState<IIncomeSummaryDto | null>(null);
  const [expenses, setExpenses] = useState<IExpenseResponseDto[]>([]);
  const [incomes, setIncomes] = useState<IIncomeResponseDto[]>([]);
  const [savings, setSavings] = useState<ISavingEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [b, s, incomeS, expList, incList, savingsList] = await Promise.all([
        incomesService.balance(),
        expensesService.summary(),
        incomesService.summary(),
        expensesService.getAll(),
        incomesService.getAll(),
        savingsService.getAll(),
      ]);
      setBalance(b);
      const cleanSummary = (() => {
        if (!s) return s;
        const filterHidden = (list: IExpenseByCategoryDto[]) =>
          list.filter((item) => (item.categoryName || "").toLowerCase() !== hiddenCategory);
        const adjustTotal = (total: number, list: IExpenseByCategoryDto[]) => {
          const removed = list
            .filter((item) => (item.categoryName || "").toLowerCase() === hiddenCategory)
            .reduce((acc, item) => acc + item.totalAmount, 0);
          return Math.max(0, total - removed);
        };

        const weeklyFiltered = filterHidden(s.weeklyExpensesByCategory);
        const monthlyFiltered = filterHidden(s.monthlyExpensesByCategory);
        const yearlyFiltered = filterHidden(s.yearlyExpensesByCategory);

        return {
          ...s,
          totalExpenses: adjustTotal(s.totalExpenses, s.monthlyExpensesByCategory),
          weeklyExpenses: adjustTotal(s.weeklyExpenses, s.weeklyExpensesByCategory),
          monthlyExpenses: adjustTotal(s.monthlyExpenses, s.monthlyExpensesByCategory),
          yearlyExpenses: adjustTotal(s.yearlyExpenses, s.yearlyExpensesByCategory),
          weeklyExpensesByCategory: weeklyFiltered,
          monthlyExpensesByCategory: monthlyFiltered,
          yearlyExpensesByCategory: yearlyFiltered,
        };
      })();

      const visibleExpenses = expList.filter((x) => (x.categoryName || "").toLowerCase() !== hiddenCategory);

      setExpenseSummary(cleanSummary);
      setIncomeSummary(incomeS);
      setExpenses(visibleExpenses);
      setIncomes(incList);
      setSavings(savingsList);
      setError(null);
    } catch (err) {
      setError(mapApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const chartData = useMemo<TrendPoint[]>(() => {
    const now = new Date();
    const rows: TrendPoint[] = [];

    if (timeRange === "7d" || timeRange === "30d") {
      const days = timeRange === "7d" ? 7 : 30;
      for (let i = days - 1; i >= 0; i -= 1) {
        const current = new Date(now);
        current.setDate(current.getDate() - i);
        const year = current.getFullYear();
        const month = current.getMonth();
        const day = current.getDate();

        const incomeTotal = incomes
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        const expenseTotal = expenses
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        const label =
          timeRange === "7d"
            ? dayLabel(current)
            : `${current.getDate().toString().padStart(2, "0")}/${(current.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`;

        const savingsTotal = savings
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        rows.push({ label, incomes: incomeTotal, expenses: expenseTotal, savings: savingsTotal });
      }
    } else {
      const months = Number(timeRange.replace("m", ""));
      for (let i = months - 1; i >= 0; i -= 1) {
        const current = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = current.getFullYear();
        const month = current.getMonth();

        const incomeTotal = incomes
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        const expenseTotal = expenses
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        const savingsTotal = savings
          .filter((x) => {
            const d = new Date(x.date);
            return d.getFullYear() === year && d.getMonth() === month;
          })
          .reduce((acc, x) => acc + x.amount, 0);

        rows.push({
          label: monthLabel(current),
          incomes: incomeTotal,
          expenses: expenseTotal,
          savings: savingsTotal,
        });
      }
    }

    return rows;
  }, [expenses, incomes, savings, timeRange]);

  const maxValue = chartData.reduce((max, x) => Math.max(max, x.incomes, x.expenses, x.savings), 0);

  const rangeLabel = useMemo(() => {
    switch (timeRange) {
      case "7d":
        return "7d";
      case "30d":
        return "30d";
      default:
        return `Ultimos ${timeRange.replace("m", "")}m`;
    }
  }, [timeRange]);

  const username = auth?.user?.username?.toUpperCase() ?? "USUARIO";
  const currentBalance = balance?.balance ?? null;
  const savingsTotal = useMemo(() => savings.reduce((acc, x) => acc + x.amount, 0), [savings]);
  const isPositiveBalance = typeof currentBalance === "number" && currentBalance >= 0;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" text="Cargando dashboard..." />
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
              Bienvenido
            </span>
            <h1 className="text-3xl font-bold text-slate-900">Hola, {username}</h1>
            <p className="text-sm text-slate-600">Resumen rapido de tus ingresos y gastos.</p>
          </div>

          <div className="rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-indigo-100 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Balance + Ahorros</p>
            <p className="text-3xl font-semibold text-slate-900">{formatCurrency(currentBalance)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isPositiveBalance ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {isPositiveBalance ? "En positivo" : "En negativo"}
              </span>
              <span className="text-xs text-slate-500">Incluye los movimientos registrados a la fecha.</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-emerald-200/30 blur-3xl" aria-hidden />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard balance={balance} savingsTotal={savingsTotal} />
        <ExpenseSummaryCard summary={expenseSummary} />
        <IncomeSummaryCard summary={incomeSummary} />
      </div>

      <div className="card card-padding space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tendencia</h2>
            <p className="text-sm text-slate-600">
              Comparacion de ingresos vs gastos y ahorros (rango seleccionado).
            </p>
          </div>
          <TrendRangeSelector timeRange={timeRange} onChange={setTimeRange} label={rangeLabel} />
        </div>

        <TrendChart data={chartData} maxValue={maxValue} timeRange={timeRange} />

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Ingresos
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Gastos
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Ahorros
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
