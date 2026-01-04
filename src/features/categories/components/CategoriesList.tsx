import type { ICategory } from "../../../interfaces/category.interfaces";

export interface ICategoriesListProps {
  items: ICategory[];
  onDelete: (id: number) => void;
  onEdit: (item: ICategory) => void;
}

const CategoriesList = ({ items, onDelete, onEdit }: ICategoriesListProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Categorias existentes</h3>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
        {items.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-600">Aun no hay categorias creadas.</li>
        )}
        {items.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm font-medium text-slate-800">{c.name}</span>
            <div className="flex gap-2">
              <button className="btn-secondary px-3 py-1.5" onClick={() => onEdit(c)}>
                Editar
              </button>
              <button
                className="btn-ghost px-3 py-1.5 text-rose-700 hover:text-rose-800"
                onClick={() => onDelete(c.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
