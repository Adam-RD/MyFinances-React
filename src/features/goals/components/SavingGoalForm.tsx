import { useEffect, useState } from "react";
import type { ISavingGoal } from "../../../interfaces/saving-goal.interfaces";
import { savingGoalsService } from "../../../services/savingGoals.service";
import { savingsService } from "../../../services/savings.service";
import { notifyError, notifySuccess } from "../../../utils/notify";
import { mapApiError } from "../../../services/http";

export interface SavingGoalFormProps {
  onSaved: () => void;
  editingGoal?: ISavingGoal | null;
  onCancelEdit?: () => void;
}

const SavingGoalForm = ({ onSaved, editingGoal, onCancelEdit }: SavingGoalFormProps) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<string>(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    return now.toISOString().slice(0, 10);
  });
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 1);
    setName("");
    setTargetAmount(0);
    setTargetDate(defaultDate.toISOString().slice(0, 10));
    setInitialAmount(0);
    setIsActive(true);
  };

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.targetAmount);
      setTargetDate(new Date(editingGoal.targetDate).toISOString().slice(0, 10));
      setIsActive(editingGoal.isActive);
      setInitialAmount(0);
    } else {
      resetForm();
    }
  }, [editingGoal]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetAmount <= 0) return;

    const trimmedName = name.trim();
    const amountToSave = Number(initialAmount) || 0;

    try {
      setLoading(true);
      setError(null);

      let goalId = editingGoal?.id ?? null;

      if (editingGoal) {
        await savingGoalsService.update(editingGoal.id, {
          name: trimmedName,
          targetAmount,
          targetDate,
          isActive,
        });
        notifySuccess("Meta actualizada");
      } else {
        const created = await savingGoalsService.create({
          name: trimmedName,
          targetAmount,
          targetDate,
        });
        goalId = created.id;
        notifySuccess("Meta creada");
      }

      if (goalId && amountToSave > 0) {
        try {
          await savingsService.create({
            amount: amountToSave,
            date: new Date().toISOString().slice(0, 10),
            note: `Aporte inicial - ${trimmedName}`,
            savingGoalId: goalId,
          });
          notifySuccess("Aporte inicial registrado");
        } catch (err) {
          notifyError("Meta guardada, pero no se registro el aporte inicial");
        }
      }

      resetForm();
      onSaved();
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-3">
      <div className="space-y-1.5">
        <label className="label" htmlFor="goal-name">
          Nombre de la meta
        </label>
        <input
          id="goal-name"
          className="input"
          placeholder="Ej: Viaje, Fondo emergencia"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="label" htmlFor="goal-amount">
            Monto objetivo
          </label>
          <input
            id="goal-amount"
            className="input"
            type="number"
            min={0}
            placeholder="0"
            value={targetAmount || ""}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="goal-date">
            Fecha limite
          </label>
          <input
            id="goal-date"
            className="input"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="label" htmlFor="goal-initial-amount">
            Monto inicial (opcional)
          </label>
          <input
            id="goal-initial-amount"
            className="input"
            type="number"
            min={0}
            placeholder="0"
            value={initialAmount || ""}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
          />
          <p className="text-xs text-slate-500">
            Si capturas un monto, se registrara como un aporte ligado a esta meta.
          </p>
        </div>

        {editingGoal && (
          <div className="space-y-1.5">
            <label className="label">Estado</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <input
                id="goal-active"
                type="checkbox"
                className="h-4 w-4 accent-indigo-600"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="goal-active" className="text-sm text-slate-700">
                Meta activa
              </label>
            </div>
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="flex justify-end gap-2">
        {editingGoal && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onCancelEdit?.()}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : editingGoal ? "Actualizar meta" : "Crear meta"}
        </button>
      </div>
    </form>
  );
};

export default SavingGoalForm;
