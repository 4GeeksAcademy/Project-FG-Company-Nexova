/**
 * Nexova Recruitment Domain — Collection Utilities
 *
 * Pure utility functions for working with candidate collections.
 * No React, Next.js, browser API, or HTTP client coupling.
 */

import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
} from "../types/models";

export type SortDirection = "asc" | "desc";

export interface CandidateFilterCriteria {
  status?: CandidateStatus;
  stage?: CandidateStage;
  minimumExperience?: number;
  position?: string;
}

export function filterCandidatesByStatus(
  candidates: readonly Candidate[],
  status: CandidateStatus
): Candidate[] {
  return candidates.filter((candidate) => candidate.status === status);
}

export function filterCandidatesByStage(
  candidates: readonly Candidate[],
  stage: CandidateStage
): Candidate[] {
  return candidates.filter((candidate) => candidate.stage === stage);
}

export function filterCandidatesByMinimumExperience(
  candidates: readonly Candidate[],
  minimumExperience: number
): Candidate[] {
  return candidates.filter(
    (candidate) => candidate.experience_years >= minimumExperience
  );
}

export function filterCandidatesByPosition(
  candidates: readonly Candidate[],
  positionQuery: string
): Candidate[] {
  const normalizedQuery = positionQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...candidates];
  }

  return candidates.filter((candidate) =>
    candidate.position.toLowerCase().includes(normalizedQuery)
  );
}

export function filterCandidates(
  candidates: readonly Candidate[],
  criteria: CandidateFilterCriteria
): Candidate[] {
  let result: Candidate[] = [...candidates];

  if (criteria.status !== undefined) {
    result = filterCandidatesByStatus(result, criteria.status);
  }

  if (criteria.stage !== undefined) {
    result = filterCandidatesByStage(result, criteria.stage);
  }

  if (criteria.minimumExperience !== undefined) {
    result = filterCandidatesByMinimumExperience(
      result,
      criteria.minimumExperience
    );
  }

  if (criteria.position !== undefined) {
    result = filterCandidatesByPosition(result, criteria.position);
  }

  return result;
}

export function sortCandidatesByExperience(
  candidates: readonly Candidate[],
  direction: SortDirection
): Candidate[] {
  const sortedCandidates = [...candidates];

  sortedCandidates.sort((a, b) => {
    const delta = a.experience_years - b.experience_years;
    return direction === "asc" ? delta : -delta;
  });

  return sortedCandidates;
}

export function sortCandidatesByName(
  candidates: readonly Candidate[],
  direction: SortDirection
): Candidate[] {
  const sortedCandidates = [...candidates];

  sortedCandidates.sort((a, b) => {
    const delta = a.full_name.localeCompare(b.full_name);
    return direction === "asc" ? delta : -delta;
  });

  return sortedCandidates;
}

export function sortCandidatesByMultipleFields(
  candidates: readonly Candidate[]
): Candidate[] {
  const sortedCandidates = [...candidates];

  sortedCandidates.sort((a, b) => {
    const experienceDelta = b.experience_years - a.experience_years;
    if (experienceDelta !== 0) {
      return experienceDelta;
    }

    return a.full_name.localeCompare(b.full_name);
  });

  return sortedCandidates;
}

export function groupCandidatesByStage(
  candidates: readonly Candidate[]
): Record<CandidateStage, Candidate[]> {
  const initialGroups: Record<CandidateStage, Candidate[]> = {
    pending: [],
    review: [],
    personal_interview: [],
    technical_interview: [],
  };

  return candidates.reduce<Record<CandidateStage, Candidate[]>>(
    (groups, candidate) => {
      groups[candidate.stage].push(candidate);
      return groups;
    },
    initialGroups
  );
}