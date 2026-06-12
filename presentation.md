# Nuivo

## AI-Powered CV Builder with ATS Optimization — now on Web & Mobile

Building smarter resumes that get past automated screening systems.

**Graduation Project 2**

---

## Main Lines

1. Introduction
2. System Architecture
3. AI-Powered Content (Gemini)
4. CV Builder
5. Multi-Template CV System *(new)*
6. ATS Analysis
7. AI Optimization
8. PDF Export
9. Firebase Backend & Authentication *(new)*
10. Admin Dashboard *(new)*
11. Mobile App — Nuivo on iOS & Android *(new)*
12. Securing the AI — Serverless Proxy *(new)*
13. Testing Strategy

---

## Introduction

### What is Nuivo?

An AI-powered CV builder that helps job seekers optimize their resumes for Applicant Tracking Systems.

### Why we built this

- Most job seekers don't understand how ATS works
- Qualified candidates get rejected before humans see their CVs
- Professional CV services are expensive
- No free tools combine AI and ATS optimization

### New problems we addressed in Project 2

- CVs were lost when the browser closed — no accounts, no cloud storage
- The platform was desktop-only — no way to build or check a CV from a phone
- A single CV design didn't fit every profession
- No way for administrators to manage the platform and its users

### Our goal

Create a smart, free CV builder that speaks both to robots and humans — **available everywhere, on any device, with your CVs safely stored in the cloud.**

---

## System Architecture

We extended the simple, layered architecture from Project 1 into a full client–server system with two clients sharing one backend.

### User flow (unchanged at its core)

CREATE CV → GET AI HELP → ANALYZE FOR ATS → OPTIMIZE → EXPORT PDF

— now with **SIGN IN** before and **SAVE TO CLOUD** after every step.

### Technical layers

**01 — PRESENTATION LAYER**
React components for the web interface **+ React Native (Expo) screens for the mobile app**

**02 — STATE MANAGEMENT**
React Context API for CV data — shared design across web and mobile (Auth, CV, Theme, Toast contexts)

**03 — INTEGRATION LAYER**
Gemini API for AI functionality — the same 8 hooks reused on both platforms

**04 — BACKEND LAYER** *(new)*
Firebase Authentication + Cloud Firestore for accounts and CV persistence, protected by server-side security rules

**05 — SERVERLESS LAYER** *(new)*
Netlify Functions proxy that keeps the Gemini API key on the server — never shipped to any client

---

## AI Integration with Gemini

### Why Gemini?

- Fast responses (under 4 seconds)
- Powered by Google
- Cost-effective
- Reliable and consistent

### 8 specialized AI hooks

1. Abstract/summary improvement
2. Career description generation
3. Education achievements suggestions
4. Project descriptions
5. Resume parsing from uploaded files
6. ATS analysis
7. CV optimization
8. Keyword extraction

### Implementation

Each hook follows the same pattern for consistency and maintainability.

**New in Project 2:** the exact same hooks now power both the web app and the mobile app, and every call goes through our serverless proxy — the API key never reaches the browser or the phone.

---

## CV Builder

The CV builder is where users create and edit their resumes.

### Left side — Input form

- Personal information
- Career experiences
- Education history
- Personal projects
- Skills

### Right side — Live preview

- Real-time updates
- A4-sized pages
- Exact PDF representation

**New in Project 2:** the builder is template-aware — users pick a design first, edit with a paginated live preview, and their work is saved to their account in the cloud instead of vanishing on refresh.

---

## Multi-Template CV System *(new)*

One CV, three professional designs.

- **3 distinct templates**, each with its own layout, typography, and styling
- A dedicated template selection page on the web and a template select screen on mobile
- **Live switching** — change templates at any time without losing data; the same CV content re-renders instantly in the new design
- Each template has a matching form and display component, so the preview and the exported PDF always agree

---

## ATS Analysis

This feature analyzes how well a CV matches a job description.

### How it works

1. User pastes job description
2. Click "Analyze CV" button
3. AI compares CV against job posting
4. System calculates match percentage (0–100)
5. Shows missing keywords
6. Provides strengths and weaknesses

---

## AI Optimization

### What we provide

- Missing keywords to add
- Better phrasing for experience
- Skills to highlight
- Sections needing more detail

### User control

- Select which suggestions to apply
- Preview changes before applying
- Re-analyze after optimization

### Each suggestion includes

- Target section
- Current text
- Suggested improvement
- Impact level (high/medium/low)

---

## PDF Export

Exporting to PDF was one of our biggest technical challenges.

### Libraries we tried

- jsPDF — manual work, inconsistent results
- html2pdf — quality issues

### Our solution: react-to-print

Why it works better:

- Uses browser's native print functionality
- Maintains all CSS styling
- High-quality rendering
- Cross-browser compatible
- No external dependencies
- Professional output quality

**New in Project 2 — mobile export:** on the phone there is no browser print dialog, so the mobile app renders the CV to PDF with `expo-print` and hands it to the native share sheet with `expo-sharing` — the same professional output, exported and shared straight from the device.

---

## Firebase Backend & Authentication *(new)*

In Project 1 everything lived in the browser. In Project 2 we added a real backend.

### Authentication

- Email/password sign-up and login
- **Google sign-in (OAuth)** on both web and mobile
- Email verification required before using the platform
- Password reset flow

### Cloud Firestore

- Every CV is saved to the user's account — create, edit, and manage multiple CVs
- Work persists across devices: start on the laptop, finish on the phone

### Security

- Server-side **Firestore security rules**: users can only read/write their own data, must be email-verified, and blocked users are denied at the database level — not just in the UI
- Auth tokens auto-refresh every 55 minutes so sessions never silently expire

---

## Admin Dashboard *(new)*

A management layer for the platform, available on web and mobile.

### Platform statistics

- Total users, total CVs created, number of admins

### User management

- Full user table with account status
- Block / unblock users — enforced by the database security rules, not just hidden in the interface

### Access control

- Role-based routing: `ProtectedRoute` guards signed-in pages, `AdminRoute` guards admin pages
- Admin role stored in the user profile and verified on every request

---

## Mobile App — Nuivo on iOS & Android *(new)*

The biggest addition of Project 2: a complete React Native app built with **Expo**.

### Full feature parity with the web

12 screens covering the entire product:

- **Auth:** Landing, Login, Signup (email + Google sign-in)
- **CV:** Builder, Live Preview, Template Select
- **Core:** Home, ATS Analysis, Jobs, Profile
- **Admin:** Dashboard, Users management

### Native experience

- Drawer + bottom-tab navigation (Home, CV, ATS, Jobs)
- **NativeWind** — the same Tailwind styling language as the web, so both apps look like one product
- Dark mode with persisted theme preference (AsyncStorage)
- Native PDF export and sharing

### One brand

- "Nuivo" identity with emerald green (#059669), custom app icon, adaptive Android icons, and splash screen — generated by our own asset script

---

## Securing the AI — Serverless Proxy *(new)*

In Project 1 the Gemini API key lived in the client. Anyone could open DevTools and steal it.

### Our solution

A **Netlify Function** that proxies every Gemini request:

- The key exists only in the server environment — never in the browser bundle, never in the mobile app binary
- Web and mobile both call the same function endpoint
- A matching Vite dev-server proxy keeps local development identical to production

Result: same AI features, zero exposed credentials.

---

## Testing Strategy

We used Cypress for comprehensive End-to-End testing.

### Why Cypress E2E testing

- Tests actual user experience
- Catches integration bugs
- Verifies complete workflows
- Gives confidence for deployment

### Test coverage areas

- Page navigation
- Form inputs and validation
- AI feature integration
- ATS analysis workflow
- Resume upload and parsing
- **New in Project 2:** a comprehensive end-to-end journey covering the full flow — sign in → build CV → ATS analysis → export

---

## Thank you for listening

**Presented by**

Roaa Almasalma

Saria aljabr
