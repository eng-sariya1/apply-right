import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronRight,
    Home,
    User,
    Lock,
    AlertCircle,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { currentUser, updateDisplayName, changePassword } = useAuth();

    const [name, setName] = useState(currentUser?.displayName || '');
    const [savingName, setSavingName] = useState(false);
    const [nameError, setNameError] = useState('');
    const [nameNotice, setNameNotice] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPwd, setSavingPwd] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [pwdNotice, setPwdNotice] = useState('');

    const initials = currentUser?.displayName
        ? currentUser.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : (currentUser?.email?.slice(0, 2) ?? 'U').toUpperCase();

    const isPasswordUser = currentUser?.providerData?.some((p) => p.providerId === 'password');

    async function handleSaveName(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setNameNotice('');
            return setNameError('Please enter your name.');
        }
        try {
            setNameError('');
            setNameNotice('');
            setSavingName(true);
            await updateDisplayName(trimmed);
            setNameNotice('Your name has been updated.');
        } catch (err: unknown) {
            const msg = (err as Error)?.message;
            if (msg === 'name-taken') {
                setNameError('That name is already in use, please choose a different one.');
            } else if (msg === 'Invalid name') {
                setNameError('Please enter a valid name.');
            } else {
                setNameError('Could not update your name. Please try again.');
            }
        } finally {
            setSavingName(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setPwdError('');
        setPwdNotice('');
        if (newPassword.length < 6) {
            return setPwdError('New password must be at least 6 characters long.');
        }
        if (newPassword !== confirmPassword) {
            return setPwdError('New password and confirmation do not match.');
        }
        try {
            setSavingPwd(true);
            await changePassword(currentPassword, newPassword);
            setPwdNotice('Your password has been changed.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setPwdError('Current password is incorrect.');
            } else if (code === 'auth/weak-password') {
                setPwdError('New password is too weak (min 6 characters).');
            } else if (code === 'auth/requires-recent-login') {
                setPwdError('For security, please log out and log back in, then try again.');
            } else {
                setPwdError('Could not change your password. Please try again.');
            }
        } finally {
            setSavingPwd(false);
        }
    }

    const inputClass =
        'w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/30 transition-all outline-none bg-[var(--color-surface-50)] text-[var(--color-text-dark)]';
    const labelClass = 'block text-sm font-semibold text-[var(--color-text-dark)] mb-2';

    return (
        <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
            </div>

            {/* Sticky Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative lg:sticky lg:top-0 z-50"
            >
                <div className="bg-gradient-to-r from-[#015C6A] via-[#017A8C] to-[#019baf] rounded-b-[1.5rem] sm:rounded-b-[2rem] shadow-lg shadow-[#017A8C]/20 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
                    </div>

                    {/* Top nav row */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-3 sm:pt-4 pb-2 relative z-10">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="hidden lg:block text-xl sm:text-2xl font-bold text-white tracking-tight cursor-pointer"
                                onClick={() => navigate('/home')}
                            >
                                Nuivo
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/home')}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap min-h-[40px]"
                            >
                                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">Back to Home</span>
                                <span className="sm:hidden">Back</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Breadcrumb + Title */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6 pt-1 relative z-10">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3 overflow-x-auto">
                            <Home className="w-3.5 h-3.5 flex-shrink-0" />
                            <button onClick={() => navigate('/home')} className="hover:text-white/90 transition-colors whitespace-nowrap">Home</button>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-white font-medium whitespace-nowrap">My Profile</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">My Profile</h1>
                                <p className="text-xs sm:text-sm text-white/60">Manage your account details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-10 sm:py-16 lg:py-20 space-y-6 sm:space-y-8">
                {/* Card A — Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[var(--color-surface-80)] backdrop-blur-sm rounded-2xl border-2 border-[var(--color-border)]/50 shadow-lg p-5 sm:p-6 md:p-8"
                >
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#017A8C] to-[#019baf] flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md select-none flex-shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] leading-tight">Personal Information</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-light)] truncate break-words">{currentUser?.email}</p>
                        </div>
                    </div>

                    {nameError && (
                        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-red-700">{nameError}</p>
                        </div>
                    )}
                    {nameNotice && (
                        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-green-700">{nameNotice}</p>
                        </div>
                    )}

                    <form onSubmit={handleSaveName} className="space-y-4 sm:space-y-5">
                        <div>
                            <label htmlFor="full-name" className={`${labelClass} text-xs sm:text-sm`}>Full name</label>
                            <input
                                id="full-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`${inputClass} text-sm`}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className={`${labelClass} text-xs sm:text-sm`}>Email address</label>
                            <input
                                type="email"
                                value={currentUser?.email || ''}
                                disabled
                                className={`${inputClass} opacity-60 cursor-not-allowed text-sm`}
                            />
                            <p className="text-xs text-[var(--color-text-light)] mt-1.5">Email can't be changed here.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: savingName ? 1 : 1.02 }}
                            whileTap={{ scale: savingName ? 1 : 0.98 }}
                            type="submit"
                            disabled={savingName}
                            className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                        >
                            {savingName ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                                    Saving...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Card B — Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-[var(--color-surface-80)] backdrop-blur-sm rounded-2xl border-2 border-[var(--color-border)]/50 shadow-lg p-5 sm:p-6 md:p-8"
                >
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#017A8C]/10 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#017A8C]" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-dark)] leading-tight">Change Password</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-light)]">Update the password you use to log in</p>
                        </div>
                    </div>

                    {!isPasswordUser ? (
                        <div className="p-3 sm:p-4 bg-[#017A8C]/5 border border-[var(--color-border)]/60 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-[#017A8C] flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-[var(--color-text-dark)]">
                                You sign in with Google, so there's no password to change here.
                                Manage your password in your Google Account.
                            </p>
                        </div>
                    ) : (
                        <>
                            {pwdError && (
                                <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm text-red-700">{pwdError}</p>
                                </div>
                            )}
                            {pwdNotice && (
                                <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm text-green-700">{pwdNotice}</p>
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">
                                <div>
                                    <label htmlFor="current-password" className={`${labelClass} text-xs sm:text-sm`}>Current password</label>
                                    <PasswordInput
                                        id="current-password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter your current password"
                                        className={`${inputClass} pr-12 text-sm`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-password" className={`${labelClass} text-xs sm:text-sm`}>New password</label>
                                    <PasswordInput
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Minimum 6 characters"
                                        className={`${inputClass} pr-12 text-sm`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className={`${labelClass} text-xs sm:text-sm`}>Confirm new password</label>
                                    <PasswordInput
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Re-enter the new password"
                                        className={`${inputClass} pr-12 text-sm`}
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: savingPwd ? 1 : 1.02 }}
                                    whileTap={{ scale: savingPwd ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={savingPwd}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] text-sm sm:text-base"
                                >
                                    {savingPwd ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update password'
                                    )}
                                </motion.button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
