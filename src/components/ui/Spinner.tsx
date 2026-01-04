type SpinnerSize = "sm" | "md" | "lg";

const sizes: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
};

interface SpinnerProps {
  size?: SpinnerSize;
  text?: string;
}

const Spinner = ({ size = "md", text }: SpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-slate-300 border-t-indigo-600 ${sizes[size]}`}
      />
      {text && <span className="text-sm text-slate-600">{text}</span>}
    </div>
  );
};

export default Spinner;
