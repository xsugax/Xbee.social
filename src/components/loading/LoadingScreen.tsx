'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        const increment = prev < 40 ? 3 : prev < 70 ? 2.5 : prev < 90 ? 2 : 1.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06060e]"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background ambient gradients */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-600/[0.04] via-indigo-500/[0.06] to-cyan-500/[0.04] blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-600/[0.03] blur-[120px]" />
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Content */}
          <div className="relative flex flex-col items-center">

            {/* Company Logo Mark */}
            <motion.div
              className="relative mb-10"
              initial={{ scale: 0.3, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-[-20px] rounded-3xl border border-white/[0.04]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ delay: 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-[-10px] rounded-2xl border border-white/[0.06]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />

              {/* Spinning accent */}
              <motion.div
                className="absolute inset-[-16px] rounded-3xl"
                style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 65%, rgba(59, 130, 246, 0.2) 80%, rgba(139, 92, 246, 0.15) 90%, transparent 100%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Logo container */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-600/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.12]" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Company X Logo */}
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative z-10 drop-shadow-lg">
                  <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
                </svg>
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.div
              className="text-center mb-1"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <h1 className="text-5xl font-black tracking-tight text-white">
                Xbee
              </h1>
            </motion.div>

            {/* Product label */}
            <motion.div
              className="flex items-center gap-3 mb-1"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/20" />
              <p className="text-[13px] font-semibold text-white/40 tracking-[0.35em] uppercase">
                Messenger
              </p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/20" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-[13px] text-white/25 mb-10 text-center max-w-[280px] leading-relaxed"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Where trust, intelligence, and real human value coexist.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-56 h-[3px] bg-white/[0.06] rounded-full overflow-hidden mb-3"
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                }}
                transition={{ duration: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </motion.div>

            {/* Status text */}
            <motion.p
              className="text-[11px] text-white/20 font-medium tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {progress < 15
                ? '🔐 Initializing secure environment...'
                : progress < 30
                  ? '🛡️ Loading trust layer...'
                  : progress < 45
                    ? '🔗 Establishing encrypted channels...'
                    : progress < 60
                      ? '🤖 Warming up Xbee AI engine...'
                      : progress < 75
                        ? '📡 Syncing latest posts & updates...'
                        : progress < 88
                          ? '✨ Preparing your personalized feed...'
                          : progress < 100
                            ? '🚀 Almost ready...'
                            : '⚡ Welcome to Xbee'}
            </motion.p>

            {/* Company footer */}
            <motion.div
              className="mt-16 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {/* Company name */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-px bg-white/[0.08]" />
                <p className="text-[10px] text-white/[0.12] tracking-[0.3em] uppercase font-semibold">
                  Xbee Technologies
                </p>
                <div className="w-6 h-px bg-white/[0.08]" />
              </div>

              {/* Est badge */}
              <p className="text-[9px] text-white/[0.1] tracking-[0.2em] uppercase">
                Est. 1996 &bull; 30 Years of Trusted Communication
              </p>

              {/* Status indicators */}
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-sm shadow-emerald-500/30" />
                  <span className="text-[9px] text-white/15 font-medium">All Systems Operational</span>
                </div>
                <span className="text-[9px] text-white/[0.06]">|</span>
                <span className="text-[9px] text-white/15 font-medium">E2E Encrypted</span>
                <span className="text-[9px] text-white/[0.06]">|</span>
                <span className="text-[9px] text-white/15 font-medium">v2.0</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
