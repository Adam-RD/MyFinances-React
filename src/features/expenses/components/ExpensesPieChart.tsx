import type { IExpenseSummaryDto } from "../../../interfaces/expense.interfaces";
import { useMemo } from "react";
import { useCurrency } from "../../../app/providers/CurrencyContext";

type ChartRange = "weekly" | "monthly" | "yearly";

interface ExpensesPieChartProps {
  summary: IExpenseSummaryDto | null;
  range: ChartRange;
  onRangeChange: (range: ChartRange) => void;
}

const palette = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#84cc16"];

const ExpensesPieChart = ({ summary, range, onRangeChange }: ExpensesPieChartProps) => {
  const { formatCurrency } = useCurrency();
  const pieData = useMemo(() => {
    if (!summary) return { total: 0, slices: [] as { label: string; value: number; color: string }[] };

    const source =
      range === "weekly"
        ? summary.weeklyExpensesByCategory
        : range === "yearly"
          ? summary.yearlyExpensesByCategory
          : summary.monthlyExpensesByCategory;

    const slices = source.map((item, idx) => ({
      label: item.categoryName,
      value: item.totalAmount,
      color: palette[idx % palette.length],
    }));
    const total = slices.reduce((acc, s) => acc + s.value, 0);
    return { total, slices };
  }, [range, summary]);

  const pieGradient = useMemo(() => {
    const { total, slices } = pieData;
    if (!total || slices.length === 0) return "";
    let start = 0;
    const segments: string[] = [];
    slices.forEach((s) => {
      const angle = (s.value / total) * 360;
      const end = start + angle;
      segments.push(`${s.color} ${start}deg ${end}deg`);
      start = end;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [pieData]);

  return (
    <div className="card card-padding space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Gastos por categoria</h3>
          <p className="text-sm text-slate-600">Distribucion por periodo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["weekly", "monthly", "yearly"] as const).map((value) => (
            <button
              key={value}
              className={`btn-secondary px-3 py-1 text-xs ${
                range === value ? "border-indigo-500 text-indigo-700" : ""
              }`}
              onClick={() => onRangeChange(value)}
            >
              {value === "weekly" ? "Semanal" : value === "monthly" ? "Mensual" : "Anual"}
            </button>
          ))}
        </div>
      </div>

      {pieData.total === 0 ? (
        <p className="text-sm text-slate-600">No hay datos para graficar este periodo.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center justify-center">
            <div className="relative h-48 w-48 rounded-full">
              <div className="absolute inset-0 rounded-full" style={{ background: pieGradient }} />
              <div className="absolute inset-6 rounded-full bg-white shadow-inner" />
              <div className="absolute inset-10 flex flex-col items-center justify-center text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(pieData.total)}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            {pieData.slices.map((slice) => (
              <div
                key={slice.label}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: slice.color }} />
                  <span className="text-sm font-semibold text-slate-800">{slice.label}</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">{formatCurrency(slice.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPieChart;
