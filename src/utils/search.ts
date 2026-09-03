/**
 * Nexova Recruitment Domain — Search Algorithms
 *
 * Pure search functions for candidate data.
 * Explicit algorithm implementations — not wrappers around find/findIndex.
 * No React, Next.js, or browser API coupling.
 */

import type { Candidate } from "../types/models";

// ── Linear Search ───────────────────────────────────────────────

/**
 * Linear search for a candidate by unique ID.
 * Iterates sequentially through the array until the target is found
 * or the end is reached.
 *
 * @param candidates - Unsorted array of candidates (can be any order)
 * @param targetId   - The candidate ID to locate
 * @returns          - The index of the matching candidate, or -1 if not found
 */
export function linearSearchCandidateById(
  candidates: readonly Candidate[],
  targetId: string
): number {
  for (let index = 0; index < candidates.length; index++) {
    if (candidates[index].id === targetId) {
      return index;
    }
  }

  return -1;
}

// ── Binary Search ───────────────────────────────────────────────

/**
 * Binary search for a candidate by full name.
 *
 * **Precondition:** The input array MUST be sorted in ascending order by
 * `full_name` using the same comparison semantics as this function.
 * Call `sortCandidatesByName(candidates, "asc")` from `collections.ts`
 * before calling this function.
 *
 * This function does NOT sort the array — it assumes the caller has
 * already sorted it. The search repeatedly narrows the range using
 * left/right/middle boundaries.
 *
 * Comparison uses the same default `localeCompare` as
 * `sortCandidatesByName` to ensure consistent ordering.
 *
 * @param candidates - Array of candidates already sorted by full_name ascending
 * @param targetName - The full name to locate
 * @returns          - The index of the matching candidate, or -1 if not found
 */
export function binarySearchCandidateByName(
  candidates: readonly Candidate[],
  targetName: string
): number {
  let left = 0;
  let right = candidates.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const comparison = candidates[middle].full_name.localeCompare(targetName);

    if (comparison === 0) {
      return middle;
    }

    if (comparison < 0) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}