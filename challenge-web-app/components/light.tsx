export default function Light() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-zinc-800/20 blur-3xl"></div>
      <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-zinc-800/30 blur-3xl"></div>
    </div>
  );
}
