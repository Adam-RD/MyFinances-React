import type { IExpenseSummaryDto } from "../../../interfaces/expense.interfaces";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface ExpensesSummaryCardProps {
  summary: IExpenseSummaryDto | null;
  error?: string | null;
}

const ExpensesSummaryCard = ({ summary, error }: ExpensesSummaryCardProps) => {
  const { formatCurrency } = useCurrency();

  return (
  <div className="card card-padding space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">Resumen de gastos</h2>
      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
        Actual
      </span>
    </div>

    {error && <p className="error-text">{error}</p>}

    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div className="rounded-xl bg-rose-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-rose-700">Total</dt>
        <dd className="mt-2 text-xl font-bold text-rose-700">
          {formatCurrency(summary?.totalExpenses)}
        </dd>
      </div>
      <div className="rounded-xl bg-indigo-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Semanal</dt>
        <dd className="mt-2 text-xl font-bold text-indigo-700">
          {formatCurrency(summary?.weeklyExpenses)}
        </dd>
      </div>
      <div className="rounded-xl bg-amber-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">Mensual</dt>
        <dd className="mt-2 text-xl font-bold text-amber-700">
          {formatCurrency(summary?.monthlyExpenses)}
        </dd>
      </div>
      <div className="rounded-xl bg-emerald-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Anual</dt>
        <dd className="mt-2 text-xl font-bold text-emerald-700">
          {formatCurrency(summary?.yearlyExpenses)}
        </dd>
      </div>
    </dl>
  </div>
  );
};

export default ExpensesSummaryCard;
