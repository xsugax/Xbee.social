'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Eye, CheckCircle, AlertTriangle, Users, Clock } from 'lucide-react';
import { TrustProfile } from '@/types';
import TrustBadge from './TrustBadge';
import { cn } from '@/lib/utils';

interface TrustScoreCardProps {
  trust: TrustProfile;
  compact?: boolean;
}

function getTrustColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-500';
  return 'text-orange-400';
}

function getBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-blue-400';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-orange-400';
}

export default function TrustScoreCard({ trust, compact = false }: TrustScoreCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <TrustBadge score={trust.score} tier={trust.tier} size="md" showScore showLabel />
        <div className="flex-1 h-1.5 rounded-full bg-theme-tertiary overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', getBarColor(trust.score))}
            initial={{ width: 0 }}
            animate={{ width: `${trust.score}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-4 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={cn('w-5 h-5', getTrustColor(trust.score))} />
          <span className="text-sm font-bold text-theme-primary">Trust Score</span>
        </div>
        <TrustBadge score={trust.score} tier={trust.tier} size="md" showScore showLabel />
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn('text-2xl font-black', getTrustColor(trust.score))}>{trust.score}</span>
          <span className="text-xs text-theme-tertiary">/100</span>
        </div>
        <div className="h-2 rounded-full bg-theme-tertiary overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', getBarColor(trust.score))}
            initial={{ width: 0 }}
            animate={{ width: `${trust.score}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricItem icon={Eye} label="Reach" value={`${trust.reachMultiplier}x`} positive={trust.reachMultiplier >= 1} />
        <MetricItem icon={CheckCircle} label="Consistency" value={`${trust.consistencyScore}%`} positive={trust.consistencyScore >= 60} />
        <MetricItem icon={Clock} label="Account Age" value={`${trust.accountAge}d`} positive={trust.accountAge >= 30} />
        <MetricItem icon={Users} label="Reports" value={`${trust.reportCount}`} positive={trust.reportCount === 0} />
      </div>

      {/* Behavior signals */}
      {trust.behaviorSignals.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-theme-tertiary uppercase tracking-wider">Signals</span>
          {trust.behaviorSignals.slice(0, 3).map((signal, i) => (
            <div key={i} className={cn(
              'flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg',
              signal.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
            )}>
              {signal.type === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{signal.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Monetization unlock */}
      {!trust.monetizationUnlocked && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-xbee-primary/5 border border-xbee-primary/20">
          <AlertTriangle className="w-4 h-4 text-xbee-primary shrink-0" />
          <span className="text-xs text-xbee-primary">
            Reach trust score 75+ to unlock monetization
          </span>
        </div>
      )}
    </motion.div>
  );
}

function MetricItem({ icon: Icon, label, value, positive }: { icon: React.ElementType; label: string; value: string; positive: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-theme-hover/50">
      <Icon className={cn('w-3.5 h-3.5', positive ? 'text-emerald-400' : 'text-orange-400')} />
      <div>
        <p className="text-[11px] text-theme-tertiary">{label}</p>
        <p className="text-xs font-bold text-theme-primary">{value}</p>
      </div>
    </div>
  );
}
