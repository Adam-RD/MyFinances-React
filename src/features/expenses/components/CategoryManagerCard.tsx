import CategoryForm from "../../categories/components/CategoryForm";
import CategoriesList from "../../categories/components/CategoriesList";
import type { ICategory } from "../../../interfaces/category.interfaces";

interface CategoryManagerCardProps {
  categories: ICategory[];
  pagedCategories: ICategory[];
  categoryError: string | null;
  editingCategory: ICategory | null;
  categoryStart: number;
  categoryPageSize: number;
  currentCategoryPage: number;
  totalCategoryPages: number;
  onSavedCategory: () => void;
  onEditCategory: (category: ICategory) => void;
  onCancelEdit: () => void;
  onDeleteCategory: (id: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const CategoryManagerCard = ({
  categories,
  pagedCategories,
  categoryError,
  editingCategory,
  categoryStart,
  categoryPageSize,
  currentCategoryPage,
  totalCategoryPages,
  onSavedCategory,
  onEditCategory,
  onCancelEdit,
  onDeleteCategory,
  onPrevPage,
  onNextPage,
}: CategoryManagerCardProps) => (
  <div className="card card-padding space-y-3">
    <h2 className="text-lg font-semibold text-slate-900">Crear categoria</h2>
    <p className="text-sm text-slate-600">Agrega categorias nuevas para tus gastos.</p>
    <CategoryForm editing={editingCategory} onCancelEdit={onCancelEdit} onSaved={onSavedCategory} />
    {categoryError && <p className="error-text">{categoryError}</p>}
    <CategoriesList items={pagedCategories} onEdit={onEditCategory} onDelete={onDeleteCategory} />
    <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Mostrando {categories.length === 0 ? 0 : categoryStart + 1}-
        {Math.min(categoryStart + categoryPageSize, categories.length)} de {categories.length}
      </p>
      <div className="flex items-center gap-2">
        <button className="btn-secondary px-3 py-1 text-xs" onClick={onPrevPage} disabled={currentCategoryPage === 1}>
          Anterior
        </button>
        <span className="text-xs font-semibold text-slate-700">
          {currentCategoryPage} / {totalCategoryPages}
        </span>
        <button
          className="btn-secondary px-3 py-1 text-xs"
          onClick={onNextPage}
          disabled={currentCategoryPage === totalCategoryPages || categories.length === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
);

export default CategoryManagerCard;
