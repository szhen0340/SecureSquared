import Link from "next/link";

export default function UnderConstruction() {
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
          There's nothing to see here.
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
          Under <span className="text-emerald-400">Construction</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-6">
          I got too lazy to make another challenge.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium"
          >
            Check Out Other Challenges
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-zinc-700 hover:bg-zinc-800 text-white rounded-lg font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
