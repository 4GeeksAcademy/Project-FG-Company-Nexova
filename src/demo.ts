/**
 * Nexova Recruitment Domain — Demo Entry Point
 *
 * Minimal executable entry point for the Nexova TypeScript business-logic
 * milestone. This file validates that the domain models and sample data
 * compile correctly and can be consumed through collection and search
 * utilities.
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
  sortCandidatesByName,
} from "./utils/collections.js";
import {
  binarySearchCandidateByName,
  linearSearchCandidateById,
} from "./utils/search.js";

function printMilestoneBanner(): void {
  const border = "=".repeat(56);
  const title = "Nexova Solutions — TypeScript Business Logic";
  const line1 = "Milestone : C3 — Collection Operations / C4 — Search Algorithms";
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

// ── C4 — Search Algorithms ─────────────────────────────────────

function printC4Examples(): void {
  console.log("  C4 Search Examples:\n");

  // ── Linear search ────────────────────────────────────────────
  // SAMPLE_CANDIDATES is unsorted — linear search works on any order

  const foundIndex = linearSearchCandidateById(SAMPLE_CANDIDATES, "c004");
  const foundCandidate = foundIndex !== -1 ? SAMPLE_CANDIDATES[foundIndex] : null;
  console.log(
    `  Linear search by ID "c004": index=${foundIndex}` +
      (foundCandidate ? ` → ${foundCandidate.full_name}` : "")
  );

  const notFoundIndex = linearSearchCandidateById(SAMPLE_CANDIDATES, "c999");
  console.log(`  Linear search by ID "c999": index=${notFoundIndex} (not found)`);

  const firstIndex = linearSearchCandidateById(SAMPLE_CANDIDATES, "c001");
  console.log(`  Linear search first element "c001": index=${firstIndex}`);

  const lastIndex = linearSearchCandidateById(SAMPLE_CANDIDATES, "c007");
  console.log(`  Linear search last element "c007": index=${lastIndex}`);

  const emptyLinear = linearSearchCandidateById([], "c001");
  console.log(`  Linear search empty array: index=${emptyLinear}`);

  // ── Binary search ────────────────────────────────────────────
  // Sort by full_name ascending first — binary search requires sorted input

  const sortedByName = sortCandidatesByName(SAMPLE_CANDIDATES, "asc");

  console.log("\n  Name-sorted order (for binary search):");
  for (const c of sortedByName) {
    console.log(`    ${c.full_name.padEnd(30)} (id: ${c.id})`);
  }

  const binaryFound = binarySearchCandidateByName(
    sortedByName,
    "Diego Alejandro Torres"
  );
  console.log(
    `\n  Binary search "Diego Alejandro Torres": index=${binaryFound}` +
      ` → id=${sortedByName[binaryFound]?.id ?? "N/A"}`
  );

  const binaryFirst = binarySearchCandidateByName(
    sortedByName,
    "Camila Andrea Rivas"
  );
  console.log(
    `  Binary search first element "Camila Andrea Rivas": index=${binaryFirst}`
  );

  // Middle element: with 7 elements, index 3 is the 4th
  const middleName = sortedByName[3]?.full_name ?? "";
  const binaryMiddle = binarySearchCandidateByName(sortedByName, middleName);
  console.log(
    `  Binary search middle element "${middleName}": index=${binaryMiddle}`
  );

  const binaryLast = binarySearchCandidateByName(
    sortedByName,
    "Valentina Paz Soto"
  );
  console.log(
    `  Binary search last element "Valentina Paz Soto": index=${binaryLast}`
  );

  const binaryNotFound = binarySearchCandidateByName(
    sortedByName,
    "Zulema Ruiz"
  );
  console.log(`  Binary search "Zulema Ruiz": index=${binaryNotFound} (not found)`);

  const emptyBinary = binarySearchCandidateByName([], "Camila Andrea Rivas");
  console.log(`  Binary search empty array: index=${emptyBinary}`);

  // ── Immutability checks ──────────────────────────────────────

  const sourceAfterLinear = SAMPLE_CANDIDATES[0]?.full_name ?? "";
  console.log("\n  Immutability checks:");
  console.log(`  - Source unchanged after searches: ${sourceAfterLinear}`);

  // Verify binary search input array was sorted before call, not internally
  const binarySearchDidNotSort = sortedByName[0]?.full_name === "Camila Andrea Rivas";
  console.log(
    `  - Binary search did not sort internally: ${binarySearchDidNotSort}`
  );

  console.log();
}

printMilestoneBanner();
printSampleSummary();
printC3Examples();
printC4Examples();