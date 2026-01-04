import type { IIncomeSummaryDto } from "../../../interfaces/income.interfaces";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface IncomeSummaryCardProps {
  summary: IIncomeSummaryDto | null;
}

const IncomeSummaryCard = ({ summary }: IncomeSummaryCardProps) => {
  const { formatCurrency } = useCurrency();

  return (
  <div className="card card-padding space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">Ingresos</h2>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Resumen
      </span>
    </div>
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div className="rounded-xl bg-emerald-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total</dt>
        <dd className="mt-2 text-xl font-bold text-emerald-700">{formatCurrency(summary?.totalIncomes)}</dd>
      </div>
      <div className="rounded-xl bg-indigo-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Semanal</dt>
        <dd className="mt-2 text-xl font-bold text-indigo-700">{formatCurrency(summary?.weeklyIncomes)}</dd>
      </div>
      <div className="rounded-xl bg-amber-50 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">Mensual</dt>
        <dd className="mt-2 text-xl font-bold text-amber-700">{formatCurrency(summary?.monthlyIncomes)}</dd>
      </div>
      <div className="rounded-xl bg-slate-100 p-4">
        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-700">Anual</dt>
        <dd className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(summary?.yearlyIncomes)}</dd>
      </div>
    </dl>
  </div>
  );
};

export default IncomeSummaryCard;
