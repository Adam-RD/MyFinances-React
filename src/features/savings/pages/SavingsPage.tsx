import { useEffect, useMemo, useRef, useState } from "react";
import type { ISavingEntry } from "../../../interfaces/savings.interfaces";
import { savingsService } from "../../../services/savings.service";
import SavingsForm from "../components/SavingsForm";
import SavingsList from "../components/SavingsList";
import SavingsSummaryCard from "../components/SavingsSummaryCard";
import Spinner from "../../../components/ui/Spinner";
import { useBalance } from "../../../app/providers/BalanceContext";

const ITEMS_PER_PAGE = 5;

const SavingsPage = () => {
  const [items, setItems] = useState<ISavingEntry[]>([]);
  const [editingSaving, setEditingSaving] = useState<ISavingEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const { refreshBalance } = useBalance();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await savingsService.getAll();
      setItems(data);
      void refreshBalance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (editingSaving && editSectionRef.current) {
      editSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = editSectionRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, [editingSaving]);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const handleDelete = async (id: number) => {
    await savingsService.remove(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" text="Cargando ahorros..." />
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Ahorros</h1>
        <p className="text-sm text-slate-600">Registra apartados de ahorro para tu cuenta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-padding space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Agregar ahorro</h2>
          <p className="text-sm text-slate-600">Captura aportes que quieres destinar a tus ahorros.</p>
          <SavingsForm
            editingSaving={editingSaving}
            onCancelEdit={() => setEditingSaving(null)}
            onSaved={() => {
              setEditingSaving(null);
              void refresh();
            }}
          />
        </div>

        <div className="lg:col-span-2 card card-padding space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ahorros guardados</h2>
              <p className="text-sm text-slate-600">Movimientos asociados a tu usuario.</p>
            </div>
          </div>
          <SavingsList
            items={paginatedItems}
            onEdit={(item) => setEditingSaving(item)}
            onDelete={(id) => {
              void handleDelete(id);
            }}
          />
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {items.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, items.length)} de {items.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary px-3 py-1.5"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-sm font-semibold text-slate-700">
                Pagina {currentPage} de {totalPages}
              </span>
              <button
                className="btn-secondary px-3 py-1.5"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages || items.length === 0}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {editingSaving && (
          <div ref={editSectionRef} className="lg:col-span-3 card card-padding space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Editar ahorro</h3>
                <p className="text-sm text-slate-600">
                  Estas editando: <span className="font-semibold">{editingSaving.note || "Ahorro"}</span>
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setEditingSaving(null)}>
                Cerrar
              </button>
            </div>
            <SavingsForm
              editingSaving={editingSaving}
              onCancelEdit={() => setEditingSaving(null)}
              onSaved={() => {
                setEditingSaving(null);
                void refresh();
              }}
            />
          </div>
        )}

        <div className="lg:col-span-3">
          <SavingsSummaryCard items={items} />
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;
