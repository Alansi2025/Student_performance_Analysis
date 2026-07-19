import React, { useState } from 'react';
import { 
  Mail, Calendar, ExternalLink, Award, Search, Star, X, 
  BarChart2, Brain, Check, CheckCircle, Clock, Sliders, 
  Sparkles 
} from 'lucide-react';

// Import Assets
import julianVanceProfile from '../assets/julian_vance_profile.png';
import sarahProfile from '../assets/sarah_profile.png';
import marcusProfile from '../assets/marcus_profile.png';

export default function MentorsList() {
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
      avatar: sarahProfile,
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
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] py-8 sm:py-12 transition-colors duration-300 animate-fadeIn text-slate-900 dark:text-white">
      
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
            <div className="relative flex items-center bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs focus-within:border-brand-500 transition-colors pl-4 pr-2.5 py-1.5 gap-2.5">
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
                  className="bg-white dark:bg-[#0d1326]/60 border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-lg dark:hover:shadow-black/20 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 flex flex-col text-left group relative"
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-[#eef2f6] dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 text-left transition-all duration-300 shadow-xs hover:shadow-md hover:border-brand-500/30">
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
          <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative animate-scaleUp p-6 space-y-5 text-left">
            
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
                        className={`p-2.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                          isSelected
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
          <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative animate-scaleUp p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left gap-6">
            
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
                      onClick={(e) => { e.preventDefault(); alert('Redirecting to LinkedIn...'); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-[#253df5] hover:bg-blue-100/60 dark:hover:bg-blue-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-100 dark:border-brand-500/10"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert('Redirecting to GitHub...'); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-205 dark:border-slate-800"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
