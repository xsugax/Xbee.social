import {
  User, Post, Conversation, Message, Community, Notification,
  TrendingTopic, MonetizationStats, TrustProfile, PostCredibility, InviteCode, Comment,
} from '@/types';

// ─── Trust Profile Factory ──────────────────────────────────────
function makeTrust(overrides: Partial<TrustProfile> = {}): TrustProfile {
  return {
    score: 50,
    tier: 'building',
    identityVerified: false,
    behaviorSignals: [],
    reachMultiplier: 1.0,
    monetizationUnlocked: false,
    scamFlags: 0,
    reportCount: 0,
    accountAge: 30,
    consistencyScore: 50,
    lastUpdated: new Date().toISOString(),
    ...overrides,
  };
}

function makeCredibility(authorTrust: number, overrides: Partial<PostCredibility> = {}): PostCredibility {
  return {
    authorTrust,
    contentScore: 75,
    engagementQuality: 0.8,
    viralityBrake: false,
    ...overrides,
  };
}

export const currentUser: User = {
  id: 'user-1',
  username: 'you',
  displayName: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  bio: 'Building the future with code 🚀 | Full-stack developer | AI enthusiast',
  verified: true,
  verification: 'authority',
  authenticityScore: 98,
  trust: makeTrust({
    score: 98, tier: 'authority', identityVerified: true,
    reachMultiplier: 2.8, monetizationUnlocked: true, accountAge: 450, consistencyScore: 92,
    behaviorSignals: [
      { type: 'positive', label: 'Consistent quality posting', weight: 15, timestamp: new Date().toISOString() },
      { type: 'positive', label: 'Zero scam reports', weight: 20, timestamp: new Date().toISOString() },
      { type: 'positive', label: 'Identity verified', weight: 25, timestamp: new Date().toISOString() },
    ],
  }),
  followers: 12400, following: 843, joinedAt: '2024-01-15',
  badges: [
    { id: 'b1', name: 'Early Adopter', icon: '🌟', description: 'Joined during invite-only beta', earnedAt: '2024-01-15' },
    { id: 'b2', name: '14-Day Streak', icon: '🔥', description: '14 consecutive days active', earnedAt: '2024-03-01' },
    { id: 'b3', name: 'Trust Authority', icon: '🛡️', description: 'Achieved Authority trust tier', earnedAt: '2025-06-01' },
  ],
  streak: 14,
  inviteCode: 'XBEE-ALEX-2024', invitesRemaining: 5,
};

const users: User[] = [
  {
    id: 'user-2', username: 'sarahdev', displayName: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    bio: 'Senior Engineer @ Scale AI', verified: true, verification: 'identity', authenticityScore: 96,
    trust: makeTrust({ score: 96, tier: 'authority', identityVerified: true, reachMultiplier: 2.5, monetizationUnlocked: true, accountAge: 380, consistencyScore: 89 }),
    followers: 45200, following: 312, joinedAt: '2024-02-10', badges: [], streak: 22,
    invitedBy: 'user-1', invitesRemaining: 3,
  },
  {
    id: 'user-3', username: 'jamesk', displayName: 'James Kim', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    bio: 'Crypto & AI researcher 🧠', verified: false, verification: 'none' as const, authenticityScore: 42,
    trust: makeTrust({ score: 42, tier: 'building', identityVerified: false, reachMultiplier: 0.6, monetizationUnlocked: false, accountAge: 15, consistencyScore: 35, scamFlags: 2,
      behaviorSignals: [
        { type: 'negative', label: 'Multiple link-spam reports', weight: -15, timestamp: new Date().toISOString() },
        { type: 'negative', label: 'Rapid follower growth pattern', weight: -10, timestamp: new Date().toISOString() },
      ],
    }),
    followers: 8900, following: 421, joinedAt: '2024-03-05', badges: [], streak: 5,
    invitesRemaining: 0,
  },
  {
    id: 'user-4', username: 'priya_codes', displayName: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Open source contributor | Rust evangelist', verified: true, verification: 'identity' as const, authenticityScore: 94,
    trust: makeTrust({ score: 94, tier: 'trusted', identityVerified: true, reachMultiplier: 2.2, monetizationUnlocked: true, accountAge: 420, consistencyScore: 95 }),
    followers: 67800, following: 189, joinedAt: '2024-01-20', badges: [], streak: 31,
    invitedBy: 'user-1', invitesRemaining: 4,
  },
  {
    id: 'user-5', username: 'marcus_w', displayName: 'Marcus Williams', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Design engineer at Figma. Making pixels dance.', verified: true, verification: 'authority' as const, authenticityScore: 99,
    trust: makeTrust({ score: 99, tier: 'authority', identityVerified: true, reachMultiplier: 3.0, monetizationUnlocked: true, accountAge: 460, consistencyScore: 98 }),
    followers: 124000, following: 567, joinedAt: '2024-01-01', badges: [], streak: 45,
    invitesRemaining: 10,
  },
  {
    id: 'user-6', username: 'elena_r', displayName: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'AI Safety researcher @ DeepMind', verified: true, verification: 'authority' as const, authenticityScore: 97,
    trust: makeTrust({ score: 97, tier: 'authority', identityVerified: true, reachMultiplier: 2.7, monetizationUnlocked: true, accountAge: 400, consistencyScore: 91 }),
    followers: 89300, following: 234, joinedAt: '2024-02-01', badges: [], streak: 18,
    invitesRemaining: 6,
  },
  {
    id: 'user-7', username: 'dev_nina', displayName: 'Nina Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    bio: 'YC W24 founder • Building developer tools that actually work', verified: true, verification: 'authority' as const, authenticityScore: 95,
    trust: makeTrust({ score: 95, tier: 'authority', identityVerified: true, reachMultiplier: 2.6, monetizationUnlocked: true, accountAge: 390, consistencyScore: 90 }),
    followers: 56700, following: 445, joinedAt: '2024-01-25', badges: [], streak: 28,
    invitesRemaining: 5,
  },
  {
    id: 'user-8', username: 'tomcrypto', displayName: 'Tom Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Blockchain architect | Building web3 infrastructure', verified: true, verification: 'identity' as const, authenticityScore: 78,
    trust: makeTrust({ score: 78, tier: 'trusted', identityVerified: true, reachMultiplier: 1.8, monetizationUnlocked: true, accountAge: 200, consistencyScore: 72 }),
    followers: 34500, following: 312, joinedAt: '2024-06-10', badges: [], streak: 12,
    invitesRemaining: 3,
  },
  {
    id: 'user-9', username: 'aisha_ml', displayName: 'Aisha Johnson', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
    bio: 'ML Engineer @ OpenAI | Stanford CS PhD | Making AI accessible', verified: true, verification: 'authority' as const, authenticityScore: 98,
    trust: makeTrust({ score: 98, tier: 'authority', identityVerified: true, reachMultiplier: 2.9, monetizationUnlocked: true, accountAge: 440, consistencyScore: 96 }),
    followers: 189000, following: 167, joinedAt: '2024-01-05', badges: [], streak: 52,
    invitesRemaining: 8,
  },
  {
    id: 'user-10', username: 'rafaelux', displayName: 'Rafael Santos', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    bio: 'UX lead @ Stripe • Author of "Design for Humans" 📖', verified: true, verification: 'identity' as const, authenticityScore: 91,
    trust: makeTrust({ score: 91, tier: 'trusted', identityVerified: true, reachMultiplier: 2.1, monetizationUnlocked: true, accountAge: 350, consistencyScore: 88 }),
    followers: 43200, following: 298, joinedAt: '2024-03-15', badges: [], streak: 19,
    invitesRemaining: 4,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1', author: users[0],
    content: "Just shipped a real-time collaboration feature using CRDTs. The magic of conflict-free replicated data types is that every client can edit independently and they all converge to the same state. No more merge conflicts! 🎉\n\nThread below on how we built it 👇",
    media: [
      { id: 'media-1', type: 'image', url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop', alt: 'Code on screen showing real-time collaboration' },
    ],
    likes: 2340, reposts: 456, replies: 89, views: 45600,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    credibility: makeCredibility(96, { contentScore: 88, engagementQuality: 0.92 }),
    whyShowing: 'High-credibility author in your network • Relevance: Technology',
    comments: [
      { id: 'c1-1', author: users[3], content: 'CRDTs are incredible! We used Yjs in our project and the sync performance blew our minds.', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), likes: 24, liked: false },
      { id: 'c1-2', author: users[7], content: 'What was the latency like in production? We are evaluating CRDTs vs OT for our editor.', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), likes: 12, liked: false },
      { id: 'c1-3', author: currentUser, content: 'This is exactly what we needed for our real-time dashboard. Sharing with the team!', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), likes: 8, liked: false },
    ],
  },
  {
    id: 'post-2', author: users[3],
    content: "Hot take: The best code is the code you don't write.\n\nBefore adding a new dependency, ask yourself:\n• Can I write this in <50 lines?\n• Will I need to maintain it?\n• Does it add 500KB to my bundle?\n\nSimplicity scales. Complexity doesn't.",
    likes: 8920, reposts: 1230, replies: 342, views: 156000,
    liked: true, reposted: false, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    credibility: makeCredibility(94, { contentScore: 91, engagementQuality: 0.87 }),
    whyShowing: 'Trusted author • Consistent quality contributor',
    comments: [
      { id: 'c2-1', author: users[0], content: 'This is so true. We removed 15 dependencies last sprint and our CI went from 8min to 3min.', createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(), likes: 156, liked: false },
      { id: 'c2-2', author: users[5], content: 'Counter argument: sometimes the wheel has already been invented well. lodash exists for a reason.', createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), likes: 89, liked: false },
      { id: 'c2-3', author: users[8], content: 'The bundle size point hits hard. Our landing page was loading 2MB of JS for a contact form...', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), likes: 67, liked: false },
    ],
  },
  {
    id: 'post-3', author: users[4],
    content: "We're hiring designers who think in systems, not screens.\n\nAt Figma, every pixel tells a story. We need people who can write the next chapter.\n\nDM me or check the link in my bio 🎨",
    media: [
      { id: 'media-3a', type: 'image', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop', alt: 'Design workspace with tools' },
      { id: 'media-3b', type: 'image', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop', alt: 'UI design components' },
    ],
    likes: 1560, reposts: 890, replies: 67, views: 89400,
    liked: false, reposted: true, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    credibility: makeCredibility(99, { contentScore: 82, engagementQuality: 0.78 }),
    poll: {
      id: 'poll-1', question: 'What design tool do you primarily use?',
      options: [
        { id: 'o1', text: 'Figma', votes: 4520, percentage: 62 },
        { id: 'o2', text: 'Sketch', votes: 890, percentage: 12 },
        { id: 'o3', text: 'Adobe XD', votes: 670, percentage: 9 },
        { id: 'o4', text: 'Other', votes: 1240, percentage: 17 },
      ],
      totalVotes: 7320, endsAt: new Date(Date.now() + 86400000).toISOString(),
    },
  },
  {
    id: 'post-4', author: users[1],
    content: "Explained quantum computing to my 8-year-old:\n\n\"Imagine you have a magic coin that's both heads AND tails at the same time until you look at it.\"\n\nHer response: \"So it's like Schrödinger's allowance?\"\n\nI'm raising a genius 😂",
    likes: 45200, reposts: 12300, replies: 1560, views: 890000,
    liked: true, reposted: true, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    aiEnhanced: true,
    credibility: makeCredibility(42, { contentScore: 95, engagementQuality: 0.65, viralityBrake: true }),
    reachLimited: true,
    whyShowing: '⚠️ Viral content from low-trust account • Engagement quality: Moderate',
    comments: [
      { id: 'c4-1', author: users[4], content: 'Your 8-year-old just explained quantum superposition better than most textbooks 😂', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), likes: 890, liked: true },
      { id: 'c4-2', author: users[7], content: 'As a physicist, I approve this analogy. Schrödinger would be proud.', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), likes: 445, liked: false },
    ],
  },
  {
    id: 'post-5', author: users[2],
    content: "🔥 AI model performance comparison (2026):\n\n• GPT-5: Best at reasoning\n• Claude 4: Best at coding\n• Gemini Ultra 2: Best at multimodal\n• Open source (Llama 4): Catching up fast\n\nThe real winner? Developers who know how to use all of them.",
    likes: 3400, reposts: 890, replies: 234, views: 67800,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    credibility: makeCredibility(42, { contentScore: 72, engagementQuality: 0.55, factCheckStatus: 'unverified', viralityBrake: true }),
    reachLimited: true,
    whyShowing: '⚡ Reach limited: Author trust score below threshold',
  },
  {
    id: 'post-6', author: users[4],
    content: "Design tip that changed my career:\n\nStop designing for screens. Start designing for states.\n\nEvery component has:\n→ Default state\n→ Hover state\n→ Active state\n→ Loading state\n→ Error state\n→ Empty state\n→ Disabled state\n\nThe difference between good and great UI is how you handle the edges.",
    media: [
      { id: 'media-6', type: 'image', url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=500&fit=crop', alt: 'Mobile app design states' },
    ],
    likes: 15600, reposts: 4200, replies: 567, views: 234000,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    credibility: makeCredibility(99, { contentScore: 94, engagementQuality: 0.93 }),
    whyShowing: 'Authority-tier creator • Top credibility score',
  },
  {
    id: 'post-7', author: users[5],
    content: "Just raised our Series A! 🚀\n\n$12M to build the future of developer tooling. 18 months ago this was a side project. Today we're a team of 24.\n\nLessons from the journey:\n1. Build what you'd use yourself\n2. Talk to users every single day\n3. Revenue > vanity metrics\n4. Hire slow, fire fast\n\nThe real work starts now. Let's go 💪",
    media: [
      { id: 'media-7', type: 'image', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop', alt: 'Team celebrating in modern office' },
    ],
    likes: 23400, reposts: 5600, replies: 890, views: 456000,
    liked: false, reposted: false, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    credibility: makeCredibility(95, { contentScore: 89, engagementQuality: 0.91 }),
    whyShowing: 'Authority-tier creator in your network',
  },
  {
    id: 'post-8', author: users[7],
    content: "The future of AI isn't replacing humans.\n\nIt's giving every human a genius-level assistant.\n\nWe just shipped an AI coding copilot that reduced debugging time by 73% in beta testing. Real data, real developers, real impact.\n\nPaper dropping next week 📄",
    media: [
      { id: 'media-8a', type: 'image', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop', alt: 'AI neural network visualization' },
      { id: 'media-8b', type: 'image', url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=500&fit=crop', alt: 'Data analytics dashboard' },
    ],
    likes: 67800, reposts: 18900, replies: 2340, views: 1200000,
    liked: true, reposted: false, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    credibility: makeCredibility(98, { contentScore: 96, engagementQuality: 0.94 }),
    whyShowing: 'Top credibility • Trending in Technology',
    comments: [
      { id: 'c8-1', author: users[0], content: 'Where can I sign up for the beta? This would be incredibly useful in our code review pipeline.', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), likes: 234, liked: false },
      { id: 'c8-2', author: users[3], content: '73% reduction is massive. How does it compare against existing static analysis tools?', createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), likes: 167, liked: false },
      { id: 'c8-3', author: users[5], content: 'Would love to see how this handles edge cases in async code. That is where most bugs hide.', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), likes: 98, liked: false },
      { id: 'c8-4', author: currentUser, content: 'Incredible work! The proof-based approach is what sets this apart from simple pattern matching.', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), likes: 45, liked: false },
    ],
  },
  {
    id: 'post-9', author: users[8],
    content: "Just redesigned our entire checkout flow at Stripe.\n\nResults after 30 days:\n→ Conversion up 23%\n→ Cart abandonment down 31%\n→ Support tickets down 45%\n\nThe secret? We removed 4 steps. Users don't want more options. They want less friction.",
    media: [
      { id: 'media-9', type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', alt: 'Dashboard showing conversion metrics' },
    ],
    likes: 12300, reposts: 3400, replies: 456, views: 189000,
    liked: false, reposted: true, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    credibility: makeCredibility(91, { contentScore: 87, engagementQuality: 0.85 }),
    whyShowing: 'Trusted author • Trending topic: UX Design',
  },
  {
    id: 'post-10', author: users[6],
    content: "Unpopular opinion: TypeScript is overrated for small projects.\n\nDon't get me wrong — I love TS for large codebases. But for a hackathon project or quick prototype? Pure JS is faster to ship.\n\nKnow your tools. Use them wisely.",
    likes: 5600, reposts: 1200, replies: 890, views: 78900,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    credibility: makeCredibility(78, { contentScore: 68, engagementQuality: 0.72, factCheckStatus: 'unverified' }),
    whyShowing: 'Debate trending in developer community',
  },
  {
    id: 'post-11', author: users[3],
    content: "Today I mass-deleted 47 npm packages from our monorepo.\n\n47 packages. Gone.\n\nBundle size went from 4.2MB to 890KB.\n\nTech debt isn't just messy code — it's also the weight of every dependency you never needed.",
    media: [
      { id: 'media-11', type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop', alt: 'Clean code on laptop screen' },
    ],
    likes: 34500, reposts: 8900, replies: 1230, views: 567000,
    liked: true, reposted: true, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    credibility: makeCredibility(94, { contentScore: 92, engagementQuality: 0.89 }),
    whyShowing: 'Trusted author • High engagement quality',
    comments: [
      { id: 'c11-1', author: users[4], content: 'We did the same thing and our Lighthouse score jumped from 42 to 94. Dependencies are the silent killer.', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), likes: 345, liked: false },
      { id: 'c11-2', author: users[6], content: 'What tool did you use to audit which packages were actually unused?', createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), likes: 123, liked: false },
    ],
  },
  {
    id: 'post-12', author: users[4],
    content: "We just open-sourced our design system at Figma 🎉\n\n2,400 components. 180 patterns. 3 years of iteration.\n\nAll free. No strings attached.\n\nBecause great design shouldn't be locked behind a paywall. Link in bio 🔗",
    media: [
      { id: 'media-12a', type: 'image', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop', alt: 'Design system components' },
      { id: 'media-12b', type: 'image', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=500&fit=crop', alt: 'Color palette design' },
      { id: 'media-12c', type: 'image', url: 'https://images.unsplash.com/photo-1581291518633-83b4eef1d2f8?w=800&h=500&fit=crop', alt: 'Typography system' },
    ],
    likes: 89200, reposts: 23400, replies: 3400, views: 2300000,
    liked: false, reposted: false, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    credibility: makeCredibility(99, { contentScore: 97, engagementQuality: 0.96, factCheckStatus: 'verified' }),
    whyShowing: 'Authority creator • Verified content • Trending',
  },
  {
    id: 'post-13', author: users[7],
    content: "We trained a model on 10 million code reviews.\n\nIt now catches bugs that senior engineers miss.\n\nNot 'might have a bug' — actual logical errors with proof.\n\nAI isn't coming for your job. It's coming for your bugs. 🐛→🤖",
    media: [
      { id: 'media-13', type: 'image', url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop', alt: 'Code review on multiple monitors' },
    ],
    likes: 45600, reposts: 12300, replies: 1890, views: 890000,
    liked: true, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    credibility: makeCredibility(98, { contentScore: 93, engagementQuality: 0.88 }),
    whyShowing: 'Authority-tier creator • Trending in AI',
  },
  {
    id: 'post-14', author: users[5],
    content: "Startup advice nobody gives you:\n\nYour first 10 customers won't come from marketing.\nThey'll come from DMs.\nFrom cold emails.\nFrom showing up where your users hang out.\n\nDo things that don't scale. It's not just a quote — it's survival.",
    likes: 18900, reposts: 4500, replies: 678, views: 234000,
    liked: false, reposted: false, bookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    credibility: makeCredibility(95, { contentScore: 88, engagementQuality: 0.86 }),
    whyShowing: 'Authority-tier creator • Business insights',
  },
  {
    id: 'post-15', author: users[0],
    content: "The CRDT paper is live! 📝\n\nWe benchmarked 5 different CRDT implementations across:\n• Latency (avg 12ms sync)\n• Memory usage (40% reduction)\n• Conflict resolution accuracy (99.97%)\n\nFull paper + benchmarks + code → link in thread 🧵",
    media: [
      { id: 'media-15a', type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', alt: 'Performance benchmark charts' },
      { id: 'media-15b', type: 'image', url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=500&fit=crop', alt: 'Data visualization graphs' },
    ],
    likes: 7800, reposts: 2100, replies: 345, views: 123000,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    credibility: makeCredibility(96, { contentScore: 95, engagementQuality: 0.91, factCheckStatus: 'verified' }),
    whyShowing: 'High-credibility author • Verified research',
  },
  {
    id: 'post-16', author: users[8],
    content: "Your landing page has 3 seconds to answer:\n\n1. What is this?\n2. Why should I care?\n3. What do I do next?\n\nIf your hero section doesn't nail all 3, everything below it doesn't matter.\n\nSimplicity wins. Every. Single. Time.",
    media: [
      { id: 'media-16', type: 'image', url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop', alt: 'Clean modern website landing page' },
    ],
    likes: 9800, reposts: 2800, replies: 234, views: 145000,
    liked: true, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    credibility: makeCredibility(91, { contentScore: 85, engagementQuality: 0.83 }),
    whyShowing: 'Trusted author • UX Design trending',
  },
  {
    id: 'post-17', author: users[2],
    content: "Just crossed 100K lines of Rust code without a single segfault in production. 🦀\n\nMeanwhile our Go microservice crashed 3 times this week.\n\nThe borrow checker isn't your enemy. It's your therapist.",
    likes: 23400, reposts: 6700, replies: 890, views: 345000,
    liked: false, reposted: false, bookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    credibility: makeCredibility(94, { contentScore: 82, engagementQuality: 0.79 }),
    whyShowing: 'Trusted author • Programming trending',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1', participants: [currentUser, users[0]], unreadCount: 3, pinned: true, muted: false, encrypted: true,
    safeMode: false, riskLevel: 'safe', scamAlerts: [],
    lastMessage: { id: 'm1', senderId: users[0].id, content: "Sure! Let's sync tomorrow at 10am. I'll share the prototype link.", type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, encrypted: true },
  },
  {
    id: 'conv-2', participants: [currentUser, users[3]], unreadCount: 0, pinned: false, muted: false, encrypted: true,
    safeMode: false, riskLevel: 'safe', scamAlerts: [],
    lastMessage: { id: 'm2', senderId: currentUser.id, content: 'Thanks for the Rust tips! Going to try that approach.', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true, encrypted: true },
  },
  {
    id: 'conv-3', participants: [currentUser, users[4]], unreadCount: 1, pinned: false, muted: false, encrypted: true,
    safeMode: false, riskLevel: 'safe', scamAlerts: [],
    lastMessage: { id: 'm3', senderId: users[4].id, content: 'Check out this design system I built 🎨', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), read: false, encrypted: true },
  },
  {
    id: 'conv-4', participants: [currentUser, users[1]], unreadCount: 2, pinned: false, muted: false, encrypted: true,
    safeMode: true, riskLevel: 'warning',
    scamAlerts: [{
      id: 'sa-1', severity: 'high', type: 'financial_scam',
      message: 'This user has been flagged for sending cryptocurrency investment links. 2 reports in the last 7 days.',
      detectedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), dismissed: false,
    }],
    lastMessage: { id: 'm4', senderId: users[1].id, content: 'Hey check out this amazing crypto opportunity! 💰🚀', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, encrypted: true,
      scamAlert: {
        id: 'sa-msg-1', severity: 'high', type: 'financial_scam',
        message: 'Potential financial scam: Unsolicited investment link',
        detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), dismissed: false,
      },
    },
  },
];

export const mockMessages: Message[] = [
  { id: 'msg-1', senderId: currentUser.id, content: 'Hey Sarah! How is the CRDT implementation going?', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true, encrypted: true },
  { id: 'msg-2', senderId: users[0].id, content: "It's going great! We hit a tricky edge case with offline edits but figured it out.", type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), read: true, encrypted: true },
  { id: 'msg-3', senderId: currentUser.id, content: 'Nice! Would love to see a demo. Can we sync this week?', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: true, encrypted: true },
  { id: 'msg-4', senderId: users[0].id, content: "Absolutely! Let's sync tomorrow at 10am. I'll share the prototype link.", type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, encrypted: true },
];

export const mockScamMessages: Message[] = [
  { id: 'smsg-1', senderId: users[1].id, content: "Hey! Long time no chat 👋", type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true, encrypted: true },
  { id: 'smsg-2', senderId: currentUser.id, content: "Hey James! How have you been?", type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true, encrypted: true },
  { id: 'smsg-3', senderId: users[1].id, content: 'Hey check out this amazing crypto opportunity! 💰🚀 Click here → bit.ly/xyz', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, encrypted: true,
    scamAlert: { id: 'sa-msg-1', severity: 'high', type: 'financial_scam', message: 'Potential financial scam: Unsolicited investment link with URL shortener', detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), dismissed: false },
  },
  { id: 'smsg-warn', senderId: 'system', content: '🛡️ Xbee AI detected a potential scam in this conversation. This user has a low trust score (42/100) and has been reported for suspicious financial links.', type: 'scam_warning', createdAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(), read: false, encrypted: false },
];

export const mockCommunities: Community[] = [
  {
    id: 'comm-1', name: 'AI Builders', description: 'A community for developers building with AI. Share projects, get feedback, learn together.',
    avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop', banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=300&fit=crop', members: 45200, category: 'Technology', verified: true,
    rules: ['Be respectful', 'No spam', 'Share knowledge'], moderators: [users[4]], isLive: true, liveParticipants: 234,
    paidAccess: false, trustRequired: 30,
  },
  {
    id: 'comm-2', name: 'Design Systems', description: 'Everything about design systems, component libraries, and visual consistency.',
    avatar: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=100&fit=crop', banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=300&fit=crop', members: 23400, category: 'Design', verified: true,
    rules: ['Show your work', 'Constructive feedback only'], moderators: [users[3]], isLive: false,
    paidAccess: false, trustRequired: 20,
  },
  {
    id: 'comm-3', name: 'Startup Founders', description: 'Connect with founders, share your journey, find co-founders. Trusted members only.',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop', banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=300&fit=crop', members: 67800, category: 'Business', verified: true,
    rules: ['No solicitation', 'Be genuine'], moderators: [users[0]], isLive: true, liveParticipants: 89,
    paidAccess: true, price: 29.99, trustRequired: 70,
  },
  {
    id: 'comm-4', name: 'Web3 Innovators', description: 'Exploring the decentralized future. Crypto, blockchain, DeFi discussions.',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', banner: 'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=800&h=300&fit=crop', members: 12300, category: 'Technology', verified: false,
    rules: ['No financial advice', 'DYOR'], moderators: [users[1]], isLive: false,
    paidAccess: false, trustRequired: 50,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'like', actor: users[3], content: 'liked your post', postId: 'post-1', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 'n2', type: 'repost', actor: users[4], content: 'reposted your post', postId: 'post-1', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'n3', type: 'follow', actor: users[2], content: 'followed you', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'n4', type: 'reply', actor: users[0], content: 'replied to your post', postId: 'post-2', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'n5', type: 'mention', actor: users[1], content: 'mentioned you in a post', postId: 'post-3', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'n6', type: 'badge', actor: currentUser, content: 'You earned the "Trust Authority" badge! 🛡️', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'n7', type: 'monetization', actor: users[3], content: 'tipped you $5.00 for your post', postId: 'post-2', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: 'n8', type: 'streak', actor: currentUser, content: '14-day streak! Keep it going! 🔥', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export const mockTrends: TrendingTopic[] = [
  { id: 't1', name: 'AI Agents', category: 'Technology', postCount: 45200, change: 'up', description: 'Autonomous AI agents are reshaping software development' },
  { id: 't2', name: 'Rust 2.0', category: 'Programming', postCount: 23400, change: 'up' },
  { id: 't3', name: 'Climate Tech', category: 'Science', postCount: 12300, change: 'stable' },
  { id: 't4', name: 'World Cup 2026', category: 'Sports', postCount: 890000, change: 'up' },
  { id: 't5', name: 'Apple Vision Pro 2', category: 'Technology', postCount: 67800, change: 'down' },
];

export const mockMonetization: MonetizationStats = {
  totalEarnings: 4523.87,
  monthlyEarnings: 1234.56,
  tips: 567.89,
  subscriptions: 345.67,
  adRevenue: 234.00,
  digitalProducts: 87.00,
  paidCommunities: 149.99,
  subscribers: 234,
  stabilityScore: 82,
  topPosts: [mockPosts[1], mockPosts[3]],
  projections: [
    { month: 'Nov 2025', projected: 1100, actual: 1089 },
    { month: 'Dec 2025', projected: 1150, actual: 1203 },
    { month: 'Jan 2026', projected: 1200, actual: 1178 },
    { month: 'Feb 2026', projected: 1250, actual: 1290 },
    { month: 'Mar 2026', projected: 1300, actual: 1234 },
    { month: 'Apr 2026', projected: 1350, actual: 0 },
  ],
  tiers: [
    { id: 'tier-1', name: 'Supporter', price: 4.99, benefits: ['Ad-free feed', 'Supporter badge', 'Early access posts'], subscribers: 156 },
    { id: 'tier-2', name: 'Pro', price: 14.99, benefits: ['Everything in Supporter', 'Direct messaging access', 'Monthly Q&A', 'Exclusive community'], subscribers: 62 },
    { id: 'tier-3', name: 'Inner Circle', price: 49.99, benefits: ['Everything in Pro', '1-on-1 monthly call', 'Custom content requests', 'Revenue sharing insights'], subscribers: 16 },
  ],
};

export const mockInviteCodes: InviteCode[] = [
  { code: 'XBEE-ALEX-001', createdBy: 'user-1', usedBy: 'user-2', usedAt: '2024-02-10', expiresAt: '2024-12-31', active: false },
  { code: 'XBEE-ALEX-002', createdBy: 'user-1', usedBy: 'user-4', usedAt: '2024-01-20', expiresAt: '2024-12-31', active: false },
  { code: 'XBEE-ALEX-003', createdBy: 'user-1', expiresAt: '2026-12-31', active: true },
  { code: 'XBEE-ALEX-004', createdBy: 'user-1', expiresAt: '2026-12-31', active: true },
  { code: 'XBEE-ALEX-005', createdBy: 'user-1', expiresAt: '2026-12-31', active: true },
];

export { users as mockUsers };
