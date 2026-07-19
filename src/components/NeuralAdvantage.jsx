import React from 'react';
import { TrendingUp, BrainCircuit, Waves } from 'lucide-react';

export default function NeuralAdvantage() {
  // 54 detailed node coordinates for the left hemisphere outlining frontal, parietal, occipital, temporal, and cerebellum lobes
  const leftNodes = [
    // Track 1: Outer perimeter of cerebral cortex
    { x: 142, y: 22, size: 1.5 },
    { x: 130, y: 24, size: 1.5 },
    { x: 115, y: 28, size: 2 },
    { x: 100, y: 36, size: 1.5 },
    { x: 86, y: 48, size: 2, pulse: true },
    { x: 74, y: 64, size: 1.5 },
    { x: 66, y: 82, size: 2 },
    { x: 62, y: 100, size: 2.5, pulse: true },
    { x: 64, y: 118, size: 2 },
    { x: 72, y: 136, size: 1.5 },
    { x: 84, y: 152, size: 2 },
    { x: 98, y: 164, size: 1.5 },
    { x: 114, y: 172, size: 2.5, pulse: true },
    { x: 130, y: 176, size: 1.5 },
    { x: 142, y: 170, size: 2 },

    // Track 2: Mid-outer concentric cortex layers
    { x: 138, y: 38, size: 1.5 },
    { x: 122, y: 42, size: 2 },
    { x: 108, y: 48, size: 1.5 },
    { x: 94, y: 58, size: 2, pulse: true },
    { x: 84, y: 72, size: 1.5 },
    { x: 78, y: 88, size: 2 },
    { x: 76, y: 104, size: 1.5 },
    { x: 78, y: 120, size: 2, pulse: true },
    { x: 84, y: 136, size: 1.5 },
    { x: 94, y: 148, size: 2 },
    { x: 108, y: 158, size: 1.5 },
    { x: 124, y: 162, size: 2 },
    { x: 138, y: 154, size: 1.5 },

    // Track 3: Mid-inner layers
    { x: 132, y: 54, size: 2, pulse: true },
    { x: 118, y: 58, size: 1.5 },
    { x: 104, y: 66, size: 2 },
    { x: 94, y: 78, size: 1.5 },
    { x: 88, y: 94, size: 2.5, pulse: true },
    { x: 88, y: 110, size: 1.5 },
    { x: 94, y: 126, size: 2 },
    { x: 104, y: 138, size: 1.5 },
    { x: 118, y: 146, size: 2 },
    { x: 132, y: 140, size: 1.5 },

    // Track 4: Inner core layers
    { x: 126, y: 70, size: 1.5 },
    { x: 114, y: 74, size: 2, pulse: true },
    { x: 104, y: 84, size: 1.5 },
    { x: 98, y: 98, size: 2 },
    { x: 98, y: 112, size: 1.5 },
    { x: 104, y: 124, size: 2, pulse: true },
    { x: 114, y: 132, size: 1.5 },
    { x: 126, y: 126, size: 2 },

    // Track 5: Deep subcortical region
    { x: 132, y: 86, size: 1.5 },
    { x: 122, y: 90, size: 2 },
    { x: 114, y: 98, size: 2.5, pulse: true },
    { x: 114, y: 108, size: 2 },
    { x: 122, y: 114, size: 1.5 },
    { x: 132, y: 110, size: 2 }
  ];

  // Mirror left nodes to construct the right hemisphere
  const rightNodes = leftNodes.map(node => ({
    x: 300 - node.x, // Mirror along center line (150)
    y: node.y,
    size: node.size,
    pulse: node.pulse
  }));

  const allNodes = [...leftNodes, ...rightNodes];

  // Create connection lines for nearby nodes (Euclidean distance threshold)
  const lines = [];
  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const n1 = allNodes[i];
      const n2 = allNodes[j];
      
      // Do not draw connections across the middle sagittal fissure to maintain separation
      const sameHemisphere = (n1.x <= 145 && n2.x <= 145) || (n1.x >= 155 && n2.x >= 155);
      
      if (sameHemisphere) {
        const distance = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        // Connect nodes close to each other to generate a detailed mesh grid
        if (distance < 24) {
          lines.push({ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y });
        }
      }
    }
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Brain visualization card */}
        <div className="lg:col-span-6 flex justify-center items-center relative order-2 lg:order-1">
          
          {/* Main Visual Card */}
          <div className="relative bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/80 dark:shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-lg transition-all duration-300">
            
            {/* Visual Screen Container */}
            <div className="relative bg-[#0d1326] border border-slate-800/85 rounded-2xl p-4 sm:p-6 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
              
              {/* Radial glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18),transparent_70%)] pointer-events-none" />

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Highly Detailed Brain SVG */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Center Sagittal Fissure shadow gap line */}
                <line x1="150" y1="20" x2="150" y2="180" stroke="rgba(6,182,212,0.08)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Neural mesh connecting lines */}
                {lines.map((line, idx) => (
                  <line 
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(6,182,212,0.18)" 
                    strokeWidth="0.65" 
                  />
                ))}

                {/* Synaptic nodes (dots) */}
                {allNodes.map((node, idx) => (
                  <circle
                    key={idx}
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    className={`${node.pulse ? 'fill-cyan-300 animate-pulse' : 'fill-cyan-500/80'} transition-all`}
                  />
                ))}
              </svg>

            </div>

            {/* Status Bar */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between transition-colors duration-300">
              <span className="text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-gray-500 font-mono uppercase">
                Real-Time Adaptation
              </span>
              
              {/* Progress bar */}
              <div className="w-1/3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full" />
              </div>

              <div className="text-brand-500 dark:text-brand-400">
                <Waves size={16} className="animate-pulse" />
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Texts & Features list */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left order-1 lg:order-2">
          
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            The Neural{' '}
            <span className="text-blue-900 dark:text-blue-400">
              Advantage
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-300">
            Every mind processes information differently. AetherLearn's 
            proprietary engine continuously maps your cognitive load, 
            learning velocity, and retention decay.
          </p>

          {/* Features */}
          <div className="space-y-6 max-w-xl">
            
            {/* Feature 1 */}
            <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center flex-shrink-0 border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 group-hover:scale-105">
                <TrendingUp size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  Dynamic Pacing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                  The curriculum slows down for complex topics and accelerates 
                  through mastered concepts, ensuring optimal flow state.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 items-start group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 group-hover:scale-105">
                <BrainCircuit size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                  Cognitive Load Balancing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                  Prevents burnout by measuring interaction patterns and scheduling 
                  micro-breaks precisely when your brain needs them.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
