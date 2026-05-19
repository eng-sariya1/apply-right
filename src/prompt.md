Fix the following security and quality issues. Do NOT change any existing functionality, UI, or business logic.
Firestore Rules — Privilege Escalation (firestore.rules)
Users can currently overwrite their own role and status fields. Fix the /users/{uid} update rule so that only admins can change role and status
2- Blocked User Enforcement in Firestore Rules
Update the /cvs/{uid} rules to check that the user's status is not blocked
3- Fix lint script in package.json
Change the lint script from eslint my-app to eslint src/.
4- Fix all ESLint errors

Replace any types with proper TypeScript types.
Prefix intentionally unused destructured variables with _ (e.g. _id, _savedAt).
Add // eslint-disable-next-line react-refresh/only-export-components in AuthContext.tsx and CVContext.tsx where needed.
5-  Preserve original errors in catch blocks
In extractTextFromPDF and extractTextFromDOCX, change
6-Gemini API Key Exposure

Add .env to .gitignore
Run git rm --cached .env so it's untracked
Create a Firebase Cloud Function (or Netlify serverless function) that proxies all Gemini API calls. The function reads the API key from server-side environment variables (not VITE_-prefixed).
Update all useGemini* hooks in the frontend to call your new proxy endpoint instead of calling the Gemini API directly.
Remove the VITE_GEMINI_API_KEY variable from .env — replace it with a non-VITE key used only by the backend function.



Do not change any functionality, component behavior, or UI. Only fix security rules, move the API key to the backend, and resolve linting/error-handling issues.
