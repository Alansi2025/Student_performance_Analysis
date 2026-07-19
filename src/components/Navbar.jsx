import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell, User, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state synced with localStorage and html class
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const navTabs = [
    ...(isLoggedIn ? [{ name: 'Dashboard', href: '#dashboard' }] : []),
    { name: 'Curriculum', href: '#curriculum' },
    { name: 'Live Sessions', href: '#live' },
    { name: 'Mentors', href: '#mentors' }
  ];

  // Close mobile menu on resize to desktop/tablet size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* LEFT SIDE: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('Curriculum');
              }}
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
              aria-label="AetherLearn Home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-650 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-500/10 dark:shadow-brand-500/5 group-hover:scale-105 transition-transform duration-300">
                A
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600 dark:from-white dark:via-gray-100 dark:to-brand-400 bg-clip-text text-transparent group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                AetherLearn
              </span>
            </a>
          </div>

          {/* CENTER: Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 h-full" aria-label="Main Navigation">
            <ul className="flex space-x-1 lg:space-x-2 h-full items-center">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <li key={tab.name} className="relative flex items-center h-full">
                    <button
                      onClick={() => {
                        setActiveTab(tab.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        isActive 
                          ? 'text-brand-600 dark:text-brand-400 font-bold' 
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {tab.name}
                      {/* Active state indicator line */}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,92,250,0.15)] dark:shadow-[0_-2px_10px_rgba(59,92,250,0.4)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT SIDE: Search & Actions */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 md:flex-initial">
            
            {/* Search Bar Container */}
            <div 
              className={`relative flex items-center transition-all duration-300 rounded-full bg-slate-100/80 dark:bg-slate-900/90 border ${
                searchFocused 
                  ? 'border-brand-500/60 ring-2 ring-brand-500/10 w-36 sm:w-48 md:w-52 lg:w-60 bg-white dark:bg-[#0d1326]' 
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 w-24 sm:w-36 md:w-40 lg:w-48'
              }`}
            >
              <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-gray-500">
                <Search size={14} className={`transition-colors duration-200 ${searchFocused ? 'text-brand-500' : 'text-slate-400 dark:text-gray-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 rounded-full focus:outline-none"
                aria-label="Search courses"
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              type="button"
              className="p-2 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Toggle color theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Notification Icon Button */}
            <button
              type="button"
              className="relative p-2 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="View notifications"
            >
              <Bell size={16} />
              {/* Pulse Indicator */}
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            </button>

            {/* Profile Icon Button */}
            <button
              type="button"
              className="p-2 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="User profile menu"
            >
              <User size={16} />
            </button>

            {/* Log In Button (Desktop & Tablet) */}
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                type="button"
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-650 dark:text-rose-400 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 border border-rose-500/20 transition-all duration-200 shadow-sm focus:outline-none"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('Login')}
                type="button"
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="transform rotate-0 transition-transform duration-200" />
              ) : (
                <Menu size={20} className="transform rotate-0 transition-transform duration-200" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWDOWN MENU */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden border-t border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] transition-all duration-300 ease-in-out"
        >
          <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
            <div className="space-y-1">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <a
                    key={tab.name}
                    href={tab.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50/60 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-l-4 border-brand-500 pl-3'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
                    }`}
                  >
                    {tab.name}
                  </a>
                );
              })}
            </div>
            
            {/* Log In Button (Mobile Dropdown Viewport) */}
            <div className="px-4 pt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  type="button"
                  className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-650 dark:text-rose-455 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 transition-all duration-200 border border-rose-500/20 shadow-sm"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('Login');
                    setIsMobileMenuOpen(false);
                  }}
                  type="button"
                  className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
