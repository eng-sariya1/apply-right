import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle, currentUser, userRole } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (currentUser) {
        return <Navigate to={userRole === 'admin' ? '/dashboard' : '/'} replace />;
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            const role = await loginWithGoogle();
            navigate(role === 'admin' ? '/dashboard' : '/');
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled');
            } else if (err.code === 'auth/cancelled-popup-request') {
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
            setLoading(true);
            const role = await login(email, password);
            navigate(role === 'admin' ? '/dashboard' : '/');
        } catch (error: any) {
            setError('Failed to log in: ' + error.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden flex items-center justify-center px-4">
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
                className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-[#C6DEE4]/30"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <motion.h1
                            whileHover={{scale: 1.05}}
                            transition={{duration: 0.2}}
                            className="text-3xl font-bold text-[#017A8C] mb-2"
                        >
                            Nuivo
                        </motion.h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-[#02343F] mb-2">Welcome Back</h2>
                    <p className="text-sm text-[#88B7C4]">Log in to continue building your resume</p>
                </div>
                <div className="mb-6">
                    {/* Google Sign-In Button */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-[#4285F4] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or continue with email</span>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                        <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[#02343F] mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#C6DEE4] rounded-xl focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all outline-none bg-white/50"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-[#02343F] mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#C6DEE4] rounded-xl focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all outline-none bg-white/50"
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
                        className="w-full py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                {/* Signup Link */}
                <p className="mt-6 text-center text-sm text-[#88B7C4]">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#017A8C] hover:text-[#015C6A] font-semibold transition-colors">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
