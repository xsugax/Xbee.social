'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

// Generate bee buzz sound using Web Audio API
function playBeeSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Buzz oscillator 1
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
    osc1.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.2);
    osc1.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    // Buzz oscillator 2 (slightly detuned for richness)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(185, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(225, ctx.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(165, ctx.currentTime + 0.2);
    osc2.frequency.exponentialRampToValueAtTime(205, ctx.currentTime + 0.3);

    // High frequency wing flutter
    const flutter = ctx.createOscillator();
    flutter.type = 'sine';
    flutter.frequency.setValueAtTime(600, ctx.currentTime);
    flutter.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.35);

    // Gain envelopes
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.03);
    gain1.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
    gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.03);
    gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);

    const gainFlutter = ctx.createGain();
    gainFlutter.gain.setValueAtTime(0, ctx.currentTime);
    gainFlutter.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gainFlutter.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);

    osc1.connect(gain1).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    flutter.connect(gainFlutter).connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    flutter.start(ctx.currentTime);

    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
    flutter.stop(ctx.currentTime + 0.4);

    // Double buzz — play again after tiny gap
    setTimeout(() => {
      try {
        const ctx2 = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx2.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(200, ctx2.currentTime);
        o.frequency.exponentialRampToValueAtTime(240, ctx2.currentTime + 0.08);
        o.frequency.exponentialRampToValueAtTime(180, ctx2.currentTime + 0.2);
        const g = ctx2.createGain();
        g.gain.setValueAtTime(0.12, ctx2.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx2.currentTime + 0.25);
        o.connect(g).connect(ctx2.destination);
        o.start(ctx2.currentTime);
        o.stop(ctx2.currentTime + 0.25);
      } catch {}
    }, 350);
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

    // Play bee buzz sound
    playBeeSound();

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

  // Start periodic simulated notifications (addictive engagement loop)
  useEffect(() => {
    requestPermission();
    registerSW();

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
  }, [requestPermission, registerSW, sendNotification]);

  return null; // Invisible component — runs in background
}
