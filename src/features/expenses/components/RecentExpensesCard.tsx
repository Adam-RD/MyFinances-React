import ExpensesList from "./ExpensesList";
import ExportActions from "../../../components/export/ExportActions";
import type { IExpenseResponseDto } from "../../../interfaces/expense.interfaces";

interface RecentExpensesCardProps {
  items: IExpenseResponseDto[];
  pagedItems: IExpenseResponseDto[];
  expenseError: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onEdit: (item: IExpenseResponseDto) => void;
  onDelete: (id: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const RecentExpensesCard = ({
  items,
  pagedItems,
  expenseError,
  currentPage,
  totalPages,
  pageSize,
  onEdit,
  onDelete,
  onPrevPage,
  onNextPage,
}: RecentExpensesCardProps) => (
  <div className="card card-padding space-y-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Gastos recientes</h2>
        <p className="text-xs text-slate-600">Exporta o imprime tus movimientos.</p>
      </div>
      <ExportActions data={items} fileLabel="gastos" includeCategory />
    </div>
    {expenseError && <p className="error-text">{expenseError}</p>}
    <ExpensesList items={pagedItems} onDelete={onDelete} onEdit={onEdit} />

    <div className="flex items-center justify-between text-sm text-slate-600">
      <span>
        Mostrando {pagedItems.length} de {items.length} gastos ({pageSize} mas recientes)
      </span>
      <div className="flex items-center gap-2">
        <button className="btn-secondary px-3 py-1 text-xs" onClick={onPrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span className="text-xs font-semibold text-slate-700">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn-secondary px-3 py-1 text-xs"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
);

export default RecentExpensesCard;
