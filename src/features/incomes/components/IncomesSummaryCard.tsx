import type { IIncomeSummaryDto } from "../../../interfaces/income.interfaces";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface IncomesSummaryCardProps {
  summary: IIncomeSummaryDto | null;
  error?: string | null;
}

const IncomesSummaryCard = ({ summary, error }: IncomesSummaryCardProps) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="card card-padding space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Resumen de ingresos</h2>
          <p className="text-sm text-slate-600">Totales y promedios recientes.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Actual
        </span>
      </div>
      {error && <p className="error-text">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-5 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total registrado</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(summary?.totalIncomes)}</p>
          <p className="text-xs text-slate-600">Incluye todos los ingresos capturados.</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-sky-700">
            <span>Balance</span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                (summary?.balance ?? 0) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {(summary?.balance ?? 0) >= 0 ? "En positivo" : "En negativo"}
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(summary?.balance)}</p>
          <p className="text-xs text-slate-600">Ingresos menos gastos acumulados.</p>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Semanal</dt>
          <dd className="mt-2 text-xl font-bold text-emerald-700">{formatCurrency(summary?.weeklyIncomes)}</dd>
          <p className="text-xs text-slate-500">Ultimos 7 dias.</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Mensual</dt>
          <dd className="mt-2 text-xl font-bold text-indigo-700">{formatCurrency(summary?.monthlyIncomes)}</dd>
          <p className="text-xs text-slate-500">Ultimos 30 dias.</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-amber-700">Trimestral</dt>
          <dd className="mt-2 text-xl font-bold text-amber-700">
            {formatCurrency(summary?.yearlyIncomes ? summary.yearlyIncomes / 4 : null)}
          </dd>
          <p className="text-xs text-slate-500">Promedio trimestral.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-700">Anual</dt>
          <dd className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(summary?.yearlyIncomes)}</dd>
          <p className="text-xs text-slate-500">Año en curso.</p>
        </div>
      </dl>
    </div>
  );
};

export default IncomesSummaryCard;
