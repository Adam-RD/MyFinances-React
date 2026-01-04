import { useEffect, useState, useCallback } from "react";
import { categoriesService } from "../../../services/categories.service";
import { expensesService } from "../../../services/expenses.service";
import type { ICategory } from "../../../interfaces/category.interfaces";
import type { IExpenseResponseDto } from "../../../interfaces/expense.interfaces";
import { mapApiError } from "../../../services/http";
import { notifyError, notifySuccess } from "../../../utils/notify";

export interface IExpenseFormProps {
  onCreated: () => void;
  reloadCategoriesKey?: number;
  editingExpense?: IExpenseResponseDto | null;
  onCancelEdit?: () => void;
}

const ExpenseForm = ({ onCreated, reloadCategoriesKey, editingExpense, onCancelEdit }: IExpenseFormProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = (cats: ICategory[]) => {
    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().slice(0, 10));
    setCategoryId(cats[0]?.id ?? 0);
  };

  const loadCategories = useCallback(async () => {
    const data = await categoriesService.getAll();
    setCategories(data);
    if (!editingExpense && data.length > 0) setCategoryId(data[0].id);
  }, [editingExpense]);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount);
      setDate(new Date(editingExpense.date).toISOString().slice(0, 10));
    } else {
      resetForm(categories);
    }
  }, [editingExpense, categories]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories, reloadCategoriesKey]);

  useEffect(() => {
    if (editingExpense) {
      const matchedCategoryId =
        editingExpense.categoryId ??
        categories.find((c) => c.name === editingExpense.categoryName)?.id ??
        categories[0]?.id ??
        0;
      setCategoryId(matchedCategoryId);
    } else if (categoryId === 0 && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, editingExpense]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0 || categoryId <= 0) return;

    try {
      setLoading(true);
      setError(null);

      if (editingExpense) {
        await expensesService.update(editingExpense.id, {
          description: description.trim(),
          amount,
          date: new Date(date).toISOString(),
          categoryId,
        });
        notifySuccess("Gasto actualizado");
      } else {
        await expensesService.create({
          description: description.trim(),
          amount,
          date: new Date(date).toISOString(),
          categoryId,
        });
        notifySuccess("Gasto agregado");
      }

      resetForm(categories);
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
        <label className="label" htmlFor="expense-description">
          Descripcion
        </label>
        <input
          id="expense-description"
          className="input"
          placeholder="Ej: Supermercado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="label" htmlFor="expense-amount">
            Monto
          </label>
          <input
            id="expense-amount"
            className="input"
            type="number"
            placeholder="0"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="expense-date">
            Fecha
          </label>
          <input
            id="expense-date"
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label" htmlFor="expense-category">
          Categoria
        </label>
        <select
          id="expense-category"
          className="input"
          value={categoryId || ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="flex justify-end gap-2">
        {editingExpense && (
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
          {loading ? "Guardando..." : editingExpense ? "Actualizar gasto" : "Agregar gasto"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
