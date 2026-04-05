export type TrustTier = 'new' | 'building' | 'established' | 'trusted' | 'authority';
export type VerificationType = 'none' | 'identity' | 'authority';
export type AICommentMode = 'casual' | 'professional' | 'funny' | 'debate' | 'supportive';

export interface TrustProfile {
  score: number; // 0-100
  tier: TrustTier;
  identityVerified: boolean;
  behaviorSignals: BehaviorSignal[];
  reachMultiplier: number; // 0.1 (new/low trust) to 3.0 (authority)
  monetizationUnlocked: boolean;
  scamFlags: number;
  reportCount: number;
  accountAge: number; // days
  consistencyScore: number; // 0-100 how consistent posting behavior is
  lastUpdated: string;
}

export interface BehaviorSignal {
  type: 'positive' | 'negative' | 'neutral';
  label: string;
  weight: number;
  timestamp: string;
}

export interface ScamAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'phishing' | 'impersonation' | 'financial_scam' | 'spam' | 'bot_behavior' | 'suspicious_links';
  message: string;
  detectedAt: string;
  dismissed: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  verification: VerificationType;
  authenticityScore: number;
  trust: TrustProfile;
  followers: number;
  following: number;
  joinedAt: string;
  badges: Badge[];
  streak: number;
  invitedBy?: string;
  inviteCode?: string;
  invitesRemaining: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export type FeedMode = 'trusted' | 'raw';

export interface PostCredibility {
  authorTrust: number;
  contentScore: number; // AI-assessed quality 0-100
  engagementQuality: number; // ratio of meaningful engagement
  factCheckStatus?: 'verified' | 'disputed' | 'unverified';
  viralityBrake: boolean; // true if controlled virality kicked in
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
  replyTo?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  media?: MediaAttachment[];
  poll?: Poll;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  createdAt: string;
  threadId?: string;
  replyTo?: string;
  aiEnhanced?: boolean;
  whyShowing?: string;
  credibility: PostCredibility;
  reachLimited?: boolean;
  comments?: Comment[];
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'voice' | 'gif';
  url: string;
  thumbnail?: string;
  duration?: number;
  alt?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  voted?: boolean | string;
  votedOption?: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'video' | 'image' | 'system' | 'scam_warning';
  createdAt: string;
  read: boolean;
  encrypted: boolean;
  replyTo?: string;
  scamAlert?: ScamAlert;
  ghost?: GhostConfig;
}

export interface GhostConfig {
  enabled: boolean;
  expiresIn: number; // seconds
  expiresAt: string;
  screenshotDetected?: boolean;
  saved?: boolean;
}

export interface AICommentSuggestion {
  id: string;
  mode: AICommentMode;
  content: string;
  type: 'reply' | 'question' | 'debate';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  encrypted: boolean;
  safeMode: boolean;
  riskLevel: 'safe' | 'caution' | 'warning';
  scamAlerts: ScamAlert[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  members: number;
  category: string;
  verified: boolean;
  rules: string[];
  moderators: User[];
  isLive: boolean;
  liveParticipants?: number;
  paidAccess: boolean;
  price?: number;
  trustRequired: number; // minimum trust score to join
}

export interface Notification {
  id: string;
  type: 'like' | 'repost' | 'reply' | 'follow' | 'mention' | 'community' | 'monetization' | 'badge' | 'streak' | 'message' | 'trust' | 'trending' | 'comment';
  actor: User;
  content: string;
  postId?: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  postCount: number;
  change: 'up' | 'down' | 'stable';
  description?: string;
}

export interface IncomeProjection {
  month: string;
  projected: number;
  actual: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  subscribers: number;
}

export interface MonetizationStats {
  totalEarnings: number;
  monthlyEarnings: number;
  tips: number;
  subscriptions: number;
  adRevenue: number;
  digitalProducts: number;
  paidCommunities: number;
  subscribers: number;
  topPosts: Post[];
  projections: IncomeProjection[];
  tiers: SubscriptionTier[];
  stabilityScore: number; // 0-100, how predictable income is
}

export interface InviteCode {
  code: string;
  createdBy: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
  active: boolean;
}

export type Theme = 'dark' | 'light' | 'amoled';
