"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Candidate, CandidateStatus, CandidateStage } from "@/types/candidate";
import { getRecord, getNotes, patchRecord, createNote, deleteNote, ApiClientError } from "@/lib/api";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState<Candidate["notes"]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecord(id);
        if (!cancelled) {
          setCandidate(data);
          setNotes(Array.isArray(data.notes) ? data.notes : []);
        }
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

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      setNotesLoading(true);
      setNotesError(null);
      try {
        const response = await getNotes(id);
        if (!cancelled) setNotes(response.data);
      } catch (err) {
        if (!cancelled) {
          setNotesError(
            err instanceof ApiClientError
              ? `Error del servidor (${err.status})`
              : "Error al cargar notas"
          );
        }
      } finally {
        if (!cancelled) setNotesLoading(false);
      }
    }

    loadNotes();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = useCallback(async (newStatus: CandidateStatus) => {
    if (!candidate || updating || candidate.status === newStatus) return;
    setUpdating(true);
    setUpdateError(null);
    setSuccessMessage(null);
    try {
      const updated = await patchRecord(id, { status: newStatus });
      setCandidate(updated);
      setSuccessMessage("Estado actualizado correctamente.");
    } catch (err) {
      setUpdateError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})`
          : "Error al actualizar estado"
      );
    } finally {
      setUpdating(false);
    }
  }, [id, candidate, updating]);

  const handleStageChange = useCallback(async (newStage: CandidateStage) => {
    if (!candidate || updating || candidate.stage === newStage) return;
    setUpdating(true);
    setUpdateError(null);
    setSuccessMessage(null);
    try {
      const updated = await patchRecord(id, { stage: newStage });
      setCandidate(updated);
      setSuccessMessage("Etapa actualizada correctamente.");
    } catch (err) {
      setUpdateError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})`
          : "Error al actualizar etapa"
      );
    } finally {
      setUpdating(false);
    }
  }, [id, candidate, updating]);

  const handleAddNote = useCallback(async () => {
    if (!candidate || savingNote || !noteText.trim()) return;
    setSavingNote(true);
    setUpdateError(null);
    setSuccessMessage(null);
    try {
      await createNote(id, { content: noteText.trim() });
      setNoteText("");
      const [candidateData, notesData] = await Promise.all([
        getRecord(id),
        getNotes(id),
      ]);
      setCandidate(candidateData);
      setNotes(notesData.data);
      setSuccessMessage("Nota añadida correctamente.");
    } catch (err) {
      setUpdateError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})`
          : "Error al añadir nota"
      );
    } finally {
      setSavingNote(false);
    }
  }, [id, candidate, noteText, savingNote]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (deletingNoteId) return;
    setDeletingNoteId(noteId);
    setUpdateError(null);
    setSuccessMessage(null);
    try {
      await deleteNote(id, noteId);
      const [candidateData, notesData] = await Promise.all([
        getRecord(id),
        getNotes(id),
      ]);
      setCandidate(candidateData);
      setNotes(notesData.data);
      setSuccessMessage("Nota eliminada correctamente.");
    } catch (err) {
      setUpdateError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})`
          : "Error al eliminar nota"
      );
    } finally {
      setDeletingNoteId(null);
    }
  }, [id, deletingNoteId]);

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

  if (!candidate) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <HeaderBackLink />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center">
            <p className="text-zinc-800 font-medium">Candidato no disponible</p>
            <p className="text-zinc-500 text-sm mt-1">No se encontró información para este registro.</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Link
              href={`/candidates/${candidate.id}/edit`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Editar perfil
            </Link>
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

        {/* Status / Stage update card */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            Actualizar estado
          </h2>
          {updateError && (
            <p className="mt-2 text-sm text-red-600">{updateError}</p>
          )}
          {successMessage && (
            <p className="mt-2 text-sm text-green-700">{successMessage}</p>
          )}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                Estado
              </label>
              <select
                value={candidate.status}
                onChange={(e) => handleStatusChange(e.target.value as CandidateStatus)}
                disabled={updating}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="received">Recibido</option>
                <option value="in_progress">En progreso</option>
                <option value="discarded">Descartado</option>
                <option value="selected">Seleccionado</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                Etapa
              </label>
              <select
                value={candidate.stage}
                onChange={(e) => handleStageChange(e.target.value as CandidateStage)}
                disabled={updating}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="pending">Pendiente</option>
                <option value="review">Revisión</option>
                <option value="personal_interview">Entrevista personal</option>
                <option value="technical_interview">Entrevista técnica</option>
              </select>
            </div>
            {updating && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Actualizando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes section */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">
            Notas ({candidate.notes_count})
          </h2>

          {/* Add note form */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Añadir una nota..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !savingNote) handleAddNote(); }}
              disabled={savingNote}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNote}
              disabled={savingNote || !noteText.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {savingNote ? "Guardando..." : "Añadir"}
            </button>
          </div>

          {notesLoading ? (
            <p className="mt-4 text-sm text-zinc-500">Cargando notas...</p>
          ) : notesError ? (
            <p className="mt-4 text-sm text-red-600">{notesError}</p>
          ) : notes && notes.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="flex items-start justify-between rounded-md bg-zinc-50 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700">{note.content}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {new Date(note.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={Boolean(deletingNoteId)}
                    className="ml-2 shrink-0 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    {deletingNoteId === note.id ? "..." : "Eliminar"}
                  </button>
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