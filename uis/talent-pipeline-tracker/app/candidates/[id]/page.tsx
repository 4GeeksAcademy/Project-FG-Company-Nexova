"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Candidate } from "@/types/candidate";
import { getRecord, ApiClientError } from "@/lib/api";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecord(id);
        if (!cancelled) setCandidate(data);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiClientError
              ? `Error del servidor (${err.status})`
              : err instanceof Error
                ? err.message
                : "Error al cargar candidato";
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <HeaderBackLink />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3 text-zinc-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Cargando candidato...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <HeaderBackLink />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-red-700 underline hover:no-underline">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <HeaderBackLink />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Candidate info card */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                {candidate.full_name}
              </h1>
              <p className="text-lg text-zinc-500 mt-1">{candidate.position}</p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  statusBadgeClass(candidate.status)
                }`}
              >
                {statusLabel(candidate.status)}
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600">
                {stageLabel(candidate.stage)}
              </span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</dt>
              <dd className="mt-1 text-sm text-zinc-900">{candidate.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Teléfono</dt>
              <dd className="mt-1 text-sm text-zinc-900">{candidate.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Años de experiencia</dt>
              <dd className="mt-1 text-sm text-zinc-900">{candidate.experience_years}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Fecha de aplicación</dt>
              <dd className="mt-1 text-sm text-zinc-900">
                {new Date(candidate.applied_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-3">
            {candidate.linkedin_url && (
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                LinkedIn →
              </a>
            )}
            {candidate.cv_url && (
              <a
                href={candidate.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver CV →
              </a>
            )}
          </div>
        </div>

        {/* Notes section */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            Notas ({candidate.notes_count})
          </h2>
          {candidate.notes && candidate.notes.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {candidate.notes.map((note) => (
                <li key={note.id} className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700">
                  <p>{note.content}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(note.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No hay notas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderBackLink() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-700">
          &larr; Volver al listado
        </Link>
      </div>
    </header>
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