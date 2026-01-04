import type { ISavingEntry } from "../../../interfaces/savings.interfaces";
import { SAVINGS_DISPLAY_NAME } from "../../../constants/savings";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface SavingsSummaryCardProps {
  items: ISavingEntry[];
}

const SavingsSummaryCard = ({ items }: SavingsSummaryCardProps) => {
  const { formatCurrency } = useCurrency();
  const total = items.reduce((acc, x) => acc + x.amount, 0);
  const monthly = items
    .filter((x) => {
      const d = new Date(x.date);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((acc, x) => acc + x.amount, 0);

  return (
    <div className="card card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Resumen de ahorros</h2>
          <p className="text-sm text-slate-600">Movimientos guardados como {SAVINGS_DISPLAY_NAME} en tu cuenta.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total ahorrado</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(total)}</p>
          <p className="text-xs text-slate-600">Acumulado de todos los registros locales.</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Este mes</p>
          <p className="mt-2 text-2xl font-bold text-indigo-700">{formatCurrency(monthly)}</p>
          <p className="text-xs text-slate-600">Movimientos del mes actual.</p>
        </div>
      </div>
    </div>
  );
};

export default SavingsSummaryCard;
