import MentorDashboard from './components/MentorDashboard';
import OverseerDashboard from './components/OverseerDashboard';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import StudentDashboard from './components/StudentDashboard';
import agiStage from './assets/agi_stage.png';
import alexChenAvatar from './assets/julian_vance_profile.png';
import circuitBoard from './assets/circuit_board.png';
import davidKimAvatar from './assets/vikram_singh_profile.png';
import forecastingChart from './assets/forecasting_chart.png';
import generativeAiAbstract from './assets/generative_ai_abstract.png';
import liveHeroRoom from './assets/live_hero_room.png';
import marcusProfile from './assets/marcus_profile.png';
import quantumScientist from './assets/quantum_scientist.png';
import sarahJenkinsAvatar from './assets/sarah_profile.png';
import { Activity, AlertCircle, ArrowRight, Award, BarChart2, Bell, Bot, Brain, BrainCircuit, Building2, Calendar, Camera, CameraOff, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronRight, Clock, Code2, Cpu, Database, ExternalLink, Eye, EyeOff, FileText, Globe, GraduationCap, ImageIcon, KeyRound, Link, Loader2, Lock, Mail, Map, Menu, MessageSquare, Mic, MicOff, Moon, Play, School, Search, Send, Share2, Shield, Sliders, Sparkles, Star, Sun, Target, TrendingUp, User, UserCheck, Users, Video, Volume2, VolumeX, Waves, Wifi, WifiOff, X } from 'lucide-react';

// --- Starfield Background (Animated blue particles on deep black) ---
function StarfieldBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const count = Math.floor((width * height) / 4500); // density scales with screen
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.15 + 0.05,
        opacity: Math.random() * 0.6 + 0.15,
        // Blue hue range: 200-240
        hue: 210 + Math.random() * 30,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < -5) p.x = window.innerWidth + 5;
        if (p.x > window.innerWidth + 5) p.x = -5;
        if (p.y < -5) p.y = window.innerHeight + 5;
        if (p.y > window.innerHeight + 5) p.y = -5;

        // Twinkle effect
        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
        const alpha = p.opacity * (0.6 + 0.4 * twinkle);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 62%, ${alpha})`;
        ctx.fill();

        // Subtle glow for larger particles
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 55%, ${alpha * 0.12})`;
          ctx.fill();
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
}

// --- Component: Navbar.jsx ---
function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* LEFT SIDE: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Home'); }}
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
                      className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${isActive
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
              className={`relative flex items-center transition-all duration-300 rounded-full bg-slate-100/80 dark:bg-slate-900/90 border ${searchFocused
                  ? 'border-brand-500/60 ring-2 ring-brand-500/10 w-36 sm:w-48 md:w-52 lg:w-60 bg-white dark:bg-[#0c0c0c]'
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
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

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-6 px-4 z-50 animate-fade-in-up">
                  <div className="flex flex-col items-center justify-center text-center gap-2">
                    <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

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
          className="lg:hidden border-t border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#050505] transition-all duration-300 ease-in-out"
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
                    className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${isActive
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


// --- Component: Footer.jsx ---
function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: crypto.randomUUID().slice(0, 12) }),
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="relative flex items-center mt-2 max-w-sm group">
      {status === 'success' ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold py-2 animate-pulse">
          ✅ Subscribed successfully!
        </p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-300 pr-10"
            required
            disabled={status === 'sending'}
          />
          <button
            type="submit"
            className="absolute right-1 p-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors duration-200 disabled:opacity-50"
            aria-label="Subscribe"
            disabled={status === 'sending'}
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </form>
  );
}

function Footer({ setActiveTab, isLoggedIn, onLogout }) {
  return (
    <footer className="w-full bg-white dark:bg-[#050505] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-12 gap-y-10 gap-x-6 sm:gap-x-8 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">

          {/* Column 1: Brand Info */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-5 text-left">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-650 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-brand-500/10 dark:shadow-brand-500/5 group-hover:scale-105 transition-transform duration-300">
                A
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600 dark:from-white dark:via-gray-100 dark:to-brand-400 bg-clip-text text-transparent transition-colors duration-300 block">
                  AetherLearn
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block -mt-0.5 font-mono">
                  AI Performance Analytics
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering the next generation of education through predictive analytics, real-time tracking, and personalized learning pathways.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2 lg:col-start-6 space-y-4 text-left">
            <h4 className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-200 uppercase font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#" onClick={(e) => { e.preventDefault(); if (setActiveTab) setActiveTab('Home'); }}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                >
                  Home
                </a>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <a
                      href="#dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        if (setActiveTab) setActiveTab('Dashboard');
                      }}
                      className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#logout"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onLogout) onLogout();
                      }}
                      className="hover:text-rose-600 dark:hover:text-rose-405 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                    >
                      Log Out
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        if (setActiveTab) setActiveTab('Login');
                      }}
                      className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="#register"
                      onClick={(e) => {
                        e.preventDefault();
                        if (setActiveTab) setActiveTab('Login');
                      }}
                      className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                    >
                      Register
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-200 uppercase font-mono">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                >
                  Predictive Analytics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                >
                  Real-time Monitoring
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                >
                  Personalized Learning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 font-medium inline-block hover:translate-x-1"
                >
                  Early Intervention
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Connect */}
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 space-y-5 text-left">
            <h4 className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-200 uppercase font-mono">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Subscribe to get the latest updates on performance analytics and learning methodologies.
            </p>
            <SubscribeForm />

            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block font-mono">
                Follow Us
              </span>
              <div className="flex gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="GitHub"
                >
                  <Code2 className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="Community"
                >
                  <Users className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@aetherlearn.edu"
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-all duration-200 hover:scale-105"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; 2026 AetherLearn. All rights reserved.
          </div>
          <div className="flex gap-6 font-medium text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-brand-600 dark:hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-600 dark:hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}


// --- Component: LoginPage.jsx ---
function LoginPage({ onBackToHome, onLoginSuccess }) {
  // viewState can be 'signIn', 'signUp', or 'choosePath'
  const [viewState, setViewState] = useState('signIn');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sign In inputs state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up inputs state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpInstitute, setSignUpInstitute] = useState('');
  const [signUpState, setSignUpState] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpAccessKey, setSignUpAccessKey] = useState('');
  const [signUpConfirmAccessKey, setSignUpConfirmAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showExistsModal, setShowExistsModal] = useState(false);
  const [existsEmail, setExistsEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState('Student');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Theme state synced with localStorage and HTML class
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

  const roles = [
    "Student / Learner",
    "Educator / Instructor",
    "Administrator",
    "AI Researcher"
  ];

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signInEmail || !signInPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      const activeRoleParam = selectedRole === 'Teacher' ? 'Mentor' : selectedRole;
      const formData = new URLSearchParams();
      formData.append('username', signInEmail.trim());
      formData.append('password', signInPassword);

      const response = await fetch(`http://localhost:8000/users/login?role=${encodeURIComponent(activeRoleParam)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.detail || 'Invalid email or password.');
        return;
      }

      const data = await response.json();
      const user = { email: signInEmail.trim(), role: data.role || activeRoleParam };
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    }
  };

  const executeGoogleAuth = async (token) => {
    setErrorMsg('');
    try {
      const response = await fetch('http://localhost:8000/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          credential: token,
          role: selectedRole || 'Student'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.detail || 'Google Authentication failed.');
        return;
      }

      const data = await response.json();
      const user = {
        email: data.email,
        name: data.name,
        picture: data.picture,
        role: data.role
      };
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Google authentication server error.');
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMsg('');
    const userEmail = window.prompt("Google Account Sign-In:\nEnter your Google Account email (or paste Google ID Token):", "1978adityakakri@gmail.com");
    if (!userEmail) return;
    executeGoogleAuth(userEmail.trim());
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: '341791876616-40e80livod2f7h4u2kj8jm0pov66bdv3.apps.googleusercontent.com',
          callback: (res) => {
            if (res.credential) {
              executeGoogleAuth(res.credential);
            }
          }
        });
        const btnContainer = document.getElementById('googleSignInBtnContainer');
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      } catch (err) {
        console.error('Google GSI error:', err);
      }
    }
  }, []);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Email format validation check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|edu|org|net|gov|co|io|ai)$/i;
    if (!emailRegex.test(signUpEmail.trim())) {
      setErrorMsg('Please enter a valid email address containing "@" and a supported domain extension (e.g., .com, .in, .edu).');
      return;
    }

    if (signUpAccessKey !== signUpConfirmAccessKey) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    try {
      const activeRoleParam = selectedRole === 'Teacher' ? 'Mentor' : selectedRole;
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpEmail.trim(),
          password: signUpAccessKey,
          role: activeRoleParam
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.detail === 'Email already registered') {
          setExistsEmail(signUpEmail.trim());
          setShowExistsModal(true);
        } else {
          setErrorMsg(errorData.detail || 'Registration failed.');
        }
        return;
      }

      // Clear password states and transition back to sign in
      setSignInEmail(signUpEmail.trim());
      setSignInPassword('');
      setErrorMsg('');
      setSuccessMsg('Account created successfully! Please sign in with your credentials.');
      setViewState('signIn');
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">

      {/* Top Header Controls with Theme Toggle and Back button */}
      <div className="w-full flex items-center justify-between mb-4 max-w-md">
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors duration-200 flex items-center gap-1.5 focus:outline-none"
        >
          &larr; Back to Platform
        </button>

        {/* Dynamic theme toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          type="button"
          className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* ==================== LOGIN CARD CONTAINER ==================== */}
      <div className="w-full max-w-md bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl dark:shadow-black/30 p-8 sm:p-10 transition-all duration-300 animate-login-card animate-border-glow">

        {viewState === 'signIn' ? (
          /* ==================== SIGN IN VIEW ==================== */
          <>
            {/* Title Block */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-855 to-brand-600 dark:from-white dark:via-gray-150 dark:to-brand-400 bg-clip-text text-transparent">
                AetherLearn
              </h1>
              <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-2">
                Intelligence evolved. Access your account.
              </p>
            </div>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-455 text-xs font-semibold text-center animate-fade-in">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-455 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-5 text-left">

              {/* Account Portal Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">
                  Account Portal Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Student')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Student'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Teacher')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Teacher' || selectedRole === 'Mentor'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    👨‍🏫 Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Overseer')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Overseer'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    🛡️ Overseer
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="alex@aetherlearn.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-855/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 pl-11 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white focus:outline-none cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center">
                <label className="relative flex items-center cursor-pointer select-none text-xs font-medium text-slate-650 dark:text-slate-350">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-200 ${rememberMe
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850/80'
                    }`}>
                    {rememberMe && (
                      <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  Remember me for 30 days
                </label>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-100 dark:bg-[#1a2b5c] text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-200 dark:hover:bg-[#20346e] py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm shadow-blue-500/5"
                >
                  <span>Sign In</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              {/* Divider */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80 dark:border-slate-850" />
                </div>
                <span className="relative px-3 bg-white dark:bg-[#0c0c0c] text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase font-mono">
                  Or continue with
                </span>
              </div>

              {/* Social login buttons */}
              <div className="space-y-3">
                <div id="googleSignInBtnContainer" className="w-full flex justify-center min-h-[40px]"></div>

                <div className="grid grid-cols-1 gap-3">
                  {/* GitHub */}
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-55 dark:hover:bg-slate-800/40 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-850 dark:text-slate-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>

            </form>

            {/* Footer text: Toggles to Sign Up Form */}
            <div className="text-center mt-6">
              <p className="text-xs text-slate-550 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => { setErrorMsg(''); setSuccessMsg(''); setViewState('signUp'); }}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline bg-transparent border-none p-0 focus:outline-none"
                >
                  Apply for Access
                </button>
              </p>
            </div>
          </>
        ) : (
          /* ==================== SIGN UP VIEW (The Earlier Form) ==================== */
          <>
            {/* Title Block */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-855 to-brand-600 dark:from-white dark:via-gray-150 dark:to-brand-400 bg-clip-text text-transparent">
                AetherLearn
              </h1>
              <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-2">
                Initialize your learning matrix.
              </p>

              {/* Symmetrical step progress dots */}
              <div className="flex justify-center items-center gap-1.5 mt-4">
                <span className="w-8 h-1 rounded-full bg-brand-500 dark:bg-brand-400 transition-colors duration-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-455 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSignUpSubmit} className="space-y-5 text-left">

              {/* Account Portal Role Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">
                  Registering Account Role
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Student')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Student'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Teacher')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Teacher' || selectedRole === 'Mentor'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    👨‍🏫 Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Overseer')}
                    className={`py-2 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedRole === 'Overseer'
                        ? 'bg-white dark:bg-slate-800 text-[#253df5] dark:text-blue-400 shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    🛡️ Overseer
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Sarah Connor"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Coordinates */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black tracking-widest text-slate-555 dark:text-slate-400 uppercase font-mono block">
                  Email Coordinates
                </label>
                <div
                  className="relative flex items-center w-full"
                  onMouseEnter={() => setIsEmailHovered(true)}
                  onMouseLeave={() => setIsEmailHovered(false)}
                >
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="sarah@cyberdyne.sys"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                  />

                  {/* Hover/Focus Tooltip */}
                  {(isEmailFocused || isEmailHovered) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl backdrop-blur-md z-30 text-left animate-fadeIn">
                      <div className="text-[11px] font-bold text-slate-705 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#253df5] dark:text-brand-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-[#253df5] dark:text-brand-400 block mb-0.5">Email Requirement</span>
                          Must contain <span className="font-mono text-[#253df5] dark:text-brand-400 font-black">@</span> and end with a valid extension (e.g. <span className="font-mono font-black">.com</span>, <span className="font-mono font-black">.in</span>, <span className="font-mono font-black">.edu</span>).
                        </div>
                      </div>
                      {/* Downward Pointer Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 rotate-45 -mt-1.25 z-20" />
                    </div>
                  )}
                </div>
              </div>

              {/* Institute Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">
                  Institute Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-500">
                    <School size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Aether University"
                    value={signUpInstitute}
                    onChange={(e) => setSignUpInstitute(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Select Your Role */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">
                  Select Your Role
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 dark:text-slate-550">
                    <UserCheck size={16} />
                  </span>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white pl-11 pr-10 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                  <span className="absolute right-4 text-slate-400 dark:text-slate-550 pointer-events-none">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>

              {/* State & City (2-column Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">
                    State
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 dark:text-slate-550">
                      <Map size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="California"
                      value={signUpState}
                      onChange={(e) => setSignUpState(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-555 dark:text-slate-400 uppercase font-mono block">
                    City
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 dark:text-slate-550">
                      <Building2 size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Choose Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-555 dark:text-slate-400 uppercase font-mono block">
                    Choose Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 dark:text-slate-550">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Choose your password"
                      value={signUpAccessKey}
                      onChange={(e) => setSignUpAccessKey(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-white focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-slate-555 dark:text-slate-400 uppercase font-mono block">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 dark:text-slate-555">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm your password"
                      value={signUpConfirmAccessKey}
                      onChange={(e) => setSignUpConfirmAccessKey(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-11 pr-12 py-3 rounded-2xl text-sm focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-white focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-100 dark:bg-[#1a2b5c] text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-200 dark:hover:bg-[#20346e] py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm shadow-blue-500/5"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

            </form>

            {/* Footer text: Toggles back to Sign In Form */}
            <div className="text-center mt-6">
              <p className="text-xs text-slate-550 dark:text-slate-400">
                Already part of the network?{' '}
                <button
                  onClick={() => { setErrorMsg(''); setSuccessMsg(''); setViewState('signIn'); }}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline bg-transparent border-none p-0 focus:outline-none"
                >
                  Authenticate
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Account Already Exists Modal */}
      {showExistsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">

            {/* Warning Icon Container */}
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <UserCheck size={28} />
            </div>

            {/* Content text */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-850 dark:text-white">
                Account Already Exists
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                An account with the email coordinates <span className="font-mono font-semibold text-slate-850 dark:text-slate-200">{existsEmail}</span> is already active. You may proceed to the Sign In page to log in.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setSignInEmail(existsEmail);
                  setShowExistsModal(false);
                  setViewState('signIn');
                }}
                className="w-full bg-blue-100 dark:bg-[#1a2b5c] text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-200 dark:hover:bg-[#20346e] py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setShowExistsModal(false)}
                className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white py-2 text-xs font-semibold bg-transparent border-none transition-colors duration-200"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


// --- Component: Hero.jsx ---
function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/12 w-[35rem] h-[35rem] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-1/4 right-1/12 w-[30rem] h-[30rem] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* LEFT COLUMN: Texts & Calls to Action */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] sm:leading-[1.1] lg:leading-[1.1] transition-colors duration-300 animate-fadeInUp">
            Intelligence Evolved: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-650 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Personalized AI
            </span> <br className="hidden sm:inline" />
            Learning for Every Mind.
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-300 animate-fadeInUp delay-100">
            Experience a living curriculum that adapts to your neural patterns.
            AetherLearn utilizes deep analytics to predict, guide, and accelerate your educational journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 animate-fadeInUp delay-200">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-[#253df5] hover:bg-[#1d2ae0] text-white px-8 py-4 rounded-xl text-sm font-black transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#253df5]/30 uppercase tracking-widest w-full sm:w-auto"
            >
              login and try it
            </button>

          </div>

        </div>

        {/* RIGHT COLUMN: Neural Pathway progress card */}
        <div className="lg:col-span-6 flex justify-center items-center relative">

          {/* Card Wrapper with Dynamic Floating Animation */}
          <div className="relative bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/80 dark:shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-[100%] max-w-[32rem] transition-all duration-300 animate-slideInRight animate-float-slow sheen-wrapper animate-pulse-glow-subtle">

            {/* Header info */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                Neural Pathway Progress
              </h2>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-gray-400 hover:text-slate-750 dark:hover:text-slate-200 transition-colors duration-250 cursor-pointer">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Neural graphic block (inner dark visual box) */}
            <div className="relative bg-[#0c0c0c] border border-slate-800/80 rounded-2xl p-4 sm:p-6 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
              {/* Radial glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,92,250,0.15),transparent_70%)] pointer-events-none" />

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Neural connection node wave SVG */}
              <svg className="w-full h-full relative z-10 opacity-80" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Pathway background lines */}
                <path d="M 0 100 Q 50 140 100 100 T 200 100 T 300 100" stroke="rgba(59,92,250,0.15)" strokeWidth="1.5" />
                <path d="M 0 120 Q 70 80 150 120 T 300 80" stroke="rgba(168,85,247,0.15)" strokeWidth="1.5" />

                {/* Wavy glowing signals (Mock path representation) */}
                <path
                  d="M 10 100 Q 45 130 90 95 T 180 105 T 290 85"
                  stroke="url(#blue-purple-glow-hero)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-[dash_10s_linear_infinite]"
                  style={{ strokeDasharray: '400', strokeDashoffset: '0' }}
                />

                <path
                  d="M 20 80 C 80 140 140 60 200 130 C 240 160 270 110 280 100"
                  stroke="url(#purple-green-glow-hero)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="opacity-70"
                />

                {/* Nodes / Dots representing synaptic junctions */}
                <circle cx="45" cy="115" r="4" className="fill-brand-400 animate-pulse" />
                <circle cx="90" cy="95" r="3" className="fill-purple-400" />
                <circle cx="135" cy="100" r="5" className="fill-emerald-400 animate-pulse" />
                <circle cx="180" cy="105" r="4.5" className="fill-indigo-400" />
                <circle cx="230" cy="130" r="3" className="fill-purple-300" />
                <circle cx="270" cy="110" r="4" className="fill-brand-400" />

                {/* SVG Gradient definitions */}
                <defs>
                  <linearGradient id="blue-purple-glow-hero" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b5cfa" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="purple-green-glow-hero" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="70%" stopColor="#3b5cfa" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* FLOATING AI TUTOR POPOVER CARD */}
              <div className="absolute left-4 top-1/4 z-20 bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 shadow-lg rounded-2xl p-3 flex items-center gap-3 hover:scale-102 transition-all duration-300">
                <div className="w-9 h-9 rounded-full bg-indigo-650 flex items-center justify-center text-white shadow-md shadow-indigo-650/20">
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-400 dark:text-gray-500 uppercase font-mono leading-none block">
                    AI Tutor
                  </span>
                  <span className="text-xs font-bold text-slate-705 dark:text-gray-200 leading-normal block">
                    Analyzing weak points...
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom metrics blocks */}
            <div className="grid grid-cols-2 gap-4">

              {/* Metric 1 */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1 text-left transition-colors duration-300">
                <span className="text-[9px] font-extrabold tracking-wider text-slate-400 dark:text-gray-500 uppercase font-mono">
                  Retention Rate
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  94.2%
                </span>
              </div>

              {/* Metric 2 */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1 text-left transition-colors duration-300">
                <span className="text-[9px] font-extrabold tracking-wider text-slate-400 dark:text-gray-500 uppercase font-mono">
                  Cognitive Load
                </span>
                <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-brand-400 leading-none">
                  Optimal
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


// --- Component: NeuralAdvantage.jsx ---
function NeuralAdvantage() {
  // 54 detailed node coordinates for the left hemisphere outlining frontal, parietal, occipital, temporal, and cerebellum lobes
  const leftNodes = [
    // Track 1: Outer perimeter of cerebral cortex
    { x: 142, y: 22, size: 1.5 },
    { x: 130, y: 24, size: 1.5 },
    { x: 115, y: 28, size: 2 },
    { x: 100, y: 36, size: 1.5 },
    { x: 86, y: 48, size: 2, pulse: true },
    { x: 74, y: 64, size: 1.5 },
    { x: 66, y: 82, size: 2 },
    { x: 62, y: 100, size: 2.5, pulse: true },
    { x: 64, y: 118, size: 2 },
    { x: 72, y: 136, size: 1.5 },
    { x: 84, y: 152, size: 2 },
    { x: 98, y: 164, size: 1.5 },
    { x: 114, y: 172, size: 2.5, pulse: true },
    { x: 130, y: 176, size: 1.5 },
    { x: 142, y: 170, size: 2 },

    // Track 2: Mid-outer concentric cortex layers
    { x: 138, y: 38, size: 1.5 },
    { x: 122, y: 42, size: 2 },
    { x: 108, y: 48, size: 1.5 },
    { x: 94, y: 58, size: 2, pulse: true },
    { x: 84, y: 72, size: 1.5 },
    { x: 78, y: 88, size: 2 },
    { x: 76, y: 104, size: 1.5 },
    { x: 78, y: 120, size: 2, pulse: true },
    { x: 84, y: 136, size: 1.5 },
    { x: 94, y: 148, size: 2 },
    { x: 108, y: 158, size: 1.5 },
    { x: 124, y: 162, size: 2 },
    { x: 138, y: 154, size: 1.5 },

    // Track 3: Mid-inner layers
    { x: 132, y: 54, size: 2, pulse: true },
    { x: 118, y: 58, size: 1.5 },
    { x: 104, y: 66, size: 2 },
    { x: 94, y: 78, size: 1.5 },
    { x: 88, y: 94, size: 2.5, pulse: true },
    { x: 88, y: 110, size: 1.5 },
    { x: 94, y: 126, size: 2 },
    { x: 104, y: 138, size: 1.5 },
    { x: 118, y: 146, size: 2 },
    { x: 132, y: 140, size: 1.5 },

    // Track 4: Inner core layers
    { x: 126, y: 70, size: 1.5 },
    { x: 114, y: 74, size: 2, pulse: true },
    { x: 104, y: 84, size: 1.5 },
    { x: 98, y: 98, size: 2 },
    { x: 98, y: 112, size: 1.5 },
    { x: 104, y: 124, size: 2, pulse: true },
    { x: 114, y: 132, size: 1.5 },
    { x: 126, y: 126, size: 2 },

    // Track 5: Deep subcortical region
    { x: 132, y: 86, size: 1.5 },
    { x: 122, y: 90, size: 2 },
    { x: 114, y: 98, size: 2.5, pulse: true },
    { x: 114, y: 108, size: 2 },
    { x: 122, y: 114, size: 1.5 },
    { x: 132, y: 110, size: 2 }
  ];

  // Mirror left nodes to construct the right hemisphere
  const rightNodes = leftNodes.map(node => ({
    x: 300 - node.x, // Mirror along center line (150)
    y: node.y,
    size: node.size,
    pulse: node.pulse
  }));

  const allNodes = [...leftNodes, ...rightNodes];

  // Create connection lines for nearby nodes (Euclidean distance threshold)
  const lines = [];
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const n1 = allNodes[i];
      const n2 = allNodes[j];

      // Do not draw connections across the middle sagittal fissure to maintain separation
      const sameHemisphere = (n1.x <= 145 && n2.x <= 145) || (n1.x >= 155 && n2.x >= 155);

      if (sameHemisphere) {
        const distance = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        // Connect nodes close to each other to generate a detailed mesh grid
        if (distance < 24) {
          lines.push({ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y });
        }
      }
    }
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* LEFT COLUMN: Brain visualization card */}
        <div className="lg:col-span-6 flex justify-center items-center relative order-2 lg:order-1">

          {/* Main Visual Card */}
          <div className="relative bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/80 dark:shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-lg transition-all duration-300">

            {/* Visual Screen Container */}
            <div className="relative bg-[#0c0c0c] border border-slate-800/85 rounded-2xl p-4 sm:p-6 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">

              {/* Radial glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18),transparent_70%)] pointer-events-none" />

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Highly Detailed Brain SVG */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Center Sagittal Fissure shadow gap line */}
                <line x1="150" y1="20" x2="150" y2="180" stroke="rgba(6,182,212,0.08)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Neural mesh connecting lines */}
                {lines.map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(6,182,212,0.18)"
                    strokeWidth="0.65"
                  />
                ))}

                {/* Synaptic nodes (dots) */}
                {allNodes.map((node, idx) => (
                  <circle
                    key={idx}
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    className={`${node.pulse ? 'fill-cyan-300 animate-pulse' : 'fill-cyan-500/80'} transition-all`}
                  />
                ))}
              </svg>

            </div>

            {/* Status Bar */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-gray-500 font-mono uppercase">
                Real-Time Adaptation
              </span>

              {/* Progress bar */}
              <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full" />
              </div>

              <div className="text-brand-500 dark:text-brand-400">
                <Waves size={16} className="animate-pulse" />
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Texts & Features list */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left order-1 lg:order-2">

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            The Neural{' '}
            <span className="text-blue-900 dark:text-blue-400">
              Advantage
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-300">
            Every mind processes information differently. AetherLearn's
            proprietary engine continuously maps your cognitive load,
            learning velocity, and retention decay.
          </p>

          {/* Features */}
          <div className="space-y-6 max-w-xl">

            {/* Feature 1 */}
            <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 group-hover:scale-105">
                <TrendingUp size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  Dynamic Pacing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                  The curriculum slows down for complex topics and accelerates
                  through mastered concepts, ensuring optimal flow state.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 group-hover:scale-105">
                <BrainCircuit size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  Cognitive Load Balancing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                  Prevents burnout by measuring interaction patterns and scheduling
                  micro-breaks precisely when your brain needs them.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


// --- Component: CoreCapabilities.jsx ---
function CoreCapabilities() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">

      {/* SECTION HEADER */}
      <div className="text-center space-y-4 mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
          Core Capabilities
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Modules engineered to augment human learning capacity through algorithmic precision.
        </p>
      </div>

      {/* 2X2 BALANCED GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

        {/* CARD 1: AI Performance Prediction */}
        <div className="relative bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 overflow-hidden transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          {/* Subtle background glow */}
          <div className="absolute right-[-10%] bottom-[-20%] w-48 h-48 rounded-full bg-brand-500/5 dark:bg-brand-500/10 pointer-events-none blur-3xl transition-colors duration-300" />

          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 flex-shrink-0">
            <TrendingUp size={18} />
          </div>

          <div className="space-y-1.5 text-left relative z-10">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
              AI Performance Prediction
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Anticipates conceptual roadblocks before they occur, dynamically adjusting syllabus complexity.
            </p>
          </div>
        </div>

        {/* CARD 2: Smart Analytics */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">

          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 flex-shrink-0">
            <BarChart2 size={18} />
          </div>

          <div className="space-y-1.5 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
              Smart Analytics
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Real-time telemetry on focus depth and memory retention.
            </p>
          </div>
        </div>

        {/* CARD 3: Focus Mode */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">

          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/30 transition-all duration-300 flex-shrink-0">
            <Target size={18} />
          </div>

          <div className="space-y-1.5 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
              Focus Mode
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Distraction-free environment with ambient biometric pacing.
            </p>
          </div>
        </div>

        {/* CARD 4: Peer Comparison Matrix */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">

          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/30 transition-all duration-300 flex-shrink-0">
            <Users size={18} />
          </div>

          <div className="space-y-1.5 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
              Peer Comparison Matrix
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Anonymous, aggregated benchmarking to foster healthy academic drive without compromising privacy.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}


// --- Component: Ecosystem.jsx ---
function Ecosystem() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">

      {/* DECORATIVE BACKGROUND GRADIENTS */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-brand-500/5 dark:bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* SECTION HEADER */}
      <div className="text-center space-y-4 mb-16 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
          An Ecosystem{' '}
          <span className="text-blue-900 dark:text-blue-400">
            For All
          </span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          A unified platform where AI enhances human connection rather than replacing it.
        </p>
      </div>

      {/* THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">

        {/* CARD 1: For Students */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.01]">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 flex-shrink-0">
            <GraduationCap size={22} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
              For Students
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Personalized pathways, instant AI tutoring, and actionable insights into personal learning habits to study smarter.
            </p>
          </div>
        </div>

        {/* CARD 2: For Mentors (Highlighted Premium Card!) */}
        <div className="relative bg-white dark:bg-[#0c0c0c]/85 border-2 border-brand-500/60 dark:border-brand-500/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:scale-[1.015]">

          {/* Absolute Hovering Badge on Top Border */}
          <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-650 dark:from-brand-550 dark:to-indigo-500 text-white text-[9px] font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full shadow-md shadow-brand-500/20 font-mono transition-all duration-300">
            Synergy Core
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 flex-shrink-0">
            <Users size={20} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
              For Mentors
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              AI handles routine queries and grading, freeing educators to provide high-impact 1-on-1 guidance where it matters most.
            </p>
          </div>
        </div>

        {/* CARD 3: For Administrators */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.01]">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 flex items-center justify-center border border-purple-100/50 dark:border-purple-900/30 transition-all duration-300 flex-shrink-0">
            <Shield size={20} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
              For Administrators
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Macro-level cohort analytics, predictive intervention alerts, and resource optimization based on aggregate performance data.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}


// --- Component: IntegrationSafety.jsx ---
const BACKEND = 'http://localhost:8000';

const INTEGRATION_PRESETS = {
  lms_sync: [
    { provider: 'canvas', name: 'Canvas LMS', icon: '🎨', placeholder: 'https://your-school.instructure.com' },
    { provider: 'blackboard', name: 'Blackboard', icon: '📚', placeholder: 'https://your-school.blackboard.com' },
    { provider: 'moodle', name: 'Moodle', icon: '🎓', placeholder: 'https://moodle.your-school.edu' },
  ],
  sso: [
    { provider: 'azure_ad', name: 'Azure Active Directory', icon: '🔐', placeholder: 'https://login.microsoftonline.com/tenant-id' },
    { provider: 'okta', name: 'Okta SSO', icon: '🛡️', placeholder: 'https://your-org.okta.com' },
    { provider: 'google', name: 'Google Workspace', icon: '🌐', placeholder: 'https://accounts.google.com' },
  ],
  data_lake: [
    { provider: 'custom', name: 'Custom REST API', icon: '⚡', placeholder: 'https://api.your-datalake.com/v1' },
    { provider: 'snowflake', name: 'Snowflake', icon: '❄️', placeholder: 'https://account.snowflakecomputing.com' },
    { provider: 'bigquery', name: 'Google BigQuery', icon: '📊', placeholder: 'project-id.dataset' },
  ],
};

function IntegrationModal({ type, onClose }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [configUrl, setConfigUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | connecting | success | error
  const [message, setMessage] = useState('');

  const presets = INTEGRATION_PRESETS[type] || [];
  const typeLabel = { lms_sync: 'LMS Sync', sso: 'SSO Authentication', data_lake: 'Data Lake API' }[type];

  const handleConnect = async () => {
    if (!selectedProvider) return;
    setStatus('saving');

    try {
      // Step 1: Create the integration
      const createRes = await fetch(`${BACKEND}/integrations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type,
          provider: selectedProvider.provider,
          name: selectedProvider.name,
          config_url: configUrl || null,
          api_key: apiKey || null,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.detail || 'Failed to create integration');
      }

      const integration = await createRes.json();
      setStatus('connecting');

      // Step 2: Test connectivity
      const connectRes = await fetch(`${BACKEND}/integrations/${integration.id}/connect`, {
        method: 'POST',
        credentials: 'include',
      });

      const result = await connectRes.json();
      if (result.status === 'connected') {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Connection failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Configure {typeLabel}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {status === 'success' ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Connected Successfully!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Provider selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Provider</label>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map(p => (
                    <button
                      key={p.provider}
                      onClick={() => setSelectedProvider(p)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${selectedProvider?.provider === p.provider
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                          : 'border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                        }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                      {selectedProvider?.provider === p.provider && (
                        <CheckCircle2 size={16} className="ml-auto text-brand-600 dark:text-brand-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Config fields — shown once provider is selected */}
              {selectedProvider && (
                <div className="space-y-4 animate-fadeInUp">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe size={12} /> Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={configUrl}
                      onChange={e => setConfigUrl(e.target.value)}
                      placeholder={selectedProvider.placeholder}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound size={12} /> API Key / Secret
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Paste your API key or client secret"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-mono"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                      ⚠️ {message}
                    </p>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={status === 'saving' || status === 'connecting'}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === 'saving' || status === 'connecting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {status === 'saving' ? 'Saving...' : 'Testing Connection...'}
                      </>
                    ) : (
                      <>
                        <Wifi size={16} />
                        Connect & Test
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationSafety() {
  const [activeModal, setActiveModal] = useState(null); // 'lms_sync' | 'sso' | 'data_lake' | null
  const [integrationStatus, setIntegrationStatus] = useState(null);

  // Fetch status on mount (silently — no error if backend is down)
  useEffect(() => {
    fetch(`${BACKEND}/integrations/status`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setIntegrationStatus(data))
      .catch(() => { });
  }, [activeModal]); // Re-fetch when modal closes

  const getStatusBadge = (type) => {
    if (!integrationStatus || !integrationStatus[type]) return null;
    const s = integrationStatus[type];
    if (s.connected > 0) {
      return (
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
          {s.connected} ACTIVE
        </span>
      );
    }
    return null;
  };

  const items = [
    { type: 'lms_sync', label: 'Canvas, Blackboard & Moodle Sync' },
    { type: 'sso', label: 'SSO / Active Directory Authentication' },
    { type: 'data_lake', label: 'Custom API for Data Lakes' },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

        {/* CARD 1: Deep Integration */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 flex-shrink-0">
              <Link size={18} />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
                Deep Integration
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                AetherLearn doesn't replace your stack; it supercharges it. Seamlessly connect with your existing infrastructure.
              </p>
            </div>
          </div>

          {/* Integration Bullets — Now clickable! */}
          <div className="flex flex-col gap-3 text-left w-full">
            {items.map(item => (
              <button
                key={item.type}
                onClick={() => setActiveModal(item.type)}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 transition-all duration-200 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 hover:scale-[1.01] cursor-pointer group text-left w-full"
              >
                <CheckCircle2 size={16} className="text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                  {item.label}
                </span>
                {getStatusBadge(item.type)}
              </button>
            ))}
          </div>

        </div>

        {/* CARD 2: Safety & Ethics First */}
        <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 flex-shrink-0">
              <Shield size={18} />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
                Safety & Ethics First
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                Advanced AI requires advanced responsibility. Our models are built on transparency, privacy, and active bias mitigation.
              </p>
            </div>
          </div>

          {/* Metric Sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full">

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2 transition-colors duration-300">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Zero-Data Retention
              </span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Personal models are encrypted locally; training data is anonymized immediately.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2 transition-colors duration-300">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Algorithmic Audits
              </span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Quarterly third-party audits ensure recommendation models remain unbiased and fair.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Integration Modal */}
      {activeModal && (
        <IntegrationModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  );
}


// --- Component: MeasurableEvolution.jsx ---
function MeasurableEvolution() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-5xl mx-auto">

        {/* LEFT COLUMN: Texts & Mini Stats Cards */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Measurable Evolution
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed transition-colors duration-300">
            Our algorithms don't just teach; they optimize the learning process itself, resulting in profound shifts in comprehension speed.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">

            {/* Stat 1 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800/80 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 shadow-xl dark:shadow-black/15 rounded-3xl p-6 text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none block mb-1">
                3.4x
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight block">
                Faster Concept Mastery
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-100 dark:border-slate-800/80 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 shadow-xl dark:shadow-black/15 rounded-3xl p-6 text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none block mb-1">
                89%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight block">
                Information Retention
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Testimonial Card */}
        <div className="lg:col-span-6 flex justify-center items-center">

          {/* Testimonial card wrapper */}
          <div className="relative bg-white dark:bg-[#0c0c0c]/65 border border-slate-100 dark:border-slate-800/80 shadow-2xl shadow-slate-200/80 dark:shadow-black/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-md text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">

            {/* Card Header (User profile details + Quote mark) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Profile Photo */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-[#050505] shadow-lg">
                  <img
                    src={sarahJenkinsAvatar}
                    alt="Reviewer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-850 dark:text-white leading-tight">
                    Sarah J.
                  </h4>
                  <span className="text-xs font-semibold text-purple-650 dark:text-brand-400">
                    Data Science Cohort
                  </span>
                </div>
              </div>

              {/* Giant quote mark icon in background style */}
              <span className="text-5xl font-black text-slate-200 dark:text-slate-800/60 leading-none font-serif select-none pointer-events-none pr-2">
                &rdquo;
              </span>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-slate-650 dark:text-slate-300 text-sm sm:text-base italic leading-relaxed font-medium">
              "AetherLearn's predictive modeling realized I was struggling with neural network backpropagation before I did. The dynamic syllabus instantly pivoted, offering prerequisite micro-modules that bridged the gap perfectly."
            </blockquote>

            {/* Progress element */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-gray-500 font-mono uppercase">
                Module Completion
              </span>

              {/* Progress bar */}
              <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[95%] h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


// --- Component: LiveSessions.jsx ---


// Import Assets










function LiveSessions() {
  const [selectedCategory, setSelectedCategory] = useState('All Classes');
  const [reminders, setReminders] = useState([]);
  const [showClassroom, setShowClassroom] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // Classroom Simulation States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Ananya Iyer', text: 'Will this code example be uploaded to the LMS?', time: '2:15 PM' },
    { sender: 'Arjun Mehta', text: 'The transformer attention visualization makes so much sense now!', time: '2:16 PM' },
    { sender: 'Priya Sharma', text: 'Are we going to discuss multi-headed attention projection matrices today?', time: '2:18 PM' }
  ]);
  const [typedMessage, setTypedMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(142);
  const [classAlert, setClassAlert] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showClassroom]);

  const toggleReminder = (id, sessionTitle) => {
    if (reminders.includes(id)) {
      setReminders(prev => prev.filter(item => item !== id));
      triggerAlert(`Reminder cancelled for: "${sessionTitle}"`);
    } else {
      setReminders(prev => [...prev, id]);
      triggerAlert(`Reminder set successfully for: "${sessionTitle}"`);
    }
  };

  const triggerAlert = (message) => {
    setClassAlert(message);
    setTimeout(() => setClassAlert(null), 4000);
  };

  const handleJoinSession = (session) => {
    setActiveSession(session);
    setShowClassroom(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      sender: 'You',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setTypedMessage('');

    // Simulated response from Dr. Alex Chen
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'Dr. Alex Chen (Instructor)',
          text: 'Great question. Yes, we will cover the projection mechanics in slide 12. Let me pull that up.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInstructor: true
        }
      ]);
    }, 1500);
  };

  const sessions = [
    {
      id: 1,
      tag: "Neural Networks",
      time: "Today, 2:00 PM",
      timeType: "Today",
      category: "Neural Networks",
      title: "Advanced Deep Learning Architectures",
      description: "Explore the latest advancements in transformer models and their applications in NLP.",
      instructor: "Dr. Alex Chen",
      instructorTitle: "Lead Researcher, OpenAI",
      avatar: alexChenAvatar,
      btnType: "join",
      tagClass: "bg-indigo-50 dark:bg-indigo-950/30 text-[#253df5] dark:text-blue-400 font-bold px-3 py-1 rounded-full text-[10px] tracking-wide border border-indigo-100/50 dark:border-indigo-900/10",
      iconType: "clock"
    },
    {
      id: 2,
      tag: "AI Ethics",
      time: "Tomorrow, 10:00 AM",
      timeType: "Tomorrow",
      category: "Ethics",
      title: "Bias Mitigation in Algorithmic Decision Making",
      description: "A deep dive into identifying and correcting biases in training datasets.",
      instructor: "Sarah Jenkins, PhD",
      instructorTitle: "Ethics Board, DeepMind",
      avatar: sarahJenkinsAvatar,
      btnType: "reminder",
      tagClass: "bg-purple-50 dark:bg-purple-950/30 text-purple-750 dark:text-purple-400 font-bold px-3 py-1 rounded-full text-[10px] tracking-wide border border-purple-100/50 dark:border-purple-900/10",
      iconType: "calendar"
    },
    {
      id: 3,
      tag: "Data Science",
      time: "Oct 25, 4:00 PM",
      timeType: "Upcoming",
      category: "Science",
      title: "Predictive Modeling at Petabyte Scale",
      description: "Techniques for optimizing distributed computing workflows for massive datasets.",
      instructor: "David Kim",
      instructorTitle: "Chief Data Officer, TechCorp",
      avatar: davidKimAvatar,
      btnType: "reminder",
      tagClass: "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-455 font-bold px-3 py-1 rounded-full text-[10px] tracking-wide border border-sky-100/50 dark:border-sky-900/10",
      iconType: "calendar"
    }
  ];

  const filteredSessions = sessions.filter(session => {
    if (selectedCategory === 'All Classes') return true;
    return session.category === selectedCategory;
  });

  return (
    <div className="w-full bg-slate-50 dark:bg-[#050505] py-8 sm:py-12 transition-colors duration-300 animate-fadeIn">

      {/* Toast Notification alert */}
      {classAlert && (
        <div className="fixed top-24 right-6 z-55 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-805/10 dark:border-white/20 animate-slideIn">
          <Bell className="w-4 h-4 text-blue-500 animate-swing" />
          <span>{classAlert}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* ================= HERO SECTION ================= */}
        <section className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 text-left relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/20 text-brand-600 dark:text-brand-400 border border-blue-100 dark:border-brand-500/20 uppercase tracking-widest font-mono">
              <Sparkles size={11} className="text-brand-500 animate-pulse" />
              Live Virtual Classroom
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Master the <span className="text-brand-600 dark:text-brand-400 bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">Future</span> Live
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Join interactive, real-time sessions with world-renowned experts in Artificial Intelligence, Machine Learning, and Data Science.
            </p>
          </div>
          <div className="w-full lg:w-[48%] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/80 group relative aspect-video">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all duration-300 z-10" />
            <img
              src={liveHeroRoom}
              alt="Digital virtual meeting classroom"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* ================= UPCOMING LIVE SESSIONS ================= */}
        <section className="space-y-6">
          {/* Header & Filter pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5 text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Upcoming Live Sessions
            </h2>
            <div className="flex flex-wrap gap-2">
              {['All Classes', 'Neural Networks', 'Ethics', 'Science'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer ${isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/15'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const isReminderSet = reminders.includes(session.id);
                const isToday = session.timeType === 'Today';
                return (
                  <div
                    key={session.id}
                    className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-lg dark:hover:shadow-black/20 rounded-3xl p-6 flex flex-col justify-between gap-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex justify-between items-center">
                        <span className={session.tagClass}>
                          {session.tag}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${isToday
                            ? 'text-[#253df5] dark:text-blue-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400'
                          }`}>
                          {session.iconType === 'clock' ? <Clock size={13} /> : <Calendar size={13} />}
                          {session.time}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#253df5] dark:group-hover:text-blue-400 transition-colors duration-200">
                          {session.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850/60">
                      {/* Profile details */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-slate-100 flex-shrink-0">
                          <img src={session.avatar} alt={session.instructor} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-855 dark:text-white leading-none">
                            {session.instructor}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 block">
                            {session.instructorTitle}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {session.btnType === 'join' ? (
                        <button
                          onClick={() => handleJoinSession(session)}
                          className="w-full py-3 bg-[#253df5] hover:bg-blue-650 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg active:scale-95 cursor-pointer"
                        >
                          <span>Join Now &nbsp; →</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleReminder(session.id, session.title)}
                          className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 border cursor-pointer ${isReminderSet
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-905 text-slate-700 dark:text-slate-350 bg-transparent'
                            }`}
                        >
                          {isReminderSet ? (
                            <>
                              <Check size={13} className="text-emerald-600 dark:text-emerald-450" />
                              <span>Reminder Active</span>
                            </>
                          ) : (
                            <>
                              <Bell size={13} className="text-slate-400 dark:text-slate-550" />
                              <span>Set Reminder</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400">
                No active live sessions scheduled in this category.
              </div>
            )}
          </div>
        </section>

        {/* ================= FEATURED MASTERCLASSES ================= */}
        <section className="space-y-6 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-wider font-mono">
            Featured Masterclasses
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Masterclass 1 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
              <div className="w-full md:w-[42%] aspect-video md:aspect-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={quantumScientist}
                  alt="Quantum machine learning expert"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-4 left-4 bg-brand-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase font-mono z-10 shadow-md">
                  Exclusive
                </span>
                <div className="absolute inset-0 bg-slate-950/20 z-0" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between gap-5 flex-grow">
                <div className="space-y-2.5">
                  <h3 className="text-lg font-black text-slate-909 dark:text-white leading-tight">
                    Quantum Machine Learning
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    A visionary session bridging quantum computing mechanics with next-generation ML algorithms.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850/60 pt-4 mt-2">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Dr. Elena Rostova
                  </span>
                  <button
                    onClick={() => alert('Launching masterclass details preview... Coming soon.')}
                    className="inline-flex items-center gap-1 text-xs font-black text-brand-600 dark:text-brand-400 hover:text-blue-600 dark:hover:text-brand-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Masterclass 2 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
              <div className="w-full md:w-[42%] aspect-video md:aspect-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={agiStage}
                  alt="AGI stage speaker spotlight"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-4 left-4 bg-indigo-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase font-mono z-10 shadow-md">
                  Masterclass
                </span>
                <div className="absolute inset-0 bg-slate-950/20 z-0" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between gap-5 flex-grow">
                <div className="space-y-2.5">
                  <h3 className="text-lg font-black text-slate-909 dark:text-white leading-tight">
                    The Future of AGI
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Navigating the trajectory toward Artificial General Intelligence and its societal implications.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850/60 pt-4 mt-2">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Marcus Vance
                  </span>
                  <button
                    onClick={() => alert('Launching masterclass details preview... Coming soon.')}
                    className="inline-flex items-center gap-1 text-xs font-black text-brand-600 dark:text-brand-400 hover:text-blue-600 dark:hover:text-brand-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= PREVIOUS SESSIONS ARCHIVE ================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-5 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-wider font-mono">
                Previous Sessions Archive
              </h2>
              <p className="text-slate-450 dark:text-slate-500 text-xs font-semibold mt-1">
                Catch up on highly-rated past recordings.
              </p>
            </div>
            <button
              onClick={() => alert('Loading complete video library... Coming soon.')}
              className="inline-flex items-center gap-1 text-xs font-black text-brand-600 dark:text-brand-400 hover:text-blue-600 dark:hover:text-brand-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Archive Item 1 */}
            <div className="space-y-3 group text-left">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 relative shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-slate-100">
                <img src={circuitBoard} alt="Circuit board" className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/35 flex items-center justify-center transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg flex items-center justify-center text-brand-600 dark:text-brand-400 transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={15} className="fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono shadow-md">
                  45:20
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-909 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Federated Learning in Edge Devices
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Recorded Sep 12 • 12k views
                </p>
              </div>
            </div>

            {/* Archive Item 2 */}
            <div className="space-y-3 group text-left">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 relative shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-slate-100">
                <img src={forecastingChart} alt="Time Series tablet" className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/35 flex items-center justify-center transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg flex items-center justify-center text-brand-600 dark:text-brand-400 transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={15} className="fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono shadow-md">
                  1:12:05
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-909 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Time Series Forecasting with LSTMs
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Recorded Sep 05 • 8.5k views
                </p>
              </div>
            </div>

            {/* Archive Item 3 */}
            <div className="space-y-3 group text-left">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 relative shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-slate-100">
                <img src={generativeAiAbstract} alt="AI node structure" className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/35 flex items-center justify-center transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg flex items-center justify-center text-brand-600 dark:text-brand-400 transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={15} className="fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono shadow-md">
                  58:10
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-909 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Generative AI Models Unpacked
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Recorded Aug 28 • 24k views
                </p>
              </div>
            </div>

            {/* Archive Item 4 */}
            <div className="space-y-3 group text-left">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 relative shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-slate-100">
                <img src={circuitBoard} alt="Microchip circuit board" className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 animate-pulse" />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/35 flex items-center justify-center transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-lg flex items-center justify-center text-brand-600 dark:text-brand-400 transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={15} className="fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-mono shadow-md">
                  1:05:30
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-909 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Hardware Acceleration for AI
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-550">
                  Recorded Aug 15 • 9.2k views
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* ================= INTERACTIVE CLASSROOM SIMULATION MODAL ================= */}
      {showClassroom && activeSession && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col justify-between shadow-2xl relative animate-scaleUp">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-mono font-extrabold text-red-500 uppercase tracking-widest">LIVE CLASSROOM</span>
                <span className="text-slate-600">|</span>
                <h3 className="text-sm font-bold text-white tracking-tight truncate max-w-sm sm:max-w-md">
                  {activeSession.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono font-black text-slate-400">
                  <Users size={12} className="text-blue-500" />
                  <span>{participantsCount} ATTENDING</span>
                </div>
                <button
                  onClick={() => setShowClassroom(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Split: Slides Video Pane (Left) and Live Chat (Right) */}
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">

              {/* Left Column: Virtual Presentation screen */}
              <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-center items-center relative overflow-hidden border-r border-slate-900 h-1/2 lg:h-full">

                {/* Simulated Screen Share Slide */}
                <div className="w-full max-w-3xl aspect-video bg-[#0c0c0c] border border-slate-850 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">

                  {/* Floating slide watermarks */}
                  <div className="flex justify-between items-start text-[9px] font-mono text-slate-500/60 uppercase tracking-wider">
                    <span>AetherLearn Live Session #04</span>
                    <span>Slide 12: Attention Engine</span>
                  </div>

                  {/* Slide Content Graphic */}
                  <div className="my-auto text-center space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight max-w-lg mx-auto">
                      Multi-Head Attention Scale Math
                    </h2>
                    <div className="bg-slate-950/50 p-4 border border-slate-800 rounded-xl font-mono text-[11px] sm:text-xs text-indigo-400 max-w-md mx-auto leading-normal">
                      {"Attention(Q, K, V) = softmax( (QKᵀ) / √dₖ ) V"}
                    </div>

                    {/* Abstract math flow visual */}
                    <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-400 font-mono">
                      <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">Q (Query Vector)</span>
                      <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">K (Key Matrix)</span>
                      <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">V (Value Value)</span>
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-550 border-t border-slate-900/60 pt-3 mt-4">
                    <span>Instructor: {activeSession.instructor}</span>
                    <span className="text-brand-400">Interactive Presentation Tool V2</span>
                  </div>
                </div>

                {/* Floating mini camera feed of instructor in corner */}
                {!isVideoMuted && (
                  <div className="absolute bottom-6 right-6 w-32 h-24 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-20 flex flex-col justify-end">
                    <img src={activeSession.avatar} alt={activeSession.instructor} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <span className="relative z-10 px-2 py-1 text-[8px] font-mono font-black text-white bg-slate-950/70 border-t border-slate-900 truncate">
                      {activeSession.instructor}
                    </span>
                  </div>
                )}

              </div>

              {/* Right Column: Live Chat Pane */}
              <div className="w-full lg:w-80 bg-slate-950 flex flex-col justify-between border-t lg:border-t-0 border-slate-900 h-1/2 lg:h-full">

                {/* Title */}
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-blue-500" />
                    Live Session Chat
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SYNCED
                  </span>
                </div>

                {/* Comments List */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`space-y-1 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-baseline gap-1.5 justify-start text-[10px] font-extrabold text-slate-400">
                        <span className={msg.isInstructor ? 'text-brand-400 font-black' : ''}>{msg.sender}</span>
                        <span className="text-[8px] text-slate-600 font-mono">{msg.time}</span>
                      </div>
                      <div className={`inline-block px-3 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${msg.sender === 'You'
                          ? 'bg-brand-600 text-white rounded-tr-none text-left'
                          : msg.isInstructor
                            ? 'bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-tl-none'
                            : 'bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Keyboard Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 bg-slate-950">
                  <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-brand-500 transition-colors">
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                      className="w-full bg-transparent pl-4 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 p-1.5 rounded-lg bg-brand-600 hover:bg-blue-600 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </form>

              </div>

            </div>

            {/* Bottom: Virtual Control Bar */}
            <div className="px-6 py-4 border-t border-slate-900 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-3xl">

              {/* Media Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className={`p-3.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${isAudioMuted
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className={`p-3.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${isVideoMuted
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoMuted ? <CameraOff size={16} /> : <Camera size={16} />}
                </button>
                <button
                  onClick={() => alert('Starting desktop screen broadcast simulation...')}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95 cursor-pointer"
                  title="Share Screen"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Status details */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Classroom Status: Active Transmission</span>
              </div>

              {/* Stop Session Button */}
              <button
                onClick={() => setShowClassroom(false)}
                className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md shadow-rose-500/10 active:scale-95 cursor-pointer"
              >
                <span>Leave Classroom</span>
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}


// --- Component: MentorsList.jsx ---


// Import Assets




function MentorsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingMentor, setBookingMentor] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Booking Modal States
  const [selectedDate, setSelectedDate] = useState('2026-06-15');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const mentors = [
    {
      id: 1,
      name: "Dr. Julian Vance",
      role: "Senior AI Researcher",
      rating: "4.9",
      avatar: julianVanceProfile,
      specialties: ["Neural Networks", "Ethics", "Cognitive Science"],
      description: "Former lead researcher at Horizon Labs. Passionate about aligning advanced AI architectures with human-centric ethical frameworks.",
      fullBio: "Dr. Vance has spent over a decade researching alignment paradigms in deep learning architectures. Prior to joining Horizon Labs, he completed his PhD in Computer Science at MIT and published multiple breakthrough papers on transformer model auditing.",
      expertise: [
        { name: "Transformer Alignments", val: 95 },
        { name: "PyTorch Deep Learning", val: 90 },
        { name: "Cognitive Science Systems", val: 85 }
      ],
      publications: [
        "Ethical Guards in Deep Reinforcement Learning (2024)",
        "Attention Layer Bias Identification Protocols (2023)"
      ]
    },
    {
      id: 2,
      name: "Sarah Lin, Ph.D.",
      role: "Data Infrastructure Architect",
      rating: "5.0",
      avatar: sarahJenkinsAvatar,
      specialties: ["Big Data", "Cloud Architecture"],
      description: "Specializes in building resilient, scalable data pipelines for enterprise AI deployments. I focus on practical, industry-ready skills.",
      fullBio: "Sarah Lin is an enterprise data architect with extensive experience in cloud orchestration. She holds a PhD in Systems Engineering from Stanford and is a frequent contributor to open-source distributed database ecosystems.",
      expertise: [
        { name: "Distributed Data Pipelines", val: 98 },
        { name: "Cloud Kubernetes Architectures", val: 92 },
        { name: "Large Scale Analytics Models", val: 88 }
      ],
      publications: [
        "Scalable Pipeline Architecture for Petabyte Machine Learning (2024)",
        "Optimizing Real-time Telemetry Data Distribution (2022)"
      ]
    },
    {
      id: 3,
      name: "Marcus Reynolds",
      role: "Product Strategy Director",
      rating: "4.8",
      avatar: marcusProfile,
      specialties: ["Product Management", "UX/UI"],
      description: "Bridging the gap between technical possibility and user value. I help students translate complex AI models into viable market products.",
      fullBio: "Marcus is a product design and strategy veteran who has launched multiple AI startup products in Silicon Valley. He focuses on human-centered UX design, business feasibility analysis, and data-driven product management cycles.",
      expertise: [
        { name: "AI Product Lifecycle Management", val: 96 },
        { name: "Human-AI UX Design Frameworks", val: 90 },
        { name: "Business Model Feasibility Tests", val: 85 }
      ],
      publications: [
        "UX Guidelines for Interactive Neural Visualizers (2024)",
        "Translating Deep Tech Models to Consumer Value (2023)"
      ]
    }
  ];

  // Search filtering
  const filteredMentors = mentors.filter(mentor => {
    const query = searchQuery.toLowerCase();
    const matchName = mentor.name.toLowerCase().includes(query);
    const matchSpecialties = mentor.specialties.some(spec => spec.toLowerCase().includes(query));
    return matchName || matchSpecialties;
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      alert('Please select a time slot!');
      return;
    }
    setIsBookingSubmitting(true);
    setTimeout(() => {
      setIsBookingSubmitting(false);
      setBookingMentor(null);
      setSelectedTimeSlot(null);
      setBookingTopic('');
      showToast(`Office hours session successfully booked with ${bookingMentor.name}! Details sent to email.`);
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#050505] py-8 sm:py-12 transition-colors duration-300 animate-fadeIn text-slate-900 dark:text-white">

      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-55 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-805/10 dark:border-white/20 animate-slideIn">
          <CheckCircle className="w-4 h-4 text-emerald-500 animate-swing" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ================= HEADER & SEARCH SECTION ================= */}
        <section className="text-center max-w-3xl mx-auto space-y-5 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Meet Your AI-Augmented Mentors
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Connect with world-class experts supercharged by AetherLearn's cognitive analytics to provide you with deeply personalized, data-driven guidance.
          </p>

          {/* Centered Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs focus-within:border-brand-500 transition-colors pl-4 pr-2.5 py-1.5 gap-2.5">
              <Search size={16} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Find a Mentor by Expertise (e.g., Quantum Computing)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => alert(`Searching for: "${searchQuery}"...`)}
                className="bg-[#253df5] hover:bg-blue-650 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex-shrink-0"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ================= MENTORS CARDS GRID ================= */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white dark:bg-[#0c0c0c]/60 border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-lg dark:hover:shadow-black/20 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 flex flex-col text-left group relative"
                >
                  {/* Top Image banner with Rating badge */}
                  <div className="h-52 sm:h-56 relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />

                    {/* Semi-transparent rating badge */}
                    <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-850 dark:text-white flex items-center gap-1 shadow-sm border border-slate-200/20">
                      <Star size={11} className="text-amber-500 fill-current" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-grow gap-5">
                    <div className="space-y-4">
                      {/* Name & Subtitle */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                          {mentor.name}
                        </h3>
                        <p className="text-xs font-bold text-[#253df5] dark:text-blue-400">
                          {mentor.role}
                        </p>
                      </div>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {mentor.description}
                      </p>
                    </div>

                    {/* Double stacked buttons */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-850/60">
                      <button
                        onClick={() => setBookingMentor(mentor)}
                        className="w-full py-3 bg-[#253df5] hover:bg-blue-650 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-500/10 active:scale-95 cursor-pointer"
                      >
                        <Calendar size={13} />
                        <span>Book a Session</span>
                      </button>
                      <button
                        onClick={() => setSelectedProfile(mentor)}
                        className="w-full py-3 border border-slate-205 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-transparent"
                      >
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400">
                No mentors found matching your search criteria.
              </div>
            )}
          </div>
        </section>

        {/* ================= MENTORSHIP ADVANTAGE SECTION ================= */}
        <section className="space-y-10 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              The AetherLearn Mentorship Advantage
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our mentors don't just guess what you need. They are empowered by our AI Student Performance System to deliver precision guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* Advantage 1 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#253df5] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <BarChart2 size={20} />
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                AI-Informed Context
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Before your session begins, mentors receive a summary of your recent coursework, struggled concepts, and learning velocity generated by our AI.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#253df5] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Sliders size={20} />
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Dynamic Pathing
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Mentors adjust your curriculum live during sessions. Changes sync instantly with your core AetherLearn syllabus for a seamless experience.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-white dark:bg-[#0c0c0c]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#253df5] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Brain size={20} />
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Cognitive Matching
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Our matching algorithm pairs you with mentors whose teaching style aligns with your established cognitive learning preferences.
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* ================= BOOKING MODAL OVERLAY ================= */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative animate-scaleUp p-6 space-y-5 text-left">

            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
              <h3 className="text-base font-black text-slate-909 dark:text-white flex items-center gap-1.5">
                <Calendar size={16} className="text-blue-500 animate-pulse" />
                <span>Book Office Hours</span>
              </h3>
              <button
                onClick={() => setBookingMentor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile info snippet */}
            <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/40 border border-[#eef2f6] dark:border-slate-800/60 rounded-xl">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50 dark:border-slate-700/60">
                <img src={bookingMentor.avatar} alt={bookingMentor.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">{bookingMentor.name}</h4>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{bookingMentor.role}</span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-06-15"
                  max="2026-06-25"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-855 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                  required
                />
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '09:00 AM - 10:00 AM', val: '09:00' },
                    { label: '11:30 AM - 12:30 PM', val: '11:30' },
                    { label: '02:00 PM - 03:00 PM', val: '14:00' },
                    { label: '04:30 PM - 05:30 PM', val: '16:30' }
                  ].map((slot) => {
                    const isSelected = selectedTimeSlot === slot.val;
                    return (
                      <button
                        key={slot.val}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.val)}
                        className={`p-2.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${isSelected
                            ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/60 text-slate-655 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Scope */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wide block">Subject Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Model Alignment, Pipeline Debugging"
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-855 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                  required
                />
              </div>

              {/* Action trigger */}
              <button
                type="submit"
                disabled={isBookingSubmitting}
                className="w-full py-3.5 bg-[#253df5] hover:bg-blue-650 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
              >
                {isBookingSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW PROFILE DETAIL MODAL ================= */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative animate-scaleUp p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left gap-6">

            {/* Header info */}
            <div className="flex flex-col sm:flex-row gap-5 items-start justify-between border-b border-slate-100 dark:border-slate-850 pb-5">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                  <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {selectedProfile.name}
                  </h3>
                  <p className="text-xs font-bold text-[#253df5] dark:text-blue-400">
                    {selectedProfile.role}
                  </p>
                  <div className="flex gap-1.5 pt-0.5">
                    {selectedProfile.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-850"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-655 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 self-start sm:self-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Bio Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Column: Biography & Publications */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono">Biography</span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {selectedProfile.fullBio}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono block">Selected Publications</span>
                  <div className="space-y-2">
                    {selectedProfile.publications.map((pub, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-650 dark:text-slate-350">
                        <Award size={13} className="text-[#253df5] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{pub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Insights & Core Expertise progress bars */}
              <div className="space-y-5 border-t md:border-t-0 md:border-l md:border-slate-105 dark:border-slate-850 md:pl-8 pt-5 md:pt-0">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono block">Core Research Expertise</span>

                <div className="space-y-4">
                  {selectedProfile.expertise.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{exp.name}</span>
                        <span className="font-mono text-slate-900 dark:text-white">{exp.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#253df5] to-[#4f46e5] rounded-full" style={{ width: `${exp.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850/60">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono block">Professional Networks</span>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      target="_blank" rel="noopener noreferrer" href="https://linkedin.com"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-[#253df5] hover:bg-blue-100/60 dark:hover:bg-blue-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-100 dark:border-brand-500/10"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="#"
                      target="_blank" rel="noopener noreferrer" href="https://github.com"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-205 dark:border-slate-800"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-850 mt-2">
              <button
                onClick={() => {
                  setBookingMentor(selectedProfile);
                  setSelectedProfile(null);
                }}
                className="flex-1 py-3.5 bg-[#253df5] hover:bg-blue-650 text-white rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-500/10 active:scale-95 cursor-pointer"
              >
                <Calendar size={13} />
                <span>Book Office Hours</span>
              </button>
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-6 py-3.5 border border-slate-205 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer bg-transparent"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


// --- Component: AIPanelButton.jsx ---
function AIPanelButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice feature states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Disabled by default
  const [showPopup, setShowPopup] = useState(false);
  const recognitionRef = useRef(null);
  const voiceTimerRef = useRef(null);

  // System context prompt for AetherLearn Platform
  const SYSTEM_PROMPT = `
You are an intelligent, contextual AI assistant for the 'AetherLearn' platform, an advanced industrial dashboard for students and mentors.
Your main goals are:
1. Help users navigate the web interface (e.g., explaining where the 'Past Year Question Vault' is, how to view 'Recent Sets', or where to find 'Settings').
2. Guide them on using the AI tools perfectly (e.g., how to upload a PDF for analysis, how the Topic Frequency Map works).
3. If they ask a question, answer clearly and concisely.
4. If they need to click a specific button, phrase your response like an actionable notification.
`;

  useEffect(() => {
    // Initialize Speech Recognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setQuery(finalTranscript);

        // Clear previous timer
        if (voiceTimerRef.current) {
          clearTimeout(voiceTimerRef.current);
        }

        // Wait 5 seconds after speech stops to submit
        voiceTimerRef.current = setTimeout(() => {
          handleAIRequest(null, finalTranscript);
          recognition.stop();
          setIsListening(false);
        }, 5000);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    } else {
      setQuery('');
      recognitionRef.current?.start();
      setIsListening(true);
      if (!isOpen) setIsOpen(true);
    }
  };

  const speakText = async (text) => {
    if (!voiceEnabled) return;

    try {
      const sarvamApiKey = import.meta.env.VITE_SARVAM_API_KEY || 'MISSING_SARVAM_KEY';
      if (sarvamApiKey === 'MISSING_SARVAM_KEY') {
        console.warn('VITE_SARVAM_API_KEY not set. Falling back to browser TTS.');
        // Fallback to browser TTS if no key
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }
        return;
      }

      // Placeholder for Sarvam API TTS request
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Subscription-Key': sarvamApiKey
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: "hi-IN", // Defaulting to Hindi or can be en-IN
          speaker: "meera",
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: "sarvam-1"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.audios && data.audios.length > 0) {
          // Play base64 audio string returned by Sarvam
          const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
          audio.play();
        }
      } else {
        console.error('Sarvam API Error:', response.statusText);
      }
    } catch (err) {
      console.error('TTS Error:', err);
    }
  };

  const handleAIRequest = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const finalQuery = forcedQuery || query;
    if (!finalQuery) return;

    setLoading(true);
    setResult('');
    setShowPopup(false);

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY || 'MISSING_API_KEY';

      const payload = {
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: finalQuery }
        ],
        max_tokens: 300
      };

      // In production, point to the actual NVIDIA endpoint
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Mock fallback if API fails or no key
        return {
          ok: true,
          json: () => Promise.resolve({
            choices: [{ message: { content: "To navigate to the Past Year Question Vault, click 'Quizzes' in the left sidebar, then select the 'Past Year' toggle. How else can I assist you today?" } }]
          })
        };
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Analysis complete.';

      setResult(aiResponse);
      setShowPopup(true);

      // Auto-hide popup after 10 seconds if it's just a notification
      setTimeout(() => setShowPopup(false), 10000);

      // Trigger text-to-speech
      speakText(aiResponse);

    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">

      {/* Contextual Popup Notification */}
      {showPopup && !isOpen && (
        <div className="mb-2 w-80 bg-brand-600 dark:bg-brand-700 text-white shadow-xl rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-bottom-4">
          <AlertCircle className="flex-shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">AI Guidance</h4>
            <p className="text-sm leading-snug">{result}</p>
          </div>
          <button onClick={() => setShowPopup(false)} className="self-start opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Chat Interface */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-brand-600 dark:bg-brand-700 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">AetherLearn Guide</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="hover:bg-white/20 p-1.5 rounded transition-colors"
                title={voiceEnabled ? "Mute Voice Responses" : "Enable Voice Responses"}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-around pb-3 border-b border-slate-100 dark:border-slate-800">
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <FileText size={16} className="mb-1" />
                Analyze PDF
              </button>
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <ImageIcon size={16} className="mb-1" />
                Scan Image
              </button>
              <button className="flex flex-col items-center text-xs text-slate-500 hover:text-brand-500 transition-colors">
                <Search size={16} className="mb-1" />
                Interface Help
              </button>
            </div>

            {result && (
              <div className="p-3 bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 max-h-48 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={14} className="text-brand-500" />
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Response</span>
                </div>
                {result}
              </div>
            )}

            <form onSubmit={(e) => handleAIRequest(e)} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask for guidance or tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-lg transition-colors ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-500 dark:hover:text-brand-400'}`}
                title="Use Voice Input"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                disabled={loading || !query}
                className="bg-brand-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? '...' : 'Go'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    </div>
  );
}


// --- Main App Component ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Curriculum');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Smooth page loading transition handler
  const handleTabSwitch = (tabName) => {
    if (tabName === activeTab) return;
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTab(tabName);
      setIsNavigating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 320);
  };

  // Track theme changes from Navbar's toggle via MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Check backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          setIsLoggedIn(true);
          setActiveTab('Dashboard');
        }
      } catch (err) {
        // Not logged in
      } finally {
        setIsInitializing(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setActiveTab('Dashboard');
      setIsNavigating(false);
    }, 400);
  };

  const handleLogout = async () => {
    setIsNavigating(true);
    try {
      await fetch('http://localhost:8000/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) { }

    setTimeout(() => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setActiveTab('Curriculum');
      setIsNavigating(false);
    }, 300);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
        {isDark && <StarfieldBackground />}
        <div className="w-12 h-12 rounded-2xl bg-[#253df5] flex items-center justify-center text-white shadow-xl shadow-[#253df5]/30 animate-bounce">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#253df5] animate-loader-bar" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-500/10 dark:selection:bg-brand-500/30 selection:text-brand-600 dark:selection:text-brand-450 transition-colors duration-300 overflow-x-hidden">
      {/* Top Page Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#253df5]/20 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#253df5] via-indigo-400 to-[#253df5] animate-loader-bar" />
        </div>
      )}

      {/* Animated starfield particles — only in dark mode */}
      {isDark && <StarfieldBackground />}

      {activeTab !== 'Login' && activeTab !== 'Dashboard' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleTabSwitch}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main className={`relative z-10 flex-grow flex flex-col items-center justify-center w-full transition-all duration-300 ${isNavigating ? 'opacity-40 scale-[0.995]' : 'animate-fade-in-page'}`}>
        {activeTab === 'Dashboard' && (
          isLoggedIn ? (
            currentUser?.role === 'Overseer' ? (
              <OverseerDashboard user={currentUser} onLogout={handleLogout} />
            ) : (currentUser?.role === 'Mentor' || currentUser?.role === 'Teacher') ? (
              <MentorDashboard user={currentUser} onLogout={handleLogout} />
            ) : (
              <StudentDashboard user={currentUser} onLogout={handleLogout} />
            )
          ) : (
            <LoginPage
              onBackToHome={() => setActiveTab('Curriculum')}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}
        {activeTab === 'Curriculum' && (
          <>
            <Hero />
            <NeuralAdvantage />
            <CoreCapabilities />
            <Ecosystem />
            <IntegrationSafety />
            <MeasurableEvolution />
          </>
        )}
        {activeTab === 'Live Sessions' && <LiveSessions />}
        {activeTab === 'Mentors' && <MentorsList />}
        {activeTab === 'Login' && (
          <LoginPage
            onBackToHome={() => setActiveTab(isLoggedIn ? 'Dashboard' : 'Curriculum')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>

      {activeTab !== 'Login' && activeTab !== 'Dashboard' && (
        <Footer
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;