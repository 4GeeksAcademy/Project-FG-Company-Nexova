/**
 * Nexova Recruitment Domain — Domain Models
 *
 * Core domain types for Nexova's Recruitment Operations pipeline.
 * Pure TypeScript — no React, Next.js, browser API, or HTTP client coupling.
 *
 * Compatibility note:
 * These types intentionally mirror the existing Talent Pipeline Tracker
 * (uis/talent-pipeline-tracker/types/candidate.ts) interface where the same
 * business entity is represented. The root models layer adds domain-pure
 * separation without changing the verified candidate contract from the UI.
 * Both definitions describe the same Nexova candidate — they are kept
 * consistent to avoid drift.
 *
 * Architecture rules:
 * - No `any`, no methods performing business processing.
 * - Reusable across all Nexova domain logic (utils, services, agents).
 * - Describes one entity per interface/type.
 */

// ── Value / Union Types ──────────────────────────────────────────

export type CandidateStatus =
  | "received"
  | "in_progress"
  | "discarded"
  | "selected";

export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview";

// ── Entity: CandidateNote ───────────────────────────────────────

/** A note attached to a candidate record. */
export interface CandidateNote {
  readonly id: string;
  readonly record_id: string;
  readonly content: string;
  readonly created_at: string;
}

// ── Entity: Candidate ───────────────────────────────────────────

/** A person going through Nexova's recruitment pipeline. */
export interface Candidate {
  readonly id: string;
  readonly full_name: string;
  readonly email: string;
  readonly phone: string;
  readonly position: string;
  readonly linkedin_url: string;
  readonly cv_url: string;
  readonly status: CandidateStatus;
  readonly stage: CandidateStage;
  readonly experience_years: number;
  readonly applied_at: string;
  readonly updated_at: string;
  readonly notes?: readonly CandidateNote[];
  readonly notes_count: number;
}