/**
 * Nexova Recruitment Domain — Validation Utilities
 *
 * Runtime validation for untrusted candidate data entering the Nexova system.
 * Operates on `unknown` input — the boundary between external data and
 * the trusted domain model.
 *
 * No React, Next.js, or browser API coupling.
 * No exceptions for ordinary invalid business data — returns errors array.
 */

import type { CandidateStage, CandidateStatus } from "../types/models";

// ── Result Type ─────────────────────────────────────────────────

export interface CandidateValidationResult {
  valid: boolean;
  errors: string[];
}

// ── Internal Type Guards ───────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCandidateStatus(value: unknown): value is CandidateStatus {
  return (
    value === "received" ||
    value === "in_progress" ||
    value === "discarded" ||
    value === "selected"
  );
}

function isCandidateStage(value: unknown): value is CandidateStage {
  return (
    value === "pending" ||
    value === "review" ||
    value === "personal_interview" ||
    value === "technical_interview"
  );
}

function isValidDateString(value: unknown): boolean {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  const timestamp = Date.parse(value.trim());
  return !Number.isNaN(timestamp);
}

// ── Note Validation ─────────────────────────────────────────────

/**
 * Validate a single CandidateNote-like object.
 * Returns an array of error messages (empty = valid).
 */
export function validateCandidateNote(note: unknown): string[] {
  const errors: string[] = [];

  if (note === null || note === undefined || typeof note !== "object") {
    errors.push("Note must be a non-null object");
    return errors;
  }

  const obj = note as Record<string, unknown>;

  const requiredStringFields = ["id", "record_id", "content", "created_at"] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(obj[field])) {
      errors.push(`Note.${field} must be a non-empty string`);
    }
  }

  if (obj.created_at !== undefined && !isValidDateString(obj.created_at)) {
    errors.push("Note.created_at must be a valid date string");
  }

  return errors;
}

// ── Candidate Validation ────────────────────────────────────────

/**
 * Validate a runtime candidate object against Nexova domain rules.
 *
 * Accepts `unknown` because this is the boundary between untrusted
 * external data and the trusted domain model. Returns a result object
 * containing a `valid` flag and an array of error messages.
 *
 * Never throws for ordinary invalid business data.
 */
export function validateCandidate(input: unknown): CandidateValidationResult {
  const errors: string[] = [];

  // ── Object shape ──────────────────────────────────────────────

  if (input === null || input === undefined || typeof input !== "object") {
    errors.push("Input must be a non-null object");
    return { valid: false, errors };
  }

  const obj = input as Record<string, unknown>;

  // ── Required string fields ────────────────────────────────────

  const requiredStringFields = [
    "id",
    "full_name",
    "email",
    "phone",
    "position",
    "linkedin_url",
    "cv_url",
    "applied_at",
    "updated_at",
  ] as const;

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(obj[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  // ── Email minimal structural check ────────────────────────────

  if (isNonEmptyString(obj.email) && !obj.email.includes("@")) {
    errors.push("email must contain an @ separator");
  }

  // ── experience_years ──────────────────────────────────────────

  if (typeof obj.experience_years !== "number" || !Number.isFinite(obj.experience_years)) {
    errors.push("experience_years must be a finite number");
  } else if (obj.experience_years < 0) {
    errors.push("experience_years must be >= 0");
  }

  // ── notes_count ───────────────────────────────────────────────

  if (typeof obj.notes_count !== "number" || !Number.isInteger(obj.notes_count)) {
    errors.push("notes_count must be an integer");
  } else if (obj.notes_count < 0) {
    errors.push("notes_count must be >= 0");
  }

  // ── status ────────────────────────────────────────────────────

  if (!isCandidateStatus(obj.status)) {
    errors.push(
      "status must be one of: received, in_progress, discarded, selected"
    );
  }

  // ── stage ─────────────────────────────────────────────────────

  if (!isCandidateStage(obj.stage)) {
    errors.push(
      "stage must be one of: pending, review, personal_interview, technical_interview"
    );
  }

  // ── Date validation ───────────────────────────────────────────

  if (isNonEmptyString(obj.applied_at) && !isValidDateString(obj.applied_at)) {
    errors.push("applied_at must be a valid date string");
  }

  if (isNonEmptyString(obj.updated_at) && !isValidDateString(obj.updated_at)) {
    errors.push("updated_at must be a valid date string");
  }

  // ── Date coherence: updated_at >= applied_at ──────────────────

  if (isNonEmptyString(obj.applied_at) && isNonEmptyString(obj.updated_at)) {
    const applied = Date.parse(obj.applied_at.trim());
    const updated = Date.parse(obj.updated_at.trim());

    if (!Number.isNaN(applied) && !Number.isNaN(updated) && updated < applied) {
      errors.push("updated_at must not be earlier than applied_at");
    }
  }

  // ── Notes validation ──────────────────────────────────────────

  if (obj.notes !== undefined) {
    if (!Array.isArray(obj.notes)) {
      errors.push("notes must be an array");
    } else {
      for (let i = 0; i < obj.notes.length; i++) {
        const noteErrors = validateCandidateNote(obj.notes[i]);

        for (const noteErr of noteErrors) {
          errors.push(`notes[${i}]: ${noteErr}`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}