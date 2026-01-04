import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../components/ui/Spinner";
import { savingGoalsService } from "../../../services/savingGoals.service";
import { savingsService } from "../../../services/savings.service";
import { notifyError, notifySuccess } from "../../../utils/notify";
import type { ISavingGoal } from "../../../interfaces/saving-goal.interfaces";
import type { ISavingEntry } from "../../../interfaces/savings.interfaces";
import SavingGoalForm from "../components/SavingGoalForm";
import SavingGoalCard from "../components/SavingGoalCard";
import { mapApiError } from "../../../services/http";

export type GoalStatus = "En curso" | "Cerca" | "Retrasado" | "Completado";

export interface SavingGoalWithStats extends ISavingGoal {
  totalSaved: number;
  progress: number;
  remainingDays: number;
  status: GoalStatus;
}

const msPerDay = 1000 * 60 * 60 * 24;

const calculateGoalStats = (goal: ISavingGoal, totalSaved: number): SavingGoalWithStats => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(goal.targetDate);
  target.setHours(0, 0, 0, 0);

  const remainingDays = Math.ceil((target.getTime() - today.getTime()) / msPerDay);
  const progress = goal.targetAmount > 0 ? (totalSaved / goal.targetAmount) * 100 : 0;
  const isCompleted = progress >= 100;
  const isLate = !isCompleted && today.getTime() > target.getTime();
  const isNear = !isCompleted && (progress >= 80 || remainingDays <= 14);

  let status: GoalStatus = "En curso";
  if (isCompleted) status = "Completado";
  else if (isLate) status = "Retrasado";
  else if (isNear) status = "Cerca";

  return {
    ...goal,
    totalSaved,
    progress,
    remainingDays,
    status,
  };
};

const SavingGoalsPage = () => {
  const [goals, setGoals] = useState<ISavingGoal[]>([]);
  const [savings, setSavings] = useState<ISavingEntry[]>([]);
  const [editingGoal, setEditingGoal] = useState<ISavingGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"todas" | "activas" | "completadas" | "retrasadas" | "cerca">("activas");
  const [sortBy, setSortBy] = useState<"fecha" | "fecha-desc" | "progreso">("fecha");
  const statusHistoryRef = useRef<Map<number, GoalStatus>>(new Map());
  const alertsRef = useRef<Set<string>>(new Set());

  const refresh = async () => {
    try {
      setLoading(true);
      const [goalList, savingsList] = await Promise.all([savingGoalsService.getAll(), savingsService.getAll()]);
      setGoals(goalList);
      setSavings(savingsList);
      setError(null);
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const savingsByGoal = useMemo(() => {
    const grouped: Record<number, number> = {};
    savings.forEach((s) => {
      if (!s.savingGoalId) return;
      grouped[s.savingGoalId] = (grouped[s.savingGoalId] ?? 0) + s.amount;
    });
    return grouped;
  }, [savings]);

  const goalsWithStats = useMemo(
    () =>
      goals.map((goal) => {
        const totalSaved = savingsByGoal[goal.id] ?? goal.totalSaved ?? 0;
        return calculateGoalStats(goal, totalSaved);
      }),
    [goals, savingsByGoal]
  );

  useEffect(() => {
    goalsWithStats.forEach((goal) => {
      const prev = statusHistoryRef.current.get(goal.id);
      if (prev && prev !== goal.status) {
        if (goal.status === "Completado") toast.success(`Meta "${goal.name}" completada`);
        else if (goal.status === "Retrasado") toast.error(`Meta "${goal.name}" esta retrasada`);
        else if (goal.status === "Cerca") toast(`Meta "${goal.name}" esta cerca de cumplirse`, { icon: "!" });
      }
      statusHistoryRef.current.set(goal.id, goal.status);
    });
  }, [goalsWithStats]);

  useEffect(() => {
    goalsWithStats.forEach((goal) => {
      const nearKey = `near-${goal.id}`;
      const lateKey = `late-${goal.id}`;

      if (goal.status === "Retrasado" && !alertsRef.current.has(lateKey)) {
        toast.error(`La meta "${goal.name}" esta retrasada`, { icon: "!" });
        alertsRef.current.add(lateKey);
      }

      if (goal.progress >= 90 && goal.status !== "Completado" && !alertsRef.current.has(nearKey)) {
        toast(`"${goal.name}" va ${goal.progress.toFixed(0)}% completada`, { icon: "%" });
        alertsRef.current.add(nearKey);
      }
    });
  }, [goalsWithStats]);

  const filteredGoals = useMemo(() => {
    let list = [...goalsWithStats];

    switch (statusFilter) {
      case "activas":
        list = list.filter((g) => g.status !== "Completado" && g.isActive);
        break;
      case "completadas":
        list = list.filter((g) => g.status === "Completado");
        break;
      case "retrasadas":
        list = list.filter((g) => g.status === "Retrasado");
        break;
      case "cerca":
        list = list.filter((g) => g.status === "Cerca");
        break;
      default:
        break;
    }

    if (sortBy === "fecha") {
      list.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
    } else if (sortBy === "fecha-desc") {
      list.sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime());
    } else if (sortBy === "progreso") {
      list.sort((a, b) => b.progress - a.progress);
    }

    return list;
  }, [goalsWithStats, sortBy, statusFilter]);

  const onDelete = async (id: number) => {
    try {
      await savingGoalsService.remove(id);
      statusHistoryRef.current.delete(id);
      alertsRef.current.delete(`near-${id}`);
      alertsRef.current.delete(`late-${id}`);
      notifySuccess("Meta eliminada");
      await refresh();
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
      notifyError(msg);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" text="Cargando metas..." />
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Metas</h1>
        <p className="text-sm text-slate-600">
          Define objetivos, registra aportes y revisa su estado (En curso, Cerca, Retrasado o Completado).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-padding space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Crear/editar meta</h2>
          <p className="text-sm text-slate-600">
            Captura el objetivo, monto y fecha limite. Puedes registrar un aporte inicial opcional.
          </p>
          <SavingGoalForm
            editingGoal={editingGoal}
            onCancelEdit={() => setEditingGoal(null)}
            onSaved={() => {
              setEditingGoal(null);
              void refresh();
            }}
          />
        </div>

        <div className="lg:col-span-2 card card-padding space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Metas guardadas</h2>
              <p className="text-sm text-slate-600">
                Barra de progreso, dias restantes y alertas de estado (cerca o retrasada).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="input w-auto text-sm"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "todas" | "activas" | "completadas" | "retrasadas" | "cerca")
                }
              >
                <option value="activas">Ver activas</option>
                <option value="cerca">Solo cerca</option>
                <option value="retrasadas">Solo retrasadas</option>
                <option value="completadas">Completadas</option>
                <option value="todas">Todas</option>
              </select>

              <select
                className="input w-auto text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "fecha" | "fecha-desc" | "progreso")}
              >
                <option value="fecha">Orden: fecha objetivo</option>
                <option value="fecha-desc">Orden: fecha mas lejana</option>
                <option value="progreso">Orden: % completado</option>
              </select>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          {filteredGoals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
              <p className="text-sm font-semibold text-slate-800">Sin metas registradas.</p>
              <p className="text-xs text-slate-600">Crea tu primera meta para seguir tu avance.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredGoals.map((goal) => (
                <SavingGoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={(g) => setEditingGoal(g)}
                  onDelete={(id) => {
                    void onDelete(id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingGoalsPage;
