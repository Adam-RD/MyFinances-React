import type { TimeRange } from "../types";

export interface TrendPoint {
  label: string;
  incomes: number;
  expenses: number;
  savings: number;
}

interface TrendChartProps {
  data: TrendPoint[];
  maxValue: number;
  timeRange: TimeRange;
}

const TrendChart = ({ data, maxValue, timeRange }: TrendChartProps) => {
  if (maxValue === 0 || data.length === 0) {
    return <p className="text-sm text-slate-600">Sin datos suficientes para graficar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-4">
        {data.map((row) => {
          const incomeHeight = `${(row.incomes / maxValue) * 100 || 0}%`;
          const expenseHeight = `${(row.expenses / maxValue) * 100 || 0}%`;
          const savingsHeight = `${(row.savings / maxValue) * 100 || 0}%`;
          return (
            <div
              key={`${timeRange}-${row.label}`}
              className="flex min-w-18 flex-col items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 shadow-inner"
            >
              <div className="flex items-end gap-2 h-48">
                <div
                  className="flex w-3.5 items-end justify-center rounded-full bg-linear-to-t from-emerald-600 via-emerald-500 to-emerald-300 shadow-sm ring-1 ring-emerald-200"
                  style={{ height: incomeHeight }}
                  title={`Ingresos: ${row.incomes}`}
                >
                  <span className="mb-1 inline-flex rounded-full bg-white/80 px-1 text-[10px] font-semibold text-emerald-700 shadow-sm">
                    {row.incomes || ""}
                  </span>
                </div>
                <div
                  className="flex w-3.5 items-end justify-center rounded-full bg-linear-to-t from-rose-600 via-rose-500 to-rose-300 shadow-sm ring-1 ring-rose-200"
                  style={{ height: expenseHeight }}
                  title={`Gastos: ${row.expenses}`}
                >
                  <span className="mb-1 inline-flex rounded-full bg-white/80 px-1 text-[10px] font-semibold text-rose-700 shadow-sm">
                    {row.expenses || ""}
                  </span>
                </div>
                <div
                  className="flex w-3.5 items-end justify-center rounded-full bg-linear-to-t from-amber-600 via-amber-500 to-amber-300 shadow-sm ring-1 ring-amber-200"
                  style={{ height: savingsHeight }}
                  title={`Ahorros: ${row.savings}`}
                >
                  <span className="mb-1 inline-flex rounded-full bg-white/80 px-1 text-[10px] font-semibold text-amber-700 shadow-sm">
                    {row.savings || ""}
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-700">{row.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendChart;
