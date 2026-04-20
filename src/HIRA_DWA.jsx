import React, { useState, useEffect } from 'react';
import WESTON_LOGO from './westonLogo';

// ═══════════════════════════════════════════════════════════════════════
// DATA TABLES — DWA SAF 01 Supp4 v3.3
// ═══════════════════════════════════════════════════════════════════════

const FUNCTIONAL_SEVERITY = [
  { id: '1', label: '1 — Catastrophic', description: 'Loss of aircraft or ground vehicle; fatal injury to one or more persons; loss of ATM/ANS safety capability.' },
  { id: '2', label: '2 — Hazardous', description: 'Large reduction in safety margins; serious injury; major equipment damage; significant reduction in ATM/ANS functional capability.' },
  { id: '3', label: '3 — Major', description: 'Significant reduction in safety margins; injury possible; major incident; reduction in ATM/ANS functional capability.' },
  { id: '4', label: '4 — Minor', description: 'Slight reduction in safety margins; minor injury; nuisance.' },
  { id: '5', label: '5 — Negligible', description: 'Little or no safety significance. No meaningful safety impact.' },
];

const FUNCTIONAL_PROBABILITY = [
  { id: 'A', label: 'A — Frequent', description: 'Likely to occur during a 6-week period, or 9 or more times per year. (Ps > 10⁻³)' },
  { id: 'B', label: 'B — Probable', description: 'Likely to occur one or more times during the year, but less than 9 times per year. (10⁻³ ≥ Ps > 10⁻⁴)' },
  { id: 'C', label: 'C — Occasional', description: 'Likely to occur less than once per year, or once in 14 months. (10⁻⁴ ≥ Ps > 10⁻⁵)' },
  { id: 'D', label: 'D — Remote', description: 'Likely to occur once in 10-11 years. (10⁻⁵ ≥ Ps > 10⁻⁶)' },
  { id: 'E', label: 'E — Improbable', description: 'Very unlikely to occur during the year. Up to 1 in 100 years. (10⁻⁶ ≥ Ps > 10⁻⁷)' },
  { id: 'F', label: 'F — Extremely Improbable', description: 'Extremely unlikely to occur during the year. Up to 1 in 1000 years. (Ps ≥ 10⁻⁷)' },
];

// Table 5 — Functional Risk Matrix (severity 1–5 × probability A–F)
// 5 columns (Severity 1-5) × 6 rows (Probability: Frequent, Probable, Occasional, Remote, Improbable, Extremely Improbable)
// Row patterns from riskdocx.md Table 9:
// Frequent (A):           AAABD
// Probable (B):           AABCD
// Occasional (C):         ABCCD
// Remote (D):             ACCDD
// Improbable (E):         ACDDD
// Extremely Improbable (F): ADDDD
const FUNCTIONAL_RISK_MATRIX = {
  '1': { A: 'A', B: 'A', C: 'A', D: 'A', E: 'A', F: 'A' },
  '2': { A: 'A', B: 'A', C: 'B', D: 'C', E: 'C', F: 'D' },
  '3': { A: 'A', B: 'B', C: 'C', D: 'C', E: 'D', F: 'D' },
  '4': { A: 'B', B: 'C', C: 'C', D: 'D', E: 'D', F: 'D' },
  '5': { A: 'D', B: 'D', C: 'D', D: 'D', E: 'D', F: 'D' },
};

const NONFUNCTIONAL_SEVERITY = [
  { id: 'CAT', label: 'Catastrophic', description: 'Very large impact in the capacity of the functioning of the Organisation, or in ATM/ANS capacity or safety. E.g. Inadequate resource/Loss of certificate/Safety margins critically impacted if unmanaged.' },
  { id: 'MAJ', label: 'Major', description: 'Major reduction impact in the capacity of the functioning of the Organisation, or in ATM/ANS capacity or safety. E.g. Significantly reduced resource/Limited ability to meet certificated functions or services/Safety margins eroded if unmanaged.' },
  { id: 'MIN', label: 'Minor', description: 'Slight impact in the capacity of the functioning of the Organisation, or in ATM/ANS capacity or safety. E.g. Reduced compliance/resources to provide service are affected - workloads increased/safety margins could be affected.' },
  { id: 'NEG', label: 'Negligible', description: 'Negligible impact on ATM/ANS Service or functions. No impact on safety. Minor or no impact elsewhere, such as efficiency of management system.' },
];

const NONFUNCTIONAL_PROBABILITY = [
  { id: 'FREQ', label: 'Frequent', description: 'Estimated to occur two or more times in a year.' },
  { id: 'OCC', label: 'Occasional', description: 'Estimated to occur once per year.' },
  { id: 'REM', label: 'Remote', description: 'Unlikely to occur during a year but may occur within 10 years.' },
  { id: 'IMP', label: 'Improbable', description: 'Unlikely to occur within ten years nevertheless, an occurrence is considered possible / credible.' },
];

// Table 10 — Non-Functional Risk Matrix
const NONFUNCTIONAL_RISK_MATRIX = {
  'CAT': { FREQ: 'High', OCC: 'High', REM: 'High', IMP: 'Medium' },
  'MAJ': { FREQ: 'High', OCC: 'High', REM: 'Medium', IMP: 'Low' },
  'MIN': { FREQ: 'Medium', OCC: 'Low', REM: 'Low', IMP: 'Low' },
  'NEG': { FREQ: 'Low', OCC: 'Low', REM: 'Low', IMP: 'Low' },
};

const RISK_COLOR = {
  A: '#dc2626', High: '#dc2626',
  B: '#f97316', Medium: '#f97316',
  C: '#eab308',
  D: '#16a34a', Low: '#16a34a',
};

const RISK_LABEL = {
  A: 'A — Unacceptable',
  B: 'B — Undesirable',
  C: 'C — Acceptable with Approval',
  D: 'D — Acceptable',
  High: 'High — Unacceptable',
  Medium: 'Medium — Tolerable with AM sign-off',
  Low: 'Low — Acceptable',
};

const VERIFICATION_ITEMS = [
  'a) The full scope of the change is addressed throughout the whole assessment process',
  'b) The way the service behaves complies with and does not contradict any applicable requirements',
  'c) The specification of the way the service behaves is complete and correct',
  'd) The specification of the operational context is complete and correct',
  'e) The risk analysis is complete',
  'f) The safety requirements are correct and commensurate with the risk analysis',
  'g) The design is complete and correct with reference to the specification and correctly addresses the safety requirements',
  'h) The design was the one analysed',
  'i) The implementation corresponds to that design and behaves only as specified in the given operational context',
];

// ═══════════════════════════════════════════════════════════════════════
// HELP TEXT — drawn from DWA SAF 01 Supp4 v3.3
// ═══════════════════════════════════════════════════════════════════════

const HELP = {
  1: {
    title: 'Step 1 — System Description',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.1',
    paragraphs: [
      'The System Description defines the boundaries and context of the change being assessed. It should describe: (a) the purpose of the system or change; (b) the operational environment; (c) any interfaces with other systems; (d) the operational context such as peak traffic and staffing; (e) the geographical scope; and (f) any constraints, assumptions, or limitations.',
      'A Functional System Change is any change to equipment, procedures, staffing, or physical environment that directly affects ATM/ANS or Airfield Operations. Uses severity classes 1–5 and an A/B/C/D risk classification.',
      'A Non-Functional System Change is a change to management systems, SMS, HR processes, or regulatory context that does not directly affect the functional system. Uses Catastrophic/Major/Minor/Negligible severity and a High/Medium/Low risk classification.',
      'If in doubt, classify as Functional.',
    ],
  },
  2: {
    title: 'Step 2 — Hazard Identification',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.2',
    paragraphs: [
      'A hazard is a condition or event with the potential to cause harm. In ATM/ANS, hazards are credible hazardous events — things that could realistically happen and lead to an accident or incident.',
      'How to identify hazards: consider what could go wrong at each stage of the change; use structured prompts (What if equipment fails? What if procedures are not followed?); think about concurrent events and unusual conditions.',
      'Possible Hazard (Table 2, col e): Describe the hazardous event — the failure mode or dangerous condition.',
      'Accident/Incident Type (Table 2, col f): What type of accident could result? Use standard codes where possible (CFIT, MAC, RE, RI, etc.).',
      'Initial Severity (§2.2.2.3): Per procedure, the initial (unmitigated) severity is always set to 1 — Catastrophic. This represents the worst-case consequence before any mitigations are considered.',
      'Safety Criteria Classification (Table 2, col j): The target risk level that must be achieved after all mitigations.',
    ],
  },
  3: {
    title: 'Step 3 — Severity Classification',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.3, Table 3',
    paragraphs: [
      'Severity describes the worst credible outcome of a hazard occurring, given that current mitigations are already in place.',
      'Note (§2.2.2.3): The initial (unmitigated) severity is always Catastrophic (1) before any mitigations. At this step you re-classify severity after accounting for existing mitigations.',
      'Functional: 1=Catastrophic (loss of aircraft/fatalities), 2=Hazardous (serious injury/major reduction in safety margins), 3=Major (significant reduction/injury possible), 4=Minor (slight reduction/nuisance), 5=Negligible (no safety significance).',
      'Non-Functional: Catastrophic=fatalities/major accidents, Major=serious injuries/significant disruption, Minor=minor injuries/limited disruption, Negligible=insignificant impact.',
    ],
  },
  4: {
    title: 'Step 4 — Probability / Likelihood Assessment',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.4, Table 4',
    paragraphs: [
      'Probability estimates how likely a hazard is to occur given the current operational context and existing mitigations.',
      'Sources of data: historical occurrence records (safety reports, ECCAIRS, internal logs); expert judgment from operational staff; exposure frequency (how often the relevant operation is performed); comparison with similar operations.',
      'Functional scale: A=Frequent (Ps > 10⁻³), B=Probable (10⁻³ ≥ Ps > 10⁻⁴), C=Occasional (10⁻⁴ ≥ Ps > 10⁻⁵), D=Remote (10⁻⁵ ≥ Ps > 10⁻⁶), E=Improbable (10⁻⁶ ≥ Ps > 10⁻⁷), F=Extremely Improbable (Ps ≥ 10⁻⁷).',
      'Non-Functional scale: Frequent (two or more times per year), Occasional (once per year), Remote (within 10 years), Improbable (exceptional circumstances).',
      '§2.5 Point to Note: Where two or more hazards could independently lead to the same accident/consequence, you must SUM their probabilities. Use the "Shared Consequence" toggle to mark hazards that share a consequence.',
    ],
  },
  5: {
    title: 'Step 5 — Risk Evaluation',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.5, Tables 5, 6, 10, 11',
    paragraphs: [
      'Risk is calculated automatically from Severity × Probability using the risk matrix from the procedure.',
      'Functional classifications (Table 6): A=Unacceptable (design must change), B=Undesirable (only accept if reduction is impractical AND risk is ALARP), C=Acceptable with AM approval, D=Broadly acceptable.',
      'Non-Functional classifications (Table 11): High=Unacceptable (must reduce), Medium=Tolerable with Accountable Manager sign-off, Low=Broadly acceptable.',
      'ALARP: All risks should be reduced As Low As Reasonably Practicable, regardless of classification.',
      '§2.5 Combined Probability: Hazards marked as sharing a consequence are shown grouped below. Where hazards share a consequence, their probabilities must be added — the combined risk may require additional mitigation.',
    ],
  },
  6: {
    title: 'Step 6 — Further Mitigation',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.6',
    paragraphs: [
      'For any hazard where the current risk classification is unacceptable or undesirable (Class A, B, High, or Medium), you must define additional mitigation measures.',
      'Types of mitigation — in order of preference: Engineering controls (barriers, interlocks, alarms); Procedural controls (checklists, SOPs, briefings); Training requirements (currency, recurrent training); Monitoring (safety surveys, audits, KPIs); Administrative controls (permits, approvals).',
      'After applying new mitigations: re-assess severity and probability to determine the Final Risk Classification. The final risk must be tolerable before the change can be approved.',
      '§2.5 Note: If new mitigations affect the probability of hazards sharing a common consequence, recalculate the combined probability for that group.',
    ],
  },
  7: {
    title: 'Step 7 — Safety Requirements & Monitoring',
    ref: 'See DWA SAF 01 Supp4 v3.3 §2.2.7, §2.2.8',
    paragraphs: [
      'For each mitigation measure, define a formal Safety Requirement — a statement of what must be true for the risk to remain tolerable. A good Safety Requirement is specific, verifiable, achievable, and traceable to the hazard it addresses.',
      'Evidence of SR Met: document what confirms the Safety Requirement has been satisfied (e.g., training records, technical acceptance certificate, signed procedure, audit report).',
      'Monitoring Criteria: define how ongoing compliance will be monitored (e.g., annual audit, supervisor check, system health monitoring).',
      'Status: Open (not yet implemented), In Progress, or Closed (implemented and verified).',
      'Verification Checklist (§2.2.8): Confirm all 9 criteria are satisfied before the assessment is approved. These ensure the assessment is complete, consistent, and correctly addresses all safety requirements.',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function calcRisk(changeType, severity, probability) {
  if (!severity || !probability) return '';
  if (changeType === 'functional') {
    return (FUNCTIONAL_RISK_MATRIX[severity] || {})[probability] || '';
  }
  return (NONFUNCTIONAL_RISK_MATRIX[severity] || {})[probability] || '';
}

function downloadAssessmentJSON(assessment) {
  const jsonString = JSON.stringify(assessment, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `HIRA_${assessment.assessmentRef}_${assessment.assessmentDate}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


function makeAssessmentRef() {
  const counter = parseInt(localStorage.getItem('dwa-hira-counter') || '0', 10) + 1;
  localStorage.setItem('dwa-hira-counter', String(counter));
  const d = new Date();
  const ds = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `RA-${ds}-${String(counter).padStart(3, '0')}`;
}

function makeNewHazard(index) {
  return {
    id: `h-${Date.now()}-${index}`,
    ref: `RA-${String(index + 1).padStart(3, '0')}`,
    possibleHazard: '',
    accidentIncidentType: '',
    harmfulEffects: '',
    t2SeverityClass: '1 / Catastrophic',
    outcome: '',
    safetyCriteriaClassification: '',
    hazardTitle: '',
    accidentType: '',
    harmfulEffect: '',
    currentMitigation: '',
    worstMitigatedEffect: '',
    mitigatedSeverity: '',
    mitigatedProbability: '',
    mitigatedRiskClass: '',
    newMitigations: '',
    finalSeverity: '',
    finalProbability: '',
    finalRiskClass: '',
    newSafetyRequirement: '',
    evidenceSRMet: '',
    monitoringCriteria: '',
    status: 'Open',
    sharedConsequenceGroup: '',
  };
}

function makeInitialState() {
  return {
    assessmentRef: makeAssessmentRef(),
    assessmentDate: new Date().toISOString().split('T')[0],
    assessorName: '',
    assessmentTeam: '',
    activityDescription: '',
    changeType: 'functional',
    hazards: [makeNewHazard(0)],
    safetyCriteriaClassificationOverall: '',
    finalRiskClassificationOverall: '',
    safetyCriteriaMet: '',
    verificationChecked: Array(9).fill(false),
    currentStep: 1,
    savedAt: '',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const C = {
  navy: '#1e3a5f',
  bg: '#f0f6ff',
  border: '#c7deff',
  muted: '#5a7fa8',
  faint: '#94a3b8',
  white: '#ffffff',
  amber: '#fffbeb',
  amberBorder: '#fde68a',
  green: '#dcfce7',
  greenBorder: '#86efac',
  red: '#fee2e2',
  redBorder: '#fecaca',
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function RiskBadge({ riskClass }) {
  if (!riskClass) return <span style={{ color: C.faint, fontSize: 13 }}>—</span>;
  const color = RISK_COLOR[riskClass] || C.faint;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      background: color,
      color: '#fff',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: 0.3,
    }}>
      {riskClass}
    </span>
  );
}

function RiskMatrixFunctional({ highlightSev, highlightProb }) {
  const probs = ['A', 'B', 'C', 'D', 'E', 'F'];
  const sevs = ['1', '2', '3', '4', '5'];
  const probLabels = {
    A: 'A — Frequent',
    B: 'B — Probable',
    C: 'C — Occasional',
    D: 'D — Remote',
    E: 'E — Improbable',
    F: 'F — Extremely Improbable'
  };
  return (
    <div style={{ overflowX: 'auto', marginTop: 8 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 420 }}>
        <thead>
          <tr>
            <th style={{ padding: '4px 8px', background: C.navy, color: '#fff', textAlign: 'center', border: '1px solid #4a6fa5' }}>Prob \ Sev</th>
            {sevs.map(sv => (
              <th key={sv} style={{ padding: '4px 8px', background: highlightSev === sv ? '#2563eb' : C.navy, color: '#fff', textAlign: 'center', border: '1px solid #4a6fa5' }}>{sv}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {probs.map(p => (
            <tr key={p}>
              <td style={{ padding: '4px 8px', background: highlightProb === p ? '#2563eb' : C.navy, color: '#fff', fontWeight: 600, textAlign: 'center', border: '1px solid #4a6fa5', fontSize: 11 }}>{probLabels[p]}</td>
              {sevs.map(sv => {
                const rc = FUNCTIONAL_RISK_MATRIX[sv][p];
                const isHighlight = highlightSev === sv && highlightProb === p;
                return (
                  <td key={sv} style={{
                    padding: '4px 8px',
                    textAlign: 'center',
                    background: isHighlight ? '#1e293b' : RISK_COLOR[rc],
                    color: '#fff',
                    fontWeight: isHighlight ? 900 : 600,
                    border: isHighlight ? '3px solid #1e293b' : '1px solid rgba(255,255,255,0.2)',
                    fontSize: isHighlight ? 14 : 12,
                  }}>
                    {rc}{isHighlight ? ' ◀' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Table 5 — Functional Risk Matrix (DWA SAF 01 Supp4 v3.3)</div>
    </div>
  );
}

function RiskMatrixNonFunctional({ highlightSev, highlightProb }) {
  const probs = [{ id: 'FREQ', label: 'Frequent' }, { id: 'OCC', label: 'Occasional' }, { id: 'REM', label: 'Remote' }, { id: 'IMP', label: 'Improbable' }];
  const sevs = [{ id: 'CAT', label: 'Cat.' }, { id: 'MAJ', label: 'Major' }, { id: 'MIN', label: 'Minor' }, { id: 'NEG', label: 'Neg.' }];
  return (
    <div style={{ overflowX: 'auto', marginTop: 8 }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 380 }}>
        <thead>
          <tr>
            <th style={{ padding: '4px 8px', background: C.navy, color: '#fff', textAlign: 'center', border: '1px solid #4a6fa5' }}>Sev \ Prob</th>
            {probs.map(p => (
              <th key={p.id} style={{ padding: '4px 8px', background: highlightProb === p.id ? '#2563eb' : C.navy, color: '#fff', textAlign: 'center', border: '1px solid #4a6fa5' }}>{p.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sevs.map(sv => (
            <tr key={sv.id}>
              <td style={{ padding: '4px 8px', background: highlightSev === sv.id ? '#2563eb' : C.navy, color: '#fff', fontWeight: 600, textAlign: 'center', border: '1px solid #4a6fa5' }}>{sv.label}</td>
              {probs.map(p => {
                const rc = NONFUNCTIONAL_RISK_MATRIX[sv.id][p.id];
                const isHighlight = highlightSev === sv.id && highlightProb === p.id;
                return (
                  <td key={p.id} style={{
                    padding: '4px 8px',
                    textAlign: 'center',
                    background: isHighlight ? '#1e293b' : RISK_COLOR[rc],
                    color: '#fff',
                    fontWeight: isHighlight ? 900 : 600,
                    border: isHighlight ? '3px solid #1e293b' : '1px solid rgba(255,255,255,0.2)',
                    fontSize: isHighlight ? 14 : 12,
                  }}>
                    {rc}{isHighlight ? ' ◀' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Table 10 — Non-Functional Risk Matrix (DWA SAF 01 Supp4 v3.3)</div>
    </div>
  );
}

function HelpPanel({ step, isOpen, onToggle }) {
  const h = HELP[step];
  if (!h) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.navy, fontWeight: 700, fontSize: 13,
          padding: '6px 0', fontFamily: C.font,
        }}
      >
        <span style={{ fontSize: 16 }}>ℹ</span>
        {isOpen ? 'Hide Help' : 'Show Help'} — {h.title}
      </button>
      {isOpen && (
        <div style={{
          background: C.amber, border: `1px solid ${C.amberBorder}`,
          borderRadius: 8, padding: '14px 18px', marginTop: 6,
        }}>
          {h.paragraphs.map((p, i) => (
            <p key={i} style={{ margin: i === 0 ? '0 0 10px 0' : '10px 0', fontSize: 13, lineHeight: 1.6, color: '#78350f' }}>{p}</p>
          ))}
          <p style={{ margin: '10px 0 0 0', fontSize: 12, color: '#92400e', fontStyle: 'italic' }}>{h.ref}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PRINT STYLES
// ═══════════════════════════════════════════════════════════════════════

const PRINT_CSS = `
@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html { font-size: 9pt; }
  body { margin: 0; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; line-height: 1.4; }
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  .print-table-container { display: block !important; }
  .print-page-break { page-break-after: always; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 12px; font-size: 8.5pt; }
  thead tr { display: table-row; page-break-inside: avoid; }
  tbody tr { page-break-inside: avoid; }
  th { background: #1e3a5f !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 6px 4px; text-align: left; font-weight: bold; font-size: 8pt; border: 1px solid #1e3a5f; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; }
  td { padding: 6px 4px; border: 1px solid #d1d5db; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; vertical-align: top; font-size: 8pt; }
  .risk-badge-print { font-weight: bold; }
  .print-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; page-break-inside: avoid; }
  .print-header img { height: 36px; }
  .print-section-title { font-size: 11pt; font-weight: bold; color: #1e3a5f; margin: 14px 0 8px 0; border-bottom: 2px solid #1e3a5f; padding-bottom: 4px; page-break-after: avoid; }
  h1, h2, h3 { page-break-after: avoid; }
  p { page-break-inside: avoid; margin: 6px 0; }
}
@media screen {
  .print-only { display: none; }
}
`;

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function HIRA_DWA() {
  const [assessment, setAssessment] = useState(null);
  const [savedDraft, setSavedDraft] = useState(null);
  const [trainedMode, setTrainedMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState({});
  const [confirmNew, setConfirmNew] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem('dwa-hira-draft');
    if (raw) {
      try {
        setSavedDraft(JSON.parse(raw));
      } catch (e) {
        // ignore corrupt draft
      }
    }
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (assessment) {
      const toSave = { ...assessment, savedAt: new Date().toISOString() };
      localStorage.setItem('dwa-hira-draft', JSON.stringify(toSave));
    }
  }, [assessment]);

  // Default help panels open when not in trained mode
  useEffect(() => {
    if (assessment && !trainedMode) {
      setHelpOpen(prev => ({ ...prev, [assessment.currentStep]: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment?.currentStep, trainedMode]);

  function startNew() {
    setConfirmNew(false);
    setSavedDraft(null);
    const s = makeInitialState();
    if (!trainedMode) setHelpOpen({ 1: true });
    setAssessment(s);
  }

  function continueDraft() {
    if (!trainedMode) setHelpOpen({ [savedDraft.currentStep]: true });
    setAssessment(savedDraft);
    setSavedDraft(null);
  }

  function loadAssessmentFromJSON(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        const parsed = JSON.parse(typeof content === 'string' ? content : '');
        
        // Validate that it has the required assessment properties
        if (!parsed.assessmentRef || !parsed.hazards || !Array.isArray(parsed.hazards)) {
          alert('Invalid assessment file format. Please ensure the file is a valid HIRA JSON export.');
          return;
        }

        // Load the assessment
        if (!trainedMode) setHelpOpen({ [parsed.currentStep || 1]: true });
        setAssessment(parsed);
        setSavedDraft(null);
        window.scrollTo(0, 0);
      } catch (err) {
        alert(`Error loading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be uploaded again
    event.target.value = '';
  }



  function update(fields) {
    setAssessment(prev => ({ ...prev, ...fields }));
  }

  function updateHazard(id, fields) {
    setAssessment(prev => ({
      ...prev,
      hazards: prev.hazards.map(h => h.id === id ? { ...h, ...fields } : h),
    }));
  }

  function addHazard() {
    setAssessment(prev => {
      const idx = prev.hazards.length;
      return { ...prev, hazards: [...prev.hazards, makeNewHazard(idx)] };
    });
  }

  function removeHazard(id) {
    setAssessment(prev => {
      const hazards = prev.hazards.filter(h => h.id !== id)
        .map((h, i) => ({ ...h, ref: `RA-${String(i + 1).padStart(3, '0')}` }));
      return { ...prev, hazards };
    });
  }

  function goToStep(step) {
    update({ currentStep: step });
    if (!trainedMode) setHelpOpen(prev => ({ ...prev, [step]: true }));
    window.scrollTo(0, 0);
  }

  // ─────────────────────────────────────────────────────────────
  // WELCOME SCREEN
  // ─────────────────────────────────────────────────────────────

  function renderWelcome() {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <img src={WESTON_LOGO} alt="Weston Airport" style={{ height: 72, marginBottom: 24 }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.navy, marginBottom: 6 }}>Risk Assessment (HIRA)</h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>Hazard Identification and Risk Assessment<br />Dublin Weston Airport — DWA SAF 01 Supp4 v3.3</p>

          {savedDraft && !confirmNew ? (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px 28px', marginBottom: 24, textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Unsaved Assessment Found</p>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>
                Ref: <strong>{savedDraft.assessmentRef}</strong>
                {savedDraft.assessorName ? ` — ${savedDraft.assessorName}` : ''}
              </p>
              {savedDraft.savedAt && (
                <p style={{ fontSize: 12, color: C.faint, marginBottom: 16 }}>
                  Last saved: {new Date(savedDraft.savedAt).toLocaleString()}
                </p>
              )}
              <p style={{ fontSize: 13, color: '#1e293b', marginBottom: 20 }}>
                {savedDraft.activityDescription
                  ? savedDraft.activityDescription.slice(0, 100) + (savedDraft.activityDescription.length > 100 ? '…' : '')
                  : 'No description entered.'}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={continueDraft} style={{ flex: 1, padding: '10px 0', background: C.navy, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
                  Continue Assessment
                </button>
                <button onClick={() => setConfirmNew(true)} style={{ flex: 1, padding: '10px 0', background: C.white, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
                  Start New
                </button>
              </div>
            </div>
          ) : confirmNew ? (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '20px 24px', marginBottom: 24 }}>
              <p style={{ fontWeight: 700, color: '#9a3412', marginBottom: 8 }}>Discard saved assessment?</p>
              <p style={{ fontSize: 13, color: '#78350f', marginBottom: 16 }}>This will permanently delete the in-progress assessment <strong>{savedDraft?.assessmentRef}</strong>.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={startNew} style={{ padding: '8px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontFamily: C.font }}>
                  Discard &amp; Start New
                </button>
                <button onClick={() => setConfirmNew(false)} style={{ padding: '8px 20px', background: C.white, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={startNew} style={{ padding: '12px 36px', background: C.navy, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 16, fontFamily: C.font, marginBottom: 24 }}>
                Start New Assessment
              </button>
              
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '18px 22px', marginBottom: 24, textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Or Load a Previous Assessment</p>
                <label style={{ display: 'inline-block', padding: '10px 24px', background: '#f0fdf4', color: '#16a34a', border: `2px solid #16a34a`, borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: C.font, transition: 'background 0.2s' }}>
                  Upload JSON File
                  <input type="file" accept=".json" onChange={loadAssessmentFromJSON} style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Select a previously downloaded HIRA_*.json file to continue</p>
              </div>
            </>
          )}

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 18px', marginTop: 8, textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: C.navy, fontWeight: 600 }}>
              <input type="checkbox" checked={trainedMode} onChange={e => setTrainedMode(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              I am a trained safety professional (collapse help panels by default)
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1 — SYSTEM DESCRIPTION
  // ─────────────────────────────────────────────────────────────

  function renderStep1() {
    const a = assessment;
    return (
      <>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Assessment Reference</label>
              <input value={a.assessmentRef} readOnly style={{ ...inp, background: '#f8faff', color: C.muted }} />
              <p style={hint}>Auto-generated reference</p>
            </div>
            <div>
              <label style={lbl}>Assessment Date *</label>
              <input type="date" value={a.assessmentDate} onChange={e => update({ assessmentDate: e.target.value })} style={inp} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Assessor Name *</label>
              <input value={a.assessorName} onChange={e => update({ assessorName: e.target.value })} style={inp} placeholder="Full name of lead assessor" />
            </div>
            <div>
              <label style={lbl}>Assessment Team</label>
              <input value={a.assessmentTeam} onChange={e => update({ assessmentTeam: e.target.value })} style={inp} placeholder="Names of team members" />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Activity / Change Description *</label>
            <textarea
              value={a.activityDescription}
              onChange={e => update({ activityDescription: e.target.value })}
              style={{ ...inp, minHeight: 100, resize: 'vertical' }}
              placeholder="Describe the activity or change being assessed. Include: purpose, operational environment, interfaces, scope, constraints and assumptions."
            />
            <p style={hint}>Describe sections a–f from §2.2.1</p>
          </div>

          <div>
            <label style={lbl}>Change Type *</label>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>
              Select the type of change. This determines which risk matrix and severity/probability scales are used throughout this assessment.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { value: 'functional', label: 'Functional System Change', desc: 'Changes to equipment, procedures, staff, or physical environment that directly affect ATM/ANS or Airfield Operations. Uses severity 1–5 and A/B/C/D risk classification.' },
                { value: 'non-functional', label: 'Non-Functional System Change', desc: 'Changes to management systems, SMS, HR, or regulatory context that do not directly affect the functional system. Uses Catastrophic/Major/Minor/Negligible and High/Medium/Low classification.' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                  background: a.changeType === opt.value ? '#eff6ff' : C.white,
                  border: `2px solid ${a.changeType === opt.value ? '#2563eb' : C.border}`,
                  borderRadius: 8, padding: '12px 16px',
                }}>
                  <input
                    type="radio"
                    name="changeType"
                    value={opt.value}
                    checked={a.changeType === opt.value}
                    onChange={() => update({ changeType: opt.value })}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 2 — HAZARD IDENTIFICATION
  // ─────────────────────────────────────────────────────────────

  function renderStep2() {
    const a = assessment;
    return (
      <>
        {a.hazards.map((h, idx) => (
          <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: C.navy }}>Hazard {h.ref}</span>
                {h.hazardTitle && <span style={{ fontSize: 13, color: C.muted, marginLeft: 10 }}>— {h.hazardTitle}</span>}
              </div>
              {a.hazards.length > 1 && (
                <button onClick={() => removeHazard(h.id)} style={{ padding: '5px 12px', background: C.red, color: '#dc2626', border: `1px solid ${C.redBorder}`, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: C.font }}>
                  Remove
                </button>
              )}
            </div>

            {/* Table 1 fields */}
            <div style={{ marginBottom: 14 }}>
              <div style={sectionTitle}>Table 1 — Risk Assessment Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lbl}>Hazard Title (col j) *</label>
                  <input value={h.hazardTitle} onChange={e => updateHazard(h.id, { hazardTitle: e.target.value })} style={inp} placeholder="Brief title for this hazard" />
                </div>
                <div>
                  <label style={lbl}>Accident Type (col k)</label>
                  <input value={h.accidentType} onChange={e => updateHazard(h.id, { accidentType: e.target.value })} style={inp} placeholder="e.g. CFIT, MAC, RE, RI" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Harmful Effect (col l)</label>
                <input value={h.harmfulEffect} onChange={e => updateHazard(h.id, { harmfulEffect: e.target.value })} style={inp} placeholder="Describe the harmful effect if this hazard occurs" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Current Mitigations (col m)</label>
                <textarea value={h.currentMitigation} onChange={e => updateHazard(h.id, { currentMitigation: e.target.value })} style={{ ...inp, minHeight: 70, resize: 'vertical' }} placeholder="List existing controls or barriers already in place" />
              </div>
              <div>
                <label style={lbl}>Worst Mitigated Effect (col n)</label>
                <input value={h.worstMitigatedEffect} onChange={e => updateHazard(h.id, { worstMitigatedEffect: e.target.value })} style={inp} placeholder="Worst outcome remaining after current mitigations" />
              </div>
            </div>

            {/* Table 2 fields */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <div style={sectionTitle}>Table 2 — Hazard Identification and Safety Criteria</div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Possible Hazard (col e) *</label>
                <textarea value={h.possibleHazard} onChange={e => updateHazard(h.id, { possibleHazard: e.target.value })} style={{ ...inp, minHeight: 70, resize: 'vertical' }} placeholder="Describe the credible hazardous event or failure mode" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lbl}>Accident/Incident Type (col f)</label>
                  <input value={h.accidentIncidentType} onChange={e => updateHazard(h.id, { accidentIncidentType: e.target.value })} style={inp} placeholder="CFIT / MAC / RE / RI / etc." />
                </div>
                <div>
                  <label style={lbl}>Initial Severity (col h)</label>
                  <input value={h.t2SeverityClass} readOnly style={{ ...inp, background: '#f8faff', color: C.muted }} />
                  <p style={hint}>Fixed at 1/Catastrophic per §2.2.2.3</p>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Harmful Effects (col g)</label>
                <input value={h.harmfulEffects} onChange={e => updateHazard(h.id, { harmfulEffects: e.target.value })} style={inp} placeholder="What harm could result — injury, damage, disruption?" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Outcome (col i)</label>
                  <input value={h.outcome} onChange={e => updateHazard(h.id, { outcome: e.target.value })} style={inp} placeholder="e.g. Fatal injury, Aircraft damaged" />
                </div>
                <div>
                  <label style={lbl}>Safety Criteria Classification (col j)</label>
                  <input value={h.safetyCriteriaClassification} onChange={e => updateHazard(h.id, { safetyCriteriaClassification: e.target.value })} style={inp} placeholder="Target risk level to be achieved" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addHazard} style={{ width: '100%', padding: '12px 0', background: C.white, border: `2px dashed ${C.border}`, borderRadius: 8, cursor: 'pointer', color: C.navy, fontWeight: 700, fontSize: 14, fontFamily: C.font, marginBottom: 8 }}>
          + Add Another Hazard
        </button>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 3 — SEVERITY CLASSIFICATION
  // ─────────────────────────────────────────────────────────────

  function renderStep3() {
    const a = assessment;
    const isFn = a.changeType === 'functional';
    const sevList = isFn ? FUNCTIONAL_SEVERITY : NONFUNCTIONAL_SEVERITY;
    return (
      <>
        {/* Reference table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
          <div style={sectionTitle}>{isFn ? 'Functional' : 'Non-Functional'} Severity Classes — Reference</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '6px 10px', background: C.navy, color: '#fff', textAlign: 'left', borderRadius: '4px 0 0 0' }}>Class</th>
                <th style={{ padding: '6px 10px', background: C.navy, color: '#fff', textAlign: 'left', borderRadius: '0 4px 0 0' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {sevList.map((sv, i) => (
                <tr key={sv.id} style={{ background: i % 2 === 0 ? C.bg : C.white }}>
                  <td style={{ padding: '6px 10px', fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', border: `1px solid ${C.border}` }}>{sv.label}</td>
                  <td style={{ padding: '6px 10px', color: '#374151', border: `1px solid ${C.border}` }}>{sv.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={hint}>Initial (unmitigated) severity is always 1/Catastrophic per §2.2.2.3. Select mitigated severity here.</p>
        </div>

        {a.hazards.map(h => {
          const newMitRisk = calcRisk(a.changeType, h.mitigatedSeverity, h.mitigatedProbability);
          if (newMitRisk !== h.mitigatedRiskClass) {
            updateHazard(h.id, { mitigatedRiskClass: newMitRisk });
          }
          return (
            <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 4 }}>{h.ref} — {h.hazardTitle || '(untitled hazard)'}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>{h.worstMitigatedEffect || h.harmfulEffect || 'No description entered'}</div>
              <label style={lbl}>Severity after current mitigations *</label>
              <select value={h.mitigatedSeverity} onChange={e => updateHazard(h.id, { mitigatedSeverity: e.target.value, mitigatedRiskClass: calcRisk(a.changeType, e.target.value, h.mitigatedProbability) })} style={sel}>
                <option value="">— Select severity —</option>
                {sevList.map(sv => <option key={sv.id} value={sv.id}>{sv.label}</option>)}
              </select>
            </div>
          );
        })}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 4 — PROBABILITY
  // ─────────────────────────────────────────────────────────────

  function renderStep4() {
    const a = assessment;
    const isFn = a.changeType === 'functional';
    const probList = isFn ? FUNCTIONAL_PROBABILITY : NONFUNCTIONAL_PROBABILITY;
    return (
      <>
        {/* Reference table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
          <div style={sectionTitle}>{isFn ? 'Functional' : 'Non-Functional'} Probability Scale — Reference</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '6px 10px', background: C.navy, color: '#fff', textAlign: 'left' }}>Level</th>
                <th style={{ padding: '6px 10px', background: C.navy, color: '#fff', textAlign: 'left' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {probList.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? C.bg : C.white }}>
                  <td style={{ padding: '6px 10px', fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', border: `1px solid ${C.border}` }}>{p.label}</td>
                  <td style={{ padding: '6px 10px', color: '#374151', border: `1px solid ${C.border}` }}>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {a.hazards.map(h => (
          <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 4 }}>{h.ref} — {h.hazardTitle || '(untitled hazard)'}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
              Severity: <strong>{h.mitigatedSeverity ? (isFn ? FUNCTIONAL_SEVERITY.find(s => s.id === h.mitigatedSeverity)?.label : NONFUNCTIONAL_SEVERITY.find(s => s.id === h.mitigatedSeverity)?.label) : '—'}</strong>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Probability (after current mitigations) *</label>
              <select
                value={h.mitigatedProbability}
                onChange={e => updateHazard(h.id, { mitigatedProbability: e.target.value, mitigatedRiskClass: calcRisk(a.changeType, h.mitigatedSeverity, e.target.value) })}
                style={sel}
              >
                <option value="">— Select probability —</option>
                {probList.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>§2.5 Shared Consequence Group</label>
              <input
                value={h.sharedConsequenceGroup}
                onChange={e => updateHazard(h.id, { sharedConsequenceGroup: e.target.value })}
                style={inp}
                placeholder="Leave blank if none — enter a group name (e.g. 'MAC') if shared with other hazards"
              />
              <p style={hint}>If multiple hazards lead to the same accident outcome, enter the same group label here. Their probabilities must be summed per §2.5.</p>
            </div>
          </div>
        ))}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 5 — RISK EVALUATION
  // ─────────────────────────────────────────────────────────────

  function renderStep5() {
    const a = assessment;
    const isFn = a.changeType === 'functional';

    // Build shared consequence groups
    const groups = {};
    a.hazards.forEach(h => {
      if (h.sharedConsequenceGroup) {
        if (!groups[h.sharedConsequenceGroup]) groups[h.sharedConsequenceGroup] = [];
        groups[h.sharedConsequenceGroup].push(h);
      }
    });

    return (
      <>
        {a.hazards.map(h => (
          <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: C.navy, marginBottom: 2 }}>{h.ref} — {h.hazardTitle || '(untitled hazard)'}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{h.possibleHazard || h.harmfulEffect || ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Mitigated Risk</div>
                <RiskBadge riskClass={h.mitigatedRiskClass} />
                {h.mitigatedRiskClass && (
                  <div style={{ fontSize: 11, color: RISK_COLOR[h.mitigatedRiskClass] || C.muted, marginTop: 4, fontWeight: 600 }}>
                    {RISK_LABEL[h.mitigatedRiskClass]}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
              <div style={{ fontSize: 13, color: C.muted }}>
                <span style={{ fontWeight: 600 }}>Severity:</span>{' '}
                {h.mitigatedSeverity
                  ? (isFn ? FUNCTIONAL_SEVERITY.find(s => s.id === h.mitigatedSeverity)?.label : NONFUNCTIONAL_SEVERITY.find(s => s.id === h.mitigatedSeverity)?.label) || h.mitigatedSeverity
                  : '—'}
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>
                <span style={{ fontWeight: 600 }}>Probability:</span>{' '}
                {h.mitigatedProbability
                  ? (isFn ? FUNCTIONAL_PROBABILITY.find(p => p.id === h.mitigatedProbability)?.label : NONFUNCTIONAL_PROBABILITY.find(p => p.id === h.mitigatedProbability)?.label) || h.mitigatedProbability
                  : '—'}
              </div>
            </div>
            {isFn && h.mitigatedSeverity && h.mitigatedProbability && (
              <div style={{ marginTop: 14 }}>
                <RiskMatrixFunctional highlightSev={h.mitigatedSeverity} highlightProb={h.mitigatedProbability} />
              </div>
            )}
            {!isFn && h.mitigatedSeverity && h.mitigatedProbability && (
              <div style={{ marginTop: 14 }}>
                <RiskMatrixNonFunctional highlightSev={h.mitigatedSeverity} highlightProb={h.mitigatedProbability} />
              </div>
            )}
            {h.sharedConsequenceGroup && (
              <div style={{ marginTop: 10, padding: '6px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
                Shared consequence group: <strong>{h.sharedConsequenceGroup}</strong> — See combined probability summary below.
              </div>
            )}
          </div>
        ))}

        {Object.keys(groups).length > 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '16px 20px', marginTop: 8 }}>
            <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 10, fontSize: 14 }}>§2.5 Shared Consequence Groups</div>
            {Object.entries(groups).map(([groupName, hazards]) => (
              <div key={groupName} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, color: '#78350f', marginBottom: 6 }}>Group: "{groupName}"</div>
                {hazards.map(h => (
                  <div key={h.id} style={{ fontSize: 13, color: '#78350f', marginBottom: 2, paddingLeft: 12 }}>
                    • {h.ref} {h.hazardTitle && `— ${h.hazardTitle}`}: <RiskBadge riskClass={h.mitigatedRiskClass} />
                    {h.mitigatedProbability && <span style={{ marginLeft: 8 }}>P={h.mitigatedProbability}</span>}
                  </div>
                ))}
                <p style={{ fontSize: 12, color: '#92400e', margin: '8px 0 0 12px' }}>
                  Per §2.5: Sum the probabilities of all hazards in this group to determine the combined likelihood of the shared consequence. The combined probability may result in a higher risk classification.
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 6 — FURTHER MITIGATION
  // ─────────────────────────────────────────────────────────────

  function renderStep6() {
    const a = assessment;
    const isFn = a.changeType === 'functional';
    const sevList = isFn ? FUNCTIONAL_SEVERITY : NONFUNCTIONAL_SEVERITY;
    const probList = isFn ? FUNCTIONAL_PROBABILITY : NONFUNCTIONAL_PROBABILITY;
    return (
      <>
        {a.hazards.map(h => (
          <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, color: C.navy, marginBottom: 2 }}>{h.ref} — {h.hazardTitle || '(untitled hazard)'}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Current risk: <RiskBadge riskClass={h.mitigatedRiskClass} /></div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>New Mitigation Measures (col p)</label>
              <textarea
                value={h.newMitigations}
                onChange={e => updateHazard(h.id, { newMitigations: e.target.value })}
                style={{ ...inp, minHeight: 90, resize: 'vertical' }}
                placeholder="Describe new controls or barriers to be introduced. Leave blank if current risk is acceptable and no further mitigation is required."
              />
            </div>

            <div style={{ paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <div style={sectionTitle}>Final Risk Assessment (after new mitigations)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Final Severity</label>
                  <select
                    value={h.finalSeverity}
                    onChange={e => updateHazard(h.id, { finalSeverity: e.target.value, finalRiskClass: calcRisk(a.changeType, e.target.value, h.finalProbability) })}
                    style={sel}
                  >
                    <option value="">— Select —</option>
                    {sevList.map(sv => <option key={sv.id} value={sv.id}>{sv.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Final Probability</label>
                  <select
                    value={h.finalProbability}
                    onChange={e => updateHazard(h.id, { finalProbability: e.target.value, finalRiskClass: calcRisk(a.changeType, h.finalSeverity, e.target.value) })}
                    style={sel}
                  >
                    <option value="">— Select —</option>
                    {probList.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              {h.finalSeverity && h.finalProbability && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Final Risk Classification:</span>
                  <RiskBadge riskClass={h.finalRiskClass} />
                  {h.finalRiskClass && (
                    <span style={{ fontSize: 13, color: RISK_COLOR[h.finalRiskClass], fontWeight: 600 }}>
                      {RISK_LABEL[h.finalRiskClass]}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 7 — SAFETY REQUIREMENTS & MONITORING
  // ─────────────────────────────────────────────────────────────

  function renderStep7() {
    const a = assessment;
    return (
      <>
        {/* Per-hazard safety requirements */}
        {a.hazards.map(h => (
          <div key={h.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 4 }}>{h.ref} — {h.hazardTitle || '(untitled hazard)'}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
              Final risk: <RiskBadge riskClass={h.finalRiskClass || h.mitigatedRiskClass} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>New Safety Requirement (col r)</label>
              <textarea value={h.newSafetyRequirement} onChange={e => updateHazard(h.id, { newSafetyRequirement: e.target.value })} style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="State what must be true for the risk to remain tolerable — specific, verifiable, and traceable to this hazard" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Evidence Safety Requirement Has Been Met (col s)</label>
              <textarea value={h.evidenceSRMet} onChange={e => updateHazard(h.id, { evidenceSRMet: e.target.value })} style={{ ...inp, minHeight: 70, resize: 'vertical' }} placeholder="e.g. Training records, Technical acceptance certificate, Signed procedure, Audit report" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Monitoring Criteria</label>
              <textarea value={h.monitoringCriteria} onChange={e => updateHazard(h.id, { monitoringCriteria: e.target.value })} style={{ ...inp, minHeight: 60, resize: 'vertical' }} placeholder="How will ongoing compliance be monitored? e.g. Annual audit, Supervisor check, System health monitoring" />
            </div>
            <div>
              <label style={lbl}>Status (col t)</label>
              <select value={h.status} onChange={e => updateHazard(h.id, { status: e.target.value })} style={sel}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
        ))}

        {/* Overall assessment fields */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
          <div style={sectionTitle}>Table 1 — Overall Assessment Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 6 }}>
            <div>
              <label style={lbl}>Overall Safety Criteria Classification (col f)</label>
              <input value={assessment.safetyCriteriaClassificationOverall} onChange={e => update({ safetyCriteriaClassificationOverall: e.target.value })} style={inp} placeholder="Highest safety criteria class" />
            </div>
            <div>
              <label style={lbl}>Final Risk Classification Overall (col g)</label>
              <input value={assessment.finalRiskClassificationOverall} onChange={e => update({ finalRiskClassificationOverall: e.target.value })} style={inp} placeholder="Highest final risk class" />
              <p style={hint}>Typically auto-derived as worst final risk across all hazards</p>
            </div>
            <div>
              <label style={lbl}>Has Safety Criteria Been Met? (col h)</label>
              <select value={assessment.safetyCriteriaMet} onChange={e => update({ safetyCriteriaMet: e.target.value })} style={sel}>
                <option value="">— Select —</option>
                <option value="Y">Y — Yes</option>
                <option value="N">N — No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Verification checklist */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
          <div style={sectionTitle}>Verification Checklist — §2.2.8</div>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Confirm each of the following before submitting the assessment for approval:</p>
          {VERIFICATION_ITEMS.map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, cursor: 'pointer', padding: '8px 12px', borderRadius: 6, background: assessment.verificationChecked[i] ? '#f0fdf4' : C.bg, border: `1px solid ${assessment.verificationChecked[i] ? '#86efac' : C.border}` }}>
              <input
                type="checkbox"
                checked={assessment.verificationChecked[i]}
                onChange={e => {
                  const arr = [...assessment.verificationChecked];
                  arr[i] = e.target.checked;
                  update({ verificationChecked: arr });
                }}
                style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: assessment.verificationChecked[i] ? '#15803d' : '#374151', lineHeight: 1.5 }}>{item}</span>
            </label>
          ))}
          <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
            {assessment.verificationChecked.filter(Boolean).length} of 9 items confirmed
          </p>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // REVIEW & EXPORT
  // ─────────────────────────────────────────────────────────────

  function renderReview() {
    const a = assessment;
    const isFn = a.changeType === 'functional';
    const getSevLabel = (sev) => {
      if (!sev) return '—';
      if (isFn) return FUNCTIONAL_SEVERITY.find(s => s.id === sev)?.label || sev;
      return NONFUNCTIONAL_SEVERITY.find(s => s.id === sev)?.label || sev;
    };
    const getProbLabel = (prob) => {
      if (!prob) return '—';
      if (isFn) return FUNCTIONAL_PROBABILITY.find(p => p.id === prob)?.label || prob;
      return NONFUNCTIONAL_PROBABILITY.find(p => p.id === prob)?.label || prob;
    };

    return (
      <div>
        {/* Print header — visible only in print */}
        <div className="print-only" style={{ marginBottom: 20 }}>
          <div className="print-header">
            <img src={WESTON_LOGO} alt="Weston Airport" style={{ height: 48 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Risk Assessment — HIRA</div>
              <div style={{ fontSize: 12 }}>Dublin Weston Airport | DWA SAF 01 Supp4 v3.3</div>
              <div style={{ fontSize: 12 }}>Ref: {a.assessmentRef} | Date: {a.assessmentDate} | Assessor: {a.assessorName}</div>
            </div>
          </div>
        </div>

        {/* Screen summary header */}
        <div className="no-print" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
            <div><span style={{ fontSize: 12, color: C.muted }}>Reference</span><div style={{ fontWeight: 700, color: C.navy }}>{a.assessmentRef}</div></div>
            <div><span style={{ fontSize: 12, color: C.muted }}>Date</span><div style={{ fontWeight: 700, color: C.navy }}>{a.assessmentDate}</div></div>
            <div><span style={{ fontSize: 12, color: C.muted }}>Assessor</span><div style={{ fontWeight: 700, color: C.navy }}>{a.assessorName || '—'}</div></div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Change Type: </span>
            <span style={{ fontWeight: 600 }}>{isFn ? 'Functional System Change' : 'Non-Functional System Change'}</span>
          </div>
          {a.activityDescription && <div style={{ fontSize: 13, color: '#374151', background: C.bg, borderRadius: 6, padding: '8px 12px' }}>{a.activityDescription}</div>}
          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={{ padding: '10px 24px', background: C.navy, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
              Print / Save as PDF
            </button>
            <button onClick={() => downloadAssessmentJSON(a)} style={{ padding: '10px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
              Download as JSON
            </button>
            <button onClick={() => { if (window.confirm('Start a new assessment? This will clear all current data.')) { localStorage.removeItem('dwa-hira-draft'); setAssessment(null); setSavedDraft(null); } }} style={{ padding: '10px 20px', background: C.white, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
              New Assessment
            </button>
            <button onClick={() => goToStep(7)} style={{ padding: '10px 20px', background: C.white, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}>
              ← Back to Step 7
            </button>
          </div>
        </div>

        {/* TABLE 2 — Hazard Identification and Safety Criteria Form */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 8, borderBottom: `2px solid ${C.navy}`, paddingBottom: 6 }}>
            Table 2 — Hazard Identification and Safety Criteria Form
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>DWA SAF 01 Supp4 v3.3 — {isFn ? 'Functional System' : 'Non-Functional System'} Change</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Ref (e)</th>
                  <th style={th}>Possible Hazard (e)</th>
                  <th style={th}>Accident/Incident Type (f)</th>
                  <th style={th}>Harmful Effects (g)</th>
                  <th style={th}>Initial Severity (h)</th>
                  <th style={th}>Outcome (i)</th>
                  <th style={th}>Safety Criteria Classification (j)</th>
                </tr>
              </thead>
              <tbody>
                {a.hazards.map((h, i) => (
                  <tr key={h.id} style={{ background: i % 2 === 0 ? C.white : C.bg }}>
                    <td style={td}><strong>{h.ref}</strong></td>
                    <td style={td}>{h.possibleHazard || '—'}</td>
                    <td style={td}>{h.accidentIncidentType || '—'}</td>
                    <td style={td}>{h.harmfulEffects || '—'}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{h.t2SeverityClass}</td>
                    <td style={td}>{h.outcome || '—'}</td>
                    <td style={td}>{h.safetyCriteriaClassification || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page break for print */}
        <div className="print-page-break" />

        {/* Print header for page 2 */}
        <div className="print-only" style={{ marginBottom: 16, marginTop: 8 }}>
          <div className="print-header">
            <img src={WESTON_LOGO} alt="Weston Airport" style={{ height: 40 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Risk Assessment — Table 1</div>
              <div style={{ fontSize: 11 }}>Ref: {a.assessmentRef} | {a.assessmentDate} | {a.assessorName}</div>
            </div>
          </div>
        </div>

        {/* TABLE 1 — Risk Assessment & Evaluation Form */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 4, borderBottom: `2px solid ${C.navy}`, paddingBottom: 6 }}>
            Table 1 — Risk Assessment and Evaluation Form
          </div>

          {/* Table 1 header section */}
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', marginBottom: 10, fontSize: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div><span style={{ color: C.muted }}>Ref:</span> <strong>{a.assessmentRef}</strong></div>
              <div><span style={{ color: C.muted }}>Date:</span> <strong>{a.assessmentDate}</strong></div>
              <div><span style={{ color: C.muted }}>Team:</span> <strong>{a.assessmentTeam || '—'}</strong></div>
              <div><span style={{ color: C.muted }}>Safety Criteria Classification (f):</span> <strong>{a.safetyCriteriaClassificationOverall || '—'}</strong></div>
              <div><span style={{ color: C.muted }}>Final Risk Classification (g):</span> <strong>{a.finalRiskClassificationOverall || '—'}</strong></div>
              <div><span style={{ color: C.muted }}>Safety Criteria Met (h):</span> <strong>{a.safetyCriteriaMet || '—'}</strong></div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={th}>Ref (i)</th>
                  <th style={th}>Hazard (j)</th>
                  <th style={th}>Accident Type (k)</th>
                  <th style={th}>Harmful Effect (l)</th>
                  <th style={th}>Current Mitigations (m)</th>
                  <th style={th}>Worst Mitigated Effect (n)</th>
                  <th style={th}>Mitigated Sev.</th>
                  <th style={th}>Mitigated Prob.</th>
                  <th style={th}>Mitigated Risk (o)</th>
                  <th style={th}>New Mitigations (p)</th>
                  <th style={th}>Final Sev.</th>
                  <th style={th}>Final Prob.</th>
                  <th style={th}>Final Risk (q)</th>
                  <th style={th}>Safety Req. (r)</th>
                  <th style={th}>Evidence SR Met (s)</th>
                  <th style={th}>Status (t)</th>
                </tr>
              </thead>
              <tbody>
                {a.hazards.map((h, i) => (
                  <tr key={h.id} style={{ background: i % 2 === 0 ? C.white : C.bg, verticalAlign: 'top' }}>
                    <td style={{ ...td, fontWeight: 700 }}>{h.ref}</td>
                    <td style={td}>{h.hazardTitle || '—'}</td>
                    <td style={td}>{h.accidentType || '—'}</td>
                    <td style={td}>{h.harmfulEffect || '—'}</td>
                    <td style={td}>{h.currentMitigation || '—'}</td>
                    <td style={td}>{h.worstMitigatedEffect || '—'}</td>
                    <td style={td}>{getSevLabel(h.mitigatedSeverity)}</td>
                    <td style={td}>{getProbLabel(h.mitigatedProbability)}</td>
                    <td style={td}>
                      {h.mitigatedRiskClass
                        ? <span style={{ fontWeight: 700, color: RISK_COLOR[h.mitigatedRiskClass] }}>{h.mitigatedRiskClass}</span>
                        : '—'}
                    </td>
                    <td style={td}>{h.newMitigations || '—'}</td>
                    <td style={td}>{getSevLabel(h.finalSeverity)}</td>
                    <td style={td}>{getProbLabel(h.finalProbability)}</td>
                    <td style={td}>
                      {h.finalRiskClass
                        ? <span style={{ fontWeight: 700, color: RISK_COLOR[h.finalRiskClass] }}>{h.finalRiskClass}</span>
                        : '—'}
                    </td>
                    <td style={td}>{h.newSafetyRequirement || '—'}</td>
                    <td style={td}>{h.evidenceSRMet || '—'}</td>
                    <td style={td}>{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification checklist summary */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 10 }}>Verification Checklist — §2.2.8</div>
          {VERIFICATION_ITEMS.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: a.verificationChecked[i] ? '#16a34a' : '#dc2626', fontWeight: 700, flexShrink: 0 }}>
                {a.verificationChecked[i] ? '✓' : '✗'}
              </span>
              <span style={{ color: a.verificationChecked[i] ? '#15803d' : '#374151' }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: C.faint, textAlign: 'center', marginTop: 16, paddingBottom: 24 }}>
          DWA SAF 01 Supp4 v3.3 — Dublin Weston Airport Risk Assessment &amp; Mitigation Procedures
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PROGRESS BAR
  // ─────────────────────────────────────────────────────────────

  function renderProgress() {
    const steps = [
      { n: 1, label: 'System\nDescription' },
      { n: 2, label: 'Hazard\nIdentification' },
      { n: 3, label: 'Severity' },
      { n: 4, label: 'Probability' },
      { n: 5, label: 'Risk\nEvaluation' },
      { n: 6, label: 'Further\nMitigation' },
      { n: 7, label: 'Safety\nRequirements' },
      { n: 8, label: 'Review' },
    ];
    const current = assessment.currentStep;
    return (
      <div className="no-print" style={{ background: '#e8f0fe', padding: '0 0 12px 0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 560 }}>
          {steps.map((s, i) => {
            const isDone = s.n < current;
            const isActive = s.n === current;
            return (
              <button
                key={s.n}
                onClick={() => { if (isDone || isActive) goToStep(s.n); }}
                style={{
                  flex: 1, padding: '10px 4px', background: 'none', border: 'none', cursor: isDone ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: C.font,
                  opacity: isDone || isActive ? 1 : 0.45,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isActive ? C.navy : isDone ? '#2563eb' : '#cbd5e1',
                  color: isActive || isDone ? '#fff' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {isDone ? '✓' : s.n}
                </div>
                <div style={{ fontSize: 10, color: isActive ? C.navy : isDone ? '#2563eb' : '#94a3b8', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre' }}>
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION BUTTONS
  // ─────────────────────────────────────────────────────────────

  function renderNavButtons() {
    const step = assessment.currentStep;
    return (
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={() => goToStep(Math.max(1, step - 1))}
          disabled={step === 1}
          style={{ padding: '10px 24px', background: step === 1 ? '#f1f5f9' : C.white, color: step === 1 ? C.faint : C.navy, border: `1px solid ${step === 1 ? '#e2e8f0' : C.border}`, borderRadius: 6, fontWeight: 600, cursor: step === 1 ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: C.font }}
        >
          ← Back
        </button>
        {step < 8 ? (
          <button
            onClick={() => goToStep(step + 1)}
            style={{ padding: '10px 28px', background: C.navy, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: C.font }}
          >
            {step === 7 ? 'Review Assessment →' : 'Next →'}
          </button>
        ) : null}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP TITLES
  // ─────────────────────────────────────────────────────────────

  const STEP_TITLES = {
    1: 'Step 1 — System Description',
    2: 'Step 2 — Hazard Identification',
    3: 'Step 3 — Severity Classification',
    4: 'Step 4 — Probability / Likelihood Assessment',
    5: 'Step 5 — Risk Evaluation',
    6: 'Step 6 — Further Mitigation',
    7: 'Step 7 — Safety Requirements & Monitoring',
    8: 'Review & Export',
  };

  // ─────────────────────────────────────────────────────────────
  // SHARED INLINE STYLE SHORTCUTS
  // ─────────────────────────────────────────────────────────────

  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 };
  const inp = { width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, fontFamily: C.font, color: '#1e293b', boxSizing: 'border-box', background: C.white };
  const sel = { width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, fontFamily: C.font, color: '#1e293b', boxSizing: 'border-box', background: C.white, cursor: 'pointer' };
  const hint = { fontSize: 11, color: C.faint, marginTop: 3, marginBottom: 0 };
  const sectionTitle = { fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${C.border}` };
  const th = { padding: '7px 8px', background: C.navy, color: '#fff', textAlign: 'left', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', border: '1px solid #4a6fa5' };
  const td = { padding: '6px 8px', border: `1px solid ${C.border}`, fontSize: 11, verticalAlign: 'top', lineHeight: 1.4 };

  // ─────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────

  if (!assessment) {
    return (
      <>
        <style>{PRINT_CSS}</style>
        {renderWelcome()}
      </>
    );
  }

  const step = assessment.currentStep;
  const stepContent = step === 1 ? renderStep1()
    : step === 2 ? renderStep2()
    : step === 3 ? renderStep3()
    : step === 4 ? renderStep4()
    : step === 5 ? renderStep5()
    : step === 6 ? renderStep6()
    : step === 7 ? renderStep7()
    : renderReview();

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: C.font }}>

        {/* Header */}
        <header className="no-print" style={{ background: C.navy, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={WESTON_LOGO} alt="Weston Airport" style={{ height: 40 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Risk Assessment (HIRA)</div>
              <div style={{ color: '#93c5fd', fontSize: 11 }}>Dublin Weston Airport — DWA SAF 01 Supp4 v3.3</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {assessment.savedAt && (
              <span style={{ color: '#86efac', fontSize: 11 }}>
                Saved {new Date(assessment.savedAt).toLocaleTimeString()}
              </span>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#93c5fd', fontSize: 12 }}>
              <input
                type="checkbox"
                checked={trainedMode}
                onChange={e => setTrainedMode(e.target.checked)}
                style={{ width: 14, height: 14 }}
              />
              Trained professional
            </label>
          </div>
        </header>

        {/* Progress */}
        {renderProgress()}

        {/* Content */}
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>
          <div className="no-print" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: 0 }}>{STEP_TITLES[step]}</h2>
            {step < 8 && (
              <p style={{ fontSize: 12, color: C.faint, margin: '4px 0 0 0' }}>
                Ref: {assessment.assessmentRef}
                {assessment.assessorName ? ` — ${assessment.assessorName}` : ''}
              </p>
            )}
          </div>

          {/* Help panel (steps 1–7 only) */}
          {step < 8 && (
            <HelpPanel
              step={step}
              isOpen={!!helpOpen[step]}
              onToggle={() => setHelpOpen(prev => ({ ...prev, [step]: !prev[step] }))}
            />
          )}

          {stepContent}

          {step < 8 && renderNavButtons()}
        </main>
      </div>
    </>
  );
}
