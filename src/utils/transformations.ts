/**
 * Nexova Recruitment Domain — Transformation and Aggregation Utilities
 *
 * Pure utility functions for counting, totaling, averaging, and reporting
 * on candidate data. No React, Next.js, or browser API coupling.
 */

import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
} from "../types/models";

// ── Count by Category ───────────────────────────────────────────

/**
 * Count candidates by status.
 * Returns an object with every CandidateStatus key mapped to its count.
 */
export function countCandidatesByStatus(
  candidates: readonly Candidate[]
): Record<CandidateStatus, number> {
  const counts: Record<CandidateStatus, number> = {
    received: 0,
    in_progress: 0,
    discarded: 0,
    selected: 0,
  };

  return candidates.reduce<Record<CandidateStatus, number>>(
    (acc, candidate) => {
      acc[candidate.status]++;
      return acc;
    },
    counts
  );
}

/**
 * Count candidates by stage.
 * Returns an object with every CandidateStage key mapped to its count.
 */
export function countCandidatesByStage(
  candidates: readonly Candidate[]
): Record<CandidateStage, number> {
  const counts: Record<CandidateStage, number> = {
    pending: 0,
    review: 0,
    personal_interview: 0,
    technical_interview: 0,
  };

  return candidates.reduce<Record<CandidateStage, number>>(
    (acc, candidate) => {
      acc[candidate.stage]++;
      return acc;
    },
    counts
  );
}

// ── Numeric Totals ──────────────────────────────────────────────

/**
 * Calculate the total years of experience across all candidates.
 * Returns 0 for an empty array.
 */
export function totalExperienceYears(
  candidates: readonly Candidate[]
): number {
  return candidates.reduce(
    (total, candidate) => total + candidate.experience_years,
    0
  );
}

// ── Averages ────────────────────────────────────────────────────

/**
 * Calculate the average years of experience across all candidates.
 * Returns 0 for an empty array (avoids division by zero).
 */
export function averageExperienceYears(
  candidates: readonly Candidate[]
): number {
  if (candidates.length === 0) {
    return 0;
  }

  return totalExperienceYears(candidates) / candidates.length;
}

/**
 * Calculate the average years of experience grouped by position.
 * Returns an empty object for an empty array.
 */
export function averageExperienceByPosition(
  candidates: readonly Candidate[]
): Record<string, number> {
  const positionTotals: Record<string, { sum: number; count: number }> = {};

  for (const candidate of candidates) {
    const position = candidate.position;

    if (positionTotals[position] === undefined) {
      positionTotals[position] = { sum: 0, count: 0 };
    }

    positionTotals[position].sum += candidate.experience_years;
    positionTotals[position].count++;
  }

  const result: Record<string, number> = {};

  for (const position of Object.keys(positionTotals)) {
    result[position] = positionTotals[position].sum / positionTotals[position].count;
  }

  return result;
}

// ── Maximum and Minimum ─────────────────────────────────────────

/**
 * Find the maximum years of experience in the candidate array.
 * Returns 0 for an empty array.
 */
export function maxExperienceYears(
  candidates: readonly Candidate[]
): number {
  if (candidates.length === 0) {
    return 0;
  }

  let max = candidates[0].experience_years;

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].experience_years > max) {
      max = candidates[i].experience_years;
    }
  }

  return max;
}

/**
 * Find the minimum years of experience in the candidate array.
 * Returns 0 for an empty array.
 */
export function minExperienceYears(
  candidates: readonly Candidate[]
): number {
  if (candidates.length === 0) {
    return 0;
  }

  let min = candidates[0].experience_years;

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].experience_years < min) {
      min = candidates[i].experience_years;
    }
  }

  return min;
}

// ── Meaningful Reports ──────────────────────────────────────────

/**
 * Generate a human-readable pipeline status report.
 * Shows how many candidates are at each stage of the pipeline.
 */
export function generateStageReport(
  candidates: readonly Candidate[]
): string {
  if (candidates.length === 0) {
    return "No candidates in the pipeline.";
  }

  const counts = countCandidatesByStage(candidates);
  const total = candidates.length;

  const lines: string[] = [];
  lines.push(`Pipeline Report — ${total} candidate(s) total`);

  const stageLabels: Record<CandidateStage, string> = {
    pending: "Pending review",
    review: "Under review",
    personal_interview: "Personal interview",
    technical_interview: "Technical interview",
  };

  for (const stage of Object.keys(stageLabels) as CandidateStage[]) {
    const count = counts[stage];
    const percentage = ((count / total) * 100).toFixed(1);
    lines.push(`  ${stageLabels[stage]}: ${count} (${percentage}%)`);
  }

  return lines.join("\n");
}

/**
 * Generate a human-readable status summary report.
 * Shows how many candidates are at each status.
 */
export function generateStatusReport(
  candidates: readonly Candidate[]
): string {
  if (candidates.length === 0) {
    return "No candidates in the pipeline.";
  }

  const counts = countCandidatesByStatus(candidates);
  const total = candidates.length;

  const lines: string[] = [];
  lines.push(`Status Report — ${total} candidate(s) total`);

  const statusLabels: Record<CandidateStatus, string> = {
    received: "Received",
    in_progress: "In progress",
    discarded: "Discarded",
    selected: "Selected",
  };

  for (const status of Object.keys(statusLabels) as CandidateStatus[]) {
    const count = counts[status];
    const percentage = ((count / total) * 100).toFixed(1);
    lines.push(`  ${statusLabels[status]}: ${count} (${percentage}%)`);
  }

  return lines.join("\n");
}