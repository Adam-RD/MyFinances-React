import ExpenseForm from "./ExpenseForm";
import type { IExpenseResponseDto } from "../../../interfaces/expense.interfaces";

interface ExpenseFormCardProps {
  editingExpense: IExpenseResponseDto | null;
  onCreated: () => void;
  reloadCategoriesKey: number;
  onCancelEdit: () => void;
}

const ExpenseFormCard = ({ editingExpense, onCreated, reloadCategoriesKey, onCancelEdit }: ExpenseFormCardProps) => (
  <div className="card card-padding space-y-3">
    <h2 className="text-lg font-semibold text-slate-900">Agregar gasto</h2>
    <p className="text-sm text-slate-600">Captura un nuevo movimiento.</p>
    <ExpenseForm
      onCreated={onCreated}
      reloadCategoriesKey={reloadCategoriesKey}
      editingExpense={editingExpense}
      onCancelEdit={onCancelEdit}
    />
  </div>
);

export default ExpenseFormCard;
