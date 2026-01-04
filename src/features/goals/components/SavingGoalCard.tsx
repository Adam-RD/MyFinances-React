import type { SavingGoalWithStats } from "../pages/SavingGoalsPage";
import { useCurrency } from "../../../app/providers/CurrencyContext";

interface SavingGoalCardProps {
  goal: SavingGoalWithStats;
  onEdit: (goal: SavingGoalWithStats) => void;
  onDelete: (id: number) => void;
}

const statusClasses: Record<SavingGoalWithStats["status"], string> = {
  "En curso": "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Cerca: "bg-amber-50 text-amber-700 border border-amber-100",
  Retrasado: "bg-rose-50 text-rose-700 border border-rose-100",
  Completado: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const progressColor: Record<SavingGoalWithStats["status"], string> = {
  "En curso": "bg-indigo-500",
  Cerca: "bg-amber-500",
  Retrasado: "bg-rose-500",
  Completado: "bg-emerald-500",
};

const SavingGoalCard = ({ goal, onEdit, onDelete }: SavingGoalCardProps) => {
  const { formatCurrency } = useCurrency();
  const percent = Math.min(100, goal.progress);
  const isLate = goal.status === "Retrasado";
  const isNear = goal.status === "Cerca";

  const daysLabel =
    goal.remainingDays < 0
      ? `Vencida hace ${Math.abs(goal.remainingDays)} dias`
      : goal.remainingDays === 0
        ? "Vence hoy"
        : `Faltan ${goal.remainingDays} dias`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meta</p>
          <h3 className="text-lg font-semibold text-slate-900">{goal.name}</h3>
          <p className="text-sm text-slate-600">
            Objetivo: <span className="font-semibold text-slate-900">{formatCurrency(goal.targetAmount)}</span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[goal.status]}`}>
          {goal.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>Ahorros asociados</span>
          <span className="font-semibold text-slate-900">{formatCurrency(goal.totalSaved)}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${progressColor[goal.status]}`} style={{ width: `${percent}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{percent.toFixed(1)}% completado</span>
          <span className={isLate ? "font-semibold text-rose-700" : isNear ? "font-semibold text-amber-700" : ""}>
            {daysLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Fecha limite: {new Date(goal.targetDate).toLocaleDateString()}</span>
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-1 text-xs" onClick={() => onEdit(goal)}>
            Editar
          </button>
          <button
            className="btn-ghost px-3 py-1 text-xs text-rose-700 hover:text-rose-800"
            onClick={() => onDelete(goal.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingGoalCard;
