'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

// Soft, satisfying notification chime using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    // Warm sine tone — gentle "pop" note (C6 → E6 slide)
    const tone = ctx.createOscillator();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(1047, now);
    tone.frequency.exponentialRampToValueAtTime(1319, now + 0.08);

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    // Subtle harmonic shimmer
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2093, now);
    shimmer.frequency.exponentialRampToValueAtTime(2637, now + 0.08);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0, now);
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    // Second soft note (the "pop-pop" dopamine hit)
    const tone2 = ctx.createOscillator();
    tone2.type = 'sine';
    tone2.frequency.setValueAtTime(1319, now + 0.12);
    tone2.frequency.exponentialRampToValueAtTime(1568, now + 0.18);

    const tone2Gain = ctx.createGain();
    tone2Gain.gain.setValueAtTime(0, now + 0.12);
    tone2Gain.gain.linearRampToValueAtTime(0.08, now + 0.135);
    tone2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.7, now);

    tone.connect(toneGain).connect(master);
    shimmer.connect(shimmerGain).connect(master);
    tone2.connect(tone2Gain).connect(master);
    master.connect(ctx.destination);

    tone.start(now);
    shimmer.start(now);
    tone2.start(now + 0.12);
    tone.stop(now + 0.3);
    shimmer.stop(now + 0.25);
    tone2.stop(now + 0.4);

    setTimeout(() => ctx.close().catch(() => {}), 500);
  } catch {}
}

export default function NotificationSystem() {
  const { addNotification } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const permissionRef = useRef<NotificationPermission>('default');
  const lastNotificationCount = useRef(0);
  const { notifications } = useApp();
  const { user } = useAuth();

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      permissionRef.current = 'granted';
      return;
    }
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      permissionRef.current = result;
    }
  }, []);

  const registerSW = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch {}
    }
  }, []);

  // Play sound for REAL new notifications (not simulated)
  // Only runs when the notifications array actually changes from real sources
  useEffect(() => {
    if (notifications.length > lastNotificationCount.current) {
      const newCount = notifications.length - lastNotificationCount.current;
      // Only play if a real notification was added (not on initial load)
      if (lastNotificationCount.current > 0) {
        playNotificationSound();

        // Browser push notification if tab is hidden
        if (permissionRef.current === 'granted' && document.hidden) {
          const latest = notifications[0];
          try {
            const opts: any = {
              body: latest.content,
              icon: '/icons/icon-192.png',
              badge: '/icons/icon-192.png',
              tag: latest.type,
              renotify: true,
              vibrate: [100, 50, 200, 50, 100],
            };
            const notif = new Notification(`🐝 ${latest.actor.displayName}`, opts);
            notif.onclick = () => {
              window.focus();
              notif.close();
            };
          } catch {}
        }
      }
      lastNotificationCount.current = notifications.length;
    }
  }, [notifications, permissionRef]);

  useEffect(() => {
    requestPermission();
    registerSW();
  }, [requestPermission, registerSW]);

  return null; // Invisible component — runs in background
}
