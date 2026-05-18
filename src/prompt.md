I need you to implement email verification in my Firebase project. Here's what I need:

1. After user registration (createUserWithEmailAndPassword), automatically send a verification email using sendEmailVerification.

2. On login (signInWithEmailAndPassword), check if the user's email is verified (emailVerified). If not verified, sign them out and show a message asking them to verify their email first.

3. Add a "Resend verification email" button/option for users who haven't received the email.

4. After the user comes back from verifying, call auth.currentUser.reload() to refresh their verification status.

5. Add Firestore security rules to block unverified users:
   request.auth.token.email_verified == true

Please scan my codebase first to understand my project structure, then apply these changes in the correct files.