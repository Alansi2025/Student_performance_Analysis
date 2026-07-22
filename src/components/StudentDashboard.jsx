import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, GraduationCap, Bot, TrendingUp, Settings, 
  HelpCircle, LogOut, Bell, Target, Award, 
  FileText, Calendar, Clock, Lock, Menu, X, ArrowRight,
  MapPin, Sparkles, Search, Star, MessageSquare, Sun, Moon, ArrowLeft,
  Paperclip, Mic, Send, ExternalLink, Zap, Play, Trophy,
  Globe, Network, Database, Cpu, Router, Scale, ChevronDown,
  User, Sliders, ShieldCheck, Mail, BookOpen,
  Megaphone, PlayCircle, CheckCircle, Layers, Download, Timer, Check, Camera, Upload
} from 'lucide-react';

import alexRiversProfile from '../assets/alex_rivers_profile.png';
import julianVanceProfile from '../assets/julian_vance_profile.png';
import sarahProfile from '../assets/sarah_profile.png';
import priyaSharmaProfile from '../assets/priya_sharma_profile.png';
import vikramSinghProfile from '../assets/vikram_singh_profile.png';
import ananyaDesaiProfile from '../assets/ananya_desai_profile.png';
import circuitBoardImage from '../assets/circuit_board.png';

export default function StudentDashboard({ user, onLogout }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [courseFilter, setCourseFilter] = useState('Active');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [settingsTab, setSettingsTab] = useState('Profile');
  const [formName, setFormName] = useState(user?.name || 'Alex Rivers');
  const [profileImage, setProfileImage] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [formEmail, setFormEmail] = useState(user?.email || 'alex@aetherlearn.com');
  const [formInstitution, setFormInstitution] = useState(user?.institute || 'Aether Academy');
  const [formCity, setFormCity] = useState(user?.city || 'San Francisco');
  const [formState, setFormState] = useState(user?.state || 'California');
  const [toggleDailyGoals, setToggleDailyGoals] = useState(true);
  const [toggleEmailSummaries, setToggleEmailSummaries] = useState(false);
  const [toggleAdaptiveVoice, setToggleAdaptiveVoice] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);
  
  // Connectivity fields
  const [formTelegram, setFormTelegram] = useState(user?.telegram_id || '');
  const [formGmail, setFormGmail] = useState(user?.gmail || '');
  const [formPhone, setFormPhone] = useState(user?.phone_number || '');

  // AI Document Processing State
  const [aiHealth, setAiHealth] = useState(null);
  const [aiSelectedFile, setAiSelectedFile] = useState(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/ai/health')
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setAiHealth(data))
      .catch(() => {});
  }, []);

  const handleProcessPdf = async (e) => {
    e.preventDefault();
    if (!aiSelectedFile) return;
    setAiProcessing(true);
    setAiError(null);
    setAiResult(null);

    const formData = new FormData();
    formData.append('file', aiSelectedFile);

    try {
      const res = await fetch('http://localhost:8000/ai/process-pdf', {
        method: 'POST',
        headers: {
          'X-API-Key': 'aether_ai_secret_key_2026'
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'PDF processing failed');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      setAiError(err.message || 'Failed to analyze PDF with AI');
    } finally {
      setAiProcessing(false);
    }
  };
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [explorerTab, setExplorerTab] = useState('Modules');
  const [selectedModuleId, setSelectedModuleId] = useState(2);
  const [practiceType, setPracticeType] = useState('AI-Generated Quiz');
  const [sessionMode, setSessionMode] = useState('Timed Quiz');
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState('15');

  // Past Year Question Vault States
  const [quizzesView, setQuizzesView] = useState('generator'); // 'generator' or 'past-year'
  const [pastYearSubject, setPastYearSubject] = useState('Advanced Machine Learning');
  const [pastYearStart, setPastYearStart] = useState('2018');
  const [pastYearEnd, setPastYearEnd] = useState('2024');
  const [pastYearExamType, setPastYearExamType] = useState('End-Term');
  const [pastYearTopics, setPastYearTopics] = useState({
    'Neural Networks': true,
    'CNNs': false,
    'Transformers': true,
    'RNNs': false
  });
  const [isGeneratingSet, setIsGeneratingSet] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showGenSuccess, setShowGenSuccess] = useState(false);
  const [recentSets, setRecentSets] = useState([
    { id: 1, title: 'End-Term 2023 - AML', subtitle: 'Generated 2 days ago', status: 'download', type: 'End-Term', year: '2023' },
    { id: 2, title: 'Transformers Focus Set', subtitle: 'In Progress • 40% Complete', status: 'inprogress', type: 'Focus Set', year: '2024' }
  ]);

  useEffect(() => {
    let interval;
    if (isGeneratingSet) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsGeneratingSet(false);
            
            // Add new set to recent sets list
            const subjectAbbr = pastYearSubject === 'Advanced Machine Learning' ? 'AML' : pastYearSubject === 'Natural Language Processing' ? 'NLP' : 'DS';
            const newSet = {
              id: Date.now(),
              title: `${pastYearExamType} ${pastYearEnd} - ${subjectAbbr}`,
              subtitle: 'Generated just now',
              status: 'download',
              type: pastYearExamType,
              year: pastYearEnd
            };
            setRecentSets(prevSets => [newSet, ...prevSets]);
            setShowGenSuccess(true);
            setTimeout(() => setShowGenSuccess(false), 3000);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isGeneratingSet, pastYearSubject, pastYearEnd, pastYearExamType]);

  const [chatHistory, setChatHistory] = useState({
    'priya-sharma': [],
    'vikram-singh': [],
    'ananya-desai': [],
    'rajesh-kumar': [],
    'meera-patel': []
  });

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

  const getUserAvatar = (u) => {
    if (profileImage) return profileImage;
    if (!u) return null;
    const email = u.email ? u.email.toLowerCase() : '';
    if (email.includes('alex')) return alexRiversProfile;
    if (email.includes('sarah')) return sarahProfile;
    return null;
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Alex';
    return fullName.split(' ')[0];
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'ST';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Courses', icon: GraduationCap },
    { name: 'Assignments', icon: FileText },
    { name: 'Discussions', icon: MessageSquare },
    { name: 'Insights', icon: TrendingUp },
    { name: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between text-left">
      <div className="space-y-8 flex-grow overflow-y-auto pr-1 sidebar-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#253df5] flex items-center justify-center text-white shadow-md shadow-brand-500/10">
            <Zap className="w-4.5 h-4.5 text-white fill-current" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-wide text-[#253df5] dark:text-white leading-none">
              AetherLearn
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-none">
              AI Learning Platform
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3.5 px-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0 flex items-center justify-center bg-[#253df5]">
            {getUserAvatar(user) ? (
              <img loading="lazy" src={getUserAvatar(user)} 
                alt={user?.name || "Alex Rivers"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-black tracking-wider">
                {getInitials(user?.name || 'ST')}
              </span>
            )}
          </div>
          <div className="truncate">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm sm:text-base tracking-wide uppercase leading-tight">
              {user?.name || 'ALEX RIVERS'}
            </h3>
            <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 font-mono tracking-widest block mt-0.5">
              {user?.role === 'Mentor' ? 'LEAD INSTRUCTOR' : 'AI RESEARCHER PATH'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveNav(item.name);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#253df5] dark:bg-[#253df5]'
                    : 'text-slate-605 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`} />
                  <span className="tracking-wider">{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-5 pt-6 border-t border-slate-100 dark:border-slate-850/60">
        <button className="w-full bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/85 text-[#253df5] dark:text-white border border-[#253df5]/10 dark:border-slate-800 text-xs font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-2 shadow-xs">
          <Trophy className="w-4 h-4 text-[#253df5] dark:text-brand-400 fill-current" />
          <span>Upgrade to Pro</span>
        </button>
        <div className="space-y-3 px-2">
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-xs font-bold text-slate-550 dark:text-gray-450 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-250 w-full text-left"
          >
            <LogOut className="w-4 h-4 text-slate-400 dark:text-gray-500" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPastYearVault = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2001; y <= currentYear; y++) {
      years.push(y.toString());
    }
    return (
      <div className="space-y-6 w-full text-left animate-fadeIn">
        {/* Past Year Question Vault Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-205 dark:border-slate-800">
          <div className="space-y-2.5 text-left max-w-3xl">
            {/* Back button */}
            <button 
              onClick={() => setQuizzesView('generator')}
              className="flex items-center gap-1.5 text-xs font-black text-[#253df5] dark:text-brand-400 hover:text-blue-700 dark:hover:text-brand-300 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} />
              <span>Back to Quiz Generator</span>
            </button>
            <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none mt-2">
              Past Year Question Vault
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Access and generate practice sets from historical examination data (2015 - 2024).
            </p>
          </div>
        </div>

        {/* AI Document Processing Panel (PaddleOCR + Ollama LLM) */}
        <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs text-left space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#253df5]" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">AI PYQ Document Processor</h3>
                <span className="text-[10px] text-slate-400 font-mono">PyMuPDF (JPG) → PaddleOCR (Apple ANE) → Ollama (gemma4:12b)</span>
              </div>
            </div>
            {aiHealth && (
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded-full border ${aiHealth.ready ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'}`}>
                  {aiHealth.ready ? '● AI Pipeline Ready' : '▲ AI Engine Initialising'}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleProcessPdf} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input 
              type="file"
              accept=".pdf"
              onChange={(e) => setAiSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#253df5]/10 file:text-[#253df5] hover:file:bg-[#253df5]/20 cursor-pointer"
            />
            <button
              type="submit"
              disabled={!aiSelectedFile || aiProcessing}
              className="px-6 py-2.5 bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[170px]"
            >
              {aiProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Extracting AI...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Analyze PDF with AI</span>
                </>
              )}
            </button>
          </form>

          {aiError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400">
              ⚠️ {aiError}
            </div>
          )}

          {aiResult && (
            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check size={14} /> PDF Analysis Complete — {aiResult.filename}
                </span>
                <span className="text-[10px] font-mono text-slate-400">gemma4:12b Output</span>
              </div>

              {aiResult.analysis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Subject</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{aiResult.analysis.subject || 'Detected Subject'}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Difficulty</span>
                    <span className="font-extrabold text-[#253df5]">{aiResult.analysis.difficulty || 'Intermediate'}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Questions</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{aiResult.analysis.question_count || '12'}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Topics</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate block">{aiResult.analysis.topics?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
              )}

              {aiResult.analysis?.summary && (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-[#253df5] mr-1">Summary:</span> {aiResult.analysis.summary}
                </p>
              )}

              {aiResult.extracted_text && (
                <details className="text-[11px] text-slate-500">
                  <summary className="cursor-pointer font-bold hover:text-slate-700 dark:hover:text-slate-300">View Raw Extracted Text Snippet (PaddleOCR)</summary>
                  <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-[10px] max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {aiResult.extracted_text.slice(0, 1000)}...
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Past Year Question Vault Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
          {/* Left Column: GENERATION PARAMETERS (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Sliders size={18} className="text-[#253df5] dark:text-brand-400" />
                <h3 className="font-extrabold text-[12px] text-slate-900 dark:text-white uppercase tracking-wider">
                  Generation Parameters
                </h3>
              </div>

              {/* Subject */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Subject</label>
                <div className="relative">
                  <select 
                    value={pastYearSubject}
                    onChange={(e) => setPastYearSubject(e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                  >
                    <option>Advanced Machine Learning</option>
                    <option>Natural Language Processing</option>
                    <option>Distributed Systems</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <ChevronDown size={14} className="text-slate-400" />
                  </span>
                </div>
              </div>

              {/* Start Year & End Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-555 dark:text-slate-400 uppercase tracking-wide">Start Year</label>
                  <div className="relative">
                    <select 
                      value={pastYearStart}
                      onChange={(e) => setPastYearStart(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <ChevronDown size={14} className="text-slate-400" />
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-extrabold text-slate-555 dark:text-slate-400 uppercase tracking-wide">End Year</label>
                  <div className="relative">
                    <select 
                      value={pastYearEnd}
                      onChange={(e) => setPastYearEnd(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <ChevronDown size={14} className="text-slate-400" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Exam Type */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Exam Type</label>
                <div className="relative">
                  <select 
                    value={pastYearExamType}
                    onChange={(e) => setPastYearExamType(e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-205 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                  >
                    <option>End-Term</option>
                    <option>Mid-Term</option>
                    <option>Class Test</option>
                    <option>Surprise Quiz</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <ChevronDown size={14} className="text-slate-400" />
                  </span>
                </div>
              </div>

              {/* Topic Focus */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Topic Focus</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(pastYearTopics).map((topic) => {
                    const isChecked = pastYearTopics[topic];
                    return (
                      <div 
                        key={topic}
                        onClick={() => {
                          setPastYearTopics(prev => ({
                            ...prev,
                            [topic]: !prev[topic]
                          }));
                        }}
                        className={`flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all duration-200 ${
                          isChecked 
                            ? 'border-[#253df5] bg-[#253df5]/5 dark:bg-[#253df5]/10' 
                            : 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked 
                            ? 'bg-[#253df5] border-[#253df5] text-white' 
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-808 dark:text-slate-205">{topic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Generate Button / Progress */}
            <div className="pt-3">
              {isGeneratingSet ? (
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#253df5] transition-all duration-150 ease-out" 
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Generating Practice Set...</span>
                    <span>{generationProgress}%</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsGeneratingSet(true)}
                  className="w-full bg-[#253df5] hover:bg-[#1d2ae0] text-white py-3.5 px-4 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-brand-500/10"
                >
                  <Timer size={14} className="animate-pulse" />
                  <span>Generate Historical Set</span>
                </button>
              )}
              
              {showGenSuccess && (
                <div className="mt-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-450 animate-fadeIn">
                  ✨ Practice set generated successfully and added to Recent Sets!
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI INSIGHT, TOPIC MAP, RECENT SETS (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* AI Insight Card */}
            <div className="relative overflow-hidden p-5 rounded-3xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 flex gap-3.5 text-left">
              <div className="absolute right-2 bottom-2 text-blue-500/10 dark:text-blue-400/5 pointer-events-none">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1c-.25.18-.4.48-.4.79V16h-4.9v-2.11c0-.31-.15-.61-.4-.79C8.48 11.89 8 10.51 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.51-.48 2.89-1.15 3.1z"/>
                </svg>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#253df5] dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="fill-current" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-blue-905 dark:text-blue-200">
                  AI Insight
                </h4>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-350 leading-normal">
                  Topics like <span className="font-extrabold text-slate-900 dark:text-white">Transformers</span> have appeared in <span className="font-extrabold text-slate-900 dark:text-white">80%</span> of End-Term exams since 2021. Prioritize these in your generation.
                </p>
              </div>
            </div>

            {/* Topic Frequency Map Card */}
            <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-5 shadow-xs text-left space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Topic Frequency Map ({pastYearStart}-{pastYearEnd})
                </h4>
              </div>
              <div className="space-y-3.5">
                {/* Transformers */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-655 dark:text-slate-300">Transformers</span>
                    <span className="text-[#253df5] dark:text-brand-400 font-extrabold">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-[#253df5] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                {/* Neural Networks */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-655 dark:text-slate-300">Neural Networks</span>
                    <span className="text-slate-705 dark:text-slate-400 font-extrabold">60%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 dark:bg-slate-450 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                {/* CNNs */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-655 dark:text-slate-300">CNNs</span>
                    <span className="text-violet-500 font-extrabold">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sets Card */}
            <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-5 shadow-xs text-left space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Recent Sets
                  </h4>
                  <a href="#" className="text-[10px] font-black text-[#253df5] dark:text-brand-400 uppercase tracking-wide hover:underline">
                    View All
                  </a>
                </div>
                
                <div className="space-y-3">
                  {recentSets.map((set) => (
                    <div 
                      key={set.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-55/50 dark:bg-slate-900/30 border border-[#eef2f6]/60 dark:border-slate-850/60 hover:border-slate-205 dark:hover:border-slate-800 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {set.status === 'download' ? (
                          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#ef4444] flex items-center justify-center flex-shrink-0">
                            <FileText size={16} />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
                            <PlayCircle size={16} className="fill-current" />
                          </div>
                        )}
                        <div className="text-left">
                          <h5 className="text-xs font-black text-slate-808 dark:text-slate-205 leading-tight truncate max-w-[150px]">
                            {set.title}
                          </h5>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 block mt-0.5">
                            {set.subtitle}
                          </span>
                        </div>
                      </div>
                      
                      <button className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white shadow-xs">
                        {set.status === 'download' ? (
                          <Download size={12} />
                        ) : (
                          <ArrowRight size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedCourse) {

    const modulesList = [
      {
        id: 1,
        name: 'Module 1',
        title: 'Neural Network Architectures',
        description: 'Perceptrons, Feedforward neural nodes, loss metrics, and basic training.',
        progress: 100,
        status: 'Completed',
        lesson: 'Lesson 4: Backpropagation Mechanics',
        upNextText: 'Review the mathematical derivations of gradient descent and chain rule applied to multi-layer perceptrons.',
        timeLabel: '15 MINS LEFT',
        readingsLabel: '1 READING',
        tag: 'Module 1 • Lesson 4'
      },
      {
        id: 2,
        name: 'Module 2',
        title: 'CNNs in Practice',
        description: 'Convolutional operations, pooling, advanced architectures (ResNet, AlexNet, VGG).',
        progress: 15,
        status: 'Current',
        lesson: 'Convolutional Layers & Feature Maps',
        upNextText: 'Dive deep into the mechanics of 2D convolutions. Learn how filters slide over pixels to detect visual features like edges, corners, and complex textures.',
        timeLabel: '45 MINS LEFT',
        readingsLabel: '2 READINGS',
        tag: 'Module 2 • Lesson 3'
      },
      {
        id: 3,
        name: 'Module 3',
        title: 'Sequence Models',
        description: 'RNNs, LSTMs, GRUs, and bidirectional architectures.',
        progress: 0,
        status: 'Locked',
        lesson: 'Recurrent Connections & Backpropagation Through Time',
        upNextText: 'Understand the vanishing gradient problem in recurrent nets and how LSTM gating mechanisms control long-term dependencies.',
        timeLabel: '60 MINS LEFT',
        readingsLabel: '3 READINGS',
        tag: 'Module 3 • Lesson 1'
      },
      {
        id: 4,
        name: 'Module 4',
        title: 'Attention & Transformers',
        description: 'Self-attention mechanisms, encoders, decoders, and LLM scaling.',
        progress: 0,
        status: 'Locked',
        lesson: 'Self-Attention & Query-Key-Value Math',
        upNextText: 'Step-by-step matrix multiplication walkthrough of scaled dot-product attention and multi-head attention blocks.',
        timeLabel: '75 MINS LEFT',
        readingsLabel: '4 READINGS',
        tag: 'Module 4 • Lesson 1'
      }
    ];

    const activeModule = modulesList.find(m => m.id === selectedModuleId) || modulesList[1];

    return (
      <div className="w-full h-screen bg-[#f4f6fa] dark:bg-[#0b0f19] text-slate-900 dark:text-white flex overflow-hidden transition-colors duration-300">
        
        {/* ================= COURSE EXPLORER SIDEBAR ================= */}
        <aside className="hidden lg:block w-68 bg-white dark:bg-[#0d1326] border-r border-[#eef2f6] dark:border-slate-850/60 p-6 h-full flex-shrink-0 z-20 text-left">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-[#253df5] flex items-center justify-center text-white shadow-md shadow-brand-500/10">
                  <Zap className="w-4.5 h-4.5 text-white fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg font-black tracking-wide text-[#253df5] dark:text-white leading-none">
                    AetherLearn
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-none uppercase tracking-wide">
                    Course Explorer
                  </span>
                </div>
              </div>

              {/* Course Info in Sidebar */}
              <div className="px-2 py-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-105 dark:border-slate-800">
                <span className="text-[9px] font-extrabold text-[#253df5] bg-[#253df5]/10 px-2.5 py-1 rounded font-mono uppercase tracking-wide">
                  CS 501
                </span>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-205 mt-2.5 truncate leading-tight">
                  {selectedCourse.title}
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">
                  Active Curriculum
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5" aria-label="Course Navigation">
                {[
                  { name: 'Dashboard', icon: LayoutDashboard, action: () => setSelectedCourse(null) },
                  { name: 'Modules', icon: Layers, action: () => setExplorerTab('Modules') },
                  { name: 'Assignments', icon: FileText, action: () => setExplorerTab('Assignments') },
                  { name: 'Quizzes', icon: HelpCircle, action: () => setExplorerTab('Quizzes') },
                  { name: 'Discussions', icon: MessageSquare, action: () => setExplorerTab('Discussions') },
                  { name: 'Analytics', icon: TrendingUp, action: () => setExplorerTab('Analytics') },
                ].map((item) => {
                  const isActive = item.name === 'Dashboard' ? false : explorerTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-[#253df5]'
                          : 'text-slate-605 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`} />
                        <span className="tracking-wider">{item.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-5 pt-6 border-t border-slate-100 dark:border-slate-850/60">
              
              
              {/* User Profile Info Card */}
              <div className="flex items-center gap-3 px-2 border-t border-slate-50 dark:border-slate-850/50 pt-4">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0 flex items-center justify-center bg-[#253df5]">
                  {getUserAvatar(user) ? (
                    <img loading="lazy" src={getUserAvatar(user)} 
                      alt={user?.name || "Alex Mercer"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-black tracking-wider">
                      {getInitials(user?.name || 'AM')}
                    </span>
                  )}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-808 dark:text-white truncate leading-tight">
                    {user?.name || 'Alex Mercer'}
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mt-0.5">
                    {user?.role || 'Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT VIEWPORT ================= */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden">
          
          {/* Top Header */}
          <header className="w-full bg-white dark:bg-[#0d1326] border-b border-[#eef2f6] dark:border-slate-855/60 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
             {/* Left: Course Title and ID */}
             <div className="flex items-center gap-3.5 text-left">
               <button 
                 onClick={() => setSelectedCourse(null)}
                 className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1326] text-slate-500 dark:text-gray-400 hover:text-[#253df5] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs"
                 aria-label="Back to dashboard"
               >
                 <ArrowLeft size={15} />
               </button>
               <div className="flex flex-col text-left">
                 <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                   {selectedCourse.title}
                 </h2>
                 <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                   Course ID: {selectedCourse.id === 'aml' ? 'ML-401' : selectedCourse.id === 'nlp' ? 'NLP-501' : 'CS-501'}
                 </span>
               </div>
             </div>

             {/* Right: Clock & Bell icons */}
             <div className="flex items-center gap-2 flex-shrink-0">
               {/* Clock button */}
               <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                 <Clock className="w-5 h-5" />
               </button>

               {/* Bell button */}
               <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
                 <Bell className="w-5 h-5" />
               </button>
             </div>
          </header>

          {/* Main Course Body */}
          <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 text-left w-full">
                 {/* ================= CONDITIONAL TAB RENDERING ================= */}
            {explorerTab === 'Quizzes' ? (
              quizzesView === 'past-year' ? (
                renderPastYearVault()
              ) : (
                <>
                  {/* Quizzes Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-105 dark:border-slate-850">
                  <div className="space-y-2.5 text-left max-w-3xl">
                    <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                      Practice Session Generator
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Generate custom practice sets based on your current skill gaps and historical assessment patterns.
                    </p>
                  </div>
                </div>

                {/* Quizzes Split Grid panel */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
                  {/* Left Column: GENERATION PARAMETERS (40%) */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-5">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Generation Parameters
                        </h3>
                      </div>

                      {/* Practice Type */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Practice Type</label>
                        <div className="relative">
                          <select 
                            value={practiceType}
                            onChange={(e) => setPracticeType(e.target.value)}
                            className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                          >
                            <option>AI-Generated Quiz</option>
                            <option>Practice Exam</option>
                            <option>Flashcards Session</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown size={14} className="text-slate-400" />
                          </span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Subject</label>
                        <div className="relative">
                          <select 
                            className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                            defaultValue={selectedCourse.title}
                          >
                            <option>{selectedCourse.title}</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown size={14} className="text-slate-400" />
                          </span>
                        </div>
                      </div>

                      {/* Focus Area */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Focus Area</label>
                        <div className="relative">
                          <select 
                            className="w-full appearance-none px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] cursor-pointer"
                          >
                            <option>Backpropagation (Weakest)</option>
                            <option>CNN Feature Mapping</option>
                            <option>Neural Architecture Search</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown size={14} className="text-slate-400" />
                          </span>
                        </div>
                      </div>

                      {/* Session Mode */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide">Session Mode</label>
                        <div className="flex bg-slate-100/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {['Timed Quiz', 'Practice Mode'].map(mode => {
                            const isSelected = sessionMode === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setSessionMode(mode)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800 text-[#253df5] dark:text-brand-400 shadow-xs'
                                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {mode}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Difficulty Level */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide">Difficulty Level</label>
                        <div className="flex bg-slate-100/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                            const isSelected = difficultyLevel === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setDifficultyLevel(level)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-white dark:bg-[#0d1326] border border-slate-200/80 dark:border-slate-800 text-[#253df5] dark:text-brand-400 shadow-xs'
                                    : 'text-slate-550 dark:text-slate-405 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-505 dark:text-slate-400 uppercase tracking-wide">Question Count</label>
                        <input 
                          type="number"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5]"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                      <button className="flex-1 bg-[#253df5] hover:bg-[#1d2ae0] text-white py-3.5 px-4 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-brand-500/10">
                        <Play size={12} className="fill-current" />
                        <span onClick={() => setActiveNav('Quizzes')}>Start AI Quiz</span>
                      </button>
                      <button 
                        onClick={() => setQuizzesView('past-year')}
                        className="flex-grow bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 py-3.5 px-4 rounded-2xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-800"
                      >
                        <FileText size={12} />
                        <span>Start Past Year Session</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: AI-RECOMMENDED FOCUS & RECENT QUIZ PERFORMANCE (60%) */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-6 flex-grow">
                      {/* AI-Recommended Focus Header */}
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
                        <h3 className="font-extrabold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          AI-Recommended Focus
                        </h3>
                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800 px-2.5 py-1 rounded font-mono uppercase tracking-wide">
                          Auto-balanced
                        </span>
                      </div>

                      {/* Info Box */}
                      <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-red-950/10 border border-red-100/60 dark:border-red-900/20 flex items-start gap-3 text-left">
                        <TrendingUp className="w-4 h-4 text-[#ef4444] dark:text-[#f87171] mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">
                            Focus Required: Backpropagation
                          </h4>
                          <p className="text-[11px] font-semibold text-slate-505 dark:text-slate-400 leading-relaxed pt-0.5">
                            Your recent accuracy in Backpropagation is <span className="text-[#ef4444] dark:text-[#f87171] font-bold">45%</span>. We recommend a focused session targeting this concept to improve your overall model evaluation skills.
                          </p>
                        </div>
                      </div>

                      {/* PREDICTED TOPIC DISTRIBUTION */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                          Predicted Topic Distribution
                        </h4>
                        
                        <div className="space-y-3.5">
                          {/* Backpropagation */}
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="w-28 text-slate-700 dark:text-slate-300 truncate">Backpropagation</span>
                            <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                              <div className="h-full bg-[#253df5] rounded-full w-[50%]" />
                            </div>
                            <span className="w-8 text-right text-[#253df5] dark:text-brand-400 font-extrabold">50%</span>
                          </div>
                          {/* CNNs */}
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="w-28 text-slate-700 dark:text-slate-300 truncate">CNNs</span>
                            <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full w-[30%]" />
                            </div>
                            <span className="w-8 text-right text-indigo-500 font-extrabold">30%</span>
                          </div>
                          {/* Neural Networks */}
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="w-28 text-slate-700 dark:text-slate-300 truncate">Neural Networks</span>
                            <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-500 dark:bg-slate-400 rounded-full w-[20%]" />
                            </div>
                            <span className="w-8 text-right text-slate-500 dark:text-slate-400 font-extrabold">20%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RECENT QUIZ PERFORMANCE */}
                    <div className="space-y-3 w-full border-t border-slate-100 dark:border-slate-850/80 pt-4">
                      <h4 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                        Recent Quiz Performance
                      </h4>

                      <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-left text-xs font-semibold text-slate-650 dark:text-slate-350">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-wider">
                              <th className="py-2.5 pb-2">Date</th>
                              <th className="py-2.5 pb-2">Topic</th>
                              <th className="py-2.5 pb-2 text-center">Score</th>
                              <th className="py-2.5 pb-2 text-right">Level</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="py-3.5 text-slate-500 dark:text-slate-400">Oct 12</td>
                              <td className="py-3.5 text-slate-900 dark:text-white font-bold truncate max-w-[150px]">CNN Architectures</td>
                              <td className="py-3.5 text-center text-[#253df5] dark:text-brand-400 font-extrabold">85%</td>
                              <td className="py-3.5 text-right font-medium text-slate-605 dark:text-slate-400 font-semibold">Intermediate</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="py-3.5 text-slate-500 dark:text-slate-400">Oct 08</td>
                              <td className="py-3.5 text-slate-900 dark:text-white font-bold truncate max-w-[150px]">Backpropagation</td>
                              <td className="py-3.5 text-center text-[#ef4444] dark:text-[#f87171] font-extrabold">45%</td>
                              <td className="py-3.5 text-right font-medium text-slate-605 dark:text-slate-400 font-semibold">Advanced</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="py-3.5 text-slate-500 dark:text-slate-400">Oct 01</td>
                              <td className="py-3.5 text-slate-900 dark:text-white font-bold truncate max-w-[150px]">Intro to Neural Networks</td>
                              <td className="py-3.5 text-center text-emerald-600 dark:text-emerald-450 font-extrabold">92%</td>
                              <td className="py-3.5 text-right font-medium text-slate-605 dark:text-slate-400 font-semibold">Beginner</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>)
            ) : explorerTab === 'Assignments' ? (
              <>
                {/* Assignments Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-105 dark:border-slate-850">
                  <div className="space-y-2.5 text-left max-w-3xl">
                    <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                      Assignments & Tasks
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Track your deliverables, due dates, grading rubrics, and project submissions for {selectedCourse.title}.
                    </p>
                  </div>
                </div>

                {/* Assignments Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: UPCOMING ASSIGNMENTS (7 cols) */}
                  <div className="lg:col-span-7 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4 w-full">
                      <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Active & Upcoming
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {[
                          { title: "Implement Transformer Logic", course: selectedCourse.title, priority: "HIGH PRIORITY", type: "Programming Lab", due: "14 hours left", priorityClass: "text-[#ef4444] bg-[#fee2e2] dark:bg-[#3f1619]" },
                          { title: "Optimize Data Pipeline", course: selectedCourse.title, priority: "STANDARD", type: "Performance Lab", due: "Due Friday", priorityClass: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-[#eef2f6] dark:border-slate-855/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`inline-block text-[8px] font-black tracking-wider px-2 py-0.5 rounded font-mono uppercase ${item.priorityClass}`}>
                                  {item.priority}
                                </span>
                              </div>
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-505 dark:text-slate-400 font-medium">
                                {item.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 justify-between sm:justify-end">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans whitespace-nowrap">
                                {item.due}
                              </span>
                              <button className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-[11px] font-black py-2.5 px-4 rounded-xl transition-all duration-200 tracking-wider">
                                Submit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: GRADING & COMPLETED (5 cols) */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4 w-full">
                      <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Graded & Completed
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {[
                          { title: "CNN Feature Mapping lab", score: "95/100", date: "Oct 12", course: selectedCourse.title },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3.5 rounded-2xl border border-[#eef2f6]/50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10">
                            <div className="truncate pr-4">
                              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                                Graded on {item.date}
                              </span>
                              <h4 className="text-xs font-bold text-slate-905 dark:text-white truncate mt-0.5">
                                {item.title}
                              </h4>
                            </div>
                            <span className="text-xs font-black text-emerald-655 dark:text-emerald-450 whitespace-nowrap">
                              {item.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : explorerTab === 'Discussions' ? (
              <>
                {/* Discussions Header section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-105 dark:border-slate-850">
                  <div className="space-y-2.5 text-left max-w-3xl">
                    <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                      Community Discussions
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Participate in study groups, ask questions, collaborate with peers, and interact with course mentors for {selectedCourse.title}.
                    </p>
                  </div>
                </div>

                {/* Discussions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Channels List (4 cols) */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4 w-full">
                      <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-[12px] text-slate-505 dark:text-slate-400 uppercase tracking-wider">
                          Discussion Channels
                        </h3>
                      </div>

                      <div className="space-y-1">
                        {[
                          { name: `# class-announcements`, active: true, count: 0 },
                          { name: `# lectures-qa`, active: false, count: 3 },
                          { name: `# study-groups-collaboration`, active: false, count: 8 },
                        ].map((item, idx) => (
                          <button 
                            key={idx} 
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                              item.active 
                                ? 'bg-[#253df5]/10 text-[#253df5] dark:text-white dark:bg-[#253df5]' 
                                : 'text-slate-606 dark:text-gray-400 hover:bg-slate-55 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate">{item.name}</span>
                            {item.count > 0 && (
                              <span className="bg-[#253df5] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {item.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Active Threads (8 cols) */}
                  <div className="lg:col-span-8 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-[12px] text-slate-505 dark:text-slate-400 uppercase tracking-wider">
                          Active Threads
                        </h3>
                        <button className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-[10px] font-black py-2 px-3.5 rounded-xl transition-all duration-200 tracking-wider">
                          New Thread
                        </button>
                      </div>

                      <div className="space-y-4">
                        {[
                          { title: `Derivation of Transformer Self-Attention scaling factor in ${selectedCourse.title}`, author: "Julian Vance", replies: 12, views: 89, category: "NLP", lastActive: "10m ago" },
                          { title: "Midterm PyTorch image classification parameters setup issues", author: "Rohan Sharma", replies: 28, views: 145, category: "AML", lastActive: "4h ago" },
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-900/20 border border-[#eef2f6]/60 dark:border-slate-850 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors duration-200">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="inline-block text-[8px] font-black tracking-wider text-[#253df5] bg-[#253df5]/10 px-2 py-0.5 rounded font-mono uppercase">
                                  {item.category}
                                </span>
                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                                  {item.title}
                                </h4>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 font-mono whitespace-nowrap">
                                {item.lastActive}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-455 dark:text-slate-550 pt-1.5 border-t border-slate-100/50 dark:border-slate-850/40">
                              <span>Started by <span className="text-slate-705 dark:text-slate-300">{item.author}</span></span>
                              <div className="flex items-center gap-3">
                                <span>{item.replies} replies</span>
                                <span>•</span>
                                <span>{item.views} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : explorerTab === 'Modules' ? (
              <>
                {/* Header Title section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-105 dark:border-slate-850">
                  <div className="space-y-2.5 text-left max-w-3xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                        {selectedCourse.title}
                      </h1>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-[10px] font-black text-[#253df5] bg-[#253df5]/10 px-2.5 py-1 rounded font-mono uppercase tracking-wide">
                          CS 501
                        </span>
                        <span className="text-xs font-semibold text-slate-455">
                          {selectedCourse.semester}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 leading-relaxed">
                      Explore deep learning architectures, neural networks, and advanced predictive modeling.
                    </p>
                  </div>

                  {/* Progress Card (Top Right) */}
                  <div className="w-full md:w-52 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-16 flex-shrink-0">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-455 dark:text-slate-400">Course Progress</span>
                      <span className="text-[#253df5] dark:text-brand-400 text-xs font-black">{selectedCourse.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-855 rounded-full overflow-hidden">
                      <div className="h-full bg-[#253df5] rounded-full" style={{ width: `${selectedCourse.progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Split Grid panel */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
                  {/* Left Column: UP NEXT + ANNOUNCEMENTS (70%) */}
                  <div className="lg:col-span-7 space-y-6 flex flex-col">
                    {/* UP NEXT Card */}
                    <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs flex flex-col">
                      {/* UP NEXT Header row */}
                      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-850 flex-shrink-0">
                        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-[#253df5] dark:text-brand-400 uppercase font-sans">
                          <PlayCircle size={16} className="text-[#253df5] dark:text-brand-400" />
                          <span>Up Next</span>
                        </div>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md text-[10px] font-bold font-sans">
                          {activeModule.tag}
                        </span>
                      </div>

                      {/* UP NEXT Details content split */}
                      <div className="p-6 flex flex-col sm:flex-row gap-6 items-stretch flex-grow">
                        {/* Visual preview block left */}
                        <div className="relative w-full sm:w-[45%] h-44 sm:h-auto rounded-2xl bg-[#121212] overflow-hidden flex items-center justify-center flex-shrink-0">
                          {/* Custom SVG Waveform visual */}
                          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 200 120" preserveAspectRatio="none">
                            <path 
                              d="M0 60 C50 120, 80 0, 120 90 C150 120, 170 30, 200 60 L200 120 L0 120 Z" 
                              fill="none" 
                              stroke="url(#wave-gradient)" 
                              strokeWidth="1.5"
                            />
                            <path 
                              d="M0 60 C30 20, 60 100, 100 40 C140 0, 160 80, 200 60 L200 120 L0 120 Z" 
                              fill="none" 
                              stroke="url(#wave-gradient)" 
                              strokeWidth="1"
                              className="opacity-50"
                            />
                            <defs>
                              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#253df5" />
                                <stop offset="100%" stopColor="#7f7eff" />
                              </linearGradient>
                            </defs>
                          </svg>
                          {/* Play Button Overlay */}
                          <button className="relative w-12 h-12 rounded-full bg-white text-[#253df5] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-250">
                            <Play size={16} className="fill-current ml-1" />
                          </button>
                        </div>

                        {/* Lesson description details right */}
                        <div className="flex flex-col justify-between text-left flex-grow">
                          <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                              {activeModule.lesson}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-405 leading-relaxed">
                              {activeModule.upNextText}
                            </p>
                          </div>

                          <div className="space-y-4 mt-6">
                            {/* Time Metadata */}
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-455 dark:text-slate-500 font-sans tracking-wide">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{activeModule.timeLabel}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText size={12} />
                                <span>{activeModule.readingsLabel}</span>
                              </span>
                            </div>

                            {/* Action CTA */}
                            <button className="w-full sm:w-auto bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/10">
                              <span onClick={() => setActiveNav('Courses')}>Start Learning</span>
                              <ArrowRight size={13} className="stroke-[2.5px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Announcements Card */}
                    <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs text-left">
                      <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase font-sans border-b border-slate-100 dark:border-slate-850 pb-4">
                        <Megaphone size={16} className="text-[#253df5] dark:text-brand-400" />
                        <span>Course Announcements</span>
                      </div>

                      <div className="mt-5 border-l-2 border-[#253df5] pl-4 space-y-2 text-left">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          Midterm Project Guidelines Released
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-550 dark:text-slate-400 leading-relaxed">
                          The requirements for the image classification project using PyTorch are now available. Learn how to construct, train, and test models. Due in 3 weeks.
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono block pt-1.5">
                          Yesterday, 10:00 AM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: MODULES LIST (30%) */}
                  <div className="lg:col-span-3 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[460px]">
                    <div className="space-y-4">
                      {/* Heading */}
                      <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Modules
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5 font-sans">
                          Semester 5 Curriculum
                        </p>
                      </div>

                      {/* Modules List panel */}
                      <div className="space-y-3.5">
                        {modulesList.map((mod) => {
                          const isSelected = mod.id === selectedModuleId;
                          const isCompleted = mod.progress === 100;
                          
                          return (
                            <div
                              key={mod.id}
                              onClick={() => setSelectedModuleId(mod.id)}
                              className={`p-4 rounded-2xl flex flex-col gap-3 text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-white dark:bg-[#0d1326] border-2 border-[#253df5] shadow-2xs relative overflow-hidden'
                                  : isCompleted
                                  ? 'bg-slate-50/50 dark:bg-slate-900/40 border border-[#eef2f6] dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                                  : 'bg-slate-50/20 dark:bg-slate-900/10 border border-slate-105 dark:border-slate-850/50 hover:border-slate-350 dark:hover:border-slate-705'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase font-sans ${
                                  isSelected ? 'text-[#253df5]' : 'text-slate-550 dark:text-slate-400'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle size={12} className="text-[#253df5]" />
                                  ) : isSelected ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#253df5]" />
                                  ) : (
                                    <Lock size={11} className="text-slate-400 dark:text-slate-500" />
                                  )}
                                  <span>{mod.name}{isSelected && ' (Current)'}</span>
                                </div>
                                <span className={`text-[9px] font-bold font-mono ${
                                  isSelected ? 'text-[#253df5]' : 'text-slate-400 dark:text-slate-500'
                                }`}>
                                  {mod.progress}%
                                </span>
                              </div>
                              
                              <h4 className={`text-xs font-bold leading-tight ${
                                isSelected ? 'text-slate-905 dark:text-white' : 'text-slate-800 dark:text-slate-205'
                              }`}>
                                {mod.title}
                              </h4>
                              
                              <p className={`text-[10px] font-semibold leading-relaxed truncate ${
                                isSelected ? 'text-slate-550 dark:text-slate-400' : 'text-slate-455 dark:text-slate-450'
                              }`}>
                                {mod.description}
                              </p>

                              {/* Mini progress bar if selected or has progress */}
                              {(isSelected || (mod.progress > 0 && mod.progress < 100)) && (
                                <div className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden mt-1 flex-shrink-0">
                                  <div 
                                    className={`h-full rounded-full ${isSelected ? 'bg-[#253df5]' : 'bg-slate-400'}`} 
                                    style={{ width: `${mod.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* View Syllabus Button */}
                    <button className="w-full bg-white dark:bg-slate-900 border border-slate-200 hover:border-[#253df5] dark:border-slate-800 text-[#253df5] dark:text-brand-400 text-xs font-extrabold py-3 rounded-xl transition-all duration-200 tracking-wider text-center mt-5 flex-shrink-0">
                      View Full Syllabus
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Coming Soon</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">The {explorerTab} feature is under development.</p>
              </div>
            )}

          </main>

          {/* Footer */}
          <footer className="w-full mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-[#eef2f6] dark:border-slate-855/20 bg-white dark:bg-[#0b0f19] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 text-left">
              <span className="text-sm font-black tracking-wider text-[#253df5] dark:text-white">
                AetherLearn
              </span>
              <span className="text-xs text-slate-455 dark:text-slate-500 font-semibold">
                &copy; 2024 AetherLearn. All rights reserved.
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-455 dark:text-slate-500">
              <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-600 transition-colors">AI Ethics</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Support</a>
            </div>
          </footer>

        </div>

      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#f4f6fa] dark:bg-[#0b0f19] text-slate-905 dark:text-white flex overflow-hidden transition-colors duration-300">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:block w-68 bg-white dark:bg-[#0d1326] border-r border-[#eef2f6] dark:border-slate-850/60 p-6 h-full flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* ================= MOBILE DRAW OPEN BUTTON ================= */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SLIDING SIDEBAR ================= */}
      <aside className={`lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-[#0d1326] border-r border-[#eef2f6] dark:border-slate-800 p-6 z-50 transition-transform duration-300 transform ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-55 text-slate-500 dark:text-gray-400"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
        <SidebarContent />
      </aside>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <div className={`flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden`}>
        
        {/* ================= TOP HEADER ================= */}
        <header className="w-full bg-white dark:bg-[#0d1326] border-b border-[#eef2f6] dark:border-slate-855/60 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 text-left">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-650 dark:text-gray-400 hover:bg-slate-55 mr-1 flex-shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Center: Search input */}
          <div className="flex-grow flex justify-center max-w-xl mx-auto px-4">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, topics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-55/50 dark:bg-[#0b0f19] border border-slate-205 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-855 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all placeholder:text-slate-400 shadow-xs"
              />
            </div>
          </div>

          {/* Right: Theme, Notifications, Settings, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-gray-405 dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* stopwatch/timer icon for past-year view */}


            {/* Notification bell */}
            <button className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-gray-450 dark:hover:text-white transition-colors duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
            </button>

            {/* Settings Icon */}
            <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-gray-450 dark:hover:text-white transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>

            {/* Small Profile initials bubble or image */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0 flex items-center justify-center bg-[#253df5] ml-1">
              {getUserAvatar(user) ? (
                <img loading="lazy" src={getUserAvatar(user)} 
                  alt={user?.name || "Alex Rivers"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-black tracking-wider">
                  {getInitials(user?.name || 'ST')}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ================= MAIN DASHBOARD BODY ================= */}
        <main className={`flex-grow p-4 sm:p-6 lg:p-8 space-y-6 text-left w-full`}>
          
          {/* Card 1: Motivation & Progress Quote (Full Width) */}
          {activeNav === 'Dashboard' && (
            <>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {getFirstName(user?.name)}.
                </h1>
              </div>
              <div className="bg-white dark:bg-[#0d1326] rounded-3xl p-8 sm:p-10 border border-[#eef2f6] dark:border-slate-800/80 shadow-xs relative overflow-hidden flex flex-col justify-center text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-wider text-[#253df5] dark:text-[#7f7eff] bg-[#253df5]/10 dark:bg-[#1f1e4d] px-3.5 py-1.5 rounded-full font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LEARNING EFFICIENCY AT 94%</span>
              </span>
            </div>
            <div className="space-y-4 mt-6">
              <blockquote className="text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans tracking-tight max-w-4xl">
                "The mind is not a vessel to be filled, but a fire to be kindled."
              </blockquote>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                Your neural-adapted curriculum is ready. Continue your journey in Advanced Machine Learning.
              </p>
            </div>
          </div>

          {/* Card 2: Lead Professor (Full Width) */}
          <div className="bg-white dark:bg-[#0d1326] rounded-3xl p-5 sm:p-6 border border-[#eef2f6] dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 text-left">
            {/* Professor headshot */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex-shrink-0">
              <img loading="lazy" src={julianVanceProfile} 
                alt="Dr. Julian Vance" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Details */}
            <div className="space-y-1.5 flex-grow">
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wider text-[#253df5] dark:text-[#7f7eff] bg-[#253df5]/10 dark:bg-brand-950/40 px-2.5 py-1 rounded-md uppercase font-mono">
                  <Award className="w-3 h-3" />
                  <span>LEAD PROFESSOR</span>
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-none mt-1">
                Dr. Julian Vance
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-455">
                Lead Instructor, AI & Neural Networks
              </p>
              
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Office 402-B, Science Wing</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Available: Tue & Thu, 2 PM - 4 PM</span>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <button className="sm:ml-auto self-start sm:self-center px-5 py-2.5 rounded-xl border border-[#253df5]/30 hover:bg-[#253df5]/5 text-[#253df5] dark:text-brand-400 dark:border-brand-900/40 dark:hover:bg-brand-500/5 text-xs font-black tracking-wider shadow-xs transition-colors duration-250">
              CONTACT
            </button>
          </div>

          {/* Lower Grid (Latest Updates & Upcoming Assignments (Left) & Current Focus & Pending Quizzes (Right)) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ================= LEFT 2/3 COLUMN ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 3: Latest Updates */}
              <div className="bg-white dark:bg-[#0d1326] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-wide">
                    Latest Updates
                  </h3>
                  <a href="#" className="text-xs font-black text-[#253df5] dark:text-brand-400 hover:underline flex items-center gap-1">
                    <span>View all</span>
                    <ArrowRight size={12} />
                  </a>
                </div>

                {/* Updates List */}
                <div className="space-y-4">
                  {/* Update 1 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-[#eef2f6] dark:border-slate-850/60">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        New Module: Quantum Neural Networks
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        The highly anticipated module on QNNs is now available in your Advanced Curriculum track.
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono flex-shrink-0 ml-auto pt-0.5">
                      2H AGO
                    </span>
                  </div>

                  {/* Update 2 */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-[#eef2f6] dark:border-slate-850/60">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Weekly Performance Analysis Ready
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Your AI tutor has generated a comprehensive breakdown of your learning patterns and focus areas.
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono flex-shrink-0 ml-auto pt-0.5">
                      1D AGO
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Upcoming Assignments */}
              <div className="space-y-4 text-left">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-wide">
                  Upcoming Assignments
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-[#fff8f8] dark:bg-[#1c0f14] border border-[#ffebeb] dark:border-[#2e151e] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4 min-h-[140px]">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="inline-block text-[9px] font-black tracking-wider text-[#ef4444] dark:text-[#f87171] bg-[#fee2e2] dark:bg-[#3f1619] px-2.5 py-1 rounded font-mono uppercase">
                          HIGH PRIORITY
                        </span>
                        <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3.5">
                        Implement Transformer Logic
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#ef4444] dark:text-[#f87171] font-bold mt-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due in 14 hours</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#f4f7fd] dark:bg-[#0e1627] border border-[#e5edf9] dark:border-[#1e293b] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4 min-h-[140px]">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="inline-block text-[9px] font-black tracking-wider text-[#64748b] dark:text-[#94a3b8] bg-[#e2e8f0] dark:bg-[#1e293b] px-2.5 py-1 rounded font-mono uppercase">
                          STANDARD
                        </span>
                        {/* Mock Navigation Arrows matching layout */}
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold font-mono">&lt;</button>
                          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold font-mono">&gt;</button>
                        </div>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#253df5] dark:text-white mt-3.5">
                        Optimize Data Pipeline
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-[#94a3b8] font-semibold mt-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due Friday</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ================= RIGHT 1/3 COLUMN ================= */}
            <div className="lg:col-span-4 space-y-6">
              
                {/* Card 1: Current Focus */}
                <div className="bg-white dark:bg-[#0d1326] rounded-3xl p-6 border border-[#eef2f6] dark:border-slate-800/80 shadow-xs flex flex-col items-center gap-5 text-center">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white self-start tracking-wide">
                    Current Focus
                  </h3>

                  {/* Radial Progress Meter (78% Complete) */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background Circle */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="48" 
                        className="stroke-slate-100 dark:stroke-slate-800" 
                        strokeWidth="10" 
                        fill="none" 
                      />
                      {/* Active Circular Progress */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="48" 
                        className="stroke-[#253df5] dark:stroke-[#5e5df0]" 
                        strokeWidth="10" 
                        fill="none" 
                        strokeDasharray="301.6" 
                        strokeDashoffset={301.6 - (301.6 * 78) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Progress Text overlay */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        78%
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono mt-0.5">
                        COMPLETE
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Neural Networks 201
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-455">
                      Module 4: Backpropagation Deep Dive
                    </p>
                  </div>

                  <button className="w-full bg-[#253df5] hover:bg-[#1d2ae0] text-white py-3.5 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md shadow-brand-500/10">
                    Resume Session
                  </button>
                </div>

                {/* Card 2: Pending Quizzes */}
                <div className="bg-white dark:bg-[#0d1326] rounded-3xl p-6 border border-[#eef2f6] dark:border-slate-800/80 shadow-xs space-y-4 text-left">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">
                    Pending Quizzes
                  </h3>

                  <div className="space-y-3">
                    {/* Quiz Item 1 */}
                    <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#eef2f6] dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/30">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          CNN Architecture
                        </h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium mt-0.5">
                          15 mins • 10 Qs
                        </p>
                      </div>
                      <button className="ml-auto bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-300 px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-colors duration-200 shadow-xs">
                        Start
                      </button>
                    </div>

                    {/* Quiz Item 2 (Locked) */}
                    <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#eef2f6] dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/30 opacity-70">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500">
                          RNN Basics
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium mt-0.5">
                          Requires Module 5
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

            </div>

          </div>
            </>
          )}

          {/* ================= MY COURSES VIEW ================= */}
          {activeNav === 'My Courses' && (() => {
            const courses = [
              {
                id: 'aml',
                title: "Advanced Machine Learning",
                progress: 62,
                semester: "Semester 5",
                description: "Explore deep learning architectures, neural networks, and advanced predictive models. Study CNN operations, transformers, backpropagation, and optimization techniques to master state-of-the-art AI systems.",
                featured: true,
                image: circuitBoardImage,
                instructor: "Dr. Elena Vance",
                credits: 4,
                nextAssignment: "CNN Feature Mapping (June 10)"
              },
              {
                id: 'nlp',
                title: "Natural Language Processing",
                progress: 34,
                semester: "Semester 5",
                description: "Understand how machines process, interpret, and generate human language. Study tokenizer structures, word embeddings, attention mechanisms, and transformers for sequence modeling.",
                icon: Globe,
                instructor: "Dr. Priya Sharma",
                credits: 4,
                nextAssignment: "Attention Mechanisms Project (June 15)"
              },
              {
                id: 'distsys',
                title: "Distributed Systems",
                progress: 45,
                semester: "Semester 5",
                description: "Architect and design highly scalable, fault-tolerant network services, consistency protocols, and consensus algorithms. Study MapReduce models, Raft replication, and vector clocks in dynamic networks.",
                icon: Layers,
                instructor: "Prof. Marcus Brody",
                credits: 4,
                nextAssignment: "Raft Consensus (June 12)"
              },
              {
                id: 'dsa',
                title: "Data Structures & Algorithms",
                progress: 89,
                semester: "Semester 4",
                description: "Master the fundamental building blocks of efficient software design including graphs, trees, sorting, and dynamic programming. Analyze complexity bounds, recursive algorithms, and optimal data storage structures.",
                icon: Network,
                instructor: "Dr. Vikram Singh",
                credits: 4,
                nextAssignment: "Graph Flow Algorithms (Completed)"
              },
              {
                id: 'ai',
                title: "Artificial Intelligence",
                progress: 100,
                semester: "Semester 4",
                description: "A comprehensive introduction to search algorithms, state-space exploration, heuristics, and classical reasoning methods. Study search agents, game theory, constraint satisfaction, and logical inference frameworks.",
                icon: Bot,
                instructor: "Dr. Ananya Desai",
                credits: 3,
                nextAssignment: "Alpha-Beta Pruning Agent (Completed)"
              },
              {
                id: 'db',
                title: "Database Systems",
                progress: 100,
                semester: "Semester 3",
                description: "Learn the principles of relational databases, SQL queries, transaction isolation, indexing strategies, and data modeling. Explore B+ tree index execution, normal forms, and transaction logging systems.",
                icon: Database,
                instructor: "Prof. Sourav Roy",
                credits: 4,
                nextAssignment: "B+ Tree Indexing lab (Completed)"
              },
              {
                id: 'os',
                title: "Operating Systems",
                progress: 100,
                semester: "Semester 3",
                description: "Dive into process scheduling, virtual memory management, deadlock prevention, concurrency control, and system calls. Understand kernel space execution, thread synchronization, and file system layouts.",
                icon: Cpu,
                instructor: "Dr. Julian Vance",
                credits: 4,
                nextAssignment: "Kernel Thread Scheduler (Completed)"
              },
              {
                id: 'cn',
                title: "Computer Networks",
                progress: 100,
                semester: "Semester 2",
                description: "Discover the layers, routing protocols, sliding window mechanisms, congestion control, and socket programming APIs. Trace packet routing, TCP handshake mechanisms, and domain name resolution pipelines.",
                icon: Router,
                instructor: "Dr. Sarah Jenkins",
                credits: 3,
                nextAssignment: "TCP Socket Chat App (Completed)"
              },
              {
                id: 'compiler',
                title: "Compiler Design",
                progress: 12,
                semester: "Semester 5",
                description: "Study lexical analysis, parse tree generation, syntax-directed translation, semantic analysis, intermediate representation, and optimization. Implement scanners, parser engines, and assembly output generators.",
                icon: Scale,
                instructor: "Prof. Robert Chen",
                credits: 4,
                nextAssignment: "Lexer & Parser for Mini-C (June 20)"
              },
              {
                id: 'se',
                title: "Software Engineering",
                progress: 100,
                semester: "Semester 3",
                description: "Apply software engineering methodologies, design patterns, testing frameworks, CI/CD pipeline automation, and agile Scrum workflows. Master UML diagrams, refactoring patterns, and modular code construction.",
                icon: FileText,
                instructor: "Dr. Priya Sharma",
                credits: 3,
                nextAssignment: "Clean Architecture Design (Completed)"
              },
              {
                id: 'graphics',
                title: "Computer Graphics",
                progress: 78,
                semester: "Semester 4",
                description: "Learn 2D and 3D rendering pipelines, ray tracing foundations, OpenGL shader development, matrix transformations, and lighting models. Compute rasterization, shadows, textures, and camera projections.",
                icon: Sparkles,
                instructor: "Dr. Vikram Singh",
                credits: 3,
                nextAssignment: "Ray Tracing Reflections (June 18)"
              },
              {
                id: 'cyber',
                title: "Cyber Security & Cryptography",
                progress: 20,
                semester: "Semester 5",
                description: "Understand system threats, network security protocols, symmetric/asymmetric encryption, hash functions, and digital signatures. Examine network firewalls, penetration testing, RSA encryption, and key exchanges.",
                icon: Lock,
                instructor: "Prof. Clara Stone",
                credits: 4,
                nextAssignment: "RSA Key Exchange Hack (June 25)"
              },
              {
                id: 'eth',
                title: "AI Ethics",
                progress: 100,
                semester: "Semester 1",
                description: "Examine the moral implications and societal impact of artificial intelligence. Focus on model alignment, training dataset bias, public privacy protection, transparent explainability, and policy governance regulations.",
                icon: Scale,
                instructor: "Dr. Ananya Desai",
                credits: 2,
                nextAssignment: "Ethics in Generative AI Essay (Completed)"
              }
            ];

            const activeCount = courses.filter(c => c.progress < 100).length;

            const filteredCourses = courses.filter(course => {
              if (semesterFilter !== 'All' && course.semester !== semesterFilter) return false;
              if (courseFilter === 'Active' && course.progress === 100) return false;
              if (courseFilter === 'Completed' && course.progress < 100) return false;
              return true;
            });

            return (
              <div className="space-y-6 w-full text-left animate-fadeIn">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-extrabold text-slate-905 dark:text-white tracking-tight">My Learning Journey</h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Continue your mastery of advanced computing sciences.</p>
                  </div>

                  {/* Filters Row */}
                  <div className="flex flex-wrap items-center gap-3.5">
                    {/* Active / Completed pills */}
                    <div className="flex items-center bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-full border border-slate-205/60 dark:border-slate-800">
                      <button
                        onClick={() => setCourseFilter('Active')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                          courseFilter === 'Active'
                            ? 'bg-[#253df5] text-white shadow-xs'
                            : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Active ({activeCount})
                      </button>
                      <button
                        onClick={() => setCourseFilter('Completed')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                          courseFilter === 'Completed'
                            ? 'bg-[#253df5] text-white shadow-xs'
                            : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Completed
                      </button>
                    </div>

                    {/* Semester Selector Dropdown */}
                    <div className="relative">
                      <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer shadow-2xs"
                      >
                        <option value="All">All Semesters</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 1">Semester 1</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {filteredCourses.map((course) => {
                    if (course.featured) {
                      return (
                        <div 
                          key={course.id}
                          className="lg:col-span-2 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs flex flex-col sm:flex-row h-full"
                        >
                          {/* Left: Image with badge overlay */}
                          <div className="relative w-full sm:w-[32%] h-48 sm:h-auto flex-shrink-0">
                            <img loading="lazy" src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-4 left-4 bg-white/90 dark:bg-[#0d1326]/90 text-[#253df5] dark:text-brand-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-2xs">
                              {course.semester}
                            </span>
                          </div>
                          
                          {/* Right: Course Details */}
                          <div className="p-6 flex flex-col justify-between flex-grow text-left">
                            <div className="space-y-2">
                              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                                {course.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                {course.description}
                              </p>
                            </div>

                            <div className="space-y-4 mt-6">
                              {/* Progress bar info */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-slate-450 dark:text-slate-400">Progress</span>
                                  <span className="text-[#253df5] dark:text-brand-400">{course.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#253df5] rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                              {/* Continue button */}
                              <button 
                                onClick={() => setSelectedCourse(course)}
                                className="w-full sm:w-auto bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-xl transition-all duration-200 tracking-wider"
                              >
                                Continue Learning
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Standard Course Card
                      return (
                        <div 
                          key={course.id}
                          className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between text-left"
                        >
                          {/* Top row: Icon and Semester */}
                          <div className="flex justify-between items-start">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 flex items-center justify-center flex-shrink-0">
                              <course.icon size={18} className="text-[#253df5] dark:text-brand-400" />
                            </div>
                            <span className="bg-[#f1f5f9] dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              {course.semester}
                            </span>
                          </div>

                          {/* Course Title and Description */}
                          <div className="space-y-1 mt-3 flex-grow">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                              {course.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-505 dark:text-slate-400 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          {/* Progress bar & Action button */}
                          <div className="space-y-3 mt-4">
                            {/* Progress bar info */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-slate-455 dark:text-slate-400">Progress</span>
                                <span className="text-[#253df5] dark:text-brand-400">{course.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#253df5] rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Action button */}
                            {course.progress < 100 ? (
                              <button 
                                onClick={() => setSelectedCourse(course)}
                                className="w-full bg-white dark:bg-[#0d1326] border border-[#253df5] dark:border-brand-400/50 text-[#253df5] dark:text-brand-400 text-xs font-extrabold py-2.5 rounded-xl transition-all duration-200 tracking-wider text-center hover:bg-[#253df5] hover:text-white dark:hover:bg-brand-400 dark:hover:text-[#0d1326]"
                              >
                                Continue Learning
                              </button>
                            ) : (
                              <button 
                                onClick={() => setSelectedCourse(course)}
                                className="w-full bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold py-2.5 rounded-xl transition-all duration-200 tracking-wider text-center hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              >
                                Review Materials
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })()}


                    {/* ================= INSIGHTS VIEW ================= */}
          {activeNav === 'Insights' && (() => {
            // Simulated PowerBI-style data
            const subjectStats = {
              "All Subjects": { rank: "12th / 150", marks: "85%", hours: "42h", pie: [40, 35, 15, 10] },
              "Machine Learning": { rank: "5th / 150", marks: "92%", hours: "15h", pie: [50, 20, 20, 10] },
              "Neural Networks": { rank: "18th / 150", marks: "78%", hours: "12h", pie: [30, 45, 15, 10] },
              "Data Science": { rank: "8th / 150", marks: "89%", hours: "15h", pie: [35, 35, 20, 10] }
            };
            const selectedSubjectData = subjectStats[selectedSubject] || subjectStats["All Subjects"];
            const [pLectures, pPractice, pRevision, pQuiz] = selectedSubjectData.pie;
            
            // Pie chart calculations (approximate SVG paths for visual representation)
            const createPieSlice = (startPercent, percent, color) => {
              const startAngle = (startPercent * 3.6) - 90;
              const endAngle = ((startPercent + percent) * 3.6) - 90;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              const largeArcFlag = percent > 50 ? 1 : 0;
              return <path d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`} fill={color} />;
            };

            return (
              <div className="space-y-6 w-full text-left animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-205 dark:border-slate-800">
                  <div className="space-y-2.5 text-left max-w-3xl">
                    <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                      Performance Insights
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Track your mastery and optimize your learning path with PowerBI-style analytics.
                    </p>
                  </div>

                  {/* Header Action Buttons */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select 
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="All Subjects">All Subjects</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Neural Networks">Neural Networks</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-2xl text-xs font-extrabold hover:bg-brand-700 transition-colors shadow-xs" onClick={() => alert('Downloading CSV...')}>
                      <FileText size={14} />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Rank KPI */}
                  <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Award size={48} className="text-brand-500" />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Class Rank</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedSubjectData.rank}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <TrendingUp size={14} />
                      <span>Top 10%</span>
                    </div>
                  </div>

                  {/* Marks KPI */}
                  <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Target size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Overall Score</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedSubjectData.marks}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                      <BarChart2 size={14} />
                      <span>Based on assignments & quizzes</span>
                    </div>
                  </div>

                  {/* Hours KPI */}
                  <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Clock size={48} className="text-purple-500" />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Focus Hours</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedSubjectData.hours}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <TrendingUp size={14} />
                      <span>+2h this week</span>
                    </div>
                  </div>
                </div>

                {/* Main Grid: Left Column (60%), Right Column (40%) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  
                  {/* Skill Balancing Radar Card */}
                  <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-105 dark:border-slate-850 pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#253df5]/10 text-[#253df5] flex items-center justify-center">
                            <Target size={12} />
                          </span>
                          Skill Balancing Radar
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1">
                          Visualizing mastery across core disciplines.
                        </p>
                      </div>
                      <span className="text-[9px] font-black text-[#253df5] bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {selectedSubject}
                      </span>
                    </div>

                    <div className="flex justify-center py-4 bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl h-64 items-center">
                      {/* Original Radar Code Integrated here */}
                      {(() => {
                        const cx = 200;
                        const cy = 125;
                        const rMax = 80;
                        const categories = [
                          { name: 'Theory', value: selectedSubject === 'Machine Learning' ? 0.9 : 0.8, xLabel: 200, yLabel: 30 },
                          { name: 'Application', value: selectedSubject === 'Neural Networks' ? 0.85 : 0.76, xLabel: 320, yLabel: 120 },
                          { name: 'Analysis', value: 0.94, xLabel: 275, yLabel: 215 },
                          { name: 'Coding', value: selectedSubject === 'Data Science' ? 0.9 : 0.7, xLabel: 125, yLabel: 215 },
                          { name: 'Optimization', value: 0.6, xLabel: 80, yLabel: 120 }
                        ];
                        
                        const getPt = (i, r) => {
                          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                        };
                        
                        const rings = [20, 40, 60, 80];
                        const valPoints = categories.map((cat, i) => getPt(i, rMax * cat.value)).join(' ');

                        return (
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 250">
                            {rings.map((r, ri) => (
                              <polygon key={ri} points={Array.from({ length: 5 }, (_, i) => getPt(i, r)).join(' ')} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1.5" />
                            ))}
                            {Array.from({ length: 5 }).map((_, i) => (
                              <line key={i} x1={cx} y1={cy} x2={getPt(i, rMax).split(',')[0]} y2={getPt(i, rMax).split(',')[1]} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1.5" />
                            ))}
                            <polygon points={valPoints} fill="rgba(37, 61, 245, 0.15)" stroke="#253df5" strokeWidth="2.5" />
                            {categories.map((cat, i) => (
                              <circle key={i} cx={getPt(i, rMax * cat.value).split(',')[0]} cy={getPt(i, rMax * cat.value).split(',')[1]} r="4" fill="#253df5" stroke="white" strokeWidth="1.5" />
                            ))}
                            {categories.map((cat, i) => (
                              <text key={i} x={cat.xLabel} y={cat.yLabel} textAnchor={i === 0 ? 'middle' : (i === 1 || i === 2) ? 'start' : 'end'} className="text-[9px] font-black fill-slate-500 dark:fill-slate-400 uppercase tracking-wide">
                                {cat.name}
                              </text>
                            ))}
                          </svg>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Focus Period Pie Chart Card */}
                  <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-105 dark:border-slate-850 pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Clock size={12} />
                          </span>
                          Focus Period Breakdown
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1">
                          Distribution of study time for {selectedSubject}.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-center py-4 gap-8">
                      {/* SVG Pie Chart */}
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 rounded-full">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-slate-100 dark:text-slate-800" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray={`${pLectures * 2.51} 251`} strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray={`${pPractice * 2.51} 251`} strokeDashoffset={`-${pLectures * 2.51}`} />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray={`${pRevision * 2.51} 251`} strokeDashoffset={`-${(pLectures + pPractice) * 2.51}`} />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray={`${pQuiz * 2.51} 251`} strokeDashoffset={`-${(pLectures + pPractice + pRevision) * 2.51}`} />
                        </svg>
                        {/* Center Hole for Doughnut Look */}
                        <div className="absolute inset-0 m-auto w-24 h-24 bg-white dark:bg-[#0d1326] rounded-full flex items-center justify-center shadow-inner">
                          <div className="text-center">
                            <span className="text-xl font-black text-slate-900 dark:text-white block">{selectedSubjectData.hours}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total</span>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-col gap-3 justify-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lectures ({pLectures}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Practice ({pPractice}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Revision ({pRevision}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quizzes ({pQuiz}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Mastery Trend Card */}
                <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-105 dark:border-slate-850 pb-3 text-left">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <TrendingUp size={12} />
                      </span>
                      Subject-wise Mastery Trend
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">
                      Tracking progress against syllabus goals over the current semester.
                    </p>
                  </div>

                  <div className="pt-2">
                    <svg className="w-full h-52 overflow-visible" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#253df5" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#253df5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {[0, 1, 2, 3].map((i) => (
                        <line key={i} x1="30" y1={30 + i * 45} x2="470" y2={30 + i * 45} stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />
                      ))}
                      <path d="M 30,150 Q 130,140 240,110 T 470,60 L 470,170 L 30,170 Z" fill="url(#chart-grad)" />
                      <path d="M 30,150 Q 130,145 240,130 T 470,100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="opacity-50" />
                      <path d={selectedSubject === 'Machine Learning' ? "M 30,150 Q 130,110 240,90 T 470,30" : "M 30,150 Q 130,140 240,110 T 470,60"} fill="none" stroke="#253df5" strokeWidth="3.5" strokeLinecap="round" />
                      
                      {['Week 1', 'Week 4', 'Week 8', 'Week 12', 'Week 16'].map((label, idx) => (
                        <text key={idx} x={30 + idx * 110} y="190" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-wider font-mono">
                          {label}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}

{/* ================= SETTINGS VIEW ================= */}
          {activeNav === 'Settings' && (() => {
            const handleSaveSettings = (e) => {
              e.preventDefault();
              if (isSavingSettings) return;
              setIsSavingSettings(true);
              setTimeout(() => {
                setIsSavingSettings(false);
                setSettingsSavedFeedback(true);
                setTimeout(() => setSettingsSavedFeedback(false), 3000);
              }, 1200);
            };

            const handleSaveConnectivity = async (e) => {
              e.preventDefault();
              if (isSavingSettings) return;
              setIsSavingSettings(true);
              try {
                const response = await fetch('http://localhost:8000/users/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    telegram_id: formTelegram || null,
                    gmail: formGmail || null,
                    phone_number: formPhone || null
                  })
                });
                if (response.ok) {
                  setSettingsSavedFeedback(true);
                  setTimeout(() => setSettingsSavedFeedback(false), 3000);
                }
              } catch (error) {
                console.error("Failed to update connectivity", error);
              } finally {
                setIsSavingSettings(false);
              }
            };

            return (
              <div className="space-y-6 w-full text-left animate-fadeIn">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-extrabold text-slate-905 dark:text-white tracking-tight">Account & Preferences</h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Manage your profile details, notification options, and security settings.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-full border border-slate-205/60 dark:border-slate-800">
                    {['Profile', 'Connectivity', 'Preferences', 'Security', 'Contact Support'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSettingsTab(tab)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                          settingsTab === tab
                            ? 'bg-[#253df5] text-white shadow-xs'
                            : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  
                  {/* Left panel: Form details (Featured 2-column card) */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                    
                    {settingsTab === 'Profile' && (
                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                          <User className="w-5 h-5 text-[#253df5]" />
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Personal Information</h3>
                        </div>

                        <div className="flex items-center gap-6 mb-6">
                          <div className="relative group">
                            <img 
                              src={getUserAvatar(user) || "https://ui-avatars.com/api/?name="+formName} 
                              alt="Profile" 
                              className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-sm"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                              <Camera className="w-6 h-6" />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setProfileImage(URL.createObjectURL(e.target.files[0]));
                                  }
                                }} 
                              />
                            </label>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{formName}</h4>
                            <p className="text-xs text-slate-500">{formEmail}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Name Input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                            <div className="relative">
                              <input 
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                            </div>
                          </div>

                          {/* Email Input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                              <input 
                                type="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                            </div>
                          </div>

                          {/* Academic Institution */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">Academic Institution</label>
                            <div className="relative">
                              <input 
                                type="text"
                                value={formInstitution}
                                onChange={(e) => setFormInstitution(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                            </div>
                          </div>

                          {/* City & State location details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">City</label>
                              <input 
                                type="text"
                                value={formCity}
                                onChange={(e) => setFormCity(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">State</label>
                              <input 
                                type="text"
                                value={formState}
                                onChange={(e) => setFormState(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit Row */}
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3.5 px-6 rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-2 min-w-[130px] disabled:opacity-50"
                          >
                            {isSavingSettings ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Saving...</span>
                              </>
                            ) : settingsSavedFeedback ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Changes Saved!</span>
                              </>
                            ) : (
                              <span>Save Changes</span>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {settingsTab === 'Connectivity' && (
                      <form onSubmit={handleSaveConnectivity} className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                          <Network className="w-5 h-5 text-[#253df5]" />
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Connectivity & Integrations</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          {/* Telegram Input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wide">Telegram Username</label>
                            <div className="relative">
                              <input 
                                type="text"
                                value={formTelegram}
                                onChange={(e) => setFormTelegram(e.target.value)}
                                placeholder="@username"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                              <div className="absolute right-4 top-3.5">
                                {formTelegram ? (
                                  <div className="flex items-center gap-1.5 bg-[#e6fffa] dark:bg-[#113a36] text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    <Check className="w-3 h-3" /> Connected
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    Pending
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Gmail Input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">Contact Gmail</label>
                            <div className="relative">
                              <input 
                                type="email"
                                value={formGmail}
                                onChange={(e) => setFormGmail(e.target.value)}
                                placeholder="Contact Gmail address"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                              <div className="absolute right-4 top-3.5">
                                {formGmail ? (
                                  <div className="flex items-center gap-1.5 bg-[#e6fffa] dark:bg-[#113a36] text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    <Check className="w-3 h-3" /> Connected
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    Pending
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Phone Number Input */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">Phone Number</label>
                            <div className="relative">
                              <input 
                                type="text"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                              />
                              <div className="absolute right-4 top-3.5">
                                {formPhone ? (
                                  <div className="flex items-center gap-1.5 bg-[#e6fffa] dark:bg-[#113a36] text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    <Check className="w-3 h-3" /> Connected
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    Pending
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Row */}
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3.5 px-6 rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-2 min-w-[130px] disabled:opacity-50"
                          >
                            {isSavingSettings ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Saving...</span>
                              </>
                            ) : settingsSavedFeedback ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Changes Saved!</span>
                              </>
                            ) : (
                              <span>Save Changes</span>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {settingsTab === 'Preferences' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-855">
                          <Sliders className="w-5 h-5 text-[#253df5]" />
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Learning Preferences</h3>
                        </div>

                        <div className="space-y-5">
                          {/* Toggle 1 */}
                          <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-[#0b0f19]/40 border border-[#eef2f6] dark:border-slate-800/80 rounded-2xl">
                            <div className="space-y-0.5 text-left max-w-[80%]">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Daily Focus Mode Goals</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive automated adaptive alerts when your learning efficiency peaks.</p>
                            </div>
                            <button 
                              onClick={() => setToggleDailyGoals(!toggleDailyGoals)}
                              className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 flex ${
                                toggleDailyGoals ? 'bg-[#253df5] justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                              }`}
                            >
                              <span className="w-5 h-5 bg-white rounded-full shadow-xs" />
                            </button>
                          </div>

                          {/* Toggle 2 */}
                          <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-[#0b0f19]/40 border border-[#eef2f6] dark:border-slate-800/80 rounded-2xl">
                            <div className="space-y-0.5 text-left max-w-[80%]">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Weekly Progress Reports</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Get detailed neural telemetry breakdowns and learning analytics directly in your inbox.</p>
                            </div>
                            <button 
                              onClick={() => setToggleEmailSummaries(!toggleEmailSummaries)}
                              className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 flex ${
                                toggleEmailSummaries ? 'bg-[#253df5] justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                              }`}
                            >
                              <span className="w-5 h-5 bg-white rounded-full shadow-xs" />
                            </button>
                          </div>

                          {/* Toggle 3 */}
                          <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-[#0b0f19]/40 border border-[#eef2f6] dark:border-slate-800/80 rounded-2xl">
                            <div className="space-y-0.5 text-left max-w-[80%]">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Tutor Audio Feedback</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Enable natural language voice synthesizers during interactive chat sessions.</p>
                            </div>
                            <button 
                              onClick={() => setToggleAdaptiveVoice(!toggleAdaptiveVoice)}
                              className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 flex ${
                                toggleAdaptiveVoice ? 'bg-[#253df5] justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                              }`}
                            >
                              <span className="w-5 h-5 bg-white rounded-full shadow-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    
                    {settingsTab === 'Contact Support' && (
                      <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); setTimeout(() => { setContactSent(false); setContactMessage(''); }, 3000); }} className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                          <Mail className="w-5 h-5 text-[#253df5]" />
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Contact Overseer</h3>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wide">Message</label>
                          <textarea 
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="How can we help you?"
                            rows={5}
                            className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                            required
                          />
                        </div>
                        <button type="submit" className="flex items-center gap-2 bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-2xl transition-all duration-200 tracking-wider w-fit">
                          {contactSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                          {contactSent ? "Message Sent" : "Send Message"}
                        </button>
                      </form>
                    )}

                    {settingsTab === 'Security' && (
                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                          <Lock className="w-5 h-5 text-[#253df5]" />
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Security & Credentials</h3>
                        </div>

                        <div className="space-y-4 max-w-md">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wide">Current Password</label>
                            <input 
                              type="password"
                              placeholder="••••••••••••"
                              className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">New Password</label>
                            <input 
                              type="password"
                              placeholder="Min 8 characters"
                              className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wide">Confirm New Password</label>
                            <input 
                              type="password"
                              placeholder="Confirm password"
                              className="w-full pl-4 pr-4 py-3 bg-slate-50/50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#253df5] focus:border-[#253df5] transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-855">
                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3.5 px-6 rounded-xl transition-all duration-200 tracking-wider flex items-center justify-center gap-2 min-w-[135px]"
                          >
                            {isSavingSettings ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Updating...</span>
                              </>
                            ) : settingsSavedFeedback ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Password Updated!</span>
                              </>
                            ) : (
                              <span>Update Password</span>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                  </div>

                  {/* Right panel: Details/Status cards (1-column layout) */}
                  <div className="lg:col-span-1 space-y-6">
                    
                    {/* Card 1: Academic Track Details */}
                    <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={18} className="text-[#253df5] dark:text-brand-400" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                            Academic Track
                          </h4>
                          <span className="text-[10px] font-bold text-slate-455 dark:text-slate-505 font-mono tracking-wider block mt-0.5">
                            PATH DETAILS
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-2">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {user?.role === 'Mentor' ? 'Lead Instructor Path' : 'AI Researcher Path'}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                          Your learning track is dynamically paced and neural-adapted for advanced computing sciences.
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Security Health Check */}
                    <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#e6fffa] dark:bg-[#113a36] text-emerald-600 dark:text-emerald-455 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                            Security Health
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-450 font-mono tracking-wider block mt-0.5">
                            100% SECURED
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mt-2">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-455">
                            <span>Security Strength</span>
                            <span className="text-emerald-600 dark:text-emerald-450">Strong</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-full" />
                          </div>
                        </div>

                        <button className="w-full bg-white dark:bg-slate-900 border border-slate-200 hover:border-slate-350 dark:border-slate-800 text-slate-705 dark:text-slate-300 text-xs font-bold py-2.5 rounded-xl transition-all duration-200 tracking-wide text-center">
                          Configure MFA
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Session Status */}
                    <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                          <Sliders size={18} className="text-[#253df5] dark:text-brand-400" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                            Active Session
                          </h4>
                          <span className="text-[10px] font-bold text-slate-455 dark:text-slate-505 font-mono tracking-wider block mt-0.5">
                            CURRENT LOGIN
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-bold text-slate-808 dark:text-slate-200">{formCity}, {formState}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Role:</span>
                          <span className="font-bold text-slate-808 dark:text-slate-200">{user?.role || 'Student'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IP Address:</span>
                          <span className="font-mono text-slate-450 dark:text-slate-500">192.168.1.104</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* ================= ASSIGNMENTS VIEW ================= */}
          {activeNav === 'Assignments' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-205 dark:border-slate-800">
                <div className="space-y-2.5 text-left max-w-3xl">
                  <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                    Assignments & Tasks
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    Track your deliverables, due dates, grading rubrics, and project submissions.
                  </p>
                </div>
              </div>

              {/* Assignments Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: UPCOMING ASSIGNMENTS (7 cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                  <div className="space-y-4 w-full">
                    <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                      <h3 className="font-extrabold text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Active & Upcoming
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: "Implement Transformer Logic", course: "Natural Language Processing", priority: "HIGH PRIORITY", type: "Programming Lab", due: "14 hours left", priorityClass: "text-[#ef4444] bg-[#fee2e2] dark:bg-[#3f1619]" },
                        { title: "Optimize Data Pipeline", course: "Advanced Machine Learning", priority: "STANDARD", type: "Performance Lab", due: "Due Friday", priorityClass: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
                        { title: "CNN Feature Mapping", course: "Advanced Machine Learning", priority: "STANDARD", type: "Written Assignment", due: "Due June 10", priorityClass: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-[#eef2f6] dark:border-slate-850/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block text-[8px] font-black tracking-wider px-2 py-0.5 rounded font-mono uppercase ${item.priorityClass}`}>
                                {item.priority}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase">
                                {item.course}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {item.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans whitespace-nowrap">
                              {item.due}
                            </span>
                            <button className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-[11px] font-black py-2.5 px-4 rounded-xl transition-all duration-200 tracking-wider">
                              Submit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: GRADING & COMPLETED (5 cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left space-y-6">
                  <div className="space-y-4 w-full">
                    <div className="text-left border-b border-slate-100 dark:border-slate-850 pb-3">
                      <h3 className="font-extrabold text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Graded & Completed
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: "Graph Flow Algorithms", score: "100/100", date: "Oct 20", course: "DSA" },
                        { title: "B+ Tree Indexing lab", score: "95/100", date: "Oct 12", course: "Database Systems" },
                        { title: "TCP Socket Chat App", score: "90/100", date: "Oct 02", course: "Computer Networks" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 rounded-2xl border border-[#eef2f6]/50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10">
                          <div className="truncate pr-4">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block">
                              {item.course} • Graded on {item.date}
                            </span>
                            <h4 className="text-xs font-bold text-slate-905 dark:text-white truncate mt-0.5">
                              {item.title}
                            </h4>
                          </div>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-450 whitespace-nowrap">
                            {item.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

                    {/* ================= DISCUSSIONS VIEW ================= */}
          {activeNav === 'Discussions' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-205 dark:border-slate-800">
                <div className="space-y-2.5 text-left max-w-3xl">
                  <h1 className="text-2xl sm:text-3.5xl font-black text-slate-909 dark:text-white tracking-tight leading-none">
                    Communication Hub
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    AetherLearn partners with secure, encrypted messaging platforms. Connect with your class or mentor instantly.
                  </p>
                </div>
              </div>

              {/* Discussions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Telegram Class Group */}
                <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-8 shadow-xs flex flex-col justify-between text-left space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MessageSquare size={120} className="text-[#0088cc]" />
                  </div>
                  <div className="space-y-4 w-full relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center mb-6">
                      <MessageSquare className="text-[#0088cc] w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                      Class Telegram Group
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Join the official Fall cohort Telegram group. Ask questions, share resources, and collaborate with peers in a secure, end-to-end encrypted channel.
                    </p>
                    <ul className="text-xs font-bold text-slate-450 dark:text-slate-500 space-y-2 mt-4">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> Real-time peer support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> Pinned announcements
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> End-to-end encrypted
                      </li>
                    </ul>
                  </div>
                  <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <a href="https://telegram.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-black py-3 px-6 rounded-xl transition-all duration-200 tracking-wider w-full justify-center">
                      Open Telegram Group <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {/* 1-on-1 Mentor Slack/Telegram */}
                <div className="bg-white dark:bg-[#0d1326] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-8 shadow-xs flex flex-col justify-between text-left space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star size={120} className="text-brand-500" />
                  </div>
                  <div className="space-y-4 w-full relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
                      <MessageSquare className="text-brand-500 w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                      1-on-1 Mentor Chat
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Need direct help with an assignment? Message your assigned mentor directly on Telegram. Private, secure, and fast.
                    </p>
                    <ul className="text-xs font-bold text-slate-450 dark:text-slate-500 space-y-2 mt-4">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> Private code reviews
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> Career advice
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-500" /> Direct feedback
                      </li>
                    </ul>
                  </div>
                  <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <a href="https://telegram.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black py-3 px-6 rounded-xl transition-all duration-200 tracking-wider w-full justify-center">
                      Message Mentor <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* ================= DASHBOARD FOOTER ================= */}
        <footer className="w-full mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-[#eef2f6] dark:border-slate-855/20 bg-white dark:bg-[#0b0f19] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 text-left">
            <span className="text-sm font-black tracking-wider text-[#253df5] dark:text-white">
              AetherLearn
            </span>
            <span className="text-xs text-slate-455 dark:text-slate-500">
              &copy; 2024 AetherLearn. Intelligence evolved.
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-455 dark:text-slate-500">
            <a href="#" className="hover:text-brand-600 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-brand-600 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-brand-600 transition-colors duration-200">AI Ethics</a>
            <a href="#" className="hover:text-brand-600 transition-colors duration-200">Support</a>
          </div>
        </footer>

      </div>

    </div>
  );
}
