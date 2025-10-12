import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-[#FAF7F0] flex items-center justify-center px-4 py-16 md:py-20 relative overflow-hidden">
            {/* Background subtle gradient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/5 to-transparent blur-3xl rounded-full" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gradient-to-l from-[#017A8C]/5 to-transparent blur-3xl rounded-full" />
            </div>

            {/* Main Hero Container */}
            <div className="w-full max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-[#F3F3F3] rounded-3xl shadow-md shadow-[#017A8C]/10 py-20 px-10 md:px-16 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#017A8C]/5 before:to-transparent before:rounded-3xl before:-z-10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Column - Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="space-y-6 z-10"
                        >
                            {/* Title */}
                            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
                                <span className="text-[#02343F]">This resume builder gets you </span>
                                <span className="text-[#017A8C]">promoted.</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-[#88B7C4] leading-relaxed max-w-xl">
                                Create your professional CV with ease — optimized for ATS and designed to impress.
                            </p>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/cv-builder')}
                                className="bg-[#017A8C] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#015C6A] transition-all duration-300 transform shadow-lg hover:shadow-xl shadow-[#017A8C]/20 hover:shadow-[#017A8C]/30 inline-block mt-4"
                            >
                                Create  resume
                            </motion.button>
                        </motion.div>

                        {/* Right Column - CV Preview Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02, rotate: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="bg-white p-4 md:p-6 rounded-2xl shadow-lg shadow-[#017A8C]/10 max-w-md lg:max-w-lg w-full lg:translate-x-8 relative z-10"
                            >
                                <img
                                    src="/rm/typing-hero-19c17dfac3e22fdc206c80e7f4d80e2c2feaa5cc2ac34f29257ec4da6ec6c722.png"
                                    alt="CV Builder Preview"
                                    className="w-full h-auto rounded-lg"
                                />
                            </motion.div>

                            {/* Decorative element behind image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#017A8C]/10 to-transparent rounded-2xl blur-2xl -z-10 scale-105" />
                        </motion.div>
                    </div>

                    {/* Optional: Trust indicators or feature highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                        className="mt-16 pt-12 border-t border-[#017A8C]/10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-[#017A8C]">ATS-Friendly</h3>
                                <p className="text-sm text-[#88B7C4]">Pass applicant tracking systems with ease</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-[#017A8C]">Professional</h3>
                                <p className="text-sm text-[#88B7C4]">Stand out with polished design</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-bold text-[#017A8C]">Easy to Use</h3>
                                <p className="text-sm text-[#88B7C4]">Build your resume in minutes</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
