import React from 'react';
import { GraduationCap, Users, Shield } from 'lucide-react';

export default function Ecosystem() {
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
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.01]">
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
        <div className="relative bg-white dark:bg-[#0d1326]/85 border-2 border-brand-500/60 dark:border-brand-500/50 shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:scale-[1.015]">
          
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
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col items-center text-center gap-5 transition-all duration-305 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.01]">
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
