import { useEffect, useRef, useState } from "react";
import { incomesService } from "../../../services/incomes.service";
import type { IIncomeResponseDto, IIncomeSummaryDto } from "../../../interfaces/income.interfaces";
import { mapApiError } from "../../../services/http";
import Spinner from "../../../components/ui/Spinner";
import IncomeForm from "../components/IncomeForm";
import IncomesList from "../components/IncomesList";
import IncomesSummaryCard from "../components/IncomesSummaryCard";
import ExportActions from "../../../components/export/ExportActions";
import { useBalance } from "../../../app/providers/BalanceContext";

const IncomesPage = () => {
  const pageSize = 5;
  const [items, setItems] = useState<IIncomeResponseDto[]>([]);
  const [summary, setSummary] = useState<IIncomeSummaryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIncome, setEditingIncome] = useState<IIncomeResponseDto | null>(null);
  const { refreshBalance } = useBalance();
  const editSectionRef = useRef<HTMLDivElement | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [incomeList, summaryData] = await Promise.all([
        incomesService.getAll(),
        incomesService.summary(),
      ]);

      const sorted = [...incomeList].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setError(null);
      setSummaryError(null);
      setItems(sorted);
      setSummary(summaryData);
      setCurrentPage(1);
      void refreshBalance();
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
      setSummaryError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      setError(null);
      await incomesService.remove(id);
      await refreshData();
    } catch (err) {
      const msg = mapApiError(err).message;
      setError(msg);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  useEffect(() => {
    if (editingIncome && editSectionRef.current) {
      editSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = editSectionRef.current.querySelector("input");
      firstInput?.focus();
    }
  }, [editingIncome]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const start = (currentPage - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" text="Cargando ingresos..." />
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Ingresos</h1>
        <p className="text-sm text-slate-600">Lleva el control de tu dinero entrante.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-padding space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Agregar ingreso</h2>
          <p className="text-sm text-slate-600">Captura tus ingresos recientes.</p>
          <IncomeForm
            onCreated={() => {
              setEditingIncome(null);
              void refreshData();
            }}
            editingIncome={editingIncome}
            onCancelEdit={() => setEditingIncome(null)}
          />
        </div>

        <div className="lg:col-span-2 card card-padding space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ingresos recientes</h2>
              <p className="text-sm text-slate-600">Ultimos {pageSize} ingresos registrados.</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Paginado
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-600">Exporta o imprime tus ingresos.</p>
            <ExportActions data={items} fileLabel="ingresos" />
          </div>

          {error && <p className="error-text">{error}</p>}
          <IncomesList
            items={pagedItems}
            onDelete={onDelete}
            onEdit={(item) => setEditingIncome(item)}
          />

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Mostrando {pagedItems.length} de {items.length} ingresos (5 mas recientes)
            </span>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary px-3 py-1 text-xs"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-xs font-semibold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                className="btn-secondary px-3 py-1 text-xs"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {editingIncome && (
          <div ref={editSectionRef} className="lg:col-span-3 card card-padding space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Editar ingreso</h3>
                <p className="text-sm text-slate-600">
                  Estas editando: <span className="font-semibold">{editingIncome.description}</span>
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setEditingIncome(null)}>
                Cerrar
              </button>
            </div>
            <IncomeForm
              onCreated={() => {
                setEditingIncome(null);
                void refreshData();
              }}
              editingIncome={editingIncome}
              onCancelEdit={() => setEditingIncome(null)}
            />
          </div>
        )}
        <div className="lg:col-span-3">
          <IncomesSummaryCard summary={summary} error={summaryError} />
        </div>
      </div>
    </div>
  );
};

export default IncomesPage;
