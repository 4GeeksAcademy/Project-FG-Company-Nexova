import CandidateList from "@/components/CandidateList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-zinc-900">
            Talent Pipeline Tracker
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Nexova Solutions &middot; Operaciones de Selección
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <CandidateList />
      </main>
    </div>
  );
}
