Add username-based login to the existing Email/Password authentication. Do NOT change any existing functionality.
1. Signup — add username field:

In Signup.tsx, add a "Username" text input above the email field.
After Firebase createUserWithEmailAndPassword succeeds, save the username to the user's Firestore document at /users/{uid} with field username (lowercase, trimmed).
Validate: username must be 3-20 characters, alphanumeric and underscores only (/^[a-zA-Z0-9_]{3,20}$/).
Before creating the account, check Firestore to make sure the username is not already taken (query /users where username == inputUsername). Show an error if taken.

2. Firestore — add username index:

In firestore.rules, allow the username uniqueness query by ensuring users can read the username field for validation:

allow read: if request.auth != null;
(This may already exist via the existing read rule — just make sure the query works.)
3. Login — accept username OR email:

In Login.tsx, change the email input label to "Email or Username".
On submit: if the input contains @, treat it as email and sign in directly with signInWithEmailAndPassword.
If it does NOT contain @, query Firestore /users where username == input to get the matching user's email, then use that email with signInWithEmailAndPassword.
If no user found with that username, show error "Username not found".

4. Username display:

Wherever the app shows the user's email or display name, also show the username if available (e.g. profile, navbar).

Do not change any existing authentication flow, Firestore rules logic, or other functionality. The Google sign-in flow should remain unchanged. Users who signed up before this change (without a username) should still be able to log in with their email as before