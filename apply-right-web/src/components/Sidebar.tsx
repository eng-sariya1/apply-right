import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, FileSearch, LayoutTemplate, Briefcase, LogOut, ChevronRight, Sun, Moon, Shield, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, path: '/home' },
  { label: 'CV Builder', icon: FileText, path: '/cv-builder' },
  { label: 'ATS Analysis', icon: FileSearch, path: '/ats' },
  { label: 'Templates', icon: LayoutTemplate, path: '/templates' },
  { label: 'Suggested Jobs', icon: Briefcase, path: '/suggested-jobs' },
];

interface SidebarProps {
  /** Desktop-only collapsed (icon-rail) state. */
  collapsed: boolean;
  /** Toggle the desktop collapsed state. */
  onToggle: () => void;
  /** True when the viewport is desktop-width (>= lg). Drives drawer vs. rail behavior. */
  isDesktop: boolean;
  /** Whether the mobile off-canvas drawer is open. */
  mobileOpen: boolean;
  /** Close the mobile drawer (e.g. after navigation). */
  onCloseMobile: () => void;
}

export default function Sidebar({ collapsed, onToggle, isDesktop, mobileOpen, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // On mobile the drawer is always full-width with labels; collapsing only applies to desktop.
  const showLabels = !isDesktop || !collapsed;

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (currentUser?.email?.slice(0, 2) ?? 'U').toUpperCase();

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isDesktop) onCloseMobile();
  };

  const handleLogout = async () => {
    await logout();
    if (!isDesktop) onCloseMobile();
    navigate('/');
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isDesktop ? (collapsed ? 72 : 260) : 280,
        x: isDesktop ? 0 : (mobileOpen ? 0 : -296),
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden={!isDesktop && !mobileOpen}
      // `max-w-[85vw]` keeps the mobile drawer inside the viewport (it never
      // exceeds 85% of the screen); on desktop the animated width is always
      // <= 260px so the cap is inert. The -296 closed offset still fully hides
      // the drawer since its rendered width can never exceed 280px.
      className="fixed left-0 top-0 h-[100dvh] max-w-[85vw] z-[60] flex flex-col bg-[var(--color-surface-solid)] border-r border-[var(--color-border)]/40 shadow-xl shadow-black/5 overflow-hidden"
    >
      {/* Profile section */}
      <div className="px-3 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate('/profile')}
            title="My Profile"
            className={`flex items-center gap-3 min-w-0 rounded-xl p-1 -m-1 text-left hover:bg-[#017A8C]/5 transition-colors ${showLabels ? 'flex-1' : 'flex-none'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#017A8C] to-[#019baf] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md select-none">
              {initials}
            </div>

            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.div
                  key="profile-text"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-[var(--color-text-dark)] truncate leading-tight">{displayName}</p>
                  <p className="text-xs text-[var(--color-text-light)] truncate leading-tight mt-0.5">{currentUser?.email || ''}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {isDesktop ? (
            <button
              onClick={onToggle}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-9 h-9 rounded-lg bg-[#017A8C]/10 hover:bg-[#017A8C]/20 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <motion.div
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-4 h-4 text-[var(--color-text-dark)]" />
              </motion.div>
            </button>
          ) : (
            <button
              onClick={onCloseMobile}
              title="Close menu"
              aria-label="Close menu"
              className="w-11 h-11 rounded-lg bg-[#017A8C]/10 hover:bg-[#017A8C]/20 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-[var(--color-text-dark)]" />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[var(--color-border)]/50 mb-3 flex-shrink-0" />

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              title={showLabels ? undefined : item.label}
              className={`w-full flex items-center gap-3 px-3 min-h-[44px] py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white shadow-md shadow-[#017A8C]/25'
                  : 'text-[var(--color-text-dark)] hover:bg-[#017A8C]/10 hover:text-[#017A8C]'
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[var(--color-text-light)] group-hover:text-[#017A8C]'
                }`}
              />
              <AnimatePresence mode="wait">
                {showLabels && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Admin-only Dashboard link */}
        {userRole === 'admin' && (() => {
          const isActive = location.pathname === '/dashboard';
          return (
            <button
              onClick={() => handleNavigate('/dashboard')}
              title={showLabels ? undefined : 'Dashboard'}
              className={`w-full flex items-center gap-3 px-3 min-h-[44px] py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white shadow-md shadow-[#017A8C]/25'
                  : 'text-[var(--color-text-dark)] hover:bg-[#017A8C]/10 hover:text-[#017A8C]'
              }`}
            >
              <Shield
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[var(--color-text-light)] group-hover:text-[#017A8C]'
                }`}
              />
              <AnimatePresence mode="wait">
                {showLabels && (
                  <motion.span
                    key="dashboard-label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium truncate"
                  >
                    Dashboard
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })()}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-[var(--color-border)]/50 mt-3 flex-shrink-0" />

      {/* Dark mode toggle */}
      <div className="px-3 pt-3 flex-shrink-0">
        <button
          onClick={toggleTheme}
          title={showLabels ? undefined : (theme === 'dark' ? 'Light mode' : 'Dark mode')}
          className="w-full flex items-center gap-3 px-3 min-h-[44px] py-2.5 rounded-xl text-[var(--color-text-dark)] hover:bg-[#017A8C]/10 hover:text-[#017A8C] transition-all duration-200 group"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 flex-shrink-0 text-[var(--color-text-light)] group-hover:text-[#017A8C]" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0 text-[var(--color-text-light)] group-hover:text-[#017A8C]" />
          )}
          <AnimatePresence mode="wait">
            {showLabels && (
              <motion.span
                key="theme-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium truncate"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          title={showLabels ? undefined : 'Logout'}
          className="w-full flex items-center gap-3 px-3 min-h-[44px] py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {showLabels && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
