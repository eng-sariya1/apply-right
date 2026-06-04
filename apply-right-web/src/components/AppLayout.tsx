import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useIsDesktop } from '../hooks/useMediaQuery';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Never leave the drawer "open" when crossing into desktop layout.
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen && !isDesktop) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileOpen, isDesktop]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Mobile top app bar with hamburger (hidden on desktop).
          `sticky` (not `fixed`) keeps the bar in normal flow, so it reserves
          its own 56px at the top and the page content sits flush right below
          it — no separate padding spacer that could drift out of sync. */}
      <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-[var(--color-surface-solid)]/95 backdrop-blur-md border-b border-[var(--color-border)]/40 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="w-11 h-11 -ml-1 rounded-xl flex items-center justify-center text-[var(--color-text-dark)] hover:bg-[#017A8C]/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-[#017A8C] tracking-tight">Nuivo</span>
      </header>

      {/* Backdrop for the mobile drawer */}
      <AnimatePresence>
        {mobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        isDesktop={isDesktop}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <motion.div
        animate={{ marginLeft: isDesktop ? (collapsed ? 72 : 260) : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}
