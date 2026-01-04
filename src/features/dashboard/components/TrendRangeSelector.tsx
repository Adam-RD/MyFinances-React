import type { TimeRange } from "../types";

interface TrendRangeSelectorProps {
  timeRange: TimeRange;
  onChange: (range: TimeRange) => void;
  label: string;
}

const TrendRangeSelector = ({ timeRange, onChange, label }: TrendRangeSelectorProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {(["7d", "30d", "3m", "6m", "12m"] as TimeRange[]).map((range) => {
      const text =
        range === "7d" ? "7d" : range === "30d" ? "30d" : `Ultimos ${range.replace("m", "")}m`;
      return (
        <button
          key={range}
          className={`btn-secondary px-3 py-1 text-xs ${
            timeRange === range ? "border-indigo-500 text-indigo-700" : ""
          }`}
          onClick={() => onChange(range)}
        >
          {text}
        </button>
      );
    })}
    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
      {label}
    </span>
  </div>
);

export default TrendRangeSelector;
