import React from 'react';
import { LogoIcon, HomeIcon, PaymentIcon, AnalyticsIcon, EducationIcon, ExpandIcon, BellIcon, LogoutIcon } from './IconComponents';

const NavItem: React.FC<{ icon: React.ElementType, label: string, active?: boolean }> = ({ icon: Icon, label, active = false }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${active ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-light hover:text-text-light'}`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </a>
);

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-text-light">
          <LogoIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">PlaybotIQ</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-2">
          <NavItem icon={HomeIcon} label="Home" active />
          <NavItem icon={PaymentIcon} label="Payment" />
          <NavItem icon={AnalyticsIcon} label="Analytics" />
          <NavItem icon={EducationIcon} label="Education" />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-light text-text-muted hover:text-text-light transition-colors hidden sm:block">
          <ExpandIcon className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-border-color hidden sm:block"></div>
        <div className="flex items-center gap-2 text-text-muted hidden sm:block">
          <span className="text-sm">Pro</span>
        </div>
        <button className="p-2 rounded-full hover:bg-surface-light text-text-muted hover:text-text-light transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar" className="w-8 h-8 rounded-full" />
        <button className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-text-light transition-colors">
            <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;