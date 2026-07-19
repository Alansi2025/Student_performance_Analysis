import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sun, Moon, ArrowRight, User, School, Map, Building2, UserCheck, ChevronDown, GraduationCap, Brain, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage({ onBackToHome, onLoginSuccess }) {
  // viewState can be 'signIn', 'signUp', or 'choosePath'
  const [viewState, setViewState] = useState('signIn');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('');
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
      const formData = new URLSearchParams();
      formData.append('username', signInEmail.trim());
      formData.append('password', signInPassword);

      const response = await fetch('http://localhost:8000/users/login', {
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
      const user = { email: signInEmail.trim(), role: data.role };
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    }
  };

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
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpEmail.trim(),
          password: signUpAccessKey
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center pt-8 pb-6 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      
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
      <div className="w-full max-w-md bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl dark:shadow-black/30 p-8 sm:p-10 transition-all duration-300 animate-fade-in">
          
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
                    <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-200 ${
                      rememberMe 
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
                  <span className="relative px-3 bg-white dark:bg-[#0d1326] text-[10px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase font-mono">
                    Or continue with
                  </span>
                </div>

                {/* Social login buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-55 dark:hover:bg-slate-800/40 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>

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
          <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
            
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
