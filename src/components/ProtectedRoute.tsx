import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Loader2, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { currentUser, userStatus, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
                <Loader2 className="w-8 h-8 animate-spin text-[#017A8C]" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (userStatus === 'blocked') {
        return (
            <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden flex items-center justify-center">
                {/* Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center px-6 max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                        <Ban className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-bold text-[#02343F] mb-4"
                    >
                        Account Suspended
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-[#88B7C4] mb-8 leading-relaxed"
                    >
                        Your account has been suspended by an administrator. If you believe this is a mistake, please contact support.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Link
                            to="/"
                            className="inline-block px-8 py-3 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Return to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
