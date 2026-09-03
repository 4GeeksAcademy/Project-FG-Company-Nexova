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
import {
  averageExperienceByPosition,
  averageExperienceYears,
  countCandidatesByStage,
  countCandidatesByStatus,
  generateStageReport,
  generateStatusReport,
  maxExperienceYears,
  minExperienceYears,
  totalExperienceYears,
} from "./utils/transformations.js";
import {
  validateCandidate,
  validateCandidateNote,
} from "./utils/validations.js";

function printMilestoneBanner(): void {
  const border = "=".repeat(56);
  const title = "Nexova Solutions — TypeScript Business Logic";
  const line1 = "Milestone : C3 — Collection Operations / C4 — Search Algorithms / C5 — Aggregations / C6 — Validations";
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

// ── C5 — Aggregations and Reports ──────────────────────────────

function printC5Examples(): void {
  console.log("  C5 Aggregation Examples:\n");

  // ── Count by category ────────────────────────────────────────
  const statusCounts = countCandidatesByStatus(SAMPLE_CANDIDATES);
  console.log("  Count by status:");
  console.log(`    received: ${statusCounts.received}`);
  console.log(`    in_progress: ${statusCounts.in_progress}`);
  console.log(`    discarded: ${statusCounts.discarded}`);
  console.log(`    selected: ${statusCounts.selected}`);

  const stageCounts = countCandidatesByStage(SAMPLE_CANDIDATES);
  console.log("  Count by stage:");
  console.log(`    pending: ${stageCounts.pending}`);
  console.log(`    review: ${stageCounts.review}`);
  console.log(`    personal_interview: ${stageCounts.personal_interview}`);
  console.log(`    technical_interview: ${stageCounts.technical_interview}`);

  // ── Numeric totals ───────────────────────────────────────────
  const totalExp = totalExperienceYears(SAMPLE_CANDIDATES);
  console.log(`\n  Total experience years: ${totalExp}`);

  // ── Averages ─────────────────────────────────────────────────
  const avgExp = averageExperienceYears(SAMPLE_CANDIDATES);
  console.log(`  Average experience years: ${avgExp.toFixed(2)}`);

  const avgByPosition = averageExperienceByPosition(SAMPLE_CANDIDATES);
  console.log("  Average experience by position:");
  for (const position of Object.keys(avgByPosition).sort()) {
    console.log(`    ${position.padEnd(30)} ${avgByPosition[position].toFixed(2)}y`);
  }

  // ── Maximum and minimum ──────────────────────────────────────
  const maxExp = maxExperienceYears(SAMPLE_CANDIDATES);
  const minExp = minExperienceYears(SAMPLE_CANDIDATES);
  console.log(`\n  Maximum experience: ${maxExp}y`);
  console.log(`  Minimum experience: ${minExp}y`);

  // ── Meaningful reports ───────────────────────────────────────
  console.log("\n  Stage Report:");
  console.log(`  ${generateStageReport(SAMPLE_CANDIDATES).replace(/\n/g, "\n  ")}`);

  console.log("\n  Status Report:");
  console.log(`  ${generateStatusReport(SAMPLE_CANDIDATES).replace(/\n/g, "\n  ")}`);

  // ── Empty array behavior ─────────────────────────────────────
  const empty: readonly Candidate[] = [];
  console.log("\n  Empty array behavior:");
  console.log(`  - Count by status: ${JSON.stringify(countCandidatesByStatus(empty))}`);
  console.log(`  - Count by stage: ${JSON.stringify(countCandidatesByStage(empty))}`);
  console.log(`  - Total experience: ${totalExperienceYears(empty)}`);
  console.log(`  - Average experience: ${averageExperienceYears(empty)}`);
  console.log(`  - Average by position: ${JSON.stringify(averageExperienceByPosition(empty))}`);
  console.log(`  - Max experience: ${maxExperienceYears(empty)}`);
  console.log(`  - Min experience: ${minExperienceYears(empty)}`);
  console.log(`  - Stage report: "${generateStageReport(empty)}"`);
  console.log(`  - Status report: "${generateStatusReport(empty)}"`);

  // ── Immutability check ───────────────────────────────────────
  const sourceAfterAgg = SAMPLE_CANDIDATES[0]?.full_name ?? "";
  console.log("\n  Immutability check:");
  console.log(`  - Source unchanged after aggregations: ${sourceAfterAgg}`);

  console.log();
}

// ── C6 — Business Validations ──────────────────────────────────

function printC6Examples(): void {
  console.log("  C6 Validation Examples:\n");

  // ── Valid candidate (from sample data) ───────────────────────
  const validResult = validateCandidate(SAMPLE_CANDIDATES[0]);
  console.log(`  Valid candidate (${SAMPLE_CANDIDATES[0].full_name}):`);
  console.log(`    valid: ${validResult.valid}`);
  console.log(`    errors: ${JSON.stringify(validResult.errors)}`);

  // ── Candidate with notes ─────────────────────────────────────
  const candidateWithNotes = SAMPLE_CANDIDATES[1];
  const notesResult = validateCandidate(candidateWithNotes);
  console.log(`\n  Candidate with notes (${candidateWithNotes.full_name}):`);
  console.log(`    valid: ${notesResult.valid}`);
  console.log(`    errors: ${JSON.stringify(notesResult.errors)}`);

  // ── Invalid cases ────────────────────────────────────────────
  const invalidCases: [string, unknown][] = [
    ["null input", null],
    ["undefined input", undefined],
    ["non-object (number)", 42],
    ["non-object (string)", "not-an-object"],
    ["missing required field", {}],
    ["empty required string", { id: "", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["negative experience_years", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: -1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["NaN experience_years", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: NaN, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["negative notes_count", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: -1, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["non-integer notes_count", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 1.5, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["invalid status", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "unknown_status", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["invalid stage", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "unknown_stage", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01" }],
    ["invalid applied_at date", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "not-a-date", updated_at: "2026-01-01" }],
    ["invalid updated_at date", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "not-a-date" }],
    ["updated_at before applied_at", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-06-01", updated_at: "2026-01-01" }],
    ["notes is not an array", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01", notes: "not-an-array" }],
    ["malformed CandidateNote", { id: "x", full_name: "Test", email: "a@b", phone: "123", position: "Dev", linkedin_url: "url", cv_url: "url", status: "received", stage: "pending", experience_years: 1, notes_count: 0, applied_at: "2026-01-01", updated_at: "2026-01-01", notes: [{ id: "", record_id: "x", content: "", created_at: "bad-date" }] }],
  ];

  for (const [label, input] of invalidCases) {
    const result = validateCandidate(input);
    console.log(`  ${label}:`);
    console.log(`    valid: ${result.valid}`);
    console.log(`    errors: ${JSON.stringify(result.errors)}`);
  }

  console.log();
}

printMilestoneBanner();
printSampleSummary();
printC3Examples();
printC4Examples();
printC5Examples();
printC6Examples();