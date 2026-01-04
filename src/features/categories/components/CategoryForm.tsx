import { useEffect, useState } from "react";
import { categoriesService } from "../../../services/categories.service";
import { mapApiError } from "../../../services/http";
import type { ICategory } from "../../../interfaces/category.interfaces";
import { notifyError, notifySuccess } from "../../../utils/notify";

export interface ICategoryFormProps {
  onSaved: () => void;
  editing?: ICategory | null;
  onCancelEdit?: () => void;
}

const CategoryForm = ({ onSaved, editing, onCancelEdit }: ICategoryFormProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(editing?.name ?? "");
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      if (editing) {
        await categoriesService.update(editing.id, { name: name.trim() });
        notifySuccess("Categoria actualizada");
      } else {
        await categoriesService.create({ name: name.trim() });
        notifySuccess("Categoria creada");
      }
      setName("");
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
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="label" htmlFor="category-name">
            {editing ? "Editar categoria" : "Nueva categoria"}
          </label>
          <input
            id="category-name"
            className="input"
            placeholder="Ej: Hogar"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {editing && (
            <button
              type="button"
              className="btn-secondary sm:w-auto"
              onClick={() => {
                setName("");
                onCancelEdit?.();
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button className="btn-primary sm:w-auto" disabled={loading}>
            {loading ? "Guardando..." : editing ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default CategoryForm;
