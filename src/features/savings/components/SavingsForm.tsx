import { useEffect, useState } from "react";
import type { ISavingEntry } from "../../../interfaces/savings.interfaces";
import { savingsService } from "../../../services/savings.service";
import { notifySuccess, notifyError } from "../../../utils/notify";
import { mapApiError } from "../../../services/http";
import { savingGoalsService } from "../../../services/savingGoals.service";
import type { ISavingGoal } from "../../../interfaces/saving-goal.interfaces";
import { useCurrency } from "../../../app/providers/CurrencyContext";

export interface ISavingsFormProps {
  onSaved: () => void;
  editingSaving?: ISavingEntry | null;
  onCancelEdit?: () => void;
}

const SavingsForm = ({ onSaved, editingSaving, onCancelEdit }: ISavingsFormProps) => {
  const { formatCurrency } = useCurrency();
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [savingGoals, setSavingGoals] = useState<ISavingGoal[]>([]);
  const [savingGoalId, setSavingGoalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);

  const resetForm = () => {
    setNote("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setSavingGoalId(null);
  };

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoadingGoals(true);
        const data = await savingGoalsService.getAll();
        setSavingGoals(data.filter((g) => g.isActive && g.status !== "Completado"));
      } catch (err) {
        setSavingGoals([]);
      } finally {
        setLoadingGoals(false);
      }
    };
    void loadGoals();
  }, []);

  useEffect(() => {
    if (editingSaving) {
      setNote(editingSaving.note ?? "");
      setAmount(editingSaving.amount);
      setDate(new Date(editingSaving.date).toISOString().slice(0, 10));
      setSavingGoalId(editingSaving.savingGoalId ?? null);
    } else {
      resetForm();
    }
  }, [editingSaving]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || amount <= 0) return;
    try {
      setLoading(true);
      if (editingSaving) {
        await savingsService.update(editingSaving.id, {
          note: note.trim(),
          amount,
          date,
          savingGoalId,
        });
        notifySuccess(`Ahorro actualizado (${formatCurrency(amount)})`);
      } else {
        await savingsService.create({
          note: note.trim(),
          amount,
          date,
          savingGoalId,
        });
        notifySuccess(`Ahorro agregado (${formatCurrency(amount)})`);
      }
      resetForm();
      onSaved();
    } catch (err) {
      notifyError(mapApiError(err).message || "No se pudo guardar el ahorro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-2 space-y-3">
      <div className="space-y-1.5">
        <label className="label" htmlFor="saving-description">
          Descripcion
        </label>
        <input
          id="saving-description"
          className="input"
          placeholder="Ej: Fondo emergencia"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="label" htmlFor="saving-amount">
            Monto
          </label>
          <input
            id="saving-amount"
            className="input"
            type="number"
            placeholder="0"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="saving-date">
            Fecha
          </label>
          <input
            id="saving-date"
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label" htmlFor="saving-goal">
          Meta (opcional)
        </label>
        <select
          id="saving-goal"
          className="input"
          value={savingGoalId ?? ""}
          onChange={(e) => setSavingGoalId(e.target.value ? Number(e.target.value) : null)}
          disabled={loadingGoals}
        >
          <option value="">Sin meta asociada</option>
          {!savingGoals.some((g) => g.id === (savingGoalId ?? 0)) && savingGoalId !== null && (
            <option value={savingGoalId}>
              Meta #{savingGoalId} (inactiva)
            </option>
          )}
          {savingGoals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name} {goal.isActive ? "" : "(inactiva)"}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Los aportes suman al progreso de la meta seleccionada.</p>
      </div>

      <div className="flex justify-end gap-2">
        {editingSaving && (
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
          {loading ? "Guardando..." : editingSaving ? "Actualizar ahorro" : "Agregar ahorro"}
        </button>
      </div>
    </form>
  );
};

export default SavingsForm;
