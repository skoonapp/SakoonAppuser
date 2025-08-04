
import React from 'react';
import { NAV_LINKS } from '../constants';
import type { NavLink, User } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  currentUser: User;
  onLogout: () => void;
}

const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, currentUser, onLogout }) => {
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.startsWith('#') ? href.substring(1) : href;
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-700 focus:outline-none mr-4" aria-label="Open menu">
              <HamburgerIcon className="w-7 h-7" />
            </button>
            <h1 className="text-3xl font-bold text-cyan-700">SakoonApp</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link: NavLink) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-600 hover:text-cyan-600 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center space-x-4 border-l pl-6 border-slate-300">
              <button
                onClick={onLogout}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                लॉगआउट
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
           <h2 className="text-2xl font-bold text-cyan-700">SakoonApp</h2>
           <button onClick={() => setIsMenuOpen(false)} className="text-slate-700 focus:outline-none" aria-label="Close menu">
             <CloseIcon className="w-7 h-7" />
           </button>
        </div>
        <div className="flex flex-col h-full justify-between">
            <nav className="flex flex-col p-4 space-y-2">
            {NAV_LINKS.map((link: NavLink) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)} 
                  className="text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 font-medium p-3 rounded-md transition-colors text-lg"
                >
                  {link.label}
                </a>
            ))}
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={onLogout}
                    className="w-full text-left bg-red-50 text-red-700 font-medium p-3 rounded-md transition-colors text-lg hover:bg-red-100"
                >
                    लॉगआउट
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);