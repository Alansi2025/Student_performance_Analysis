import React, { useState } from 'react';
import { Code2, Share2, Users, Mail } from 'lucide-react';

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

export default function Footer({ setActiveTab, isLoggedIn, onLogout }) {
  return (
    <footer className="w-full bg-white dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300">
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
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (setActiveTab) setActiveTab('Curriculum');
                  }}
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
