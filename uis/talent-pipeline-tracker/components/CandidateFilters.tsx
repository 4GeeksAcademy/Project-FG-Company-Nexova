"use client";

import { useCallback } from "react";
import type { CandidateStatus, CandidateStage } from "@/types/candidate";

export interface Filters {
  search: string;
  status: "" | CandidateStatus;
  stage: "" | CandidateStage;
}

interface CandidateFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const STATUS_OPTIONS: { value: "" | CandidateStatus; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "received", label: "Recibido" },
  { value: "in_progress", label: "En progreso" },
  { value: "discarded", label: "Descartado" },
  { value: "selected", label: "Seleccionado" },
];

const STAGE_OPTIONS: { value: "" | CandidateStage; label: string }[] = [
  { value: "", label: "Todas las etapas" },
  { value: "pending", label: "Pendiente" },
  { value: "review", label: "Revisión" },
  { value: "personal_interview", label: "Entrevista personal" },
  { value: "technical_interview", label: "Entrevista técnica" },
];

export default function CandidateFilters({
  filters,
  onChange,
}: CandidateFiltersProps) {
  const setSearch = useCallback(
    (search: string) => onChange({ ...filters, search }),
    [filters, onChange]
  );

  const setStatus = useCallback(
    (status: "" | CandidateStatus) => onChange({ ...filters, status }),
    [filters, onChange]
  );

  const setStage = useCallback(
    (stage: "" | CandidateStage) => onChange({ ...filters, stage }),
    [filters, onChange]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Buscar por nombre, email o cargo..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <select
        value={filters.status}
        onChange={(e) => setStatus(e.target.value as "" | CandidateStatus)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.stage}
        onChange={(e) => setStage(e.target.value as "" | CandidateStage)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {STAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}