import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Video, User, Play, Bell, Check, ArrowRight, X, 
  Volume2, VolumeX, MessageSquare, Users, Send, Share2, Camera, 
  Mic, MicOff, CameraOff, ChevronRight, Sparkles 
} from 'lucide-react';

// Import Assets
import liveHeroRoom from '../assets/live_hero_room.png';
import quantumScientist from '../assets/quantum_scientist.png';
import agiStage from '../assets/agi_stage.png';
import forecastingChart from '../assets/forecasting_chart.png';
import generativeAiAbstract from '../assets/generative_ai_abstract.png';
import circuitBoard from '../assets/circuit_board.png';
import alexChenAvatar from '../assets/julian_vance_profile.png';
import sarahJenkinsAvatar from '../assets/sarah_profile.png';
import davidKimAvatar from '../assets/vikram_singh_profile.png';

export default function LiveSessions() {
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
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] py-8 sm:py-12 transition-colors duration-300 animate-fadeIn">
      
      {/* Toast Notification alert */}
      {classAlert && (
        <div className="fixed top-24 right-6 z-55 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-805/10 dark:border-white/20 animate-slideIn">
          <Bell className="w-4 h-4 text-blue-500 animate-swing" />
          <span>{classAlert}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ================= HERO SECTION ================= */}
        <section className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 text-left relative overflow-hidden transition-all duration-300 hover:shadow-md">
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
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
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
                    className="bg-white dark:bg-[#0d1326]/60 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-lg dark:hover:shadow-black/20 rounded-3xl p-6 flex flex-col justify-between gap-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex justify-between items-center">
                        <span className={session.tagClass}>
                          {session.tag}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                          isToday 
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
                          className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 border cursor-pointer ${
                            isReminderSet
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
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
                <div className="w-full max-w-3xl aspect-video bg-[#0d1326] border border-slate-850 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                  
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
                      <div className={`inline-block px-3 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === 'You'
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
                  className={`p-3.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    isAudioMuted 
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button 
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className={`p-3.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    isVideoMuted 
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
