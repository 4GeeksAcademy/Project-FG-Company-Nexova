"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRecord, ApiClientError } from "@/lib/api";

export default function NewCandidatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    experience_years: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const fullName = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const position = formData.position.trim();
    const experienceYears = Number(formData.experience_years);

    if (!fullName || !email || !phone || !position) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (Number.isNaN(experienceYears) || experienceYears < 0) {
      setError("Los años de experiencia deben ser un número válido mayor o igual a 0.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const candidate = await createRecord({
        full_name: fullName,
        email,
        phone,
        position,
        experience_years: experienceYears,
      });
      router.push(`/candidates/${candidate.id}`);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? `Error del servidor (${err.status})${getApiErrorDetail(err.body)}`
          : err instanceof Error
            ? err.message
            : "Error al crear candidato"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-700">
            &larr; Volver al listado
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Nuevo candidato</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Cargo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Años de experiencia
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.experience_years}
              onChange={(e) => handleChange("experience_years", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Crear candidato"}
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function getApiErrorDetail(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const maybeBody = body as { detail?: unknown; error?: unknown };
  if (typeof maybeBody.error === "string") return `: ${maybeBody.error}`;
  if (typeof maybeBody.detail === "string") return `: ${maybeBody.detail}`;
  return "";
}