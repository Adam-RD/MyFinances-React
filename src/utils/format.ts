export const formatCurrency = (
  value?: number | null,
  currency: string = "DOP",
  locale: string = "es-DO"
) =>
  typeof value === "number"
    ? value.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      })
    : "-";
