import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Award, TrendingUp, FileText, Calendar, Settings, 
  HelpCircle, LogOut, Bell, ChevronDown, ChevronRight, ArrowRight, User, 
  Check, Search, Sliders, Sun, Moon, Zap, Plus, MessageSquare, Download, 
  BookOpen, Play, AlertCircle, AlertTriangle, Send, RefreshCw, X, Star,
  CheckCircle, Clock, BarChart2, Sparkles, Camera, Mail, Network
} from 'lucide-react';

import alexRiversProfile from '../assets/alex_rivers_profile.png';
import sarahProfile from '../assets/sarah_profile.png';
import priyaSharmaProfile from '../assets/priya_sharma_profile.png';
import vikramSinghProfile from '../assets/vikram_singh_profile.png';
import ananyaDesaiProfile from '../assets/ananya_desai_profile.png';

// Helper to format date YYYY-MM-DD to e.g., "Jun 11"
function formatCalendarDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 'Select Date';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
}

// Helper to check if a scheduled event date matches the selected calendar date YYYY-MM-DD
function calendarMatchesDate(eventDateStr, calendarDateStr) {
  if (!calendarDateStr || !eventDateStr) return false;
  
  const selectedDate = new Date(calendarDateStr + 'T00:00:00');
  if (isNaN(selectedDate.getTime())) return false;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();
  
  const monthName = monthNames[month];
  const shortMonthName = shortMonthNames[month];
  
  const eventLower = eventDateStr.toLowerCase();
  
  const dayStr = String(day);
  const dayPadded = String(day).padStart(2, '0');
  const monthNum = String(month + 1);
  const monthNumPadded = String(month + 1).padStart(2, '0');
  
  // Direct matches on month + day names
  if (eventLower.includes(`${monthName.toLowerCase()} ${dayStr}`) ||
      eventLower.includes(`${shortMonthName.toLowerCase()} ${dayStr}`) ||
      eventLower.includes(`${monthName.toLowerCase()} ${dayPadded}`) ||
      eventLower.includes(`${shortMonthName.toLowerCase()} ${dayPadded}`) ||
      eventLower.includes(`${dayStr} ${monthName.toLowerCase()}`) ||
      eventLower.includes(`${dayStr} ${shortMonthName.toLowerCase()}`) ||
      eventLower.includes(`${dayPadded} ${monthName.toLowerCase()}`) ||
      eventLower.includes(`${dayPadded} ${shortMonthName.toLowerCase()}`)) {
    return true;
  }
  
  // Check relative terms Today and Tomorrow
  // The system's "Today" is 2026-06-09
  if (calendarDateStr === '2026-06-09' && eventLower.includes('today')) {
    return true;
  }
  if (calendarDateStr === '2026-06-10' && eventLower.includes('tomorrow')) {
    return true;
  }
  
  // Standard format matching
  if (eventLower.includes(calendarDateStr)) {
    return true;
  }
  
  const usFormat = `${monthNum}/${dayStr}`;
  const usFormatPadded = `${monthNumPadded}/${dayPadded}`;
  if (eventLower.includes(usFormat) || eventLower.includes(usFormatPadded)) {
    return true;
  }
  
  return false;
}

// Helper to combine date picker (YYYY-MM-DD) and time picker (HH:MM) to string
function combineDateTimeString(dateStr, timeStr) {
  if (!dateStr) return '';
  
  const dateParts = dateStr.split('-');
  const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;
  
  let formattedTime = '';
  if (timeStr) {
    const timeParts = timeStr.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    formattedTime = `, ${hours}:${minutes} ${ampm}`;
  }
  
  if (dateStr === '2026-06-09') {
    return `Today${formattedTime}`;
  } else if (dateStr === '2026-06-10') {
    return `Tomorrow${formattedTime}`;
  }
  
  return `${formattedDate}${formattedTime}`;
}

export default function MentorDashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedCohort, setSelectedCohort] = useState('Advanced Calculus - Sec A');
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingCohort, setIsCreatingCohort] = useState(false);
  
  // Settings & Connectivity State
  const [formName, setFormName] = useState(user?.name || 'Lead Educator');
  const [formEmail, setFormEmail] = useState(user?.email || 'educator@aetherlearn.com');
  const [profileImage, setProfileImage] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  const [formTelegram, setFormTelegram] = useState(user?.telegram_id || '');
  const [formGmail, setFormGmail] = useState(user?.gmail || '');
  const [formPhone, setFormPhone] = useState(user?.phone_number || '');

  // Institutional Integrations State
  const [mentorIntegrations, setMentorIntegrations] = useState([]);
  const [mentorSyncingId, setMentorSyncingId] = useState(null);

  const fetchMentorIntegrations = async () => {
    try {
      const res = await fetch('http://localhost:8000/integrations/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMentorIntegrations(data);
      }
    } catch (e) {
      console.error('Failed to fetch integrations for mentor', e);
    }
  };

  useEffect(() => {
    fetchMentorIntegrations();
  }, []);
  
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

  // Cohort details mock database with 200-mark assessment scheme
  // (Major: 70, Minor: 30, Project: 50, Report: 30, Viva: 20 = 200 Total)
  const cohortsList = {
    'Advanced Calculus - Sec A': {
      subject: 'Advanced Calculus',
      section: 'Sec A',
      studentsCount: 42,
      averageMastery: 78,
      masteryTrend: '+2.4%',
      activeModule: 'Module 4: Quantum Mechanics',
      alertRate: '15%',
      alerts: 3,
      students: [
        { 
          id: '25mca016', 
          name: 'Ananya Iyer', 
          grade: 62, 
          stress: 'High', 
          engagement: 'Low', 
          avatar: ananyaDesaiProfile,
          assessment: { major: 42, minor: 18, project: 32, report: 19, viva: 13, weekly: [62, 60, 65, 59, 64] }
        },
        { 
          id: '25mca042', 
          name: 'Arjun Mehta', 
          grade: 71, 
          stress: 'Medium', 
          engagement: 'Medium', 
          avatar: null,
          assessment: { major: 51, minor: 22, project: 38, report: 20, viva: 14, weekly: [70, 72, 69, 74, 71] }
        },
        { 
          id: '25mca109', 
          name: 'Rohan Das', 
          grade: 58, 
          stress: 'High', 
          engagement: 'Low', 
          avatar: null,
          assessment: { major: 39, minor: 16, project: 30, report: 18, viva: 11, weekly: [56, 58, 60, 54, 58] }
        },
        { 
          id: '25mca005', 
          name: 'Alex Rivers', 
          grade: 89, 
          stress: 'Low', 
          engagement: 'High', 
          avatar: alexRiversProfile,
          assessment: { major: 64, minor: 27, project: 45, report: 26, viva: 18, weekly: [86, 88, 90, 89, 92] }
        },
        { 
          id: '25mca088', 
          name: 'Priya Sharma', 
          grade: 94, 
          stress: 'Low', 
          engagement: 'High', 
          avatar: priyaSharmaProfile,
          assessment: { major: 68, minor: 29, project: 48, report: 28, viva: 19, weekly: [92, 95, 94, 96, 98] }
        }
      ]
    },
    'Linear Algebra - Sec B': {
      subject: 'Linear Algebra',
      section: 'Sec B',
      studentsCount: 35,
      averageMastery: 82,
      masteryTrend: '+1.8%',
      activeModule: 'Module 3: Vector Spaces',
      alertRate: '8%',
      alerts: 1,
      students: [
        { 
          id: '25mla002', 
          name: 'Sarah Jenkins', 
          grade: 88, 
          stress: 'Low', 
          engagement: 'High', 
          avatar: sarahProfile,
          assessment: { major: 63, minor: 26, project: 44, report: 25, viva: 18, weekly: [85, 87, 89, 91, 88] }
        },
        { 
          id: '25mla015', 
          name: 'Vikram Singh', 
          grade: 79, 
          stress: 'Medium', 
          engagement: 'Medium', 
          avatar: vikramSinghProfile,
          assessment: { major: 55, minor: 23, project: 40, report: 23, viva: 15, weekly: [76, 78, 80, 79, 81] }
        },
        { 
          id: '25mla094', 
          name: 'Meera Patel', 
          grade: 64, 
          stress: 'High', 
          engagement: 'Medium', 
          avatar: null,
          assessment: { major: 44, minor: 19, project: 33, report: 19, viva: 13, weekly: [62, 64, 66, 63, 65] }
        }
      ]
    },
    'Physics 101 - Sec A': {
      subject: 'Physics 101',
      section: 'Sec A',
      studentsCount: 50,
      averageMastery: 74,
      masteryTrend: '-0.5%',
      activeModule: 'Module 3: Thermodynamics',
      alertRate: '22%',
      alerts: 4,
      students: [
        { 
          id: '25phy004', 
          name: 'Arjun Mehta', 
          grade: 54, 
          stress: 'High', 
          engagement: 'Low', 
          avatar: null,
          assessment: { major: 36, minor: 15, project: 28, report: 16, viva: 10, weekly: [52, 54, 56, 53, 55] }
        },
        { 
          id: '25phy019', 
          name: 'Kunal Sen', 
          grade: 76, 
          stress: 'Medium', 
          engagement: 'Medium', 
          avatar: null,
          assessment: { major: 53, minor: 22, project: 38, report: 22, viva: 15, weekly: [74, 76, 78, 75, 77] }
        },
        { 
          id: '25phy055', 
          name: 'Diya Roy', 
          grade: 91, 
          stress: 'Low', 
          engagement: 'High', 
          avatar: null,
          assessment: { major: 65, minor: 28, project: 46, report: 27, viva: 18, weekly: [90, 92, 91, 93, 94] }
        }
      ]
    }
  };

  // Grading queue mock database matching user mockup
  const [gradingQueue, setGradingQueue] = useState([
    { 
      id: 1, 
      studentName: 'Aditi Sharma', 
      studentId: '25mca001', 
      customId: 'ID: CS-9821',
      avatar: priyaSharmaProfile,
      assignmentName: 'Graph Algorithms Implementation', 
      courseCode: 'CS-302', 
      courseTag: 'Algorithms',
      submittedTime: '2 hrs ago',
      submittedDate: 'Oct 24, 09:15 AM',
      status: 'Pending',
      content: 'Implementation of Dijkstra\'s algorithm and Bellman-Ford using adjacency lists and priority queues in Python. Tested with cyclic graphs, disconnected nodes, and negative edge weights. Time complexity analyzed: O((V + E) log V).',
      score: null,
      feedback: '',
      cohort: 'Advanced Calculus - Sec A'
    },
    { 
      id: 2, 
      studentName: 'Rahul Verma', 
      studentId: '25mca042', 
      customId: 'ID: WD-4432',
      avatar: vikramSinghProfile,
      assignmentName: 'React Component Architecture', 
      courseCode: 'WD-201', 
      courseTag: 'Frontend Eng',
      submittedTime: '5 hrs ago',
      submittedDate: 'Oct 24, 06:30 AM',
      status: 'Needs Feedback',
      content: 'Refactored custom hooks logic to separate API calls from visual render tree. Handled multiple parallel state updates with useTransition and useDeferredValue. Code modularity is verified using ESLint and unit test coverage.',
      score: null,
      feedback: '',
      cohort: 'Linear Algebra - Sec B'
    },
    { 
      id: 3, 
      studentName: 'Kavya Patel', 
      studentId: '25mca016', 
      customId: 'ID: DB-7719',
      avatar: ananyaDesaiProfile,
      assignmentName: 'Database Normalization Essay', 
      courseCode: 'DB-105', 
      courseTag: 'Data Systems',
      submittedTime: '1 day ago',
      submittedDate: 'Oct 23, 16:45 PM',
      status: 'Graded',
      content: 'Detailed discussion on First Normal Form (1NF) up to Boyce-Codd Normal Form (BCNF). Provided formal decomposition proof showing lossless-join and dependency-preservation qualities of 3NF. Schemas include student enrollment registry.',
      score: 92,
      feedback: 'Excellent work. The decomposition proofs are rigorous and clear.',
      cohort: 'Physics 101 - Sec A'
    }
  ]);

  const [activeGradingItem, setActiveGradingItem] = useState(null);
  const [gradingScore, setGradingScore] = useState(70);
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Table filtering states
  const [filterCohort, setFilterCohort] = useState('All Cohorts');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [filterStatus, setFilterStatus] = useState('Status: Pending');
  const [searchQueryTable, setSearchQueryTable] = useState('');
  const [pendingCount, setPendingCount] = useState(42);
  const [isSyncingLMS, setIsSyncingLMS] = useState(false);
  const [scheduleTab, setScheduleTab] = useState('Today');
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');

  // Assessment generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showGenSuccess, setShowGenSuccess] = useState(false);
  const [assessmentSubject, setAssessmentSubject] = useState('Advanced Quantum Mechanics');
  const [assessmentQuestions, setAssessmentQuestions] = useState('25');
  const [difficultyFoundational, setDifficultyFoundational] = useState(30);
  const [difficultyApplied, setDifficultyApplied] = useState(50);
  const [difficultySynthesis, setDifficultySynthesis] = useState(20);
  const [generatedPaper, setGeneratedPaper] = useState({
    subject: 'Advanced Quantum Mechanics',
    title: 'Quantum Mechanics Midterm Assessment V1',
    questions: '25',
    duration: '45 Mins Est.',
    topics: [
      { name: 'Wave Functions', weight: 40, color: 'bg-rose-500' },
      { name: 'Schrödinger Eq.', weight: 35, color: 'bg-indigo-500' },
      { name: 'Spin States', weight: 25, color: 'bg-blue-500' }
    ]
  });

  const handleSynthesizePaper = (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Calculate dynamic values for generated paper
          const cleanSubject = assessmentSubject.replace('Advanced ', '');
          const newTitle = `${cleanSubject} Midterm Assessment V${Math.floor(Math.random() * 5) + 1}`;
          const qCount = parseInt(assessmentQuestions, 10) || 20;
          
          setGeneratedPaper({
            subject: assessmentSubject,
            title: newTitle,
            questions: String(qCount),
            duration: `${qCount * 1.8} Mins Est.`,
            topics: [
              { name: 'Wave Functions', weight: Math.max(10, Math.round(difficultyFoundational * 1.2)) || 40, color: 'bg-rose-500' },
              { name: 'Schrödinger Eq.', weight: Math.max(10, Math.round(difficultyApplied * 0.7)) || 35, color: 'bg-indigo-500' },
              { name: 'Spin States', weight: Math.max(10, Math.round(difficultySynthesis * 1.25)) || 25, color: 'bg-blue-500' }
            ]
          });
          
          setShowGenSuccess(true);
          setTimeout(() => setShowGenSuccess(false), 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleExportPDF = () => {
    alert(`Exporting "${generatedPaper.title}" to PDF... Ready for printing/LMS dispatch.`);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!activeGradingItem) return;
    
    const wasPending = activeGradingItem.status !== 'Graded';
    
    setGradingQueue(prev => prev.map(item => {
      if (item.id === activeGradingItem.id) {
        return {
          ...item,
          status: 'Graded',
          score: gradingScore,
          feedback: gradingFeedback
        };
      }
      return item;
    }));
    
    if (wasPending) {
      setPendingCount(prev => Math.max(0, prev - 1));
    }
    
    setActiveGradingItem(null);
    setGradingFeedback('');
    alert('Grade submitted successfully! Metrics updated.');
  };

  // Schedule mock database
  const [scheduleEvents, setScheduleEvents] = useState([
    { id: 1, title: 'Linear Algebra Office Hours', date: 'Tomorrow, 2:00 PM', duration: '60 mins', cohort: 'Linear Algebra - Sec B', type: 'Office Hours' },
    { id: 2, title: 'Calculus Advanced Calculus Review', date: 'June 11, 4:00 PM', duration: '90 mins', cohort: 'Advanced Calculus - Sec A', type: 'Review Session' },
    { id: 3, title: 'Physics 101 Midterm Prep', date: 'June 14, 10:00 AM', duration: '120 mins', cohort: 'Physics 101 - Sec A', type: 'Review Session' }
  ]);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionCohort, setNewSessionCohort] = useState('Advanced Calculus - Sec A');
  const [newSessionDateVal, setNewSessionDateVal] = useState('');
  const [newSessionTimeVal, setNewSessionTimeVal] = useState('12:00');
  const [newSessionType, setNewSessionType] = useState('Office Hours');

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!newSessionTitle || !newSessionDateVal) return;
    const combinedDateStr = combineDateTimeString(newSessionDateVal, newSessionTimeVal);
    const newEvent = {
      id: Date.now(),
      title: newSessionTitle,
      date: combinedDateStr,
      duration: '60 mins',
      cohort: newSessionCohort,
      type: newSessionType
    };
    setScheduleEvents(prev => [...prev, newEvent]);
    setNewSessionTitle('');
    setNewSessionDateVal('');
    setNewSessionTimeVal('12:00');
    setIsSchedulingModalOpen(false);
    alert('Live session scheduled successfully and added to cohort calendar.');
  };

  const currentCohortData = cohortsList[selectedCohort] || cohortsList['Advanced Calculus - Sec A'];

  // Dynamic filtering of student submissions based on the active filters and search query
  const filteredGradingQueue = gradingQueue.filter(item => {
    // Cohort filter
    if (filterCohort !== 'All Cohorts') {
      if (item.cohort !== filterCohort) return false;
    }
    // Subject filter
    if (filterSubject !== 'All Subjects') {
      if (item.courseTag !== filterSubject) return false;
    }
    // Status filter
    const statusVal = filterStatus.replace('Status: ', '');
    if (statusVal !== 'All' && filterStatus !== 'Status: All') {
      if (item.status.toLowerCase() !== statusVal.toLowerCase()) return false;
    }
    // Search query
    if (searchQueryTable.trim() !== '') {
      const query = searchQueryTable.toLowerCase();
      const matchName = item.studentName.toLowerCase().includes(query);
      const matchId = item.studentId.toLowerCase().includes(query);
      const matchCustomId = item.customId?.toLowerCase().includes(query);
      const matchAssignment = item.assignmentName.toLowerCase().includes(query);
      if (!matchName && !matchId && !matchCustomId && !matchAssignment) return false;
    }
    return true;
  });

  const getFirstName = (fullName) => {
    if (!fullName) return 'Arjun';
    return fullName.split(' ')[0];
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'AS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Cohorts', icon: Users },
    { name: 'Analytics & Reports', icon: TrendingUp },
    { name: 'Grading Queue', icon: FileText },
    { name: 'Schedule', icon: Calendar },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-[#050505] flex transition-colors duration-300 overflow-hidden">
      
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-[#0c0c0c] border-r border-[#eef2f6] dark:border-slate-800/80 p-6 justify-between flex-shrink-0 h-full overflow-y-auto">
        <div className="space-y-6 text-left">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#253df5] flex items-center justify-center text-white shadow-md shadow-brand-500/10">
              <Zap className="w-4.5 h-4.5 text-white fill-current" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-wide text-slate-900 dark:text-white leading-none">
                AetherLearn
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 leading-none uppercase tracking-wider">
                AI Education Suite
              </span>
            </div>
          </div>

          {/* Create New Cohort Button */}
          <div className="px-1.5 pb-2">
            
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5" aria-label="Sidebar Navigation">
            {navItems.filter(item => item.name !== 'Settings').map((item) => {
              const isActive = activeNav === item.name;
              const displayName = item.name === 'Analytics & Reports' ? 'Analytics & Insights' : item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'text-white bg-[#253df5] dark:bg-[#253df5]'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-105/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`} />
                    <span className="tracking-wider">{displayName}</span>
                  </div>
                  {/* Mock red badge counts on tabs */}
                  {item.name === 'Grading Queue' && gradingQueue.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${isActive ? 'bg-white text-[#253df5]' : 'bg-rose-500 text-white'}`}>
                      {gradingQueue.length}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-white rounded-l-md" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom links & Profile Card */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850/60 text-left">
          {/* Settings link */}
          <button
            onClick={() => setActiveNav('Settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeNav === 'Settings'
                ? 'text-white bg-[#253df5] dark:bg-[#253df5]'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-105/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <Settings className={`w-4.5 h-4.5 ${activeNav === 'Settings' ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`} />
            <span className="tracking-wider">Settings</span>
          </button>
          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-850/60 my-2" />

          {/* Profile Card */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Gray placeholder box with text "img" from the mockup */}
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 font-extrabold text-[10px] uppercase border border-slate-200/50 dark:border-slate-700/50">
                img
              </div>
              <div className="truncate">
                <h3 className="font-extrabold text-slate-850 dark:text-white text-xs tracking-wide leading-tight">
                  {user?.name || 'Prof. Arjun Singh'}
                </h3>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">
                  Computer Science
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={onLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Header bar */}
        <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 h-16 sm:h-20 flex items-center px-6 justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/50"
            >
              <Zap className="w-5 h-5 text-[#253df5]" />
            </button>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              AetherLearn Console
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Course / Cohort Select Dropdown */}
            <div className="relative">
              <select
                value={selectedCohort}
                onChange={(e) => {
                  setSelectedCohort(e.target.value);
                  setSelectedStudentId('all');
                }}
                className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-700 dark:text-slate-350 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#253df5] animate-dropdown-pop"
              >
                {Object.keys(cohortsList).map(name => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <ChevronDown size={12} />
              </span>
            </div>

            {/* Student Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800 rounded-2xl text-xs font-extrabold text-[#253df5] dark:text-[#7f7eff] cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#253df5] animate-dropdown-pop"
              >
                <option value="all">👥 All Students ({currentCohortData.students?.length || 0})</option>
                {currentCohortData.students?.map(s => (
                  <option key={s.id} value={s.id}>
                    🎓 {s.name} ({s.id})
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <User size={12} />
              </span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-2xl border border-[#eef2f6] dark:border-slate-800/80 bg-white dark:bg-[#0c0c0c] text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all shadow-xs">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </button>

            {/* Quick theme toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-2xl border border-[#eef2f6] dark:border-slate-800/80 bg-white dark:bg-[#0c0c0c] text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-all shadow-xs"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow p-6 overflow-y-auto space-y-6">

          {/* ================= VIEW: DASHBOARD (Educator Mockup) ================= */}
          {activeNav === 'Dashboard' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              
              {/* Header Title */}
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentCohortData.subject} Dashboard
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Overview of cohort health, student 200-mark evaluation scheme, and curriculum analytics.
                </p>
              </div>

              {/* 200-Mark Student Assessment Scheme Breakdown Card */}
              {(() => {
                const activeStudent = selectedStudentId !== 'all' 
                  ? currentCohortData.students?.find(s => s.id === selectedStudentId) 
                  : currentCohortData.students?.[0];
                const assess = activeStudent?.assessment || { major: 64, minor: 27, project: 45, report: 26, viva: 18, weekly: [86, 88, 90, 89, 92] };
                const totalScore = assess.major + assess.minor + assess.project + assess.report + assess.viva;
                const percentage = Math.round((totalScore / 200) * 100);

                return (
                  <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-6 text-left animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#253df5]/10 text-[#253df5] font-black text-base flex items-center justify-center border border-[#253df5]/20 font-mono">
                          {activeStudent?.name ? activeStudent.name.slice(0, 2).toUpperCase() : 'ST'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {selectedStudentId !== 'all' ? activeStudent?.name : `${currentCohortData.subject} Student Evaluation`}
                            </h3>
                            <span className="bg-[#253df5]/10 text-[#253df5] dark:text-[#7f7eff] text-[10px] font-black px-2.5 py-0.5 rounded font-mono">
                              {selectedStudentId !== 'all' ? `ID: ${activeStudent?.id}` : '200-MARK SCHEME'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            Continuous evaluation scheme: Major (70), Minor (30), Project (50), Report (30), Viva (20).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 px-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                        <div className="text-right">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">TOTAL CUMULATIVE MARKS</span>
                          <span className="text-2xl font-black text-[#253df5] dark:text-[#7f7eff] font-mono">
                            {totalScore} <span className="text-xs text-slate-400 font-normal">/ 200</span>
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm font-mono border border-emerald-500/20">
                          {percentage}%
                        </div>
                      </div>
                    </div>

                    {/* 5 Marks Components Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Component 1: Major Examination (70 Marks) */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase font-mono tracking-wider">🏆 Major Exam</span>
                          <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 font-mono">Max 70</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {assess.major} <span className="text-xs text-slate-400 font-normal">/ 70</span>
                        </div>
                        <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#253df5] rounded-full" style={{ width: `${(assess.major / 70) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block pt-1 font-mono">Sessional Midterm & Paper</span>
                      </div>

                      {/* Component 2: Minor Examination (30 Marks) */}
                      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">📝 Minor Exam</span>
                          <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 font-mono">Max 30</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {assess.minor} <span className="text-xs text-slate-400 font-normal">/ 30</span>
                        </div>
                        <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(assess.minor / 30) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block pt-1 font-mono">Short Tests & Quizzes</span>
                      </div>

                      {/* Component 3: Project Work (50 Marks) */}
                      <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase font-mono tracking-wider">💻 Project Work</span>
                          <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 font-mono">Max 50</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {assess.project} <span className="text-xs text-slate-400 font-normal">/ 50</span>
                        </div>
                        <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(assess.project / 50) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block pt-1 font-mono">Practical Code & Repo</span>
                      </div>

                      {/* Component 4: Report Submission (30 Marks) */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase font-mono tracking-wider">📄 Report Submission</span>
                          <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 font-mono">Max 30</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {assess.report} <span className="text-xs text-slate-400 font-normal">/ 30</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(assess.report / 30) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block pt-1 font-mono">Thesis & Lab Reports</span>
                      </div>

                      {/* Component 5: Class Viva (20 Marks) */}
                      <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase font-mono tracking-wider">🗣 Class Viva</span>
                          <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 font-mono">Max 20</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {assess.viva} <span className="text-xs text-slate-400 font-normal">/ 20</span>
                        </div>
                        <div className="w-full h-1.5 bg-rose-200 dark:bg-rose-900 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(assess.viva / 20) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 block pt-1 font-mono">Oral Viva & Participation</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Main Grid: Left alerts (7 cols) and Right mastery stats (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: Intervention Alert System */}
                <div className="lg:col-span-7 bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 text-left">
                  <div className="space-y-4 w-full">
                    <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                          <AlertCircle size={14} />
                        </span>
                        Intervention & Alert System
                      </h3>
                      <span className="bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {currentCohortData.alerts} Critical Alerts
                      </span>
                    </div>

                    {/* Alert items list */}
                    <div className="space-y-3.5">
                      
                      {/* Alert 1 */}
                      <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-red-950/10 border border-rose-100/60 dark:border-red-900/20 flex items-start justify-between gap-4 hover:border-rose-200 dark:hover:border-red-900/40 transition-colors cursor-pointer">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-rose-600 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded font-mono uppercase">
                              CODE RED
                            </span>
                            <span className="text-xs font-black text-slate-850 dark:text-white">
                              Ananya Iyer
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              (25mca016)
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            High Risk + High Stress detected in Advanced Calculus.
                          </p>
                          <a href="#" className="inline-block text-[10px] font-extrabold text-rose-600 dark:text-rose-450 hover:underline">
                            Action Required: Immediate Pastoral Care
                          </a>
                        </div>
                        <ChevronRight className="text-rose-500 w-5 h-5 self-center" />
                      </div>

                      {/* Alert 2 */}
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 border border-[#eef2f6] dark:border-slate-850/60 flex items-start justify-between gap-4 hover:border-slate-205 dark:hover:border-slate-800 transition-colors cursor-pointer">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-slate-500 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded font-mono uppercase">
                              WATCHLIST
                            </span>
                            <span className="text-xs font-black text-slate-850 dark:text-white">
                              Arjun Mehta
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              (25mca042)
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">
                            Consecutive missed micro-assessments in Physics 101.
                          </p>
                        </div>
                        <ChevronRight className="text-slate-400 w-5 h-5 self-center" />
                      </div>

                      {/* Alert 3 */}
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 border border-[#eef2f6] dark:border-slate-850/60 flex items-start justify-between gap-4 hover:border-slate-205 dark:hover:border-slate-800 transition-colors cursor-pointer">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-slate-500 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded font-mono uppercase">
                              WATCHLIST
                            </span>
                            <span className="text-xs font-black text-slate-855 dark:text-white">
                              Rohan Das
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              (25mca109)
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-655 dark:text-slate-400">
                            Low engagement in Thermodynamics module.
                          </p>
                        </div>
                        <ChevronRight className="text-slate-400 w-5 h-5 self-center" />
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Column: Cohort Progress & Mastery */}
                <div className="lg:col-span-5 bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6 text-left animate-fadeIn">
                  <div className="space-y-5 w-full">
                    <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#253df5]/10 text-[#253df5] flex items-center justify-center">
                          <TrendingUp size={12} />
                        </span>
                        Cohort Progress
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Overall mastery */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                          Overall Mastery Level
                        </span>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                            {currentCohortData.averageMastery}%
                          </span>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-450">
                            {currentCohortData.masteryTrend}
                          </span>
                        </div>
                      </div>

                      {/* Quantum Mechanics warning / tracker */}
                      <div className="p-4 bg-slate-55/40 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850/65 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-707 dark:text-slate-300">{currentCohortData.activeModule}</span>
                          <span className="text-rose-600 font-extrabold">Alert: {currentCohortData.alertRate} Failure Rate</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#253df5] rounded-full transition-all duration-300" 
                            style={{ width: `${currentCohortData.averageMastery}%` }} 
                          />
                        </div>
                        <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 leading-normal font-mono uppercase">
                          Pedagogical adjustment recommended for Week 5.
                        </p>
                      </div>

                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveNav('Analytics & Reports')}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-205 dark:border-slate-800 text-xs font-black py-3 rounded-2xl transition-all duration-200 tracking-wider text-center"
                  >
                    View Deep Analytics
                  </button>
                </div>

              </div>

              {/* Bottom Card: Curriculum Effectiveness Tracker */}
              <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-5 text-left">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 flex items-center justify-center">
                        <BookOpen size={12} />
                      </span>
                      Curriculum Effectiveness Tracker
                    </h3>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-905 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors">
                    <Download size={11} />
                    <span>Export Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  
                  {/* Column 1: Module Engagement */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                      Module Engagement
                    </h4>
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-350">Mod 1: Kinematics</span>
                          <span className="text-slate-800 dark:text-white">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-[#253df5] rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-350">Mod 2: Dynamics</span>
                          <span className="text-slate-800 dark:text-white">85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-[#253df5] rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-350">Mod 3: Thermodynamics</span>
                          <span className="text-rose-600 font-extrabold">64%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: '64%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: High-Risk Topics */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                      High-Risk Topics (Cohort)
                    </h4>
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-605 dark:text-slate-400">
                        <span className="w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          !
                        </span>
                        <div>
                          <strong className="text-slate-850 dark:text-white block">Entropy & Second Law</strong>
                          <span className="text-[10px]">32% failure rate in practice quizzes.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-605 dark:text-slate-400">
                        <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp size={11} className="transform rotate-180" />
                        </span>
                        <div>
                          <strong className="text-slate-850 dark:text-white block">Rotational Inertia</strong>
                          <span className="text-[10px]">Engagement dropped 15% this week.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: AI Pedagogical Adjustments */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                      AI Pedagogical Adjustments
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-xs">
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        <div>
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Today</span>
                          <p className="text-slate-655 dark:text-slate-400 font-semibold leading-normal mt-0.5">
                            Injected remedial interactive simulations for Entropy.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-xs">
                        <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                        <div>
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">2 days ago</span>
                          <p className="text-slate-655 dark:text-slate-400 font-semibold leading-normal mt-0.5">
                            Paced out Advanced Calculus assignments due to high stress indicators.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ================= VIEW: MY COHORTS ================= */}
          {activeNav === 'My Cohorts' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-205 dark:border-slate-800">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Cohorts</h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Manage learning pathways and monitor students across your assigned sections.</p>
                </div>
                <button 
                  onClick={() => setIsCreatingCohort(true)}
                  className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shadow-xs"
                >
                  <Plus size={14} />
                  <span>Create Cohort</span>
                </button>
              </div>

              {isCreatingCohort ? (
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs animate-fadeIn">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Cohort</h2>
                    <button 
                      onClick={() => setIsCreatingCohort(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsCreatingCohort(false); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cohort Name</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253df5]" placeholder="e.g. Advanced Calculus - Sec B" required />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Area</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253df5]" placeholder="e.g. Mathematics" required />
                      </div>
                      <div className="space-y-2 md:col-span-2 text-left">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Student Details (CSV or Emails)</label>
                        <textarea className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#253df5] resize-none" placeholder="Paste student emails separated by commas, or upload a CSV format containing student details..." required></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="button" onClick={() => setIsCreatingCohort(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 mr-3 transition-colors">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#253df5] hover:bg-[#1d2ae0] transition-colors shadow-sm">Create Cohort</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(cohortsList).map(name => {
                  const cohort = cohortsList[name];
                  const isSelected = selectedCohort === name;
                  return (
                    <div 
                      key={name}
                      onClick={() => setSelectedCohort(name)}
                      className={`bg-white dark:bg-[#0c0c0c] border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:-translate-y-1 ${
                        isSelected 
                          ? 'border-[#253df5] ring-2 ring-[#253df5]/15' 
                          : 'border-[#eef2f6] dark:border-slate-800/80'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-[#253df5] bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded font-mono uppercase">
                            {cohort.section}
                          </span>
                          <span className="text-xs font-black text-slate-400 font-mono">
                            {cohort.studentsCount} Students
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-909 dark:text-white mt-2 leading-tight">
                          {cohort.subject}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                          {cohort.activeModule}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-850/60 flex justify-between items-center text-xs font-bold">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-mono">Mastery</span>
                          <span className="text-slate-808 dark:text-white font-extrabold text-sm">{cohort.averageMastery}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-mono font-sans">Alerts</span>
                          <span className={`font-extrabold text-sm ${cohort.alerts > 0 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                            {cohort.alerts}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Cohort Student Details */}
              <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-909 dark:text-white">
                    Student Roster: {selectedCohort}
                  </h3>
                  <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-mono">
                    Filter: Active
                  </span>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left text-xs font-semibold text-slate-655 dark:text-slate-350">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-wider">
                        <th className="py-2.5 pb-2">Student ID</th>
                        <th className="py-2.5 pb-2">Name</th>
                        <th className="py-2.5 pb-2 text-center">Avg Mastery</th>
                        <th className="py-2.5 pb-2 text-center">Stress Level</th>
                        <th className="py-2.5 pb-2 text-right">Engagement</th>
                        <th className="py-2.5 pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                      {currentCohortData.students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                          <td className="py-3.5 font-mono text-slate-500 dark:text-slate-400">{student.id}</td>
                          <td className="py-3.5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#253df5] overflow-hidden flex items-center justify-center text-white text-[10px] font-black">
                              {student.avatar ? (
                                <img loading="lazy" src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{getInitials(student.name)}</span>
                              )}
                            </div>
                            <span className="text-slate-900 dark:text-white font-extrabold">{student.name}</span>
                          </td>
                          <td className="py-3.5 text-center font-extrabold text-slate-850 dark:text-slate-200">{student.grade}%</td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                              student.stress === 'High' 
                                ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' 
                                : student.stress === 'Medium' 
                                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' 
                                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                            }`}>
                              {student.stress}
                            </span>
                          </td>
                          <td className={`py-3.5 text-right font-extrabold ${
                            student.engagement === 'High' 
                              ? 'text-emerald-600 dark:text-emerald-450' 
                              : student.engagement === 'Low' 
                              ? 'text-rose-600' 
                              : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {student.engagement}
                          </td>
                          <td className="py-3.5 text-right">
                            <a 
                              href={`https://t.me/`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white rounded-lg text-[10px] font-black transition-colors duration-200"
                              title={`Message ${student.name} on Telegram`}
                            >
                              <MessageSquare size={12} />
                              <span>Message</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

          {/* ================= VIEW: ANALYTICS & REPORTS ================= */}
          {activeNav === 'Analytics & Reports' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              <div className="pb-6 border-b border-slate-205 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-909 dark:text-white tracking-tight">Analytics & Reports</h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Deep cohort analytics representing mastery levels, weekly engagement, and topic distribution curves.</p>
              </div>

              {/* Analytics curves grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Average Weekly Engagement */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-905 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#253df5]/10 text-[#253df5] flex items-center justify-center">
                        <TrendingUp size={12} />
                      </span>
                      Weekly Engagement Curve
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Average student study time in minutes over the current semester.</p>
                  </div>
                  
                  {/* SVG Line Chart */}
                  <div className="pt-2">
                    <svg className="w-full h-52 overflow-visible" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="eng-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#253df5" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#253df5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {[0, 1, 2, 3].map((i) => {
                        const y = 30 + i * 45;
                        return (
                          <line key={i} x1="30" y1={y} x2="470" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />
                        );
                      })}
                      <path d="M 30,160 Q 130,110 240,140 T 470,60 L 470,170 L 30,170 Z" fill="url(#eng-grad)" />
                      <path d="M 30,160 Q 130,110 240,140 T 470,60" fill="none" stroke="#253df5" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="470" cy="60" r="4" fill="#253df5" stroke="white" strokeWidth="2" />
                      {['Week 1', 'Week 4', 'Week 8', 'Week 12', 'Week 16'].map((label, idx) => (
                        <text key={idx} x={30 + idx * 110} y="190" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-wider font-mono">{label}</text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Chart 2: Grade Distributions */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-4 text-left">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-905 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 flex items-center justify-center">
                        <Users size={12} />
                      </span>
                      Student Grade Distribution
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Number of students within grade brackets.</p>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="pt-2">
                    <svg className="w-full h-52 overflow-visible" viewBox="0 0 500 200">
                      {[0, 1, 2, 3].map((i) => {
                        const y = 30 + i * 45;
                        return (
                          <line key={i} x1="30" y1={y} x2="470" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />
                        );
                      })}
                      {/* Bars */}
                      {[
                        { bracket: '<60', count: 3, x: 50, height: 35 },
                        { bracket: '60-70', count: 6, x: 130, height: 60 },
                        { bracket: '70-80', count: 18, x: 210, height: 130 },
                        { bracket: '80-90', count: 12, x: 290, height: 95 },
                        { bracket: '90-100', count: 5, x: 370, height: 50 }
                      ].map((bar, idx) => (
                        <g key={idx}>
                          <rect x={bar.x} y={170 - bar.height} width="40" height={bar.height} rx="4" fill="#253df5" className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
                          <text x={bar.x + 20} y={165 - bar.height} textAnchor="middle" className="text-[9px] font-bold fill-slate-800 dark:fill-slate-205">{bar.count}</text>
                          <text x={bar.x + 20} y="188" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-400 uppercase tracking-wider font-mono">{bar.bracket}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= VIEW: GRADING OVERVIEW ================= */}
          {activeNav === 'Grading Queue' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              
              {/* Header with Title and Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Grading Overview</h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Manage and evaluate student submissions efficiently.
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Sync LMS */}
                  <button 
                    onClick={() => {
                      setIsSyncingLMS(true);
                      setTimeout(() => {
                        setIsSyncingLMS(false);
                        alert('LMS sync complete! 0 new submissions found.');
                      }, 1200);
                    }}
                    disabled={isSyncingLMS}
                    className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c0c0c] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-extrabold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLMS ? 'animate-spin' : ''}`} />
                    <span>{isSyncingLMS ? 'Syncing...' : 'Sync LMS'}</span>
                  </button>
                  
                  {/* Export Batch */}
                  <button 
                    onClick={() => alert('Grading batch exported successfully as CSV.')}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-[#253df5] text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Batch</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Reviews - Blue Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-750 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] font-bold text-blue-100/90 uppercase tracking-widest">PENDING REVIEWS</span>
                    <div className="w-7 h-7 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-3 z-10">
                    <span className="text-5xl font-black tracking-tight leading-none">{pendingCount}</span>
                    <span className="bg-white/15 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-white" />
                      <span>+12 since yesterday</span>
                    </span>
                  </div>
                  {/* Decorative background shape */}
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none" />
                </div>

                {/* Avg Turnaround - White Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex items-center justify-between h-36">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">AVG. TURNAROUND</span>
                    <div className="flex items-baseline mt-1.5">
                      <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">1.8</span>
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 ml-1.5 uppercase">Days</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Clock className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* Cohort Progress - White Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">COHORT PROGRESS</span>
                      <span className="text-4xl font-black text-slate-900 dark:text-white leading-none mt-1.5">76%</span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <BarChart2 className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full mt-2">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Cohort filter */}
                  <div className="relative min-w-[130px]">
                    <select
                      value={filterCohort}
                      onChange={(e) => setFilterCohort(e.target.value)}
                      className="appearance-none w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                    >
                      <option value="All Cohorts">All Cohorts</option>
                      <option value="Advanced Calculus - Sec A">Advanced Calculus - Sec A</option>
                      <option value="Linear Algebra - Sec B">Linear Algebra - Sec B</option>
                      <option value="Physics 101 - Sec A">Physics 101 - Sec A</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={12} />
                    </span>
                  </div>

                  {/* Subject filter */}
                  <div className="relative min-w-[130px]">
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="appearance-none w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                    >
                      <option value="All Subjects">All Subjects</option>
                      <option value="Algorithms">Algorithms</option>
                      <option value="Frontend Eng">Frontend Eng</option>
                      <option value="Data Systems">Data Systems</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={12} />
                    </span>
                  </div>

                  {/* Status filter */}
                  <div className="relative min-w-[145px]">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                    >
                      <option value="Status: All">All Statuses</option>
                      <option value="Status: Pending">Status: Pending</option>
                      <option value="Status: Needs Feedback">Status: Needs Feedback</option>
                      <option value="Status: Graded">Status: Graded</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={12} />
                    </span>
                  </div>
                </div>

                {/* Right: Search */}
                <div className="relative flex-grow md:max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={13} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search student name or ID..."
                    value={searchQueryTable}
                    onChange={(e) => setSearchQueryTable(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                  />
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850/80 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-4.5 px-6 font-semibold">Student</th>
                        <th className="py-4.5 px-6 font-semibold">Assignment</th>
                        <th className="py-4.5 px-6 font-semibold">Submitted</th>
                        <th className="py-4.5 px-6 font-semibold">Status</th>
                        <th className="py-4.5 px-6 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredGradingQueue.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-slate-400 dark:text-slate-500 font-semibold text-xs">
                            No submissions match the active filters.
                          </td>
                        </tr>
                      ) : (
                        filteredGradingQueue.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                            {/* Student Info */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                {item.avatar ? (
                                  <img loading="lazy" src={item.avatar} 
                                    alt={item.studentName} 
                                    className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[#253df5] flex items-center justify-center text-white text-xs font-black">
                                    {getInitials(item.studentName)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5">
                                    <span>{item.studentName}</span>
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold font-mono">
                                      ({item.studentId})
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">
                                    {item.customId}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Assignment Info */}
                            <td className="py-4 px-6">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white text-xs block leading-tight">
                                  {item.assignmentName}
                                </span>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                                    {item.courseCode}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                    {item.courseTag}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Submitted Time */}
                            <td className="py-4 px-6">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">
                                  {item.submittedTime}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                                  {item.submittedDate}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6">
                              {item.status === 'Pending' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-650" />
                                  <span>Pending</span>
                                </span>
                              ) : item.status === 'Needs Feedback' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-100 dark:border-amber-900/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span>Needs Feedback</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-550" />
                                  <span>Graded</span>
                                </span>
                              )}
                            </td>

                            {/* Action Button */}
                            <td className="py-4 px-6 text-right">
                              {item.status === 'Pending' ? (
                                <button
                                  onClick={() => {
                                    setActiveGradingItem(item);
                                    setGradingScore(item.score !== null ? item.score : 85);
                                    setGradingFeedback(item.feedback || '');
                                  }}
                                  className="px-4 py-1.5 bg-[#253df5] text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all shadow-xs"
                                >
                                  Grade
                                </button>
                              ) : item.status === 'Needs Feedback' ? (
                                <button
                                  onClick={() => {
                                    setActiveGradingItem(item);
                                    setGradingScore(item.score !== null ? item.score : 75);
                                    setGradingFeedback(item.feedback || '');
                                  }}
                                  className="px-4 py-1.5 border border-[#253df5]/60 text-[#253df5] hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl text-xs font-bold transition-all"
                                >
                                  Review
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveGradingItem(item);
                                    setGradingScore(item.score);
                                    setGradingFeedback(item.feedback || '');
                                  }}
                                  className="text-[#253df5] dark:text-blue-400 hover:underline text-xs font-bold"
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-slate-50/50 dark:bg-slate-900/10 px-6 py-4 border-t border-slate-105 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Showing 1 to {filteredGradingQueue.length} of {gradingQueue.length} entries
                  </span>
                  
                  {/* Pagination */}
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 bg-white dark:bg-[#0c0c0c] border border-slate-205 dark:border-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-not-allowed">
                      Previous
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#253df5] text-white rounded-lg text-xs font-black">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
                      3
                    </button>
                    <span className="text-slate-400 px-1 font-extrabold text-xs">...</span>
                    <button className="px-3 py-1.5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Grading Modal Overlay */}
              {activeGradingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                  {/* Backdrop click to close */}
                  <div 
                    onClick={() => setActiveGradingItem(null)}
                    className="fixed inset-0"
                  />
                  
                  {/* Modal Box */}
                  <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-lg text-left animate-slideUp">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/85 pb-4 mb-4">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-[#253df5] dark:text-blue-400 uppercase font-mono">
                          SCORING MODULE
                        </span>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                          Evaluate Submission
                        </h3>
                      </div>
                      <button 
                        onClick={() => setActiveGradingItem(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <form onSubmit={handleGradeSubmit} className="space-y-4">
                      
                      {/* Info details */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block font-semibold">Student</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
                            {activeGradingItem.studentName} ({activeGradingItem.studentId})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500 block font-semibold">Assignment</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
                            {activeGradingItem.assignmentName}
                          </span>
                        </div>
                      </div>

                      {/* Student Deliverable Content */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono mb-1.5">
                          Submission Preview
                        </span>
                        <p className="text-xs font-semibold text-slate-655 dark:text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
                          "{activeGradingItem.content}"
                        </p>
                      </div>

                      {/* Score Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-550 dark:text-slate-400 uppercase tracking-wide">Award Score</span>
                          <span className="text-xl font-black text-[#253df5] dark:text-blue-400">{gradingScore} / 100</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={gradingScore || 0}
                          onChange={(e) => setGradingScore(Number(e.target.value))}
                          className="w-full accent-[#253df5] cursor-pointer"
                        />
                      </div>

                      {/* Feedback text input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Feedback Comments</label>
                        <textarea 
                          rows="3"
                          value={gradingFeedback}
                          onChange={(e) => setGradingFeedback(e.target.value)}
                          placeholder="Provide dynamic, personalized feedback..."
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-808 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                        />
                      </div>

                      {/* Footer action buttons */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveGradingItem(null)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#253df5] text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Check size={14} />
                          <span>{activeGradingItem.status === 'Graded' ? 'Update Evaluation' : 'Submit Evaluation'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW: PRIORITY SCHEDULE ================= */}
          {activeNav === 'Schedule' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              
              {/* Header with Title and Switcher */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Priority Schedule</h1>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Manage your upcoming lectures, grading deadlines, and student meetings.
                  </p>
                </div>
                
                {/* Actions & Day Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Switcher Pills */}
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setScheduleTab('Today');
                        setSelectedCalendarDate('');
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                        scheduleTab === 'Today'
                          ? 'bg-white dark:bg-[#0c0c0c] text-[#253df5] dark:text-blue-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        setScheduleTab('Tomorrow');
                        setSelectedCalendarDate('');
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                        scheduleTab === 'Tomorrow'
                          ? 'bg-white dark:bg-[#0c0c0c] text-[#253df5] dark:text-blue-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <label
                      className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                        scheduleTab === 'Select Date'
                          ? 'bg-white dark:bg-[#0c0c0c] text-[#253df5] dark:text-blue-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      <Calendar size={13} />
                      <span>{selectedCalendarDate ? formatCalendarDate(selectedCalendarDate) : 'Select Date'}</span>
                      <input
                        type="date"
                        value={selectedCalendarDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCalendarDate(val);
                          setScheduleTab('Select Date');
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Create Event Trigger */}
                  <button
                    onClick={() => setIsSchedulingModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-[#253df5] text-white hover:bg-blue-600 rounded-xl text-xs font-black tracking-wide shadow-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Session</span>
                  </button>
                </div>
              </div>

              {/* Main Grid split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: High Priority Action Items (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500">
                    <AlertTriangle className="w-4 h-4 fill-rose-50 dark:fill-transparent" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      HIGH PRIORITY ACTION ITEMS
                    </span>
                  </div>

                  {scheduleTab === 'Today' && (
                    <div className="space-y-4">
                      {/* Item 1: Grading: Midterm AI Projects */}
                      <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-rose-500 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left">
                        <div className="space-y-2 max-w-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                              DUE IN 4 HRS
                            </span>
                            <span className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                              Cohort MCA-A
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
                            Grading: Midterm AI Projects
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                            42 submissions pending review. Focus on algorithm efficiency metrics.
                          </p>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-3 pt-2.5">
                            <button
                              onClick={() => setActiveNav('Grading Queue')}
                              className="px-6 py-3 bg-gradient-to-r from-[#253df5] to-[#4f46e5] hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                              Start Grading Session
                            </button>
                            <button
                              onClick={() => setActiveNav('Grading Queue')}
                              className="px-6 py-3 bg-blue-50 dark:bg-blue-950/20 text-[#253df5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/35 active:scale-95 rounded-xl text-xs font-black transition-all duration-200"
                            >
                              View Submissions
                            </button>
                          </div>
                        </div>

                        {/* Right Tasks badge */}
                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 text-center flex flex-col justify-center min-w-[90px] h-24 self-start md:self-auto">
                          <span className="text-[8px] font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest block">TASKS</span>
                          <span className="text-3xl font-black text-[#253df5] dark:text-blue-400 mt-1 block leading-none">{pendingCount}</span>
                        </div>
                      </div>

                      {/* Item 2: Advanced Machine Learning Concepts */}
                      <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-blue-600 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left">
                        {/* Time side */}
                        <div className="flex items-baseline md:flex-col justify-start md:justify-center md:text-center min-w-[70px]">
                          <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">11:30</span>
                          <span className="text-xs font-bold text-slate-450 dark:text-slate-550 md:mt-1.5 ml-1.5 md:ml-0 uppercase tracking-wider">AM</span>
                        </div>

                        {/* Mid details */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              LIVE LECTURE
                            </span>
                            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-[#253df5]" />
                              <span>Zoom Room A</span>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            Advanced Machine Learning Concepts
                          </h3>
                          <p className="text-xs font-semibold text-slate-450 dark:text-slate-500">
                            Cohort B.Tech-CS, Year 3
                          </p>
                        </div>

                        {/* Action trigger */}
                        <button
                          onClick={() => window.open('https://zoom.us', '_blank')}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 self-start md:self-auto"
                        >
                          <Play size={10} className="fill-current text-white" />
                          <span>Join Room</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {scheduleTab === 'Tomorrow' && (
                    <div className="space-y-4">
                      {/* Tomorrow Item 1 */}
                      <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-rose-500 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left">
                        <div className="space-y-2 max-w-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                              DUE IN 28 HRS
                            </span>
                            <span className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                              Cohort MCA-A
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
                            Grading: Algorithms Assignment 2
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                            15 pending submissions. Code complexity and profiling verification.
                          </p>
                          <div className="flex items-center gap-3 pt-2.5">
                            <button
                              onClick={() => setActiveNav('Grading Queue')}
                              className="px-6 py-3 bg-gradient-to-r from-[#253df5] to-[#4f46e5] hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                              Start Session
                            </button>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 text-center flex flex-col justify-center min-w-[90px] h-24 self-start md:self-auto">
                          <span className="text-[8px] font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest block">TASKS</span>
                          <span className="text-3xl font-black text-[#253df5] dark:text-blue-400 mt-1 block leading-none">15</span>
                        </div>
                      </div>

                      {/* Tomorrow Item 2 */}
                      <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-blue-600 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left">
                        <div className="flex items-baseline md:flex-col justify-start md:justify-center md:text-center min-w-[70px]">
                          <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">10:00</span>
                          <span className="text-xs font-bold text-slate-455 dark:text-slate-550 md:mt-1.5 ml-1.5 md:ml-0 uppercase tracking-wider">AM</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              LIVE LECTURE
                            </span>
                            <span className="text-[10px] font-bold text-slate-450 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-[#253df5]" />
                              <span>Zoom Room B</span>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            Vector Calculus Basics & Line Integrals
                          </h3>
                          <p className="text-xs font-semibold text-slate-455 dark:text-slate-500">
                            Cohort MCA-A, Year 1
                          </p>
                        </div>
                        <button
                          onClick={() => window.open('https://zoom.us', '_blank')}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 self-start md:self-auto"
                        >
                          <Play size={10} className="fill-current text-white" />
                          <span>Join Room</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {scheduleTab === 'Select Date' && (
                    <div className="space-y-4">
                      {!selectedCalendarDate ? (
                        <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-550">
                          <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">Date Agenda View</h4>
                          <p className="text-xs mt-1">Please select an upcoming date on the calendar filter to list planned sessions.</p>
                        </div>
                      ) : selectedCalendarDate === '2026-06-09' ? (
                        // Today Action Items
                        <div className="space-y-4">
                          {/* Item 1: Grading: Midterm AI Projects */}
                          <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-rose-500 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left animate-fadeIn">
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                  DUE IN 4 HRS
                                </span>
                                <span className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                  Cohort MCA-A
                                </span>
                              </div>
                              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
                                Grading: Midterm AI Projects
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                42 submissions pending review. Focus on algorithm efficiency metrics.
                              </p>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-3 pt-2.5">
                                <button
                                  onClick={() => setActiveNav('Grading Queue')}
                                  className="px-6 py-3 bg-gradient-to-r from-[#253df5] to-[#4f46e5] hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                  Start Grading Session
                                </button>
                                <button
                                  onClick={() => setActiveNav('Grading Queue')}
                                  className="px-6 py-3 bg-blue-50 dark:bg-blue-950/20 text-[#253df5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/35 active:scale-95 rounded-xl text-xs font-black transition-all duration-200"
                                >
                                  View Submissions
                                </button>
                              </div>
                            </div>

                            {/* Right Tasks badge */}
                            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 text-center flex flex-col justify-center min-w-[90px] h-24 self-start md:self-auto">
                              <span className="text-[8px] font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest block">TASKS</span>
                              <span className="text-3xl font-black text-[#253df5] dark:text-blue-400 mt-1 block leading-none">{pendingCount}</span>
                            </div>
                          </div>

                          {/* Item 2: Advanced Machine Learning Concepts */}
                          <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-blue-600 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left animate-fadeIn">
                            {/* Time side */}
                            <div className="flex items-baseline md:flex-col justify-start md:justify-center md:text-center min-w-[70px]">
                              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">11:30</span>
                              <span className="text-xs font-bold text-slate-450 dark:text-slate-550 md:mt-1.5 ml-1.5 md:ml-0 uppercase tracking-wider">AM</span>
                            </div>

                            {/* Mid details */}
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  LIVE LECTURE
                                </span>
                                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-[#253df5]" />
                                  <span>Zoom Room A</span>
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                Advanced Machine Learning Concepts
                              </h3>
                              <p className="text-xs font-semibold text-slate-455 dark:text-slate-500">
                                Cohort B.Tech-CS, Year 3
                              </p>
                            </div>

                            {/* Action trigger */}
                            <button
                              onClick={() => window.open('https://zoom.us', '_blank')}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 self-start md:self-auto"
                            >
                              <Play size={10} className="fill-current text-white" />
                              <span>Join Room</span>
                            </button>
                          </div>
                        </div>
                      ) : selectedCalendarDate === '2026-06-10' ? (
                        // Tomorrow Action Items
                        <div className="space-y-4">
                          {/* Tomorrow Item 1 */}
                          <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-rose-500 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left animate-fadeIn">
                            <div className="space-y-2 max-w-xl">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                  DUE IN 28 HRS
                                </span>
                                <span className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                  Cohort MCA-A
                                </span>
                              </div>
                              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
                                Grading: Algorithms Assignment 2
                              </h3>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                15 pending submissions. Code complexity and profiling verification.
                              </p>
                              <div className="flex items-center gap-3 pt-2.5">
                                <button
                                  onClick={() => setActiveNav('Grading Queue')}
                                  className="px-6 py-3 bg-gradient-to-r from-[#253df5] to-[#4f46e5] hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                  Start Session
                                </button>
                              </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 text-center flex flex-col justify-center min-w-[90px] h-24 self-start md:self-auto">
                              <span className="text-[8px] font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest block">TASKS</span>
                              <span className="text-3xl font-black text-[#253df5] dark:text-blue-400 mt-1 block leading-none">15</span>
                            </div>
                          </div>

                          {/* Tomorrow Item 2 */}
                          <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-blue-600 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left animate-fadeIn">
                            <div className="flex items-baseline md:flex-col justify-start md:justify-center md:text-center min-w-[70px]">
                              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">10:00</span>
                              <span className="text-xs font-bold text-slate-455 dark:text-slate-550 md:mt-1.5 ml-1.5 md:ml-0 uppercase tracking-wider">AM</span>
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                  LIVE LECTURE
                                </span>
                                <span className="text-[10px] font-bold text-slate-450 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-[#253df5]" />
                                  <span>Zoom Room B</span>
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                Vector Calculus Basics & Line Integrals
                              </h3>
                              <p className="text-xs font-semibold text-slate-455 dark:text-slate-500">
                                Cohort MCA-A, Year 1
                              </p>
                            </div>
                            <button
                              onClick={() => window.open('https://zoom.us', '_blank')}
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 self-start md:self-auto"
                            >
                              <Play size={10} className="fill-current text-white" />
                              <span>Join Room</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Dynamic search results for other dates
                        <div className="space-y-4">
                          {scheduleEvents.filter(event => calendarMatchesDate(event.date, selectedCalendarDate)).map(event => (
                            <div key={event.id} className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 border-l-4 border-l-blue-600 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left animate-fadeIn">
                              {/* Time side */}
                              <div className="flex items-baseline md:flex-col justify-start md:justify-center md:text-center min-w-[75px]">
                                <span className="text-base font-black text-slate-950 dark:text-white leading-none">
                                  {event.date.split(',')[1]?.trim() || 'Session'}
                                </span>
                              </div>

                              {/* Mid details */}
                              <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    {event.type.toUpperCase()}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-[#253df5]" />
                                    <span>Zoom Room A</span>
                                  </span>
                                </div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                  {event.title}
                                </h3>
                                <p className="text-xs font-semibold text-slate-455 dark:text-slate-550">
                                  {event.cohort}
                                </p>
                              </div>

                              {/* Action trigger */}
                              <button
                                onClick={() => alert(`Launching Zoom link... Redirecting to Session: ${event.title}`)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 self-start md:self-auto"
                              >
                                <Play size={10} className="fill-current text-white" />
                                <span>Join Room</span>
                              </button>
                            </div>
                          ))}
                          
                          {/* If no events match */}
                          {scheduleEvents.filter(event => calendarMatchesDate(event.date, selectedCalendarDate)).length === 0 && (
                            <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-550">
                              <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 animate-pulse" />
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">No Actions Scheduled</h4>
                              <p className="text-xs mt-1">There are no lectures, reviews, or grading items scheduled for {formatCalendarDate(selectedCalendarDate)}.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Upcoming Schedule (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      UPCOMING SCHEDULE
                    </span>
                  </div>

                  {/* Main List Container */}
                  <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-5 shadow-xs divide-y divide-slate-100 dark:divide-slate-850/60 text-left space-y-4">
                    
                    {scheduleTab === 'Today' && (
                      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850/60 w-full">
                        {/* Row 1 */}
                        <div className="flex items-start gap-4 pt-0">
                          <div className="min-w-[70px] pt-0.5">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-white block">2:00 PM</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">30 min</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                              Thesis Review Sync
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <img loading="lazy" src={ananyaDesaiProfile} alt="Ananya" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Ananya Desai</span>
                            </div>
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex items-start gap-4 pt-4">
                          <div className="min-w-[70px] pt-0.5">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-white block">3:30 PM</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">1 hr</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                              Open Office Hours
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 mt-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-semibold">Room 402, Block C</span>
                            </div>
                          </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex items-start gap-4 pt-4">
                          <div className="min-w-[70px] pt-0.5">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-white block">5:00 PM</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">45 min</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                              Project Mentorship
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black uppercase flex-shrink-0">RS</div>
                              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Rahul Sharma</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {scheduleTab === 'Tomorrow' && (
                      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850/60 w-full">
                        {/* Tomorrow Row 1 */}
                        <div className="flex items-start gap-4 pt-0">
                          <div className="min-w-[70px] pt-0.5">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-white block">11:00 AM</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">30 min</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                              Thesis Review Sync
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[8px] font-black uppercase flex-shrink-0">MP</div>
                              <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Meera Patel</span>
                            </div>
                          </div>
                        </div>

                        {/* Tomorrow Row 2 */}
                        <div className="flex items-start gap-4 pt-4">
                          <div className="min-w-[70px] pt-0.5">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-white block">1:00 PM</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">1 hr</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                              Open Office Hours
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 mt-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-semibold">Room 402, Block C</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {scheduleTab === 'Select Date' && (
                      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850/60 w-full text-left">
                        {!selectedCalendarDate ? (
                          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-550">
                            Please select a date on the calendar.
                          </div>
                        ) : selectedCalendarDate === '2026-06-09' ? (
                          <>
                            {/* Today static events */}
                            <div className="flex items-start gap-4 pt-0">
                              <div className="min-w-[70px] pt-0.5">
                                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">2:00 PM</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">30 min</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                                  Thesis Review Sync
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <img loading="lazy" src={ananyaDesaiProfile} alt="Ananya" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                                  <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Ananya Desai</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 pt-4">
                              <div className="min-w-[70px] pt-0.5">
                                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">3:30 PM</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">1 hr</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                                  Open Office Hours
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 mt-1">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="text-[10px] font-semibold">Room 402, Block C</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 pt-4">
                              <div className="min-w-[70px] pt-0.5">
                                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">5:00 PM</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">45 min</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                                  Project Mentorship
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black uppercase flex-shrink-0">RS</div>
                                  <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Rahul Sharma</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : selectedCalendarDate === '2026-06-10' ? (
                          <>
                            {/* Tomorrow static events */}
                            <div className="flex items-start gap-4 pt-0">
                              <div className="min-w-[70px] pt-0.5">
                                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">11:00 AM</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">30 min</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                                  Thesis Review Sync
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[8px] font-black uppercase flex-shrink-0">MP</div>
                                  <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400">Meera Patel</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 pt-4">
                              <div className="min-w-[70px] pt-0.5">
                                <span className="text-xs font-extrabold text-slate-800 dark:text-white block">1:00 PM</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">1 hr</span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">
                                  Open Office Hours
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-400 mt-1">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="text-[10px] font-semibold">Room 402, Block C</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Other dates empty check
                          scheduleEvents.filter(event => calendarMatchesDate(event.date, selectedCalendarDate)).length === 0 && (
                            <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-550">
                              No events scheduled for this date.
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Dynamic additions from the form list */}
                    {scheduleEvents.filter(event => {
                      if (scheduleTab === 'Today' && !event.date.toLowerCase().includes('today')) return false;
                      if (scheduleTab === 'Tomorrow' && !event.date.toLowerCase().includes('tomorrow')) return false;
                      if (scheduleTab === 'Select Date' && !calendarMatchesDate(event.date, selectedCalendarDate)) return false;
                      return true;
                    }).length > 0 && (
                      <div className="pt-4 space-y-4 w-full text-left">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100 dark:border-slate-850/60">Scheduled Review Events</div>
                        {scheduleEvents.filter(event => {
                          if (scheduleTab === 'Today' && !event.date.toLowerCase().includes('today')) return false;
                          if (scheduleTab === 'Tomorrow' && !event.date.toLowerCase().includes('tomorrow')) return false;
                          if (scheduleTab === 'Select Date' && !calendarMatchesDate(event.date, selectedCalendarDate)) return false;
                          return true;
                        }).map(event => (
                          <div key={event.id} className="flex items-start gap-4 pt-3 border-t border-slate-100 dark:border-slate-850/60">
                            <div className="min-w-[70px]">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-white block">Event</span>
                              <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{event.duration}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-white block leading-snug">{event.title}</span>
                              <div className="flex justify-between items-center mt-1 text-[9px] font-semibold text-slate-400">
                                <span>Type: {event.type}</span>
                                <span className="font-mono">{event.cohort}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Pop-up Scheduling Event Modal Overlay */}
              {isSchedulingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                  {/* Backdrop click to close */}
                  <div 
                    onClick={() => setIsSchedulingModalOpen(false)}
                    className="fixed inset-0"
                  />
                  
                  {/* Modal Box */}
                  <div className="bg-white dark:bg-[#0c0c0c] border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-md text-left animate-slideUp">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-[#253df5] dark:text-blue-400 uppercase font-mono">
                          SCHEDULER SERVICE
                        </span>
                        <h3 className="text-lg font-black text-slate-909 dark:text-white mt-0.5">
                          Schedule Live Event
                        </h3>
                      </div>
                      <button 
                        onClick={() => setIsSchedulingModalOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={handleAddSession} className="space-y-4">
                      {/* Session Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block">Session Title</label>
                        <input 
                          type="text"
                          required
                          value={newSessionTitle}
                          onChange={(e) => setNewSessionTitle(e.target.value)}
                          placeholder="e.g. Backpropagation Deep-Dive Review"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                        />
                      </div>

                      {/* Target Cohort */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block">Target Cohort</label>
                        <div className="relative">
                          <select 
                            value={newSessionCohort}
                            onChange={(e) => setNewSessionCohort(e.target.value)}
                            className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#253df5] cursor-pointer"
                          >
                            {Object.keys(cohortsList).map(name => (
                              <option key={name}>{name}</option>
                            ))}
                          </select>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                            <ChevronDown size={14} />
                          </span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">Date</label>
                          <input 
                            type="date"
                            required
                            value={newSessionDateVal}
                            onChange={(e) => setNewSessionDateVal(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">Time</label>
                          <input 
                            type="time"
                            required
                            value={newSessionTimeVal}
                            onChange={(e) => setNewSessionTimeVal(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                          />
                        </div>
                      </div>

                      {/* Session Type */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider block">Session Type</label>
                        <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {['Office Hours', 'Review Session'].map(type => {
                            const isSelected = newSessionType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setNewSessionType(type)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-white dark:bg-[#0c0c0c] border border-slate-200/50 dark:border-slate-800 text-[#253df5] dark:text-blue-400 shadow-xs'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white'
                                }`}
                              >
                                  {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsSchedulingModalOpen(false)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#253df5] text-white hover:bg-blue-600 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Check size={14} />
                          <span>Schedule Session</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= VIEW: SETTINGS ================= */}
          {activeNav === 'Settings' && (
            <div className="space-y-6 w-full text-left animate-fadeIn">
              <div className="pb-6 border-b border-slate-205 dark:border-slate-800">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Educator Profile & Settings</h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Manage your profile credentials, notification channels, and active dashboard theme.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-2 text-left">
                  <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <form onSubmit={handleSaveSettings}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                      <User className="w-5 h-5 text-[#253df5]" />
                      <h3 className="font-extrabold text-base text-slate-909 dark:text-white">Personal Information</h3>
                    </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative group">
                      <img 
                        src={profileImage || "https://ui-avatars.com/api/?name="+formName} 
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">Full Name</label>
                      <input 
                        type="text"
                        value={formName} onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">Email Address</label>
                      <input 
                        type="email"
                        value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">Institution</label>
                      <input 
                        type="text"
                        defaultValue={user?.institute || 'Aether Academy'}
                        className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">Role</label>
                      <input 
                        type="text"
                        readOnly
                        defaultValue={user?.role || 'Lead Educator'}
                        className="w-full px-4 py-3 bg-slate-55/20 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isSavingSettings} className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-2xl transition-all duration-200 tracking-wider disabled:opacity-50 mt-6 flex items-center justify-center gap-2">
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
                  </form>
                  </div>
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left mt-6">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                    <Mail className="w-5 h-5 text-[#253df5]" />
                    <h3 className="font-extrabold text-base text-slate-909 dark:text-white">Contact Overseer</h3>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); setTimeout(() => { setContactSent(false); setContactMessage(''); }, 3000); }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase font-mono block">Message</label>
                      <textarea 
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can we help you?"
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
                        required
                      />
                    </div>
                    <button type="submit" className="flex items-center justify-center gap-2 bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-2xl transition-all duration-200 tracking-wider w-fit">
                      {contactSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      {contactSent ? "Message Sent" : "Send Message"}
                    </button>
                  </form>
                </div>

                {/* Connectivity Settings Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left mt-6">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                    <Network className="w-5 h-5 text-[#253df5]" />
                    <h3 className="font-extrabold text-base text-slate-909 dark:text-white">Connectivity & Integrations</h3>
                  </div>
                  <form onSubmit={handleSaveConnectivity} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">Telegram Username</label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={formTelegram} onChange={(e) => setFormTelegram(e.target.value)}
                            placeholder="@username"
                            className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">Contact Gmail</label>
                        <div className="relative">
                          <input 
                            type="email"
                            value={formGmail} onChange={(e) => setFormGmail(e.target.value)}
                            placeholder="Contact Gmail address"
                            className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
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
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-550 dark:text-slate-400 uppercase font-mono block">Phone Number</label>
                        <div className="relative">
                          <input 
                            type="text"
                            value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 bg-slate-55/50 dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-2xl text-xs font-bold text-slate-808 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#253df5]"
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
                    <button type="submit" disabled={isSavingSettings} className="bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-black py-3 px-6 rounded-2xl transition-all duration-200 tracking-wider disabled:opacity-50 mt-2 flex items-center justify-center gap-2 w-fit">
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
                  </form>
                </div>

                {/* Institutional Integrations Status Card for Mentors */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-left mt-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2.5">
                      <Network className="w-5 h-5 text-[#253df5]" />
                      <h3 className="font-extrabold text-base text-slate-909 dark:text-white">Institutional Bridges & Integrations</h3>
                    </div>
                    <button 
                      onClick={fetchMentorIntegrations}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Refresh Integrations"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {mentorIntegrations.length === 0 ? (
                      <p className="text-xs text-slate-500 font-semibold">No active LMS, SSO, or Data Lake integrations configured by Overseer.</p>
                    ) : (
                      mentorIntegrations.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">{item.type}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Provider: {item.provider} • Status: {item.status}</span>
                          </div>
                          <button
                            onClick={async () => {
                              setMentorSyncingId(item.id);
                              try {
                                await fetch(`http://localhost:8000/integrations/${item.id}/connect`, {
                                  method: 'POST',
                                  credentials: 'include'
                                });
                                await fetchMentorIntegrations();
                              } catch (e) {}
                              setMentorSyncingId(null);
                            }}
                            disabled={mentorSyncingId === item.id}
                            className="px-3 py-1.5 bg-[#253df5] hover:bg-[#1d2ae0] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {mentorSyncingId === item.id ? (
                              <>
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw size={12} />
                                <span>Test & Sync</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                </div>

                {/* Right Preferences Card */}
                <div className="bg-white dark:bg-[#0c0c0c] border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Sliders size={18} className="text-[#253df5] dark:text-brand-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">Preferences</h4>
                      <span className="text-[10px] font-bold text-slate-450 dark:text-slate-505 font-mono tracking-wider block mt-0.5">DASHBOARD CONFIG</span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-2">
                    {/* Theme choice */}
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-655 dark:text-slate-350">Dark Mode</span>
                      <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className={`w-11 h-6 rounded-full transition-all duration-300 relative border ${
                          theme === 'dark' 
                            ? 'bg-[#253df5] border-[#253df5]' 
                            : 'bg-slate-100 border-slate-205'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-all duration-300 ${
                          theme === 'dark' ? 'left-5.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Email summary toggle */}
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-655 dark:text-slate-350">Weekly Cohort Digest</span>
                      <button className="w-11 h-6 rounded-full transition-all duration-300 relative border bg-[#253df5] border-[#253df5]">
                        <span className="absolute top-0.5 left-5.5 w-4.5 h-4.5 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MOBILE SIDEBAR DRAWDOWN ================= */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Drawer drawer content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-[#0c0c0c] border-r border-[#eef2f6] dark:border-slate-800 p-6 justify-between z-10 transition-transform duration-300">
            <div className="space-y-6 text-left">
              {/* Logo & Close Button */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">AetherLearn</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">AI Education Suite</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1d273a]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Create New Cohort Button */}
              <div className="pb-2">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    setActiveNav('My Cohorts');
                    setIsCreatingCohort(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#253df5] hover:bg-blue-650 text-white rounded-xl text-xs font-black tracking-wide transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Create New Cohort</span>
                </button>
              </div>

              {/* Sidebar Links */}
              <nav className="space-y-1.5" aria-label="Mobile Navigation">
                {navItems.filter(item => item.name !== 'Settings').map((item) => {
                  const isActive = activeNav === item.name;
                  const displayName = item.name === 'Analytics & Reports' ? 'Analytics & Insights' : item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveNav(item.name);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-[#253df5] dark:bg-[#253df5]'
                          : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{displayName}</span>
                      </div>
                      {item.name === 'Grading Queue' && gradingQueue.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${isActive ? 'bg-white text-[#253df5]' : 'bg-rose-500 text-white'}`}>
                          {gradingQueue.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom links & Profile Card in mobile */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850/60 text-left">
              {/* Settings link */}
              <button
                onClick={() => {
                  setActiveNav('Settings');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  activeNav === 'Settings'
                    ? 'text-white bg-[#253df5]'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <div className="border-t border-slate-105 dark:border-slate-800 my-2" />

              {/* Profile card mobile */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 font-extrabold text-[10px] uppercase border border-slate-205 dark:border-slate-700">
                    img
                  </div>
                  <div className="truncate">
                    <h4 className="font-extrabold text-xs text-slate-805 dark:text-white leading-tight">
                      {user?.name || 'Prof. Arjun Singh'}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">Computer Science</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onLogout();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
