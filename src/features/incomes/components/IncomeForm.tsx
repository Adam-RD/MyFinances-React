import { useEffect, useState } from "react";
import { incomesService } from "../../../services/incomes.service";
import { mapApiError } from "../../../services/http";
import { notifyError, notifySuccess } from "../../../utils/notify";
import type { IIncomeResponseDto } from "../../../interfaces/income.interfaces";

export interface IIncomeFormProps {
  onCreated: () => void;
  editingIncome?: IIncomeResponseDto | null;
  onCancelEdit?: () => void;
}

const IncomeForm = ({ onCreated, editingIncome, onCancelEdit }: IIncomeFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
  };

  useEffect(() => {
    if (editingIncome) {
      setDescription(editingIncome.description);
      setAmount(editingIncome.amount);
      setDate(new Date(editingIncome.date).toISOString().slice(0, 10));
    } else {
      resetForm();
    }
  }, [editingIncome]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    try {
      setLoading(true);
      setError(null);

      if (editingIncome) {
        await incomesService.update(editingIncome.id, {
          description: description.trim(),
          amount,
          date: new Date(date).toISOString(),
        });
        notifySuccess("Ingreso actualizado");
      } else {
        await incomesService.create({
          description: description.trim(),
          amount,
          date: new Date(date).toISOString(),
        });
        notifySuccess("Ingreso agregado");
      }

      resetForm();
      onCreated();
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
        <label className="label" htmlFor="income-description">
          Descripcion
        </label>
        <input
          id="income-description"
          className="input"
          placeholder="Ej: Nomina"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="label" htmlFor="income-amount">
            Monto
          </label>
          <input
            id="income-amount"
            className="input"
            type="number"
            placeholder="0"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="income-date">
            Fecha
          </label>
          <input
            id="income-date"
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="flex justify-end gap-2">
        {editingIncome && (
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
          {loading ? "Guardando..." : editingIncome ? "Actualizar ingreso" : "Agregar ingreso"}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
