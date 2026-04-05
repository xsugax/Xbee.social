'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

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

  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover', sizeClasses[size])}
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
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}
