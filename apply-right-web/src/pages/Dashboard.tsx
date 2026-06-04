import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, FolderOpen, Settings, LogOut, Users } from 'lucide-react';

function Dashboard() {
    const { currentUser, userRole, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
            </div>

            {/* Sticky Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--color-bg)]/90 border-b border-[#017A8C]/20 shadow-sm"
            >
                <nav className="container mx-auto px-4 sm:px-6 lg:px-10 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl font-bold text-[#017A8C] tracking-tight"
                            >
                                Nuivo
                            </motion.div>
                        </Link>

                        <Link to="/cv-builder">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(1, 122, 140, 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="px-4 sm:px-6 py-2 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                            >
                                Create Resume
                            </motion.button>
                        </Link>
                    </div>
                </nav>
            </motion.header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20 relative z-10">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 sm:mb-12"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-dark)] mb-4">
                        Welcome to Your Dashboard!
                    </h1>
                    <p className="text-base sm:text-lg text-[var(--color-text-light)]">
                        Logged in as: <span className="font-semibold text-[#017A8C] break-words">{currentUser?.email}</span>
                        {userRole && <span className="ml-2 text-xs sm:text-sm bg-[#017A8C]/10 text-[#017A8C] px-3 py-1 rounded-full font-medium">{userRole}</span>}
                    </p>
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12"
                >
                    {/* Create Resume Card */}
                    <Link to="/cv-builder">
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-[var(--color-surface-80)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200 cursor-pointer"
                        >
                            <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] mb-2 sm:mb-3">
                                Create Resume
                            </h3>
                            <p className="text-sm sm:text-base text-[var(--color-text-light)] leading-relaxed">
                                Start building your professional resume with our easy-to-use builder
                            </p>
                        </motion.div>
                    </Link>

                    {/* My Resumes Card */}
                    <Link to="/cv-builder">
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-[var(--color-surface-80)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200 cursor-pointer"
                        >
                            <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                                <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] mb-2 sm:mb-3">
                                My Resumes
                            </h3>
                            <p className="text-sm sm:text-base text-[var(--color-text-light)] leading-relaxed">
                                View and manage all your saved resumes in one place
                            </p>
                        </motion.div>
                    </Link>

                    {/* Settings Card */}
                    <Link to="/profile">
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-[var(--color-surface-80)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200 cursor-pointer"
                        >
                            <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                                <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] mb-2 sm:mb-3">
                                Settings
                            </h3>
                            <p className="text-sm sm:text-base text-[var(--color-text-light)] leading-relaxed">
                                Manage your account preferences and personal information
                            </p>
                        </motion.div>
                    </Link>

                    {/* User Management Card */}
                    {userRole === 'admin' && (
                        <Link to="/dashboard/users">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
                                className="bg-[var(--color-surface-80)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200 cursor-pointer"
                            >
                                <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                                    <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] mb-2 sm:mb-3">
                                    User Management
                                </h3>
                                <p className="text-sm sm:text-base text-[var(--color-text-light)] leading-relaxed">
                                    Manage user accounts, permissions, and monitor activity
                                </p>
                            </motion.div>
                        </Link>
                    )}
                </motion.div>

                {/* Account Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-[var(--color-surface-80)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/30 shadow-lg max-w-2xl"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-dark)] mb-4 flex items-center gap-3">
                        <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-[#017A8C] flex-shrink-0" />
                        Account Management
                    </h2>
                    <p className="text-sm sm:text-base text-[var(--color-text-light)] mb-6">
                        Need to take a break? You can log out of your account here.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="px-6 sm:px-8 py-3 border-2 border-[#017A8C] text-[#017A8C] font-semibold rounded-xl hover:bg-[#017A8C] hover:text-white transition-all duration-200 flex items-center gap-2 min-h-[44px] justify-center sm:justify-start"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        Log Out
                    </motion.button>
                </motion.div>
            </main>
        </div>
    );
}

export default Dashboard;
