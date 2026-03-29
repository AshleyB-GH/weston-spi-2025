# DWA Hazard Identification & Risk Assessment (HIRA) App Design

**Date:** 2026-03-29
**Author:** Safety Manager, Dublin Weston Airport
**Status:** Approved
**Governing Document:** DWA SAF 01 Supp4 v3.3 — Risk Assessment & Mitigation Procedures

---

## Overview

A guided, wizard-based desktop application that leads users through the complete DWA 7-step
Hazard Identification and Risk Assessment process as defined in DWA SAF 01 Supp4 v3.3.
Built on the existing Electron + React stack, it runs natively on Windows, macOS, and Linux,
and also exports as a standalone HTML file. The app is designed for both trained safety
personnel and untrained staff — contextual help is always available at every step.

---

## Goals

- Guide any user (trained or not) through the full 7-step HIRA process
- Display contextual help at every step, drawn directly from procedure text
- Automatically calculate risk classifications from severity × probability inputs
- Produce a completed Table 1 (Risk Assessment & Evaluation Form) and Table 2 (Hazard
  Identification and Safety Criteria Form) ready to print or save
- Store in-progress assessments in localStorage so work is never lost
- Match the visual design language of the existing Weston Airport safety apps

---

## Out of Scope

- Backend database or server
- User authentication
- Emailing the completed form (print/PDF export covers this)
- Integration with ECCAIRS

---

## Platform

**React + Electron (Forge)**

Delivered as a single `HIRA_DWA.jsx` component integrated into the existing `my-app`
Electron project. This gives:

- Windows installer (Squirrel)
- macOS zip
- Linux .deb / .rpm
- Standalone HTML (via `npm run build`)

No new dependencies beyond what is already in `package.json`.

---

## Design Language

Matches `WestonSPI2025.jsx`:

| Token | Value |
|---|---|
| Primary navy | `#1e3a5f` |
| Page background | `#f0f6ff` |
| Card border | `#c7deff` |
| Muted text | `#5a7fa8` |
| Faint text | `#94a3b8` |
| Font | `'DM Sans', 'Segoe UI', sans-serif` |
| Header bg | `#1e3a5f` (navy) |
| Header text | `#ffffff` |
| Help panel bg | `#fffbeb` (amber tint) |

Risk traffic-light colours (from procedure tables):

| Class | Colour | Meaning |
|---|---|---|
| A / High | `#dc2626` (red) | Unacceptable |
| B / Medium | `#f97316` (orange) | Undesirable |
| C | `#eab308` (yellow) | Acceptable with approval |
| D / Low | `#16a34a` (green) | Acceptable |

---

## Key Design Decisions

**Table 1 and Table 2 relationship:** Each hazard record simultaneously populates one row
in Table 1 (Risk Assessment & Evaluation Form) AND one row in Table 2 (Hazard
Identification and Safety Criteria Form). The relationship is strictly 1:1. Rather than two
parallel arrays with a foreign key, all fields from both tables are merged into a single
`hazards[]` object. The Table 2-specific fields (possibleHazard, accidentIncidentType,
harmfulEffects, severityClass, outcome, safetyCriteriaClassification) are a sub-section of
each hazard card — shown in a collapsible "Table 2 — Safety Criteria" panel within the
hazard card during Step 2.

**Unmitigated vs mitigated vs final risk:** Each hazard tracks three risk snapshots:
1. Initial (unmitigated): severity forced to 1 (Catastrophic) per procedure §2.2.2.3; user
   selects initial probability. Risk class computed automatically.
2. Mitigated (current): user selects severity and probability after existing mitigations.
   Risk class computed automatically.
3. Final: user selects severity and probability after new mitigations. Risk class computed.

**Table 2 `outcome` field:** This maps directly to column i) "Outcome" in Table 2 as
shown in DWA SAF 01 Supp4 v3.3 p.22. It represents the anticipated outcome if the
hazard occurs (e.g. "Fatal injury", "Aircraft Damaged"). Kept in data model as `outcome`.

**§2.5 "Point to Note":** Where multiple hazards share the same consequence, the user
must sum probabilities across those hazards. This is implemented as: (a) informational
help text in Step 5; (b) a "Mark as shared consequence" toggle on each hazard that groups
them visually; (c) a calculated "Combined Probability" shown for any group, with a
warning if the combined classification differs from individual classifications. This is
advisory, not blocking.

**Verification checklist (§2.2.8, 9 items):**
```
a) The full scope of the change is addressed throughout the whole assessment process
b) The way the service behaves complies with and does not contradict any applicable requirements
c) The specification of the way the service behaves is complete and correct
d) The specification of the operational context is complete and correct
e) The risk analysis is complete
f) The safety requirements are correct and commensurate with the risk analysis
g) The design is complete and correct with reference to the specification and correctly addresses the safety requirements
h) The design was the one analysed
i) The implementation corresponds to that design and behaves only as specified in the given operational context
```

**Terminology:** Functional System uses A/B/C/D risk classifications. Non-Functional
System uses High/Medium/Low (per Table 11 of the procedure). Both are supported.

**assessmentRef counter:** A simple counter stored in localStorage (`dwa-hira-counter`)
increments on each new assessment. Format: `RA-YYYYMMDD-NNN`.

**Draft restore on load:** If a saved draft exists in localStorage when the app loads, a
banner is shown: "You have an unsaved assessment — [Continue] or [Start New]". Starting
new clears the draft after confirmation.

---

## Assessment Types

Before starting, the user selects:

- **Functional System Change** — any change to equipment, procedures, staff, or physical
  environment that directly affects ATM/ANS or Airfield Operations (uses Severity classes
  1–5, Table 3 probability scale, Risk Matrix Table 5/6)
- **Non-Functional System Change** — changes to management/SMS/HR/regulatory context
  that do not affect the functional system (uses Catastrophic/Major/Minor/Negligible
  severity, Table 9 probability scale, Risk Matrix Table 10/11)

---

## 7-Step Wizard Structure

### Step 1 — System Description
Fields: Assessment Reference (auto-generated), Date, Assessor Name, Assessment Team,
Activity Description, **Change Type** (Functional / Non-Functional — radio button, sets
all downstream tables).
Help: Explains what "system description" means (sections a–f from procedure §2.2.1) and
explains the difference between Functional and Non-Functional changes.

### Step 2 — Hazard Identification
**Table 2 panel:** Possible Hazard, Accident/Incident Type, Harmful Effect(s), Severity
Class (initial = 1, Catastrophic), Safety Criteria Classification.
**Table 1 rows:** Each hazard gets: Ref Number, Hazard Title, Accident Type, Harmful
Effect, Current Mitigations, Worst Mitigated Effect.
Multiple hazards can be added. Help explains credible hazardous events, accident types,
and the "top-level event" concept.

### Step 3 — Severity Classification
For each hazard: select the severity class after current mitigations.
Reference severity table always visible (Functional: 1–5; Non-Functional: 4 levels).
Help: explains that initial severity = 1 (Catastrophic) before mitigations.

### Step 4 — Probability / Likelihood Assessment
For each hazard: select the probability category.
Reference probability table always visible.
Help: explains how to use historical data, expert judgment, and exposure frequency.

### Step 5 — Risk Evaluation (auto-calculated)
Risk classification automatically computed from Severity × Probability using the
appropriate matrix (Table 5 for Functional; Table 10 for Non-Functional).
Visual risk matrix shown with the current classification highlighted.
Tolerability verdict shown:
- Functional: A (Unacceptable), B (Undesirable), C (Acceptable with approval), D (Acceptable)
- Non-Functional: High (Unacceptable), Medium (Tolerable with AM sign-off), Low (Acceptable)
§2.5 shared-consequence grouping shown here: if hazards share a consequence group,
the combined probability (sum) is shown alongside the individual classifications.

### Step 6 — Further Mitigation
For each hazard: describe new mitigation measures (if needed).
After new mitigations: re-enter final severity and probability.
Final Risk Classification auto-calculated and displayed.
Help: explains §2.5 (multiple hazards leading to same consequence — add probabilities).

### Step 7 — Safety Requirements & Monitoring
For each hazard: New Safety Requirement text, Evidence that SR has been met, Status.
Monitoring Criteria section.
Verification checklist (9 items from §2.2.8) — user ticks off each one.
Final header fields: Safety Criteria Classification (highest), Final Risk Classification
(highest), Has Safety Criteria Been Met? (Y/N).

### Review & Export
Summary view showing completed Table 1 and Table 2 exactly as per the procedure forms.
Print button — triggers `window.print()` with print-specific CSS that hides the wizard
chrome and shows only the tables.

---

## Data Model

```js
{
  // Metadata (Step 1)
  assessmentRef: string,       // auto: "RA-YYYYMMDD-NNN"
  assessmentDate: string,      // ISO date
  assessorName: string,
  assessmentTeam: string,
  activityDescription: string,
  changeType: 'functional' | 'non-functional',

  // Hazards — combines Table 1 AND Table 2 fields (1:1 per hazard)
  hazards: [
    {
      id: string,

      // Table 2 fields (§2.2.2.2, Table 2 columns e–j)
      possibleHazard: string,          // Table 2 col e
      accidentIncidentType: string,    // Table 2 col f (CFIT/MAC/RE etc.)
      harmfulEffects: string,          // Table 2 col g
      t2SeverityClass: string,         // Table 2 col h — always "1/Catastrophic" per §2.2.2.3
      outcome: string,                 // Table 2 col i
      safetyCriteriaClassification: string, // Table 2 col j

      // Table 1 fields (§2.2.1.1, Table 1 columns i–s)
      ref: string,              // Table 1 col i — "RA-001" …
      hazardTitle: string,      // Table 1 col j
      accidentType: string,     // Table 1 col k
      harmfulEffect: string,    // Table 1 col l (harmful effect)
      currentMitigation: string,// Table 1 col l (current mitigation note)
      worstMitigatedEffect: string, // Table 1 col n

      // Mitigated risk (Table 1 col o) — after current mitigations (Steps 3–5)
      mitigatedSeverity: string,
      mitigatedProbability: string,
      mitigatedRiskClass: string,       // auto-calculated

      // New mitigation (Table 1 col p — Step 6)
      newMitigations: string,

      // Final risk (Table 1 col q — Step 6)
      finalSeverity: string,
      finalProbability: string,
      finalRiskClass: string,           // auto-calculated

      // Safety requirements (Table 1 cols r–t — Step 7)
      newSafetyRequirement: string,     // col r
      evidenceSRMet: string,            // col s
      monitoringCriteria: string,       // Step 7 monitoring criteria
      status: string,                   // col t

      // Shared consequence grouping (§2.5)
      sharedConsequenceGroup: string,   // empty string = not grouped; else group label
    }
  ],

  // Step 7 header fields (Table 1 top section)
  safetyCriteriaClassificationOverall: string,  // Table 1 col f (highest level)
  finalRiskClassificationOverall: string,       // Table 1 col g (highest level)
  safetyCriteriaMet: 'Y' | 'N' | '',            // Table 1 col h

  // Verification checklist (§2.2.8, 9 items — Step 7)
  verificationChecked: [
    false, // a) full scope addressed
    false, // b) service behaviour complies with requirements
    false, // c) specification of service behaviour is complete/correct
    false, // d) specification of operational context is complete/correct
    false, // e) risk analysis is complete
    false, // f) safety requirements are correct and commensurate
    false, // g) design is complete and correct
    false, // h) design was the one analysed
    false, // i) implementation corresponds to design
  ],

  // Wizard state
  currentStep: number,   // 1–7 (8 = Review)
  savedAt: string        // ISO timestamp of last localStorage save
}
```

---

## Help System

Each step has a collapsible `ℹ Help` panel (amber background, always accessible via a
persistent button). The panel contains:

- A plain-English explanation of the step
- Key terms defined (drawn directly from §1.4 and relevant sub-sections)
- Examples drawn from the procedure's non-exhaustive lists
- Reference: "See DWA SAF 01 Supp4 v3.3 §X.X"

For untrained users, the help is expanded by default. A global preference toggle
("I am a trained safety professional") collapses help panels by default.

---

## Persistence

On every field change: `localStorage.setItem('dwa-hira-draft', JSON.stringify(state))`.
On app load: read from localStorage and restore in-progress assessment.
"New Assessment" button clears localStorage and resets state (with confirmation dialog).
"Load Saved" indicator shown in header if a draft exists.

---

## Print / Export

`window.print()` with `@media print` CSS:
- Hide header chrome, step navigation, help panels, sidebar
- Show Table 2 first, then a CSS page break, then Table 1 (matching procedure document order)
- Include DWA logo, document reference (DWA SAF 01 Supp4 v3.3), date, assessor

---

## File Structure Change

```
src/
├── HIRA_DWA.jsx        ← new, self-contained component
├── WestonSPI2025.jsx   ← existing, unchanged
├── App.js              ← updated: add navigation tab for HIRA app
└── ...
```

---

## Integration into App.js

`App.js` gains a top-level tab/navigation with two options:
1. **SPI Dashboard** — existing `WestonSPI2025` component
2. **Risk Assessment (HIRA)** — new `HIRA_DWA` component

The navigation bar is minimal (pills style, navy), consistent with the existing header.
