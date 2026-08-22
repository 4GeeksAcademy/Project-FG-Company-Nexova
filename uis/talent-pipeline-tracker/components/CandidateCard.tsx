import Link from "next/link";
import type { Candidate } from "@/types/candidate";

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-blue-300"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 truncate">
            {candidate.full_name}
          </h3>
          <p className="text-sm text-zinc-500 mt-0.5">{candidate.position}</p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusBadgeClass(candidate.status)
            }`}
          >
            {statusLabel(candidate.status)}
          </span>
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {stageLabel(candidate.stage)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function statusBadgeClass(status: Candidate["status"]): string {
  switch (status) {
    case "received":
      return "bg-blue-50 text-blue-700";
    case "in_progress":
      return "bg-amber-50 text-amber-700";
    case "discarded":
      return "bg-red-50 text-red-700";
    case "selected":
      return "bg-green-50 text-green-700";
  }
}

function statusLabel(status: Candidate["status"]): string {
  switch (status) {
    case "received":
      return "Recibido";
    case "in_progress":
      return "En progreso";
    case "discarded":
      return "Descartado";
    case "selected":
      return "Seleccionado";
  }
}

function stageLabel(stage: Candidate["stage"]): string {
  switch (stage) {
    case "pending":
      return "Pendiente";
    case "review":
      return "Revisión";
    case "personal_interview":
      return "Entrevista personal";
    case "technical_interview":
      return "Entrevista técnica";
  }
}