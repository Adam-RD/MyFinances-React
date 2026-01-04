import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCurrency } from "../../app/providers/CurrencyContext";

export interface ExportItem {
  description: string;
  amount: number;
  date: string;
  categoryName?: string | null;
}

interface ExportActionsProps {
  data: ExportItem[];
  fileLabel: string;
  includeCategory?: boolean;
}

const downloadBlob = (content: BlobPart, fileName: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

const ExportActions = ({ data, fileLabel, includeCategory = false }: ExportActionsProps) => {
  const { currency, locale, formatCurrency } = useCurrency();
  const hasData = data.length > 0;
  const formatDate = (value: string) => new Date(value).toLocaleDateString(locale);

  const exportExcel = () => {
    const headers = ["Descripcion", `Monto (${currency})`, "Fecha", ...(includeCategory ? ["Categoria"] : [])];

    const rows = data.map((item) => [
      item.description ?? "",
      item.amount, // número real para Excel
      formatDate(item.date),
      ...(includeCategory ? [item.categoryName ?? "-"] : []),
    ]);

    // Hoja
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Ajuste de columnas (opcional)
    ws["!cols"] = headers.map((h) => ({ wch: Math.max(12, h.length + 2) }));

    // Libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    // Exportar a Blob (.xlsx)
    const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    downloadBlob(
      arrayBuffer,
      `${fileLabel}-export.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Reporte: ${fileLabel}`, 40, 40);

    const head = [["Descripcion", `Monto (${currency})`, "Fecha", ...(includeCategory ? ["Categoria"] : [])]];

    const body = data.map((item) => [
      item.description ?? "-",
      formatCurrency(item.amount),
      formatDate(item.date),
      ...(includeCategory ? [item.categoryName ?? "-"] : []),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 60,
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [238, 242, 255] }, // tono suave tipo indigo
      columnStyles: {
        1: { halign: "right" }, // Monto a la derecha
      },
      margin: { left: 40, right: 40 },
    });

    doc.save(`${fileLabel}-export.pdf`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={exportExcel}
        disabled={!hasData}
      >
        Exportar Excel
      </button>

      <button
        type="button"
        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={exportPdf}
        disabled={!hasData}
      >
        Descargar PDF
      </button>
    </div>
  );
};

export default ExportActions;
