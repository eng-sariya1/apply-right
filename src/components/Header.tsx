import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import Logo from './Logo';

const Header = () => {
  const navigate = useNavigate();
  const menuRef = useRef<Menu>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'CV Builder',
      icon: 'pi pi-pencil',
      command: () => navigate('/builder')
    },
    {
      label: 'Templates',
      icon: 'pi pi-palette',
      command: () => console.log('Templates coming soon')
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      command: () => console.log('About coming soon')
    }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-sky-400/20 shadow-lg shadow-sky-400/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Brand Name */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => navigate('/')}
          >
            <Logo className="w-10 h-10" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              CV Builder
            </h1>
          </div>

          {/* Right: Sign Up + Menu */}
          <div className="flex items-center gap-3">
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              className="glass-btn-base glass-btn-primary"
              onClick={() => console.log('Sign up clicked')}
            />

            <Button
              icon="pi pi-bars"
              rounded
              outlined
              severity="secondary"
              className="glass-btn-base glass-btn-ghost"
              onClick={(e) => menuRef.current?.toggle(e)}
              aria-label="Menu"
            />

            <Menu
              model={menuItems}
              popup
              ref={menuRef}
              className="bg-slate-900 border border-sky-400/30 shadow-xl shadow-sky-400/20"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
