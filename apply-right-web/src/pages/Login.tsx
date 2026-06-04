import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, MailCheck, Loader2 } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const { login, loginWithGoogle, logout, lookupUsername, currentUser, userRole, sendVerificationEmail, reloadAndRefresh, resetPassword } = useAuth();
    const navigate = useNavigate();

    // Fully authenticated (verified) — go to the app.
    if (currentUser && currentUser.emailVerified) {
        return <Navigate to={userRole === 'admin' ? '/dashboard' : '/home'} replace />;
    }

    // Signed in but email not yet verified — show the inline verify panel.
    const needsVerification = !!currentUser && !currentUser.emailVerified;
    const pendingEmail = currentUser?.email ?? auth.currentUser?.email ?? email;

    async function handleGoogleSignIn() {
        try {
            setError('');
            setNotice('');
            setLoading(true);
            const role = await loginWithGoogle();
            navigate(role === 'admin' ? '/dashboard' : '/home');
        } catch (err: unknown) {
            const code = (err as { code?: string }).code;
            if (code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled');
            } else if (code === 'auth/cancelled-popup-request') {
                // User closed popup, ignore
            } else {
                setError('Failed to sign in with Google');
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setError('');
            setNotice('');
            setLoading(true);
            // An "@" means it's an email — sign in directly. Otherwise treat
            // the field as the user's name (their Full Name on Profile, which
            // doubles as their login handle) and resolve it to an email.
            const identifier = email.trim();
            let loginEmail = identifier;
            if (!identifier.includes('@')) {
                let match: { uid: string; email: string } | null = null;
                try {
                    // lookupUsername normalizes internally (trim, collapse
                    // whitespace, lowercase) so casing and stray spaces don't
                    // matter.
                    match = await lookupUsername(identifier);
                } catch (lookupErr) {
                    // Almost always Firestore permission-denied because the
                    // /usernames rules haven't been deployed yet (also catches
                    // transient network failures). Log the real cause for
                    // debugging; show the user a friendlier message that
                    // points at the working path (email).
                    console.error('Identifier lookup failed:', lookupErr);
                    setError('Login lookup is temporarily unavailable. Please try logging in with your email address.');
                    setLoading(false);
                    return;
                }
                if (!match) {
                    setError('No account found for that name');
                    setLoading(false);
                    return;
                }
                loginEmail = match.email;
            }
            const role = await login(loginEmail, password);
            if (!auth.currentUser?.emailVerified) {
                // Unverified: stay on this page; the verify panel will render
                // once the auth state propagates. Do not enter the app.
                setLoading(false);
                return;
            }
            navigate(role === 'admin' ? '/dashboard' : '/home');
        } catch (error: unknown) {
            setError('Failed to log in: ' + (error instanceof Error ? error.message : String(error)));
        }
        setLoading(false);
    }

    async function handleResend() {
        try {
            setError('');
            setNotice('');
            setLoading(true);
            await sendVerificationEmail();
            setNotice('Verification email sent. Check your inbox (and spam folder).');
        } catch {
            setError('Could not send the verification email. Please try again in a moment.');
        } finally {
            setLoading(false);
        }
    }

    async function handleIveVerified() {
        try {
            setError('');
            setNotice('');
            setVerifying(true);
            const ok = await reloadAndRefresh();
            if (ok) {
                navigate(userRole === 'admin' ? '/dashboard' : '/home');
            } else {
                setError('Still not verified. Open the link in the email, then try again.');
            }
        } catch {
            setError('Could not refresh your status. Please try again.');
        } finally {
            setVerifying(false);
        }
    }

    async function handleUseDifferentAccount() {
        setError('');
        setNotice('');
        await logout();
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        try {
            setError('');
            setNotice('');
            setLoading(true);
            await resetPassword(email);
            setNotice('Password reset link sent — check your email (and spam folder).');
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === 'auth/invalid-email') {
                setError('That email address looks invalid. Please check it and try again.');
            } else if (code === 'auth/missing-email') {
                setError('Please enter your email address.');
            } else {
                // Don't reveal whether the account exists — show generic success.
                setNotice('Password reset link sent — check your email (and spam folder).');
            }
        } finally {
            setLoading(false);
        }
    }

    function openReset() {
        setError('');
        setNotice('');
        setShowReset(true);
    }

    function backToLogin() {
        setError('');
        setNotice('');
        setShowReset(false);
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden flex items-center justify-center px-4">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-t from-[#017A8C]/5 via-transparent to-transparent blur-3xl rounded-full" />
            </div>

            {/* Form Card */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="relative bg-[var(--color-surface-90)] backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md border border-[var(--color-border)]/30"
            >
                {/* Logo */}
                <div className="text-center mb-6 sm:mb-8">
                    <Link to="/">
                        <motion.h1
                            whileHover={{scale: 1.05}}
                            transition={{duration: 0.2}}
                            className="text-3xl font-bold text-[#017A8C] mb-2"
                        >
                            Nuivo
                        </motion.h1>
                    </Link>
                    {needsVerification ? (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-2">Verify your email</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-light)]">
                                Confirm your email address to continue
                            </p>
                        </>
                    ) : showReset ? (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-2">Reset your password</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-light)]">
                                Enter your email to get a reset link
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-2">Welcome Back</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-light)]">Log in to continue building your resume</p>
                        </>
                    )}
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                        <p className="text-xs sm:text-sm text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* Success Notice */}
                {notice && (
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"/>
                        <p className="text-xs sm:text-sm text-green-700">{notice}</p>
                    </motion.div>
                )}

                {needsVerification ? (
                    /* Verify Email Panel */
                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#017A8C]/10 flex items-center justify-center">
                                <MailCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#017A8C]" />
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--color-text-dark)] leading-relaxed">
                                We sent a verification link to{' '}
                                <span className="font-semibold break-all">{pendingEmail}</span>.
                                Click the link in that email, then come back and continue.
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: verifying ? 1 : 1.02 }}
                            whileTap={{ scale: verifying ? 1 : 0.98 }}
                            type="button"
                            onClick={handleIveVerified}
                            disabled={verifying || loading}
                            className="w-full py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    Checking...
                                </>
                            ) : (
                                "I've verified — continue"
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            type="button"
                            onClick={handleResend}
                            disabled={loading || verifying}
                            className="w-full py-3 bg-[var(--color-surface-solid)] border-2 border-[#017A8C] text-[#017A8C] font-semibold rounded-xl hover:bg-[#017A8C]/5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    Sending...
                                </>
                            ) : (
                                'Resend verification email'
                            )}
                        </motion.button>

                        <p className="text-center text-xs sm:text-sm text-[var(--color-text-light)]">
                            Wrong account?{' '}
                            <button
                                type="button"
                                onClick={handleUseDifferentAccount}
                                className="text-[#017A8C] hover:text-[#015C6A] font-semibold transition-colors"
                            >
                                Use a different account
                            </button>
                        </p>
                    </div>
                ) : showReset ? (
                    /* Reset Password Panel */
                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#017A8C]/10 flex items-center justify-center">
                                <MailCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#017A8C]" />
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--color-text-dark)] leading-relaxed">
                                Enter the email for your account and we'll send you a
                                link to choose a new password.
                            </p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-4 sm:space-y-5">
                            <div>
                                <label htmlFor="reset-email" className="block text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all outline-none bg-[var(--color-surface-50)] text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                        Sending...
                                    </>
                                ) : (
                                    'Send reset link'
                                )}
                            </motion.button>
                        </form>

                        <p className="text-center text-xs sm:text-sm text-[var(--color-text-light)]">
                            <button
                                type="button"
                                onClick={backToLogin}
                                className="text-[#017A8C] hover:text-[#015C6A] font-semibold transition-colors"
                            >
                                Back to log in
                            </button>
                        </p>
                    </div>
                ) : (
                    /* Login Form */
                    <>
                        <div className="mb-4 sm:mb-6">
                            {/* Google Sign-In Button */}
                            <motion.button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 bg-[var(--color-surface-solid)] border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-[#4285F4] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[44px] text-sm sm:text-base"
                            >
                                {/* Google Icon SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </motion.button>

                            {/* Divider */}
                            <div className="relative my-4 sm:my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-4 bg-[var(--color-surface-solid)] text-gray-500">or continue with email</span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                                    Email or Name
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="username"
                                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all outline-none bg-[var(--color-surface-50)] text-sm"
                                    placeholder="you@example.com or your full name"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{
                                    scale: loading ? 1 : 1.02,
                                    boxShadow: loading ? undefined : '0 10px 25px rgba(1, 122, 140, 0.3)'
                                }}
                                whileTap={{scale: loading ? 1 : 0.98}}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                        Logging in...
                                    </>
                                ) : (
                                    'Log In'
                                )}
                            </motion.button>
                        </form>

                        {/* Forgot Password Link */}
                        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[var(--color-text-light)]">
                            <button
                                type="button"
                                onClick={openReset}
                                className="text-[#017A8C] hover:text-[#015C6A] font-semibold transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </p>

                        {/* Signup Link */}
                        <p className="mt-2 text-center text-xs sm:text-sm text-[var(--color-text-light)]">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#017A8C] hover:text-[#015C6A] font-semibold transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default Login;
