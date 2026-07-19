import React from 'react';
import sarahProfile from '../assets/sarah_profile.png';

export default function MeasurableEvolution() {
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
            <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800/80 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 shadow-xl dark:shadow-black/15 rounded-3xl p-6 text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none block mb-1">
                3.4x
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight block">
                Faster Concept Mastery
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800/80 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 shadow-xl dark:shadow-black/15 rounded-3xl p-6 text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">
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
          <div className="relative bg-white dark:bg-[#0d1326]/65 border border-slate-100 dark:border-slate-800/80 shadow-2xl shadow-slate-200/80 dark:shadow-black/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-md text-left transition-all duration-300 hover:border-slate-250 dark:hover:border-slate-700 hover:shadow-2xl">
            
            {/* Card Header (User profile details + Quote mark) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Profile Photo */}
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 overflow-hidden shadow-sm flex-shrink-0">
                  <img 
                    src={sarahProfile} 
                    alt="Sarah J. Data Science Cohort student" 
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
