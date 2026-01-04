import { useRef, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import type { IExpenseResponseDto } from "../../../interfaces/expense.interfaces";

interface EditExpenseCardProps {
  editingExpense: IExpenseResponseDto;
  reloadCategoriesKey: number;
  onClose: () => void;
  onSaved: () => void;
}

const EditExpenseCard = ({ editingExpense, reloadCategoriesKey, onClose, onSaved }: EditExpenseCardProps) => {
  const editSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editSectionRef.current) {
      editSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = editSectionRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, []);

  return (
    <div ref={editSectionRef} className="card card-padding space-y-3 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Editar gasto</h3>
          <p className="text-sm text-slate-600">
            Estas editando: <span className="font-semibold">{editingExpense.description}</span>
          </p>
        </div>
        <button className="btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <ExpenseForm
        onCreated={onSaved}
        reloadCategoriesKey={reloadCategoriesKey}
        editingExpense={editingExpense}
        onCancelEdit={onClose}
      />
    </div>
  );
};

export default EditExpenseCard;
