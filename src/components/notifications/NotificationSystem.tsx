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
    tone.frequency.setValueAtTime(1047, now);          // C6
    tone.frequency.exponentialRampToValueAtTime(1319, now + 0.08); // slide to E6

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(0.12, now + 0.015);  // quick fade in
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); // soft decay

    // Subtle harmonic shimmer (an octave above, very quiet)
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2093, now);       // C7
    shimmer.frequency.exponentialRampToValueAtTime(2637, now + 0.08); // E7

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0, now);
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    // Second soft note after a tiny gap (the "pop-pop" dopamine hit)
    const tone2 = ctx.createOscillator();
    tone2.type = 'sine';
    tone2.frequency.setValueAtTime(1319, now + 0.12);  // E6
    tone2.frequency.exponentialRampToValueAtTime(1568, now + 0.18); // G6

    const tone2Gain = ctx.createGain();
    tone2Gain.gain.setValueAtTime(0, now + 0.12);
    tone2Gain.gain.linearRampToValueAtTime(0.08, now + 0.135);
    tone2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Connect all through a master volume
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

    // Clean up context after sound finishes
    setTimeout(() => ctx.close().catch(() => {}), 500);
  } catch {
    // AudioContext not supported — silent fallback
  }
}

// Simulated notification content
const notificationTemplates = [
  { title: '🐝 New Like', body: (u: string) => `${u} liked your post`, type: 'like', url: '/notifications' },
  { title: '🐝 New Comment', body: (u: string) => `${u} commented: "This is great!"`, type: 'comment', url: '/notifications' },
  { title: '🐝 New Follower', body: (u: string) => `${u} started following you`, type: 'follow', url: '/notifications' },
  { title: '🐝 New Message', body: (u: string) => `${u}: Hey, check this out!`, type: 'message', url: '/messages' },
  { title: '🐝 Repost', body: (u: string) => `${u} reposted your content`, type: 'repost', url: '/notifications' },
  { title: '🐝 Trust Score Up', body: () => 'Your trust score increased! +2 points', type: 'trust', url: '/profile' },
  { title: '🐝 Trending', body: () => 'Your post is trending on Xbee!', type: 'trending', url: '/explore' },
  { title: '🐝 Mention', body: (u: string) => `${u} mentioned you in a post`, type: 'mention', url: '/notifications' },
];

const fakeUsers = ['Aisha Chen', 'Marcus Thompson', 'Elena Voss', 'James Wilson', 'Priya Sharma', 'David Chen', 'Sophie Taylor', 'Omar Khalid', 'Luna Garcia', 'Alex Rivers'];

export default function NotificationSystem() {
  const { addNotification } = useApp();
  const { isSupabaseConfigured } = useAuth();
  const permissionRef = useRef<NotificationPermission>('default');
  const timerRef = useRef<NodeJS.Timeout>();

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

  const sendNotification = useCallback((template: typeof notificationTemplates[0], user: string) => {
    const body = template.body(user);

    // Play soft notification chime
    playNotificationSound();

    // In-app notification via context
    addNotification?.({
      id: `notif-${Date.now()}`,
      type: template.type as any,
      content: body,
      time: 'Just now',
      read: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.replace(/\s/g, '')}`,
      actionUrl: template.url,
    });

    // Browser/OS push notification
    if (permissionRef.current === 'granted' && document.hidden) {
      try {
        const opts: any = {
          body,
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-192.png',
          tag: template.type,
          renotify: true,
          vibrate: [100, 50, 200, 50, 100],
          data: { url: template.url },
        };
        const notif = new Notification(template.title, opts);
        notif.onclick = () => {
          window.focus();
          window.location.href = template.url;
          notif.close();
        };
      } catch {}
    }
  }, [addNotification]);

  // Start periodic simulated notifications (demo mode only)
  useEffect(() => {
    requestPermission();
    registerSW();

    // In live Supabase mode, only request permission — no fake notifications
    if (isSupabaseConfigured) return;

    // First notification after 45s, then random intervals
    const scheduleNext = () => {
      const delay = 30000 + Math.random() * 90000; // 30s to 2min
      timerRef.current = setTimeout(() => {
        const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
        const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        sendNotification(template, user);
        scheduleNext();
      }, delay);
    };

    // Initial burst — 3 quick notifications to demonstrate the system
    const initialTimer = setTimeout(() => {
      sendNotification(notificationTemplates[0], fakeUsers[0]); // like
      setTimeout(() => sendNotification(notificationTemplates[3], fakeUsers[2]), 8000); // message
      setTimeout(() => sendNotification(notificationTemplates[5], ''), 18000); // trust score
      scheduleNext();
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [requestPermission, registerSW, sendNotification, isSupabaseConfigured]);

  return null; // Invisible component — runs in background
}
