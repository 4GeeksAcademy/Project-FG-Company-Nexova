/**
 * Nexova Recruitment Domain — Demo Entry Point
 *
 * Minimal executable entry point for the Nexova TypeScript business-logic
 * milestone. This file validates that the domain models and sample data
 * compile correctly and can be consumed.
 *
 * No business logic is implemented yet.
 */

import { SAMPLE_CANDIDATES } from "./data/sampleCandidates.js";

function printMilestoneBanner(): void {
  const border = "=".repeat(56);
  const title = "Nexova Solutions — TypeScript Business Logic";
  const line1 = "Milestone : C2 — Domain Models";
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
  console.log("  Candidate Summary:\n");

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

printMilestoneBanner();
printSampleSummary();