import type { IBalanceResponse } from "../../../interfaces/income.interfaces";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface BalanceCardProps {
  balance: IBalanceResponse | null;
  savingsTotal: number;
}

const BalanceCard = ({ balance, savingsTotal }: BalanceCardProps) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="card card-padding space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Balance </h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Hoy</span>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 rounded-xl border border-amber-50 bg-amber-50/70 px-3 py-2 shadow-inner">
            <p className="text-sm text-amber-700">Total ahorros</p>
            <p className="text-lg font-semibold text-amber-700 break-words sm:text-xl">
              {formatCurrency(savingsTotal)}
            </p>
          </div>
          <div className="space-y-1 rounded-xl border border-rose-50 bg-rose-50/70 px-3 py-2 shadow-inner">
            <p className="text-sm text-rose-700">Total gastos</p>
            <p className="text-lg font-semibold text-rose-700 break-words sm:text-xl">
              {formatCurrency(balance?.totalExpenses)}
            </p>
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-emerald-50 bg-emerald-50/70 px-3 py-2 shadow-inner">
          <p className="text-sm text-emerald-700">Total ingresos</p>
          <p className="text-lg font-semibold text-emerald-700 break-words sm:text-xl">
            {formatCurrency(balance?.totalIncomes)}
          </p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-500">Balance - ( Ahorros + Gastos )</p>
        <p className="text-2xl font-bold text-slate-900 break-words sm:text-3xl">
          {formatCurrency((balance?.balance ?? 0) - savingsTotal)}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
