import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, LayoutDashboard, FileText, FileSearch, LayoutTemplate, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

const NAV_ITEMS = [
  { label: 'Landing Page', icon: Globe, path: '/' },
  { label: 'Home', icon: LayoutDashboard, path: '/home' },
  { label: 'CV Builder', icon: FileText, path: '/cv-builder' },
  { label: 'ATS Analysis', icon: FileSearch, path: '/ats' },
  { label: 'Templates', icon: LayoutTemplate, path: '/templates' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (currentUser?.email?.slice(0, 2) ?? 'U').toUpperCase();

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col bg-white border-r border-[#C6DEE4]/40 shadow-xl shadow-black/5 overflow-hidden"
    >
      {/* Profile section */}
      <div className="px-3 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#017A8C] to-[#019baf] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md select-none">
            {initials}
          </div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="profile-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-[#02343F] truncate leading-tight">{displayName}</p>
                <p className="text-xs text-[#88B7C4] truncate leading-tight mt-0.5">{currentUser?.email || ''}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-7 h-7 rounded-lg bg-[#FAF7F0] hover:bg-[#017A8C]/10 flex items-center justify-center transition-colors flex-shrink-0 ml-auto"
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 text-[#017A8C]" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[#C6DEE4]/50 mb-3 flex-shrink-0" />

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white shadow-md shadow-[#017A8C]/25'
                  : 'text-[#02343F] hover:bg-[#017A8C]/10 hover:text-[#017A8C]'
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#88B7C4] group-hover:text-[#017A8C]'
                }`}
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
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
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-[#C6DEE4]/50 mt-3 flex-shrink-0" />

      {/* Logout */}
      <div className="px-3 py-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
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
