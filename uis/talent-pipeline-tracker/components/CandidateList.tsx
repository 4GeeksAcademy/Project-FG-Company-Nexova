"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Candidate, CandidateStage, CandidateStatus } from "@/types/candidate";
import { getRecords, ApiClientError } from "@/lib/api";
import CandidateCard from "./CandidateCard";
import CandidateFilters, { type Filters } from "./CandidateFilters";

const DEBOUNCE_MS = 400;
const VALID_STATUS: CandidateStatus[] = ["received", "in_progress", "discarded", "selected"];
const VALID_STAGE: CandidateStage[] = ["pending", "review", "personal_interview", "technical_interview"];

function toValidStatus(value: string | null): "" | CandidateStatus {
  if (value && VALID_STATUS.includes(value as CandidateStatus)) {
    return value as CandidateStatus;
  }
  return "";
}

function toValidStage(value: string | null): "" | CandidateStage {
  if (value && VALID_STAGE.includes(value as CandidateStage)) {
    return value as CandidateStage;
  }
  return "";
}

export default function CandidateList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo<Filters>(
    () => ({
      search: searchParams.get("search") ?? "",
      status: toValidStatus(searchParams.get("status")),
      stage: toValidStage(searchParams.get("stage")),
    }),
    [searchParams]
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  function updateUrl(nextFilters: Filters) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFilters.search.trim()) {
      params.set("search", nextFilters.search.trim());
    } else {
      params.delete("search");
    }

    if (nextFilters.status) {
      params.set("status", nextFilters.status);
    } else {
      params.delete("status");
    }

    if (nextFilters.stage) {
      params.set("stage", nextFilters.stage);
    } else {
      params.delete("stage");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // Debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch whenever debouncedSearch, status, or stage changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await getRecords({
          page: 1,
          limit: 100,
          search: debouncedSearch || undefined,
          status: filters.status || undefined,
          stage: filters.stage || undefined,
        });
        if (!cancelled) setCandidates(response.data);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiClientError
              ? `Error del servidor (${err.status})`
              : err instanceof Error
                ? err.message
                : "Error al cargar candidatos";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filters.status, filters.stage, retryKey]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-3 text-zinc-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Cargando candidatos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={() => setRetryKey((k) => k + 1)}
          className="mt-3 text-sm font-medium text-red-700 underline hover:no-underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CandidateFilters filters={filters} onChange={updateUrl} />
      {candidates.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="text-zinc-500">No hay candidatos registrados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}