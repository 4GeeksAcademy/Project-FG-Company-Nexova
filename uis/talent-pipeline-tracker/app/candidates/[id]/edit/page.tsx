"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ApiClientError, getRecord, updateRecord } from "@/lib/api";

interface CandidateFormData {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: string;
}

const EMPTY_FORM: CandidateFormData = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  experience_years: "0",
};

export default function EditCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<CandidateFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidate() {
      setLoading(true);
      setError(null);
      try {
        const candidate = await getRecord(id);
        if (!cancelled) {
          setForm({
            full_name: candidate.full_name,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            experience_years: String(candidate.experience_years),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? `Error del servidor (${err.status})`
              : "No se pudo cargar el candidato"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCandidate();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateRecord(id, {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position.trim(),
        experience_years: Number(form.experience_years),
      });
      router.push(`/candidates/${id}`);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})`
          : "No se pudo guardar el candidato"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
            <Link
              href={`/candidates/${id}`}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              &larr; Volver al candidato
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <p className="text-sm text-zinc-500">Cargando datos del candidato...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          <Link
            href={`/candidates/${id}`}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
          >
            &larr; Volver al candidato
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Editar candidato</h1>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Nombre completo</span>
            <input
              required
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Teléfono</span>
            <input
              required
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Posición</span>
            <input
              required
              value={form.position}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, position: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Años de experiencia</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.experience_years}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, experience_years: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <Link
              href={`/candidates/${id}`}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}