import type { IIncomeResponseDto } from "../../../interfaces/income.interfaces";
import { notifySuccess } from "../../../utils/notify";
import { useCurrency } from "../../../app/providers/CurrencyContext";

export interface IIncomesListProps {
  items: IIncomeResponseDto[];
  onDelete: (id: number) => void;
  onEdit: (item: IIncomeResponseDto) => void;
}

const IncomesList = ({ items, onDelete, onEdit }: IIncomesListProps) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="table-base">
        <thead className="bg-slate-50">
          <tr>
            <th className="table-head-cell">Fecha</th>
            <th className="table-head-cell">Descripcion</th>
            <th className="table-head-cell text-right">Monto</th>
            <th className="table-head-cell"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr className="table-row">
              <td className="table-cell text-sm text-slate-600" colSpan={4}>
                No hay ingresos registrados.
              </td>
            </tr>
          )}
          {items.map((x) => (
            <tr key={x.id} className="table-row">
              <td className="table-cell">{new Date(x.date).toLocaleDateString()}</td>
              <td className="table-cell">{x.description}</td>
              <td className="table-cell text-right font-semibold text-slate-900">{formatCurrency(x.amount)}</td>
              <td className="table-cell text-right space-x-2">
                <button className="btn-secondary px-3 py-1.5" onClick={() => onEdit(x)}>
                  Editar
                </button>
                <button
                  className="btn-ghost px-3 py-1.5 text-rose-700 hover:text-rose-800"
                  onClick={() => {
                    onDelete(x.id);
                    notifySuccess("Ingreso eliminado");
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomesList;
