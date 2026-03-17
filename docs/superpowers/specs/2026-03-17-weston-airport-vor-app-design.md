# Weston Airport — Voluntary Occurrence Report (VOR) App Design

**Date:** 2026-03-17
**Author:** Safety Manager, Weston Airport
**Status:** Approved

---

## Overview

A standalone cross-platform app for submitting Voluntary Occurrence Reports (VORs) at Weston Airport. Runs natively on iOS and Android, and as a web app on any desktop browser (Mac, Windows, Linux). On submission, the completed report is emailed silently to all required recipients via EmailJS — no backend server required.

---

## Goals

- Make it as easy as possible for staff to submit occurrence reports from any device
- Ensure every report always reaches the mandatory recipients
- Keep the reporter's identity optional to maximise reporting rates
- Allow the location list to be updated in future without a code change

---

## Out of Scope

- User authentication / login
- A backend database or admin dashboard
- Report history / archive on-device
- Logic or routing based on report type

---

## Platform Strategy

**React + Capacitor**

- Single React codebase shared across all platforms
- Capacitor wraps the app for iOS and Android, providing native camera and file access
- Desktop users access the app via a hosted URL in any browser (PWA)
- Development environment: Mac Mini with Node.js, Capacitor CLI, Xcode (iOS), Android Studio (Android)

This is a **standalone new project**, separate from the existing Weston Airport SPI Electron dashboard.

---

## Tech Stack

| Concern | Technology |
|---|---|
| UI framework | React (Vite) |
| Mobile wrapper | Capacitor 6 |
| Email delivery | EmailJS (free tier, ~200 emails/month) |
| Camera / file access | `@capacitor/camera`, `@capacitor/filesystem` |
| Styling | Plain CSS (mobile-first, responsive) |
| Location config | `src/config/locations.json` (editable flat file) |
| Logo | Weston Airport logo (PNG asset) |

---

## Form Fields

All 11 questions are presented on a single scrollable page. Required fields are marked with *.

### 1. What would you like to report? *(required)*
Radio button group:
- An Accident
- An Incident
- A Health & Safety Incident
- A Near Miss
- An Observation
- A Suggestion for Improvement
- Other — with an inline free-text field that appears when selected

### 2. Your name *(optional)*
Text input. Helper text: *"You may remain anonymous if you wish."*

### 3. Contact number *(optional)*
Text input. Helper text: *"You may remain anonymous if you wish."*

### 4. Email address *(optional)*
Email input. Helper text: *"You may remain anonymous if you wish."*

### 5. Is a Mandatory Occurrence Report (ECCAIRS) required?
Radio button group:
- Yes
- No
- Don't know

### 6. When did this happen? *(required)*
Native date/time picker (datetime-local input). Defaults to current date and time.

### 7. Where did this happen? *(required)*
Dropdown select. Options sourced from `src/config/locations.json`:
- Apron
- Tower
- Hangar
- Runway
- Taxiway
- Terminal
- Airside
- Landside
- Perimeter
- Remote
- Other — please specify

When "Other — please specify" is selected, a required free-text field appears immediately below the dropdown. Selecting any other option hides and clears this field. The location list in `locations.json` can be edited to add or remove options without any code changes.

### 8. To who did this happen?
Free text input.

### 9. If aircraft were involved, do you know the tail number(s) or who was flying them?
Free text input. Placeholder: *"e.g. EI-ABC, N/A"*

### 10. Please describe the occurrence in as much detail as possible. *(required)*
Large textarea. Helper text: *"This is a free text box — include as much detail as you wish."*

### 11. Any other details to help us understand the reported subject matter?
Textarea (optional).

---

## Attachments

A single **"+ Add Photo / File"** button:

- **Mobile (iOS/Android):** Opens a native action sheet — "Take Photo", "Choose from Gallery". Capacitor Camera plugin handles this. Multiple photos can be added.
- **Desktop (browser):** Opens a standard file picker. Accepts images, PDF, and Word documents. Multiple files can be selected.

Attached files are displayed as thumbnails (images) or filename chips (documents) below the button, each with a remove (×) option.

> **Desktop future enhancement:** The file picker is already in place. Accepting additional document types (PDF, Word, etc.) is supported from day one on desktop.

---

## Send To

Displayed at the bottom of the form above the Submit button. **At least one Director must be selected before the form can be submitted.**

### Always included (locked — cannot be removed):
- Safety Manager
- Line Manager
- Dir. SQC

### Reporter selects at least one *(required)*:
- Director of ANS
- Dir. Operations

The reporter selects the Director(s) relevant to their area of work. Both can be selected if appropriate.

Recipient email addresses are stored in `src/config/recipients.json` and are not exposed in the UI.

---

## Email Delivery (EmailJS)

On submit, a single EmailJS call sends the report to all selected recipients simultaneously. The email contains all form fields formatted as a readable plain-text report, plus any attached files as inline images or attachments.

**Attachment size limit:** EmailJS has a ~50KB limit per attachment. If an attached file exceeds this, the app will warn the user before submission and ask them to remove the oversized file. The report text is always sent regardless of attachment issues.

**EmailJS setup required:**
1. Create a free account at emailjs.com
2. Connect an email service (e.g. Gmail, Outlook)
3. Create an email template
4. Store the Service ID, Template ID, and Public Key in a `.env` file (not committed to git)

The app shows a success confirmation screen after sending. If sending fails (e.g. no internet), an error message is shown and the user is advised to try again.

---

## App Header

Every screen shows:
- Weston Airport logo (top left)
- App title: "Voluntary Occurrence Report"
- Subtitle: "Weston Airport"

---

## Location Config File

`src/config/locations.json`:
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

To add a location: add a string to this array.
To remove a location: delete its entry.
"Other — please specify" is always appended automatically by the app and does not need to be in this file.

---

## Recipient Config File

`src/config/recipients.json`:
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

> Placeholder emails shown above — replace with real addresses before deployment.

> **Note:** This file is bundled into the client-side build, meaning recipient email addresses will be visible in the browser's source. This is an accepted trade-off given the no-backend requirement. Do not store passwords or API secrets here — only email addresses.

---

## Validation Rules

| Field | Rule |
|---|---|
| Q1 — Report type | Required. If "Other", the free-text field is also required. |
| Q6 — Date/time | Required. Cannot be in the future. |
| Q7 — Location | Required. If "Other", the free-text field is also required. |
| Q5 — ECCAIRS | Optional. No validation required. |
| Q10 — Description | Required. Minimum 10 characters. |
| Director | At least one of Director of ANS / Dir. Operations must be checked. |

Fields 2–4 (name, phone, email) and fields 8, 9, 11 are fully optional.

---

## Development Setup (Mac Mini)

```bash
# Prerequisites
brew install node
npm install -g @capacitor/cli

# Project scaffold
npm create vite@latest weston-vor -- --template react
cd weston-vor
npm install
npm install @capacitor/core @capacitor/cli @capacitor/camera @capacitor/filesystem
npm install emailjs-com

# Add platforms
npx cap add ios      # requires Xcode
npx cap add android  # requires Android Studio

# Run in browser
npm run dev

# Build and sync to native
npm run build && npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

---

## File Structure

```
weston-vor/
├── public/
│   └── weston-logo.png
├── src/
│   ├── config/
│   │   ├── locations.json
│   │   └── recipients.json
│   ├── components/
│   │   ├── AppHeader.jsx
│   │   ├── VORForm.jsx
│   │   ├── QuestionBlock.jsx
│   │   ├── LocationSelect.jsx
│   │   ├── AttachmentPicker.jsx
│   │   ├── SendToSection.jsx
│   │   └── SuccessScreen.jsx
│   ├── hooks/
│   │   └── useEmailSend.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                  # EmailJS keys — not committed
├── .env.example
├── capacitor.config.json
└── vite.config.js
```
