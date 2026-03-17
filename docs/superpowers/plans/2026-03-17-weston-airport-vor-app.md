# Weston Airport VOR App Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone cross-platform Voluntary Occurrence Report app for Weston Airport using React + Capacitor, delivering silently via EmailJS to mandatory recipients.

**Architecture:** A single React (Vite) codebase serves as both the web/desktop PWA and the foundation for Capacitor-wrapped iOS/Android apps. The form collects occurrence data, validates it, assembles a formatted email, and sends it via EmailJS — no backend required. Location and recipient configuration live in editable JSON files.

**Tech Stack:** React 18, Vite, Capacitor 6, `@capacitor/camera`, `@capacitor/filesystem`, EmailJS (`emailjs-com`), plain CSS (mobile-first)

**Spec:** `docs/superpowers/specs/2026-03-17-weston-airport-vor-app-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `src/config/locations.json` | Editable list of location dropdown options |
| `src/config/recipients.json` | Mandatory + selectable recipient names and emails |
| `src/App.jsx` | Root component — switches between form and success screen |
| `src/index.css` | Global mobile-first styles, CSS variables for brand colours |
| `src/components/AppHeader.jsx` | Logo + app title bar, shown on every screen |
| `src/components/VORForm.jsx` | Main form — assembles all question blocks, owns form state |
| `src/components/OccurrenceTypeField.jsx` | Q1 radio group with "Other" free-text reveal |
| `src/components/AnonymousFields.jsx` | Q2–Q4 name/phone/email with optional note |
| `src/components/EccairsField.jsx` | Q5 Yes/No/Don't know radio group |
| `src/components/DateTimeField.jsx` | Q6 datetime picker |
| `src/components/LocationField.jsx` | Q7 dropdown + "Other" reveal text field |
| `src/components/FreeTextField.jsx` | Reusable labelled input or textarea |
| `src/components/AttachmentPicker.jsx` | Photo/file picker — camera on mobile, file input on desktop |
| `src/components/SendToSection.jsx` | Mandatory locked recipients + selectable director checkboxes |
| `src/components/SuccessScreen.jsx` | Post-submit confirmation screen |
| `src/hooks/useEmailSend.js` | EmailJS integration — assembles and sends the report email |
| `src/hooks/useAttachments.js` | Manages attachment list state and size validation |
| `src/utils/formatReport.js` | Formats form data into a readable email body string |
| `src/utils/validateForm.js` | Pure validation logic — returns error map from form state |
| `public/weston-logo.png` | Weston Airport logo asset |
| `.env.example` | Template for EmailJS environment variables |
| `capacitor.config.json` | Capacitor app ID, app name, web dir |

---

## Task 1: Scaffold the project

**Files:**
- Create: `weston-vor/` (new project root, sibling to `my-app/`)
- Create: `capacitor.config.json`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Create Vite + React project**

```bash
cd /Users/ash
npm create vite@latest weston-vor -- --template react
cd weston-vor
npm install
```

Expected: project created with `src/App.jsx`, `src/main.jsx`, `index.html`

- [ ] **Step 2: Install dependencies**

```bash
npm install @capacitor/core @capacitor/cli @capacitor/camera @capacitor/filesystem emailjs-com
npx cap init "Weston VOR" "ie.westonairport.vor" --web-dir dist
```

- [ ] **Step 3: Add iOS and Android platforms**

```bash
npx cap add ios
npx cap add android
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Copy this to .env and fill in your EmailJS credentials
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

- [ ] **Step 5: Create `.env` from example and add to `.gitignore`**

```bash
cp .env.example .env
echo ".env" >> .gitignore
echo "node_modules" >> .gitignore
echo "dist" >> .gitignore
echo "ios" >> .gitignore
echo "android" >> .gitignore
```

- [ ] **Step 6: Copy Weston Airport logo**

Copy `weston-logo.png` from your existing project or source file into `public/weston-logo.png`.

```bash
cp /Users/ash/my-app/public/logo192.png /Users/ash/weston-vor/public/weston-logo.png
```

> Replace with the actual Weston Airport logo PNG file.

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server running at `http://localhost:5173`

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold React + Capacitor project"
```

---

## Task 2: Config files and global styles

**Files:**
- Create: `src/config/locations.json`
- Create: `src/config/recipients.json`
- Create: `src/index.css`

- [ ] **Step 1: Create `src/config/locations.json`**

```json
[
  "Apron",
  "Tower",
  "Hangar",
  "Runway",
  "Taxiway",
  "Terminal",
  "Airside",
  "Landside",
  "Perimeter",
  "Remote"
]
```

- [ ] **Step 2: Create `src/config/recipients.json`**

```json
{
  "mandatory": [
    { "name": "Safety Manager", "email": "safety.manager@westonairport.ie" },
    { "name": "Line Manager", "email": "line.manager@westonairport.ie" },
    { "name": "Dir. SQC", "email": "dir.sqc@westonairport.ie" }
  ],
  "selectable": [
    { "name": "Director of ANS", "email": "director.ans@westonairport.ie" },
    { "name": "Dir. Operations", "email": "dir.operations@westonairport.ie" }
  ]
}
```

> Replace placeholder emails with real addresses before deployment.

- [ ] **Step 3: Replace `src/index.css` with global styles**

```css
:root {
  --brand-navy: #1a3a5c;
  --brand-green: #2a6a2a;
  --error-red: #cc0000;
  --bg: #f5f7fa;
  --card-bg: #ffffff;
  --border: #ccd;
  --text: #222;
  --subtle: #666;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
}

.app { max-width: 680px; margin: 0 auto; padding: 0 16px 40px; }

h1 { font-size: 1.2rem; color: var(--brand-navy); }
h2 { font-size: 1rem; color: var(--brand-navy); margin-bottom: 4px; }

label { display: block; font-weight: 600; color: var(--brand-navy); margin-bottom: 4px; }
input[type="text"], input[type="email"], input[type="tel"],
input[type="datetime-local"], select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 1rem;
  font-family: var(--font);
  background: #fff;
}
input:focus, select:focus, textarea:focus {
  outline: 2px solid var(--brand-navy);
  border-color: transparent;
}
textarea { resize: vertical; min-height: 80px; }

.field { margin-bottom: 20px; }
.helper { font-size: 0.82rem; color: var(--subtle); margin-top: 4px; font-style: italic; }
.error-msg { font-size: 0.82rem; color: var(--error-red); margin-top: 4px; }
.required { color: var(--error-red); }

.radio-group { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.radio-group label { font-weight: 400; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.radio-group input[type="radio"] { width: 18px; height: 18px; cursor: pointer; }

.checkbox-group { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.checkbox-group label { font-weight: 400; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }

.btn-primary {
  display: block; width: 100%; padding: 14px;
  background: var(--brand-navy); color: #fff;
  border: none; border-radius: 8px;
  font-size: 1.05rem; font-weight: 700;
  cursor: pointer; margin-top: 24px;
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary {
  padding: 8px 16px; background: #fff; color: var(--brand-navy);
  border: 2px solid var(--brand-navy); border-radius: 6px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
}

.section-note {
  background: #f0f4f8; border-radius: 6px; padding: 10px 14px;
  font-size: 0.85rem; color: var(--subtle); font-style: italic;
  margin-bottom: 20px;
}
.send-to-box {
  background: #e8f0e8; border-left: 4px solid var(--brand-green);
  border-radius: 6px; padding: 14px; margin-bottom: 20px;
}
.send-to-box h2 { color: var(--brand-green); margin-bottom: 10px; }
.send-to-divider { font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  color: var(--subtle); letter-spacing: 0.05em; margin: 12px 0 6px; }
```

- [ ] **Step 4: Commit**

```bash
git add src/config/ src/index.css
git commit -m "feat: add config files and global styles"
```

---

## Task 3: Utility functions (pure, testable)

**Files:**
- Create: `src/utils/formatReport.js`
- Create: `src/utils/validateForm.js`
- Create: `src/utils/formatReport.test.js`
- Create: `src/utils/validateForm.test.js`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

Add to `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom' }
})
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Write failing tests for `formatReport`**

Create `src/utils/formatReport.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { formatReport } from './formatReport'

describe('formatReport', () => {
  const base = {
    occurrenceType: 'An Incident',
    occurrenceTypeOther: '',
    reporterName: 'Jane Smith',
    contactNumber: '',
    emailAddress: '',
    eccairsRequired: 'No',
    dateTime: '2026-03-17T14:30',
    location: 'Hangar',
    locationOther: '',
    whoAffected: 'Ground crew',
    aircraftDetails: 'N/A',
    description: 'Fuel spill near hangar 2.',
    additionalDetails: '',
    selectedDirectors: ['Director of ANS'],
  }

  it('includes occurrence type', () => {
    expect(formatReport(base)).toContain('An Incident')
  })

  it('uses Other text when occurrence type is Other', () => {
    const r = { ...base, occurrenceType: 'Other', occurrenceTypeOther: 'Drone sighting' }
    expect(formatReport(r)).toContain('Drone sighting')
  })

  it('uses Other text when location is Other', () => {
    const r = { ...base, location: 'Other — please specify', locationOther: 'Fuel farm' }
    expect(formatReport(r)).toContain('Fuel farm')
  })

  it('marks anonymous fields when empty', () => {
    expect(formatReport({ ...base, reporterName: '' })).toContain('Anonymous')
  })

  it('includes selected directors', () => {
    expect(formatReport(base)).toContain('Director of ANS')
  })
})
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL — `formatReport` not found

- [ ] **Step 4: Implement `src/utils/formatReport.js`**

```js
export function formatReport(data) {
  const {
    occurrenceType, occurrenceTypeOther,
    reporterName, contactNumber, emailAddress,
    eccairsRequired, dateTime,
    location, locationOther,
    whoAffected, aircraftDetails,
    description, additionalDetails,
    selectedDirectors,
  } = data

  const locationDisplay = location === 'Other — please specify' ? locationOther : location
  const typeDisplay = occurrenceType === 'Other' ? `Other: ${occurrenceTypeOther}` : occurrenceType

  const line = (label, value) => `${label}: ${value || 'Not provided'}\n`

  return [
    '=== WESTON AIRPORT — VOLUNTARY OCCURRENCE REPORT ===\n',
    line('1. Report Type', typeDisplay),
    line('2. Reporter Name', reporterName || 'Anonymous'),
    line('3. Contact Number', contactNumber || 'Anonymous'),
    line('4. Email Address', emailAddress || 'Anonymous'),
    line('5. ECCAIRS Required', eccairsRequired),
    line('6. Date & Time', dateTime),
    line('7. Location', locationDisplay),
    line('8. Who Was Affected', whoAffected),
    line('9. Aircraft Details', aircraftDetails),
    '\n10. Description:\n' + description + '\n',
    additionalDetails ? '\n11. Additional Details:\n' + additionalDetails + '\n' : '',
    '\n--- Send To ---',
    'Mandatory: Safety Manager, Line Manager, Dir. SQC',
    'Selected Director(s): ' + selectedDirectors.join(', '),
  ].join('\n')
}
```

- [ ] **Step 5: Write failing tests for `validateForm`**

Create `src/utils/validateForm.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { validateForm } from './validateForm'

const validForm = {
  occurrenceType: 'An Incident',
  occurrenceTypeOther: '',
  dateTime: '2026-03-17T14:30',
  location: 'Hangar',
  locationOther: '',
  description: 'A detailed description of the incident.',
  selectedDirectors: ['Director of ANS'],
}

describe('validateForm', () => {
  it('returns no errors for a valid form', () => {
    expect(validateForm(validForm)).toEqual({})
  })

  it('requires occurrenceType', () => {
    const errors = validateForm({ ...validForm, occurrenceType: '' })
    expect(errors.occurrenceType).toBeDefined()
  })

  it('requires occurrenceTypeOther when type is Other', () => {
    const errors = validateForm({ ...validForm, occurrenceType: 'Other', occurrenceTypeOther: '' })
    expect(errors.occurrenceTypeOther).toBeDefined()
  })

  it('requires dateTime', () => {
    const errors = validateForm({ ...validForm, dateTime: '' })
    expect(errors.dateTime).toBeDefined()
  })

  it('requires location', () => {
    const errors = validateForm({ ...validForm, location: '' })
    expect(errors.location).toBeDefined()
  })

  it('requires locationOther when location is Other', () => {
    const errors = validateForm({ ...validForm, location: 'Other — please specify', locationOther: '' })
    expect(errors.locationOther).toBeDefined()
  })

  it('requires description of at least 10 chars', () => {
    const errors = validateForm({ ...validForm, description: 'Short' })
    expect(errors.description).toBeDefined()
  })

  it('requires at least one director', () => {
    const errors = validateForm({ ...validForm, selectedDirectors: [] })
    expect(errors.selectedDirectors).toBeDefined()
  })
})
```

- [ ] **Step 6: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL — `validateForm` not found

- [ ] **Step 7: Implement `src/utils/validateForm.js`**

```js
export function validateForm(data) {
  const errors = {}

  if (!data.occurrenceType) {
    errors.occurrenceType = 'Please select a report type.'
  }
  if (data.occurrenceType === 'Other' && !data.occurrenceTypeOther?.trim()) {
    errors.occurrenceTypeOther = 'Please specify the occurrence type.'
  }
  if (!data.dateTime) {
    errors.dateTime = 'Please enter the date and time.'
  }
  if (!data.location) {
    errors.location = 'Please select a location.'
  }
  if (data.location === 'Other — please specify' && !data.locationOther?.trim()) {
    errors.locationOther = 'Please specify the location.'
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Please provide a description of at least 10 characters.'
  }
  if (!data.selectedDirectors || data.selectedDirectors.length === 0) {
    errors.selectedDirectors = 'Please select at least one Director.'
  }

  return errors
}
```

- [ ] **Step 8: Run all tests — expect PASS**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 9: Commit**

```bash
git add src/utils/
git commit -m "feat: add formatReport and validateForm utilities with tests"
```

---

## Task 4: AppHeader component

**Files:**
- Create: `src/components/AppHeader.jsx`
- Create: `src/components/AppHeader.css`

- [ ] **Step 1: Create `src/components/AppHeader.css`**

```css
.app-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0 18px;
  border-bottom: 3px solid var(--brand-navy);
  margin-bottom: 24px;
}
.app-header img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}
.app-header-text h1 { font-size: 1.1rem; }
.app-header-text p { font-size: 0.82rem; color: var(--subtle); margin-top: 2px; }
```

- [ ] **Step 2: Create `src/components/AppHeader.jsx`**

```jsx
import './AppHeader.css'
import logo from '/weston-logo.png'

export default function AppHeader() {
  return (
    <header className="app-header">
      <img src={logo} alt="Weston Airport logo" />
      <div className="app-header-text">
        <h1>Voluntary Occurrence Report</h1>
        <p>Weston Airport</p>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Wire into `src/App.jsx` temporarily to verify it renders**

```jsx
import AppHeader from './components/AppHeader'
import './index.css'

export default function App() {
  return (
    <div className="app">
      <AppHeader />
      <p>Form coming soon…</p>
    </div>
  )
}
```

- [ ] **Step 4: Run dev server and visually confirm header renders**

```bash
npm run dev
```

Open `http://localhost:5173` — confirm logo and title display correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppHeader.jsx src/components/AppHeader.css src/App.jsx
git commit -m "feat: add AppHeader component"
```

---

## Task 5: Form field components

**Files:**
- Create: `src/components/OccurrenceTypeField.jsx`
- Create: `src/components/AnonymousFields.jsx`
- Create: `src/components/EccairsField.jsx`
- Create: `src/components/DateTimeField.jsx`
- Create: `src/components/LocationField.jsx`
- Create: `src/components/FreeTextField.jsx`

Each component receives `value`, `onChange`, and `error` props (where applicable).

- [ ] **Step 1: Create `src/components/FreeTextField.jsx`** (reusable — build first)

```jsx
export default function FreeTextField({ id, label, value, onChange, placeholder, required, error, multiline, helper }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      {helper && <p className="helper">{helper}</p>}
      {multiline
        ? <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/OccurrenceTypeField.jsx`**

```jsx
const OPTIONS = [
  'An Accident',
  'An Incident',
  'A Health & Safety Incident',
  'A Near Miss',
  'An Observation',
  'A Suggestion for Improvement',
  'Other',
]

export default function OccurrenceTypeField({ value, otherValue, onChange, onOtherChange, error, otherError }) {
  return (
    <div className="field">
      <label>1. What would you like to report? <span className="required">*</span></label>
      <div className="radio-group">
        {OPTIONS.map(opt => (
          <label key={opt}>
            <input
              type="radio"
              name="occurrenceType"
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="error-msg">{error}</p>}
      {value === 'Other' && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Please specify…"
            value={otherValue}
            onChange={e => onOtherChange(e.target.value)}
            style={{ borderColor: otherError ? 'var(--error-red)' : undefined }}
          />
          {otherError && <p className="error-msg">{otherError}</p>}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/AnonymousFields.jsx`**

```jsx
import FreeTextField from './FreeTextField'

export default function AnonymousFields({ name, phone, email, onChange }) {
  const helper = 'You may remain anonymous if you wish.'
  return (
    <>
      <p className="section-note">{helper}</p>
      <FreeTextField id="name" label="2. Your name" value={name} onChange={v => onChange('reporterName', v)} placeholder="Optional" />
      <FreeTextField id="phone" label="3. Contact number" value={phone} onChange={v => onChange('contactNumber', v)} placeholder="Optional" />
      <FreeTextField id="email" label="4. Email address" value={email} onChange={v => onChange('emailAddress', v)} placeholder="Optional" />
    </>
  )
}
```

- [ ] **Step 4: Create `src/components/EccairsField.jsx`**

```jsx
export default function EccairsField({ value, onChange }) {
  return (
    <div className="field">
      <label>5. Is a Mandatory Occurrence Report (ECCAIRS) required?</label>
      <div className="radio-group">
        {['Yes', 'No', "Don't know"].map(opt => (
          <label key={opt}>
            <input type="radio" name="eccairs" value={opt} checked={value === opt} onChange={() => onChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/DateTimeField.jsx`**

```jsx
export default function DateTimeField({ value, onChange, error }) {
  return (
    <div className="field">
      <label htmlFor="dateTime">6. When did this happen? <span className="required">*</span></label>
      <input
        id="dateTime"
        type="datetime-local"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ borderColor: error ? 'var(--error-red)' : undefined }}
      />
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 6: Create `src/components/LocationField.jsx`**

```jsx
import locations from '../config/locations.json'

const ALL_OPTIONS = [...locations, 'Other — please specify']

export default function LocationField({ value, otherValue, onChange, onOtherChange, error, otherError }) {
  return (
    <div className="field">
      <label htmlFor="location">7. Where did this happen? <span className="required">*</span></label>
      <select
        id="location"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ borderColor: error ? 'var(--error-red)' : undefined }}
      >
        <option value="">Select location…</option>
        {ALL_OPTIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
      </select>
      {error && <p className="error-msg">{error}</p>}
      {value === 'Other — please specify' && (
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            placeholder="e.g. North perimeter fence, Fuel farm…"
            value={otherValue}
            onChange={e => onOtherChange(e.target.value)}
            style={{ borderColor: otherError ? 'var(--error-red)' : undefined }}
          />
          {otherError && <p className="error-msg">{otherError}</p>}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Run dev server — no visual regression on header**

```bash
npm run dev
```

No test yet for these components — they will be exercised through VORForm integration in Task 6.

- [ ] **Step 8: Commit**

```bash
git add src/components/
git commit -m "feat: add form field components"
```

---

## Task 6: AttachmentPicker component

**Files:**
- Create: `src/hooks/useAttachments.js`
- Create: `src/components/AttachmentPicker.jsx`
- Create: `src/components/AttachmentPicker.css`

- [ ] **Step 1: Write failing test for `useAttachments` size validation**

Create `src/hooks/useAttachments.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { isFileTooLarge } from './useAttachments'

describe('isFileTooLarge', () => {
  it('returns false for files under 50KB', () => {
    expect(isFileTooLarge(49000)).toBe(false)
  })
  it('returns true for files over 50KB', () => {
    expect(isFileTooLarge(51000)).toBe(true)
  })
  it('returns false for exactly 50KB', () => {
    expect(isFileTooLarge(50 * 1024)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test
```

- [ ] **Step 3: Create `src/hooks/useAttachments.js`**

```js
import { useState } from 'react'

export const MAX_ATTACHMENT_SIZE = 50 * 1024 // 50KB

export function isFileTooLarge(sizeBytes) {
  return sizeBytes > MAX_ATTACHMENT_SIZE
}

export default function useAttachments() {
  const [attachments, setAttachments] = useState([]) // [{ name, dataUrl, size }]
  const [sizeError, setSizeError] = useState('')

  function addAttachment(file) {
    if (isFileTooLarge(file.size)) {
      setSizeError(`"${file.name}" is too large (max 50KB). Please choose a smaller file.`)
      return
    }
    setSizeError('')
    const reader = new FileReader()
    reader.onload = e => {
      setAttachments(prev => [...prev, { name: file.name, dataUrl: e.target.result, size: file.size }])
    }
    reader.readAsDataURL(file)
  }

  function removeAttachment(index) {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return { attachments, addAttachment, removeAttachment, sizeError }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Create `src/components/AttachmentPicker.css`**

```css
.attachment-picker { border: 2px dashed var(--border); border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px; }
.attachment-picker h2 { margin-bottom: 6px; }
.attachment-picker p { font-size: 0.85rem; color: var(--subtle); margin-bottom: 10px; }
.attachment-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.attachment-chip { display: flex; align-items: center; gap: 6px; background: #eee; border-radius: 20px; padding: 4px 10px; font-size: 0.82rem; }
.attachment-chip button { background: none; border: none; cursor: pointer; color: var(--error-red); font-size: 1rem; line-height: 1; }
```

- [ ] **Step 6: Create `src/components/AttachmentPicker.jsx`**

```jsx
import './AttachmentPicker.css'

export default function AttachmentPicker({ attachments, onAdd, onRemove, sizeError }) {
  function handleFileChange(e) {
    Array.from(e.target.files).forEach(onAdd)
    e.target.value = ''
  }

  return (
    <div className="attachment-picker">
      <h2>Attachments</h2>
      <p>Mobile: take photo or choose from gallery. Desktop: photos, PDF, Word documents.</p>
      <label style={{ display: 'inline-block', cursor: 'pointer' }}>
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
          // capture="environment" is intentionally omitted here.
          // On mobile, Capacitor's Camera plugin handles photo capture natively.
          // On desktop browsers, omitting capture ensures the standard file picker opens.
        />
        <span className="btn-secondary">+ Add Photo / File</span>
      </label>
      {sizeError && <p className="error-msg" style={{ marginTop: 8 }}>{sizeError}</p>}
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((a, i) => (
            <div key={i} className="attachment-chip">
              <span>{a.name}</span>
              <button onClick={() => onRemove(i)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useAttachments.js src/hooks/useAttachments.test.js src/components/AttachmentPicker.jsx src/components/AttachmentPicker.css
git commit -m "feat: add AttachmentPicker with 50KB size validation"
```

---

## Task 7: SendToSection component

**Files:**
- Create: `src/components/SendToSection.jsx`
- Create: `src/components/SendToSection.css`

- [ ] **Step 1: Create `src/components/SendToSection.css`**

```css
.send-to-box { background: #e8f0e8; border-left: 4px solid var(--brand-green); border-radius: 6px; padding: 14px; margin-bottom: 20px; }
.send-to-box h2 { color: var(--brand-green); margin-bottom: 4px; }
.send-to-divider { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--subtle); letter-spacing: 0.05em; margin: 12px 0 6px; }
.mandatory-label { color: var(--subtle); font-size: 0.78rem; margin-left: 4px; font-style: italic; }
```

- [ ] **Step 2: Create `src/components/SendToSection.jsx`**

```jsx
import recipients from '../config/recipients.json'
import './SendToSection.css'

export default function SendToSection({ selectedDirectors, onChange, error }) {
  function toggleDirector(name) {
    if (selectedDirectors.includes(name)) {
      onChange(selectedDirectors.filter(d => d !== name))
    } else {
      onChange([...selectedDirectors, name])
    }
  }

  return (
    <div className="send-to-box">
      <h2>Send To <span className="required">*</span></h2>

      <p className="send-to-divider">Always included</p>
      <div className="checkbox-group">
        {recipients.mandatory.map(r => (
          <label key={r.name}>
            <input type="checkbox" checked disabled />
            {r.name} <span className="mandatory-label">(mandatory)</span>
          </label>
        ))}
      </div>

      <p className="send-to-divider">Select your Director <span className="required">*</span></p>
      <div className="checkbox-group">
        {recipients.selectable.map(r => (
          <label key={r.name}>
            <input
              type="checkbox"
              checked={selectedDirectors.includes(r.name)}
              onChange={() => toggleDirector(r.name)}
            />
            {r.name}
          </label>
        ))}
      </div>
      {error && <p className="error-msg" style={{ marginTop: 8 }}>{error}</p>}
      <p className="helper" style={{ marginTop: 10 }}>All selected recipients are notified automatically on submission.</p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SendToSection.jsx src/components/SendToSection.css
git commit -m "feat: add SendToSection with mandatory + selectable recipients"
```

---

## Task 8: EmailJS hook

**Files:**
- Create: `src/hooks/useEmailSend.js`

- [ ] **Step 1: Sign up for EmailJS**

1. Go to [https://www.emailjs.com](https://www.emailjs.com) and create a free account
2. Add an email service (Gmail or Outlook recommended)
3. Create an email template with these variables:
   - `{{to_emails}}` — comma-separated recipient addresses
   - `{{subject}}` — email subject line
   - `{{report_body}}` — full formatted report text
4. Copy your Service ID, Template ID, and Public Key into `.env`:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
   ```

- [ ] **Step 2: Create `src/hooks/useEmailSend.js`**

```js
import { useState } from 'react'
import emailjs from 'emailjs-com'
import recipients from '../config/recipients.json'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function useEmailSend() {
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  async function sendReport(formData, reportBody, attachments = []) {
    setSending(true)
    setSendError('')

    const mandatoryEmails = recipients.mandatory.map(r => r.email)
    const selectedEmails = recipients.selectable
      .filter(r => formData.selectedDirectors.includes(r.name))
      .map(r => r.email)
    const allEmails = [...mandatoryEmails, ...selectedEmails].join(', ')

    const templateParams = {
      to_emails: allEmails,
      subject: `VOR Submitted — ${formData.occurrenceType} — ${formData.dateTime}`,
      report_body: reportBody,
    }

    // Attach files as base64 data URIs in the template params.
    // EmailJS supports inline attachments up to ~50KB each (validated before this point).
    attachments.forEach((a, i) => {
      templateParams[`attachment_${i + 1}_name`] = a.name
      templateParams[`attachment_${i + 1}_data`] = a.dataUrl
    })

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      setSending(false)
      return true
    } catch (err) {
      setSendError('Failed to send report. Please check your connection and try again.')
      setSending(false)
      return false
    }
  }

  return { sendReport, sending, sendError }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useEmailSend.js
git commit -m "feat: add useEmailSend hook with EmailJS integration"
```

---

## Task 9: SuccessScreen component

**Files:**
- Create: `src/components/SuccessScreen.jsx`
- Create: `src/components/SuccessScreen.css`

- [ ] **Step 1: Create `src/components/SuccessScreen.css`**

```css
.success-screen { text-align: center; padding: 40px 20px; }
.success-icon { font-size: 3rem; margin-bottom: 16px; }
.success-screen h2 { color: var(--brand-green); font-size: 1.4rem; margin-bottom: 12px; }
.success-screen p { color: var(--subtle); margin-bottom: 24px; }
```

- [ ] **Step 2: Create `src/components/SuccessScreen.jsx`**

```jsx
import './SuccessScreen.css'

export default function SuccessScreen({ onReset }) {
  return (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <h2>Report Submitted</h2>
      <p>Your Voluntary Occurrence Report has been sent to all required recipients.</p>
      <button className="btn-primary" style={{ maxWidth: 280, margin: '0 auto' }} onClick={onReset}>
        Submit Another Report
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SuccessScreen.jsx src/components/SuccessScreen.css
git commit -m "feat: add SuccessScreen component"
```

---

## Task 10: VORForm — assemble the complete form

**Files:**
- Create: `src/components/VORForm.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/VORForm.jsx`**

```jsx
import { useState } from 'react'
import OccurrenceTypeField from './OccurrenceTypeField'
import AnonymousFields from './AnonymousFields'
import EccairsField from './EccairsField'
import DateTimeField from './DateTimeField'
import LocationField from './LocationField'
import FreeTextField from './FreeTextField'
import AttachmentPicker from './AttachmentPicker'
import SendToSection from './SendToSection'
import useAttachments from '../hooks/useAttachments'
import useEmailSend from '../hooks/useEmailSend'
import { validateForm } from '../utils/validateForm'
import { formatReport } from '../utils/formatReport'

const INITIAL = {
  occurrenceType: '',
  occurrenceTypeOther: '',
  reporterName: '',
  contactNumber: '',
  emailAddress: '',
  eccairsRequired: '',
  dateTime: '',
  location: '',
  locationOther: '',
  whoAffected: '',
  aircraftDetails: '',
  description: '',
  additionalDetails: '',
  selectedDirectors: [],
}

export default function VORForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const { attachments, addAttachment, removeAttachment, sizeError } = useAttachments()
  const { sendReport, sending, sendError } = useEmailSend()

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const first = document.querySelector('.error-msg')
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const reportBody = formatReport(form)
    const ok = await sendReport(form, reportBody, attachments)
    if (ok) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <OccurrenceTypeField
        value={form.occurrenceType}
        otherValue={form.occurrenceTypeOther}
        onChange={v => setField('occurrenceType', v)}
        onOtherChange={v => setField('occurrenceTypeOther', v)}
        error={errors.occurrenceType}
        otherError={errors.occurrenceTypeOther}
      />
      <AnonymousFields
        name={form.reporterName}
        phone={form.contactNumber}
        email={form.emailAddress}
        onChange={setField}
      />
      <EccairsField value={form.eccairsRequired} onChange={v => setField('eccairsRequired', v)} />
      <DateTimeField value={form.dateTime} onChange={v => setField('dateTime', v)} error={errors.dateTime} />
      <LocationField
        value={form.location}
        otherValue={form.locationOther}
        onChange={v => setField('location', v)}
        onOtherChange={v => setField('locationOther', v)}
        error={errors.location}
        otherError={errors.locationOther}
      />
      <FreeTextField id="who" label="8. To who did this happen?" value={form.whoAffected} onChange={v => setField('whoAffected', v)} placeholder="Name(s) or role(s)" />
      <FreeTextField id="aircraft" label="9. If aircraft were involved, do you know the tail number(s) or who was flying them?" value={form.aircraftDetails} onChange={v => setField('aircraftDetails', v)} placeholder="e.g. EI-ABC, N/A" />
      <FreeTextField id="description" label="10. Please describe the occurrence in as much detail as possible." value={form.description} onChange={v => setField('description', v)} required multiline placeholder="Include as much detail as you wish…" error={errors.description} />
      <FreeTextField id="additional" label="11. Any other details to help us understand the reported subject matter?" value={form.additionalDetails} onChange={v => setField('additionalDetails', v)} multiline placeholder="Optional additional details…" />
      <AttachmentPicker attachments={attachments} onAdd={addAttachment} onRemove={removeAttachment} sizeError={sizeError} />
      <SendToSection selectedDirectors={form.selectedDirectors} onChange={v => setField('selectedDirectors', v)} error={errors.selectedDirectors} />
      {sendError && <p className="error-msg" style={{ marginBottom: 12 }}>{sendError}</p>}
      <button type="submit" className="btn-primary" disabled={sending}>
        {sending ? 'Sending…' : 'Submit Report'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--subtle)', marginTop: 8 }}>
        Fields marked <span className="required">*</span> are required
      </p>
    </form>
  )
}
```

- [ ] **Step 2: Update `src/App.jsx`**

```jsx
import { useState } from 'react'
import AppHeader from './components/AppHeader'
import VORForm from './components/VORForm'
import SuccessScreen from './components/SuccessScreen'
import './index.css'

export default function App() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="app">
      <AppHeader />
      {submitted
        ? <SuccessScreen onReset={() => setSubmitted(false)} />
        : <VORForm onSuccess={() => setSubmitted(true)} />
      }
    </div>
  )
}
```

- [ ] **Step 3: Run dev server and test the full form end-to-end**

```bash
npm run dev
```

Manual checks:
- All 11 questions render correctly
- "Other" reveals free-text in Q1 and Q7
- Required fields show errors on empty submit
- Send To section shows 3 locked + 2 selectable checkboxes
- Attachment picker accepts files and shows size error for large files
- Submit button shows "Sending…" while in-flight

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/VORForm.jsx src/App.jsx
git commit -m "feat: assemble complete VOR form with validation and email send"
```

---

## Task 11: Build and deploy as PWA (desktop web)

**Files:**
- Modify: `vite.config.js`
- Create: `public/manifest.json`

- [ ] **Step 1: Add PWA manifest**

Create `public/manifest.json`:
```json
{
  "name": "Weston Airport VOR",
  "short_name": "Weston VOR",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f7fa",
  "theme_color": "#1a3a5c",
  "icons": [
    { "src": "/weston-logo.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

Link it in `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1a3a5c">
```

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

- [ ] **Step 3: Preview the production build locally**

```bash
npm run preview
```

Open the preview URL, test the form, confirm it works identically to dev.

- [ ] **Step 4: Deploy**

Option A — host on any static host (Netlify, GitHub Pages, Vercel):
```bash
# Netlify example
npx netlify deploy --prod --dir dist
```

Option B — serve from a local Mac Mini web server:
```bash
npm install -g serve
serve dist
```

- [ ] **Step 5: Commit**

```bash
git add public/manifest.json index.html vite.config.js
git commit -m "feat: add PWA manifest for desktop web deployment"
```

---

## Task 12: Build and sync to Capacitor (mobile)

- [ ] **Step 1: Build and sync**

```bash
npm run build
npx cap sync
```

- [ ] **Step 2: Open in Xcode for iOS**

```bash
npx cap open ios
```

In Xcode:
- Set your Apple Developer team (requires free or paid Apple Developer account)
- Connect an iPhone via USB or use the simulator
- Press Run (▶)

- [ ] **Step 3: Open in Android Studio for Android**

```bash
npx cap open android
```

In Android Studio:
- Connect an Android device or use the emulator
- Press Run (▶)

- [ ] **Step 4: Mobile smoke tests**

On each platform manually verify:
- Camera/gallery opens when tapping "+ Add Photo / File"
- Form submits and email is received by all recipients
- "Other" reveals correctly in Q1 and Q7
- Success screen shows and "Submit Another Report" resets the form

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete VOR app — web, iOS, Android builds verified"
```

---

## Summary: Mac Mini Dev Setup Checklist

Before starting, ensure you have:

- [ ] Node.js v18+ installed (`node -v`)
- [ ] Xcode installed from the Mac App Store (for iOS)
- [ ] Android Studio installed (for Android)
- [ ] A free EmailJS account at emailjs.com
- [ ] The Weston Airport logo PNG file ready

Total tasks: 12 | Total commits: ~14
