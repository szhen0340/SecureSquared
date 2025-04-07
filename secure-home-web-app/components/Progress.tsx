export default function Progress({
  text,
  percentage,
}: {
  text: string;
  percentage: number;
}) {
  percentage = percentage ?? 0;

  return (
    <div className="w-full">
      {text && <div className="text-sm text-zinc-400 mb-1">{text}</div>}
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(100, percentage * 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
