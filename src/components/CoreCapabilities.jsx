import React from 'react';
import { TrendingUp, BarChart2, Target, Users } from 'lucide-react';

export default function CoreCapabilities() {
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
        <div className="relative bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 overflow-hidden transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
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
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          
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
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          
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
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-3xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          
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
