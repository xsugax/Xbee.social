'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DemoBadge() {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <span className="text-[10px] font-bold text-amber-400 tracking-wide uppercase">Demo Mode</span>
    </motion.div>
  );
}
