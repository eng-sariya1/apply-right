# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript CV/Resume builder application called "Nuivo" that uses Vite as the build tool. The application provides AI-powered CV building, ATS (Applicant Tracking System) analysis, and CV optimization features using Google's Gemini API.

## Development Commands

### Running the Application
```bash
npm run dev                # Start development server at http://localhost:5173
npm run cypress-dev        # Start development server in Cypress mode
npm run build              # Build for production (runs TypeScript compiler + Vite build)
npm run preview            # Preview production build locally
npm run lint               # Run ESLint
```

### Testing
```bash
npm run cypress-open       # Open Cypress test runner (interactive)
npm run cypress-run        # Run Cypress tests headlessly
```

The Cypress test server runs on port 5173. Tests are located in `cypress/e2e/`.

## Architecture

### Core Application Structure

**React Router Pages:**
- `LandingPage.tsx` - Home page (route: `/`)
- `CVBuilder.tsx` - Main CV builder interface (route: `/cv-builder`)
- `ATSPage.tsx` - ATS analysis and optimization (route: `/ats`)

**State Management:**
- The app uses React Context (`CVContext.tsx`) for global CV data state
- `CVProvider` wraps the entire application in `App.tsx`
- Access CV data using `useCVContext()` hook

### CV Data Flow

1. **Input:** User fills `CVFormInline` component with CV sections
2. **Storage:** Data stored in `CVContext` as `CVData` type
3. **Display:** Real-time preview in `CVPaginatedPreview` and full view in `CVDisplay`
4. **Export:** PDF generation using `html2pdf.js` library

### Key Components

**Form Components (`src/components/form/`):**
- `TextInput.tsx` - Standard text inputs
- `TextAreaInput.tsx` - Multi-line text inputs
- `ChipsInput.tsx` - Tag/chip inputs for skills
- `CheckboxInput.tsx` - Checkbox inputs
- `DropdownInput.tsx` - Dropdown selections

**Display Components:**
- `CVFormInline.tsx` - The main form with all CV sections
- `CVDisplay.tsx` - Full CV display for PDF generation
- `CVPaginatedPreview.tsx` - A4-sized paginated preview
- `UploadResumeModal.tsx` - Resume upload and parsing modal

### AI Integration (Gemini API)

The application extensively uses Google's Gemini API for AI features. All hooks follow a consistent pattern and require the `VITE_GEMINI_API_KEY` environment variable.

**Gemini Hooks (`src/hooks/`):**
- `useGemini.ts` - Abstract/summary improvement
- `useGeminiATS.ts` - Base ATS functionality
- `useGeminiATSAnalysis.ts` - ATS score analysis against job descriptions
- `useGeminiCVOptimizer.ts` - Generates optimization suggestions
- `useGeminiCVParser.ts` - Parses uploaded resume files
- `useGeminiCareer.ts` - Career section AI assistance
- `useGeminiEducation.ts` - Education section AI assistance
- `useGeminiProjects.ts` - Projects section AI assistance

All hooks use direct fetch calls to Gemini's REST API endpoint:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent
```

### Type System

All CV-related types are defined in `src/types/cv.types.ts`:
- `CVData` - Main CV data structure
- `CVHeader` - Contact information and links
- `Career` - Work experience with projects
- `PersonalProject` - Personal/side projects
- `OptimizationSuggestion` - AI-generated CV improvements
- `CVOptimizationResult` - Full optimization analysis

### PDF Generation

PDF export is handled by `react-to-print` which uses the browser's native print functionality:
- Opens the browser's print dialog
- Leverages native browser rendering for high-quality output
- Maintains all CSS styling, fonts, and formatting
- Users can save as PDF through the print dialog
- Supports all print settings (page size, margins, orientation)

The hidden `CVDisplay` component (positioned off-screen) is used as the print content to avoid affecting the visible UI.

### Styling

- **Framework:** Tailwind CSS v4 with custom theme colors
- **Primary Color:** `#017A8C` (teal/turquoise)
- **Background:** `#FAF7F0` (light warm beige)
- **Component Library:** PrimeReact for dialogs, inputs, charts
- **Icons:** Lucide React
- **Animations:** Framer Motion for page transitions and interactions

Custom CSS files:
- `src/styles/cv-builder.css` - Builder page styles
- `src/styles/cv-paginated.css` - Pagination styles
- `src/styles/cv.css` - CV display styles

## Environment Variables

Required in `.env` file:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** The `.env` file is tracked in git (not in `.gitignore`), which is a security concern for production deployments.

## Testing Configuration

Cypress is configured in `cypress.config.ts`:
- Base URL: http://localhost:5173/
- Custom timeout: 8001ms
- Screenshots and videos enabled
- Multiple reporters: spec, mocha-junit-reporter, mochawesome

## Build Configuration

**Vite Config (`vite.config.ts`):**
- React plugin with Fast Refresh
- Tailwind CSS v4 via plugin
- Optimized deps: `@react-pdf/renderer`
- Build target: `esnext`
- Minification disabled for debugging

**TypeScript:**
- Strict mode enabled
- Three tsconfig files:
  - `tsconfig.json` - Base config
  - `tsconfig.app.json` - App source code
  - `tsconfig.node.json` - Node/build scripts

## Common Patterns

### Adding a New CV Section

1. Add type definition to `cv.types.ts`
2. Update default data in `CVContext.tsx`
3. Create form inputs in `CVFormInline.tsx`
4. Add display logic in `CVDisplay.tsx`
5. Create a Gemini hook if AI assistance needed

### Working with Gemini API

All Gemini hooks follow this pattern:
```typescript
export const useGeminiFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = async (input: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        }
      );
      // Parse and return result
    } catch (err) {
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading, error };
};
```

### ATS Analysis Workflow

1. User enters job description in `ATSPage`
2. Click "Analyze CV" → calls `useGeminiATSAnalysis.analyzeCV()`
3. Results show match percentage, keywords, strengths/weaknesses
4. Click "Optimize CV" → calls `useGeminiCVOptimizer.generateSuggestions()`
5. User selects which suggestions to apply
6. Click "Apply Changes" → updates `CVContext` and re-analyzes

## Dependencies of Note

- `react-to-print` - PDF generation using browser's native print functionality
- `mammoth` - DOCX parsing for resume uploads
- `pdfjs-dist` - PDF parsing for resume uploads
- `primereact` - UI component library
- `framer-motion` - Animations
- `chart.js` + `react-chartjs-2` - ATS analysis charts
- `react-hook-form` - Form management
