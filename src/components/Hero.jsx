import React from 'react';
import { Play, TrendingUp, Cpu, Activity, BrainCircuit } from 'lucide-react';

export default function Hero() {
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
            <a
              href="#trial"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Start Free Trial
            </a>

          </div>

        </div>

        {/* RIGHT COLUMN: Neural Pathway progress card */}
        <div className="lg:col-span-6 flex justify-center items-center relative">
          
          {/* Card Wrapper */}
          <div className="relative bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/80 dark:shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-[100%] max-w-[32rem] transition-all duration-300 animate-slideInRight">
            
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
            <div className="relative bg-[#0d1326] border border-slate-800/80 rounded-2xl p-4 sm:p-6 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
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
              <div className="absolute left-4 top-1/4 z-20 bg-white/95 dark:bg-[#0d1326]/95 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 shadow-lg rounded-2xl p-3 flex items-center gap-3 hover:scale-102 transition-all duration-300">
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
