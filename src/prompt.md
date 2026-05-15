## Context
I'm building a CV builder web app with an ATS scoring system. Users fill out their CV,
then we analyze it against ATS criteria and show them a score on the ATS page.

## Goal
After the ATS comparison/scoring is shown, display a new card on the ATS page that
redirects the user to LinkedIn Jobs with a search pre-filled based on their CV data
(job title, skills, location, experience level).

## Before You Start
1. Explore the codebase first — I want you to understand the existing structure
   before suggesting changes.
2. Specifically look at:
    - The ATS results page/component (where the score is displayed)
    - The CV data structure (what fields are available — job title, skills,
      location, years of experience, etc.)
    - The styling system being used (Tailwind classes, existing card components)
    - Any existing context/state that holds the parsed CV data
3. Use @ to read the relevant files before writing any code.

## Requirements

### The Card
- Add a new card component on the ATS results page, positioned after the score display
- Title suggestion: "Find Matching Jobs on LinkedIn" (open to better copy)
- Should include: brief description, LinkedIn icon, and a CTA button
- Match the existing design language of other cards on the page (same Tailwind
  patterns, spacing, border-radius, shadows)
- Should feel like a natural next step after seeing the ATS score

### The LinkedIn Redirect Logic
- Build a LinkedIn Jobs search URL using this base pattern:
  https://www.linkedin.com/jobs/search/?keywords={keywords}&location={location}&f_E={experience_level}

- Map CV data to URL params:
    - `keywords`: job title + optionally top 2–3 skills (URL-encoded, space-separated)
    - `location`: user's location from CV (URL-encoded)
    - `f_E`: experience level mapping:
        - 0–1 years   → 2 (Entry level)
        - 2–4 years   → 3 (Associate)
        - 5–9 years   → 4 (Mid-Senior)
        - 10+ years   → 5 (Director)
          Omit if not determinable.

- Open the URL in a new tab with `target="_blank"` and `rel="noopener noreferrer"`
  (security best practice).

### Edge Cases (please handle)
- If job title is missing → fallback to top skill or hide the card
- If location is missing → omit the `location` param (don't send empty string)
- If skills array is empty → use only job title in keywords
- Properly URL-encode all values (use `encodeURIComponent`)

## Constraints
- Don't modify the existing ATS scoring logic
- Don't change the CV data structure
- Keep the URL builder logic in a separate utility function (e.g.,
  `buildLinkedInJobsUrl(cvData)`) so it's testable and reusable
- Follow the existing folder structure and naming conventions

## Deliverable
First, present a plan with:
1. Which files you'll create
2. Which files you'll modify (and why)
3. The exact URL builder logic
4. Where the card will be placed in the JSX

Wait for my approval before making any changes.