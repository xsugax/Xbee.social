'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="py-20 text-center px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-theme-hover flex items-center justify-center">
        <Icon className="w-8 h-8 text-theme-tertiary opacity-50" />
      </div>
      <h2 className="text-lg font-bold text-theme-primary mb-1">{title}</h2>
      <p className="text-sm text-theme-tertiary max-w-[320px] mx-auto leading-relaxed">{description}</p>
      {action && (
        <motion.button
          className="mt-4 xbee-button-primary py-2 px-6 text-sm"
          onClick={action.onClick}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
