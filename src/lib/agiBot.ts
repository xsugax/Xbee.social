import { User, Conversation, Message } from '@/types';

export const AGI_BOT_ID = 'xbee-agi-companion';

export const agiBotUser: User = {
  id: AGI_BOT_ID,
  username: 'xbee_agi',
  displayName: 'Xbee AGI',
  avatar: '',
  coverImage: '',
  bio: 'Your personal AI companion. I can help with writing, coding, math, ideas, translations, and more.',
  verified: true,
  verification: 'official',
  authenticityScore: 100,
  trust: {
    score: 100,
    tier: 'legendary',
    identityVerified: true,
    behaviorSignals: [],
    reachMultiplier: 1,
    monetizationUnlocked: false,
    scamFlags: 0,
    reportCount: 0,
    accountAge: 999,
    consistencyScore: 100,
    lastUpdated: new Date().toISOString(),
  },
  followers: 0,
  following: 0,
  joinedAt: '2024-01-01T00:00:00Z',
  badges: [{ id: 'agi', name: 'AGI', icon: '🧠', description: 'Artificial General Intelligence', earnedAt: '2024-01-01' }],
  streak: 0,
  invitesRemaining: 0,
};

const welcomeMsg: Message = {
  id: 'agi-welcome',
  senderId: AGI_BOT_ID,
  content: "Hey! I'm Xbee AGI — your personal AI companion. Ask me anything: write posts, debug code, solve math, get ideas, translate text, or just chat. What's on your mind?",
  type: 'text',
  createdAt: new Date().toISOString(),
  read: true,
  encrypted: false,
};

export function createAgiConversation(currentUser: User): Conversation {
  return {
    id: 'conv-xbee-agi',
    participants: [currentUser, agiBotUser],
    lastMessage: welcomeMsg,
    unreadCount: 0,
    pinned: true,
    muted: false,
    encrypted: false,
    safeMode: false,
    riskLevel: 'safe',
    scamAlerts: [],
  };
}

export function getAgiWelcomeMessage(): Message {
  return welcomeMsg;
}
