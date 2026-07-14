'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  online?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const colors = [
  'from-xbee-primary to-xbee-secondary',
  'from-xbee-secondary to-xbee-accent',
  'from-xbee-accent to-emerald-400',
  'from-pink-500 to-xbee-secondary',
  'from-amber-500 to-orange-500',
  'from-cyan-400 to-xbee-primary',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ src, name, size = 'md', verified, online, className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = getColor(name);
  const [imgError, setImgError] = useState(false);

  const showImg = src && src.startsWith('http') && !imgError;

  return (
    <div className={cn('relative shrink-0', className)}>
      {showImg ? (
        <img
          src={src}
          alt={`${name}'s avatar`}
          className={cn('rounded-full object-cover bg-theme-hover', sizeClasses[size])}
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold',
            sizeClasses[size],
            color
          )}
        >
          {initials}
        </div>
      )}
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-xbee-success rounded-full border-2 border-theme-primary" />
      )}
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-xbee-primary rounded-full flex items-center justify-center border-2 border-theme-primary">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  );
}
