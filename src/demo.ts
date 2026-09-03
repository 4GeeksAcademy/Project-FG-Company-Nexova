/**
 * Nexova Recruitment Domain — Demo Entry Point
 *
 * Minimal executable entry point for the Nexova TypeScript business-logic
 * milestone. This file validates that the domain models and sample data
 * compile correctly and can be consumed through collection utilities.
 *
 * No business logic is implemented yet.
 */

import { SAMPLE_CANDIDATES } from "./data/sampleCandidates.js";
import type { Candidate } from "./types/models";
import {
  filterCandidates,
  filterCandidatesByMinimumExperience,
  filterCandidatesByPosition,
  filterCandidatesByStatus,
  groupCandidatesByStage,
  sortCandidatesByExperience,
} from "./utils/collections.js";

function printMilestoneBanner(): void {
  const border = "=".repeat(56);
  const title = "Nexova Solutions — TypeScript Business Logic";
  const line1 = "Milestone : C3 — Collection Operations";
  const line2 = "Department: Recruitment Operations";
  const line3 = `Samples   : ${SAMPLE_CANDIDATES.length} candidates loaded`;

  console.log(`\n  ${border}`);
  console.log(`  ${title}`);
  console.log(`  ${border}`);
  console.log(`  ${line1}`);
  console.log(`  ${line2}`);
  console.log(`  ${line3}`);
  console.log(`  ${border}\n`);
}

function printSampleSummary(): void {
  console.log("  Base Candidate Summary:\n");

  for (const c of SAMPLE_CANDIDATES) {
    const noteInfo =
      c.notes_count > 0 ? ` (${c.notes_count} note(s))` : "";
    console.log(
      `  • ${c.full_name.padEnd(28)} ${c.position.padEnd(22)} ` +
        `${c.status.padEnd(14)} ${c.stage.padEnd(22)}` +
        `${c.experience_years}y${noteInfo}`
    );
  }
  console.log();
}

function printNames(title: string, candidates: readonly { full_name: string }[]): void {
  const names = candidates.map((candidate) => candidate.full_name).join(", ");
  console.log(`  ${title}: ${names || "(none)"}`);
}

function printC3Examples(): void {
  const inProgress = filterCandidatesByStatus(SAMPLE_CANDIDATES, "in_progress");
  const minimumExperience = filterCandidatesByMinimumExperience(
    SAMPLE_CANDIDATES,
    3
  );
  const positionAnalyst = filterCandidatesByPosition(SAMPLE_CANDIDATES, "analyst");
  const multiCriteria = filterCandidates(SAMPLE_CANDIDATES, {
    status: "in_progress",
    minimumExperience: 3,
  });
  const sortedByExperienceDesc = sortCandidatesByExperience(
    SAMPLE_CANDIDATES,
    "desc"
  );
  const groupedByStage = groupCandidatesByStage(SAMPLE_CANDIDATES);

  console.log("  C3 Utility Examples:\n");
  printNames("In progress", inProgress);
  printNames("Experience >= 3", minimumExperience);
  printNames("Position contains 'analyst'", positionAnalyst);
  printNames("Multi-criteria (in_progress + >=3)", multiCriteria);
  printNames("Sorted by experience desc", sortedByExperienceDesc);

  console.log("  Grouped by stage:");
  console.log(`  - pending: ${groupedByStage.pending.length}`);
  console.log(`  - review: ${groupedByStage.review.length}`);
  console.log(
    `  - personal_interview: ${groupedByStage.personal_interview.length}`
  );
  console.log(
    `  - technical_interview: ${groupedByStage.technical_interview.length}`
  );
  console.log();

  const emptyCollection: readonly Candidate[] = [];
  const emptyGrouped = groupCandidatesByStage(emptyCollection);
  const unmatched = filterCandidatesByPosition(SAMPLE_CANDIDATES, "biotech");
  const emptyCriteria = filterCandidates(SAMPLE_CANDIDATES, {});
  const emptyQuery = filterCandidatesByPosition(SAMPLE_CANDIDATES, "");
  const sortedEmpty = sortCandidatesByExperience(emptyCollection, "asc");

  console.log("  Edge cases:");
  console.log(`  - Empty array filtered by status: ${filterCandidatesByStatus(emptyCollection, "received").length}`);
  console.log(`  - Filter with no matches: ${unmatched.length}`);
  console.log(`  - Empty criteria returns all: ${emptyCriteria.length}`);
  console.log(`  - Empty position query returns all: ${emptyQuery.length}`);
  console.log(`  - Sorting empty array: ${sortedEmpty.length}`);
  console.log(
    `  - Grouping empty keeps keys: ${Object.keys(emptyGrouped).join(", ")}`
  );

  const originalFirst = SAMPLE_CANDIDATES[0]?.full_name ?? "";
  const sortedFirst = sortedByExperienceDesc[0]?.full_name ?? "";
  const sourceFirstAfterSort = SAMPLE_CANDIDATES[0]?.full_name ?? "";
  console.log("  Immutability checks:");
  console.log(`  - Source first before sort: ${originalFirst}`);
  console.log(`  - Sorted first (desc): ${sortedFirst}`);
  console.log(`  - Source first after sort: ${sourceFirstAfterSort}`);

  const everyMultiCriteriaMatches = multiCriteria.every(
    (candidate) =>
      candidate.status === "in_progress" && candidate.experience_years >= 3
  );
  console.log(
    `  - Multi-criteria all match active conditions: ${everyMultiCriteriaMatches}`
  );
  console.log();
}

printMilestoneBanner();
printSampleSummary();
printC3Examples();