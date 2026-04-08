'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Crown, AlertTriangle } from 'lucide-react';
import { TrustTier, VerificationType } from '@/types';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  score: number;
  tier: TrustTier;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  showLabel?: boolean;
  verification?: VerificationType;
}

const tierConfig: Record<TrustTier, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: Shield },
  building: { label: 'Building', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: ShieldAlert },
  established: { label: 'Established', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', icon: Shield },
  trusted: { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: ShieldCheck },
  authority: { label: 'Authority', color: 'text-xbee-primary', bg: 'bg-xbee-primary/10', border: 'border-xbee-primary/30', icon: Crown },
  diamond: { label: 'Diamond', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', icon: Crown },
  legendary: { label: 'Legendary', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: Crown },
};

const sizeMap = {
  sm: 'w-[18px] h-[18px]',
  md: 'w-[22px] h-[22px]',
  lg: 'w-[26px] h-[26px]',
};

// Real X/Twitter verified checkmark SVG
function VerifiedCheckmark({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-label="Verified account" className={className}>
      <path
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.607-.274 1.264-.144 1.897.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
        fill={color}
      />
    </svg>
  );
}

export default function TrustBadge({ score, tier, size = 'sm', showScore = false, showLabel = false, verification = 'none' }: TrustBadgeProps) {
  const config = tierConfig[tier];

  if (score < 30) {
    return (
      <div className={cn('inline-flex items-center gap-1', showLabel && 'px-2 py-0.5 rounded-full', showLabel && config.bg, showLabel && 'border', showLabel && config.border)}>
        <AlertTriangle className={cn(sizeMap[size], 'text-orange-400')} />
        {showScore && <span className="text-[11px] font-bold text-orange-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-orange-400">Low Trust</span>}
      </div>
    );
  }

  // Authority = Gold verified badge (like X Gold/Org)
  if (verification === 'authority') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Verified Organization / Public Figure"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#F59E0B" />
        {showScore && <span className="text-[11px] font-bold text-amber-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-amber-400">Verified</span>}
      </motion.div>
    );
  }

  // Government = Red verified badge
  if (verification === 'government') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Government / Official"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#EF4444" />
        {showScore && <span className="text-[11px] font-bold text-red-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-red-400">Official</span>}
      </motion.div>
    );
  }

  // Business = Green verified badge
  if (verification === 'business') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Verified Business"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#10B981" />
        {showScore && <span className="text-[11px] font-bold text-emerald-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-emerald-400">Business</span>}
      </motion.div>
    );
  }

  // Celebrity = Purple verified badge
  if (verification === 'celebrity') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Celebrity / Public Figure"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#A855F7" />
        {showScore && <span className="text-[11px] font-bold text-purple-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-purple-400">Celebrity</span>}
      </motion.div>
    );
  }

  // Creator = Pink verified badge
  if (verification === 'creator') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Verified Creator"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#EC4899" />
        {showScore && <span className="text-[11px] font-bold text-pink-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-pink-400">Creator</span>}
      </motion.div>
    );
  }

  // Identity = Blue verified badge (like X Blue)
  if (verification === 'identity') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Verified Identity"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#1DA1F2" />
        {showScore && <span className="text-[11px] font-bold text-blue-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-blue-400">Verified</span>}
      </motion.div>
    );
  }

  // Official = Gold verified badge (official accounts)
  if (verification === 'official') {
    return (
      <motion.div
        className={cn(
          'inline-flex items-center gap-1',
          showLabel && 'px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30',
        )}
        whileHover={{ scale: 1.05 }}
        title="Official Account"
      >
        <VerifiedCheckmark className={sizeMap[size]} color="#F59E0B" />
        {showScore && <span className="text-[11px] font-bold text-yellow-400">{score}</span>}
        {showLabel && <span className="text-[11px] font-medium text-yellow-400">Official</span>}
      </motion.div>
    );
  }

  // Default: trust-tier badge for unverified users
  const Icon = config.icon;
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1',
        showLabel && 'px-2 py-0.5 rounded-full',
        showLabel && config.bg,
        showLabel && 'border',
        showLabel && config.border,
      )}
      whileHover={{ scale: 1.05 }}
    >
      <Icon className={cn(sizeMap[size], config.color)} />
      {showScore && <span className={cn('text-[11px] font-bold', config.color)}>{score}</span>}
      {showLabel && <span className={cn('text-[11px] font-medium', config.color)}>{config.label}</span>}
    </motion.div>
  );
}
