'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { User, Post, Conversation, Message, Notification, ConnectionStatus, ConnectionRequest, MessageRequest } from '@/types';
import { currentUser as defaultUser, mockPosts, mockConversations, mockMessages, mockScamMessages, mockUsers, mockNotifications } from '@/lib/mockData';
import { generateId } from '@/lib/utils';
import { useAuth, profileToUser } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';
import type { Profile, PostRow, NotificationRow } from '@/lib/database.types';

type PostWithProfile = PostRow & { profiles: Profile | null };
type NotifWithActor = NotificationRow & { actor: Profile | null };
type ParticipantWithProfile = { conversation_id: string; user_id: string; profiles: Profile | null };

const hasSupabaseEnv = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url-here'
);

interface AppState {
  currentUser: User;
  updateProfile: (updates: Partial<User>) => boolean;

  posts: Post[];
  addPost: (content: string, media?: Post['media']) => void;
  likePost: (postId: string) => void;
  repostPost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  voteOnPoll: (postId: string, optionIndex: number) => void;
  viewPost: (postId: string) => void;
  loadMorePosts: () => Promise<void>;
  hasMorePosts: boolean;
  isLoadingMorePosts: boolean;

  // Connection System
  getConnectionStatus: (userId: string) => ConnectionStatus;
  sendConnectionRequest: (userId: string, message?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  declineConnectionRequest: (requestId: string) => void;
  removeConnection: (userId: string) => void;
  connectionRequests: ConnectionRequest[];
  connections: Set<string>;
  pendingSent: Set<string>;
  pendingReceived: Set<string>;
  connectionHeat: { level: number; connections: number; networkGrowth: number };

  // Message Requests
  messageRequests: MessageRequest[];
  sendMessageRequest: (userId: string, content: string) => void;
  acceptMessageRequest: (requestId: string) => void;
  dismissMessageRequest: (requestId: string) => void;
  messageRequestUnread: number;

  // Legacy follow/unfollow (used by explore, profile, onboarding pages)
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  isFollowingUser: (userId: string) => boolean;
  following: Set<string>;

  conversations: Conversation[];
  addConversation: (participants: User[], firstMessage: Message) => Conversation;
  loadConversations: () => Promise<void>;
  getMessages: (convId: string) => Message[];
  sendMessage: (convId: string, content: string, ghostConfig?: { enabled: boolean; expiresIn: number }) => void;
  addReply: (convId: string, reply: Message) => void;
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  canSendMessage: (userId: string) => boolean;

  verifiedChanges: Set<string>;
  isVerifiedChange: (userId: string) => boolean;
  toggleVerifiedChange: (userId: string) => void;

  notifications: Notification[];
  addNotification: (notif: any) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: { posts: Post[]; users: User[]; };
  searchUsers: (query: string) => User[];

  allUsers: User[];
  addSystemUser: (user: User) => void;
  deleteSystemUser: (userId: string) => void;
  updateUserInSystem: (userId: string, updates: Partial<User>) => void;
  updatePostEngagement: (postId: string, updates: Partial<{ likes: number; reposts: number; replies: number; views: number }>) => void;
  deletePostById: (postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  addPostAsUser: (authorId: string, content: string, createdAt?: string, media?: Post['media']) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

function dbPostToPost(row: any, author: User, currentUserId: string, interactions: { liked: Set<string>; reposted: Set<string>; bookmarked: Set<string> }): Post {
  return {
    id: row.id, author, content: row.content, media: row.media || [], poll: row.poll || undefined,
    likes: row.likes_count, reposts: row.reposts_count, replies: row.replies_count, views: row.views_count,
    liked: interactions.liked.has(row.id), reposted: interactions.reposted.has(row.id), bookmarked: interactions.bookmarked.has(row.id),
    createdAt: row.created_at,
    credibility: { authorTrust: author.trust.score, contentScore: 80, engagementQuality: 1.0, viralityBrake: false },
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { profile, user: authUser, isSupabaseConfigured } = useAuth();
  const isLive = isSupabaseConfigured && !!authUser;

  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [posts, setPosts] = useState<Post[]>(() => {
    if (hasSupabaseEnv) return [];
    if (typeof window === 'undefined') return mockPosts;
    try {
      const saved = localStorage.getItem('xbee_posts');
      const bookmarkedIds: string[] = JSON.parse(localStorage.getItem('xbee_bookmarks') || '[]');
      const basePosts = saved ? JSON.parse(saved) : mockPosts;
      if (bookmarkedIds.length > 0) return basePosts.map((p: Post) => ({ ...p, bookmarked: bookmarkedIds.includes(p.id) }));
      return basePosts;
    } catch { return mockPosts; }
  });

  const [conversations, setConversations] = useState<Conversation[]>(hasSupabaseEnv ? [] : mockConversations);
  const [messageStore, setMessageStore] = useState<Record<string, Message[]>>(hasSupabaseEnv ? {} : {
    'conv-1': mockMessages, 'conv-4': mockScamMessages,
  });
  
  // ─── MESSAGE ENGINE (high-performance O(1) messaging) ──────────
  const messageEngine = useRef<import('@/lib/messageEngine').MessageEngine | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (hasSupabaseEnv) return [];
    if (typeof window === 'undefined') return mockNotifications;
    try { const saved = localStorage.getItem('xbee_notifications'); if (saved) return JSON.parse(saved); } catch {}
    return mockNotifications;
  });
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return [defaultUser, ...mockUsers];
    try { const saved = localStorage.getItem('xbee_system_users'); if (saved) return JSON.parse(saved); } catch {}
    return [defaultUser, ...mockUsers];
  });

  // Connection state
  const [connections, setConnections] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { const saved = localStorage.getItem('xbee_connections'); if (saved) return new Set(JSON.parse(saved)); } catch {}
    return new Set();
  });
  const [pendingSent, setPendingSent] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { const saved = localStorage.getItem('xbee_pending_sent'); if (saved) return new Set(JSON.parse(saved)); } catch {}
    return new Set();
  });
  const [pendingReceived, setPendingReceived] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { const saved = localStorage.getItem('xbee_pending_received'); if (saved) return new Set(JSON.parse(saved)); } catch {}
    return new Set();
  });
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const saved = localStorage.getItem('xbee_connection_requests'); if (saved) return JSON.parse(saved); } catch {}
    return [];
  });
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const saved = localStorage.getItem('xbee_message_requests'); if (saved) return JSON.parse(saved); } catch {}
    return [];
  });

  // Seed a mock incoming connection request so the accept flow is testable
  useEffect(() => {
    if (isLive || typeof window === 'undefined') return;
    if (connectionRequests.length > 0) return;
    const seedFrom = mockUsers[3]; // Use Priya Sharma as a mock requester
    const seedReq: ConnectionRequest = {
      id: 'creq-seed-1',
      from: seedFrom,
      to: currentUser,
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    };
    setConnectionRequests([seedReq]);
    setPendingReceived(prev => { const n = new Set(prev); n.add(seedFrom.id); return n; });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userInteractionsRef = useRef({ liked: new Set<string>(), reposted: new Set<string>(), bookmarked: new Set<string>() });
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const POSTS_PAGE_SIZE = 30;

  // Persist connection state
  useEffect(() => {
    if (isLive) return;
    try { localStorage.setItem('xbee_connections', JSON.stringify(Array.from(connections))); } catch {}
  }, [connections, isLive]);
  useEffect(() => {
    if (isLive) return;
    try { localStorage.setItem('xbee_pending_sent', JSON.stringify(Array.from(pendingSent))); } catch {}
  }, [pendingSent, isLive]);
  useEffect(() => {
    if (isLive) return;
    try { localStorage.setItem('xbee_pending_received', JSON.stringify(Array.from(pendingReceived))); } catch {}
  }, [pendingReceived, isLive]);

  const getConnectionStatus = useCallback((userId: string): ConnectionStatus => {
    if (userId === currentUser.id) return 'connected';
    if (connections.has(userId)) return 'connected';
    if (pendingSent.has(userId)) return 'pending_sent';
    if (pendingReceived.has(userId)) return 'pending_received';
    return 'none';
  }, [connections, pendingSent, pendingReceived, currentUser.id]);

  const sendConnectionRequest = useCallback((userId: string, message?: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    // Mark as pending_sent for the current user
    setPendingSent(prev => { const n = new Set(prev); n.add(userId); return n; });
        
    const req: ConnectionRequest = {
      id: `creq-${Date.now()}`,
      from: currentUser,
      to: targetUser,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
    };
    setConnectionRequests(prev => [...prev, req]);

    setNotifications(prev => [{
      id: `notif-creq-${Date.now()}`,
      type: 'follow' as const,
      actor: currentUser,
      content: message 
        ? `wants to connect: "${message.substring(0, 50)}"` 
        : 'wants to connect with you',
      createdAt: new Date().toISOString(),
      read: false,
    }, ...prev]);
  }, [currentUser, allUsers]);

  const acceptConnectionRequest = useCallback((requestId: string) => {
    const req = connectionRequests.find(r => r.id === requestId);
    if (!req) return;
    const otherId = req.from.id === currentUser.id ? req.to.id : req.from.id;
    setConnections(prev => { const n = new Set(prev); n.add(otherId); return n; });
    setPendingSent(prev => { const n = new Set(prev); n.delete(otherId); return n; });
    setPendingReceived(prev => { const n = new Set(prev); n.delete(otherId); return n; });
    setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() } : r));
    setNotifications(prev => [{
      id: `notif-conn-${Date.now()}`,
      type: 'follow' as const,
      actor: currentUser,
      content: `accepted your connection request 🎉 You are now connected!`,
      createdAt: new Date().toISOString(),
      read: false,
    }, ...prev]);
  }, [connectionRequests, currentUser]);

  const declineConnectionRequest = useCallback((requestId: string) => {
    const req = connectionRequests.find(r => r.id === requestId);
    if (!req) return;
    const otherId = req.from.id === currentUser.id ? req.to.id : req.from.id;
    setPendingSent(prev => { const n = new Set(prev); n.delete(otherId); return n; });
    setPendingReceived(prev => { const n = new Set(prev); n.delete(otherId); return n; });
    setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'declined', respondedAt: new Date().toISOString() } : r));
  }, [connectionRequests]);

  const removeConnection = useCallback((userId: string) => {
    setConnections(prev => { const n = new Set(prev); n.delete(userId); return n; });
  }, []);

  const connectionHeat = React.useMemo(() => ({
    level: Math.min(100, connections.size * 15 + pendingSent.size * 5 + pendingReceived.size * 8),
    connections: connections.size,
    networkGrowth: connections.size > 0 ? (connections.size / Math.max(pendingSent.size, 1)) * 100 : 0,
  }), [connections, pendingSent, pendingReceived]);

  // ─── Add a new conversation to the store ────────────────────────
  const addConversation = useCallback((participants: User[], firstMessage: Message): Conversation => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      participants,
      lastMessage: firstMessage,
      unreadCount: 0,
      pinned: false, muted: false, encrypted: true,
      safeMode: false, riskLevel: 'safe', scamAlerts: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setMessageStore(prev => ({ ...prev, [newConv.id]: [firstMessage] }));
    return newConv;
  }, []);

  // ─── Verified Changes (admin-granted special permissions) ──────
  // verifiedChanges: Set of user IDs who can edit followers, backdate posts, choose badge
  const [verifiedChanges, setVerifiedChanges] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { const saved = localStorage.getItem('xbee_verified_changes'); if (saved) return new Set(JSON.parse(saved)); } catch {}
    return new Set([currentUser.id]); // admin themselves always have it
  });

  const isVerifiedChange = useCallback((userId: string) => {
    return verifiedChanges.has(userId);
  }, [verifiedChanges]);

  const toggleVerifiedChange = useCallback((userId: string) => {
    setVerifiedChanges(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('xbee_verified_changes', JSON.stringify(Array.from(next))); } catch {}
      }
      return next;
    });
  }, []);

  // Message Requests
  const sendMessageRequest = useCallback((userId: string, content: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;
    const req: MessageRequest = {
      id: `mreq-${Date.now()}`,
      from: currentUser,
      content: content.substring(0, 200),
      createdAt: new Date().toISOString(),
      read: false,
      responded: false,
    };
    setMessageRequests(prev => [req, ...prev]);
    setNotifications(prev => [{
      id: `notif-mreq-${Date.now()}`,
      type: 'message' as const,
      actor: currentUser,
      content: `sent you a message: "${content.substring(0, 50)}"`,
      createdAt: new Date().toISOString(),
      read: false,
    }, ...prev]);
  }, [currentUser, allUsers]);

  const acceptMessageRequest = useCallback((requestId: string) => {
    setMessageRequests(prev => prev.map(r => r.id === requestId ? { ...r, responded: true, read: true } : r));
    const req = messageRequests.find(r => r.id === requestId);
    if (req) {
      // Create or reuse conversation for this person
      const existing = conversations.find(c => c.participants.some(p => p.id === req.from.id));
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participants: [currentUser, req.from],
          lastMessage: {
            id: `msg-${Date.now()}`,
            senderId: req.from.id,
            content: req.content,
            type: 'text',
            createdAt: req.createdAt,
            read: true,
            encrypted: true,
          },
          unreadCount: 0,
          pinned: false, muted: false, encrypted: true,
          safeMode: false, riskLevel: 'safe', scamAlerts: [],
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newConv.id);
      }
    }
  }, [messageRequests, conversations, currentUser]);

  const dismissMessageRequest = useCallback((requestId: string) => {
    setMessageRequests(prev => prev.map(r => r.id === requestId ? { ...r, responded: true, read: true } : r));
  }, []);

  const messageRequestUnread = messageRequests.filter(r => !r.read).length;

  const canSendMessage = useCallback((userId: string): boolean => {
    if (userId === currentUser.id) return true;
    return connections.has(userId);
  }, [connections, currentUser.id]);

  // ===== OLD FUNCTIONS KEPT FOR BACKWARDS COMPAT =====
  const followUser = useCallback(async (userId: string) => {
    sendConnectionRequest(userId);
  }, [sendConnectionRequest]);

  const unfollowUser = useCallback(async (userId: string) => {
    removeConnection(userId);
  }, [removeConnection]);

  const isFollowingUser = useCallback((userId: string) => {
    return connections.has(userId) || pendingSent.has(userId);
  }, [connections, pendingSent]);

  // Sync current user
  useEffect(() => {
    if (profile) {
      setCurrentUser(profile);
    } else if (!isLive) {
      try {
        const saved = localStorage.getItem('xbee_profile');
        if (saved) { const parsed = JSON.parse(saved); setCurrentUser(prev => ({ ...prev, ...parsed })); }
      } catch {}
    }
  }, [profile, isLive]);

  // Supabase: Load posts
  useEffect(() => {
    if (!isLive) return;
    const supabase = getSupabase();
    async function loadPosts() {
      const { data: postsData } = await supabase
        .from('posts').select('*, profiles!posts_author_id_fkey(*)')
        .order('created_at', { ascending: false }).limit(POSTS_PAGE_SIZE) as unknown as { data: PostWithProfile[] | null };
      if (!postsData) return;
      setHasMorePosts(postsData.length >= POSTS_PAGE_SIZE);
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', authUser?.id || '') as { data: { post_id: string }[] | null };
      const { data: reposts } = await supabase.from('post_reposts').select('post_id').eq('user_id', authUser?.id || '') as { data: { post_id: string }[] | null };
      const { data: bookmarks } = await supabase.from('post_bookmarks').select('post_id').eq('user_id', authUser?.id || '') as { data: { post_id: string }[] | null };
      const likedSet = new Set((likes || []).map(l => l.post_id));
      const repostedSet = new Set((reposts || []).map(r => r.post_id));
      const bookmarkedSet = new Set((bookmarks || []).map(b => b.post_id));
      userInteractionsRef.current = { liked: likedSet, reposted: repostedSet, bookmarked: bookmarkedSet };
      const appPosts = postsData.map(row => {
        const author = row.profiles ? profileToUser(row.profiles) : currentUser;
        return dbPostToPost(row, author, authUser?.id || '', userInteractionsRef.current);
      });
      setPosts(appPosts);
    }
    loadPosts();
    const channel = supabase.channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const { data: fullPost } = await supabase.from('posts').select('*, profiles!posts_author_id_fkey(*)').eq('id', payload.new.id).single() as unknown as { data: PostWithProfile | null };
        if (fullPost) {
          const author = fullPost.profiles ? profileToUser(fullPost.profiles) : currentUser;
          const post = dbPostToPost(fullPost, author, authUser?.id || '', userInteractionsRef.current);
          setPosts(prev => [post, ...prev.filter(p => p.id !== post.id)]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.map(p => p.id === payload.new.id ? { ...p, likes: payload.new.likes_count, reposts: payload.new.reposts_count, replies: payload.new.replies_count, views: payload.new.views_count } : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLive, authUser, currentUser]);

  const loadMorePosts = useCallback(async () => {
    if (!isLive || isLoadingMorePosts || !hasMorePosts) return;
    setIsLoadingMorePosts(true);
    try {
      const supabase = getSupabase();
      const oldestPost = posts[posts.length - 1];
      if (!oldestPost) { setHasMorePosts(false); setIsLoadingMorePosts(false); return; }
      const { data: postsData } = await supabase
        .from('posts').select('*, profiles!posts_author_id_fkey(*)')
        .order('created_at', { ascending: false }).lt('created_at', oldestPost.createdAt).limit(POSTS_PAGE_SIZE) as unknown as { data: PostWithProfile[] | null };
      if (!postsData || postsData.length === 0) { setHasMorePosts(false); setIsLoadingMorePosts(false); return; }
      setHasMorePosts(postsData.length >= POSTS_PAGE_SIZE);
      const newPosts = postsData.map(row => {
        const author = row.profiles ? profileToUser(row.profiles) : currentUser;
        return dbPostToPost(row, author, authUser?.id || '', userInteractionsRef.current);
      });
      setPosts(prev => { const existingIds = new Set(prev.map(p => p.id)); const unique = newPosts.filter(p => !existingIds.has(p.id)); return [...prev, ...unique]; });
    } catch {}
    setIsLoadingMorePosts(false);
  }, [isLive, isLoadingMorePosts, hasMorePosts, posts, currentUser, authUser]);

  // ========== ACTIONS ==========
  const updateProfile = useCallback((updates: Partial<User>): boolean => {
    if (updates.username) {
      const taken = allUsers.some(u => u.username.toLowerCase() === updates.username!.toLowerCase() && u.id !== currentUser.id);
      if (taken) return false;
    }
    if (isLive) {
      const supabase = getSupabase();
      const dbUpdates: any = {};
      if (updates.displayName) dbUpdates.display_name = updates.displayName;
      if (updates.username) dbUpdates.username = updates.username;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.avatar) dbUpdates.avatar = updates.avatar;
      supabase.from('profiles').update(dbUpdates).eq('id', authUser?.id || '').then(() => {});
    }
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      if (!isLive) {
        try { localStorage.setItem('xbee_profile', JSON.stringify({ displayName: updated.displayName, username: updated.username, bio: updated.bio, avatar: updated.avatar })); } catch {}
      }
      setPosts(prevPosts => prevPosts.map(p => p.author.id === prev.id ? { ...p, author: updated } : p));
      return updated;
    });
    return true;
  }, [currentUser.id, isLive, authUser, allUsers]);

  const addPost = useCallback(async (content: string, media?: Post['media']) => {
    if (isLive) {
      const supabase = getSupabase();
      await supabase.from('posts').insert({ author_id: authUser?.id || '', content, media: media ? JSON.parse(JSON.stringify(media)) : [] });
    } else {
      const newPost: Post = {
        id: generateId(), author: currentUser, content, media,
        likes: 0, reposts: 0, replies: 0, views: 0,
        liked: false, reposted: false, bookmarked: false,
        createdAt: new Date().toISOString(),
        credibility: { authorTrust: currentUser.trust.score, contentScore: 80, engagementQuality: 1.0, viralityBrake: false },
      };
      setPosts(prev => [newPost, ...prev]);
    }
  }, [isLive, authUser, currentUser]);

  const likePost = useCallback(async (postId: string) => {
    if (isLive) {
      const supabase = getSupabase();
      const isLiked = userInteractionsRef.current.liked.has(postId);
      if (isLiked) {
        await supabase.from('post_likes').delete().eq('user_id', authUser?.id || '').eq('post_id', postId);
        await supabase.rpc('increment_post_likes', { p_id: postId, delta: -1 });
        userInteractionsRef.current.liked.delete(postId);
      } else {
        await supabase.from('post_likes').insert({ user_id: authUser?.id || '', post_id: postId });
        await supabase.rpc('increment_post_likes', { p_id: postId, delta: 1 });
        userInteractionsRef.current.liked.add(postId);
        const post = posts.find(p => p.id === postId);
        if (post && post.author.id !== (authUser?.id || '')) {
          await supabase.from('notifications').insert({ user_id: post.author.id, actor_id: authUser?.id || '', type: 'like', content: 'liked your post', post_id: postId });
        }
      }
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    } else {
      setPosts(prev => {
        const post = prev.find(p => p.id === postId);
        if (post && post.author.id !== currentUser.id && !post.liked) {
          setNotifications(n => [{ id: `notif-like-${Date.now()}`, type: 'like' as const, actor: currentUser, content: 'liked your post', createdAt: new Date().toISOString(), read: false }, ...n]);
        }
        return prev.map(p => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p);
      });
    }
  }, [isLive, authUser, currentUser, posts]);

  const repostPost = useCallback(async (postId: string) => {
    if (isLive) {
      const supabase = getSupabase();
      const isReposted = userInteractionsRef.current.reposted.has(postId);
      if (isReposted) {
        await supabase.from('post_reposts').delete().eq('user_id', authUser?.id || '').eq('post_id', postId);
        await supabase.rpc('increment_post_reposts', { p_id: postId, delta: -1 });
        userInteractionsRef.current.reposted.delete(postId);
      } else {
        await supabase.from('post_reposts').insert({ user_id: authUser?.id || '', post_id: postId });
        await supabase.rpc('increment_post_reposts', { p_id: postId, delta: 1 });
        userInteractionsRef.current.reposted.add(postId);
        const post = posts.find(p => p.id === postId);
        if (post && post.author.id !== (authUser?.id || '')) {
          await supabase.from('notifications').insert({ user_id: post.author.id, actor_id: authUser?.id || '', type: 'repost', content: 'reposted your post', post_id: postId });
        }
      }
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, reposted: !p.reposted, reposts: p.reposted ? p.reposts - 1 : p.reposts + 1 } : p));
    } else {
      setPosts(prev => {
        const post = prev.find(p => p.id === postId);
        if (post && post.author.id !== currentUser.id && !post.reposted) {
          setNotifications(n => [{ id: `notif-repost-${Date.now()}`, type: 'repost' as const, actor: currentUser, content: 'reposted your post', createdAt: new Date().toISOString(), read: false }, ...n]);
        }
        return prev.map(p => p.id === postId ? { ...p, reposted: !p.reposted, reposts: p.reposted ? p.reposts - 1 : p.reposts + 1 } : p);
      });
    }
  }, [isLive, authUser, currentUser, posts]);

  const bookmarkPost = useCallback(async (postId: string) => {
    if (isLive) {
      const supabase = getSupabase();
      const isBookmarked = userInteractionsRef.current.bookmarked.has(postId);
      if (isBookmarked) {
        await supabase.from('post_bookmarks').delete().eq('user_id', authUser?.id || '').eq('post_id', postId);
        userInteractionsRef.current.bookmarked.delete(postId);
      } else {
        await supabase.from('post_bookmarks').insert({ user_id: authUser?.id || '', post_id: postId });
        userInteractionsRef.current.bookmarked.add(postId);
      }
    }
    setPosts(prev => {
      const updated = prev.map(p => p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p);
      if (!isLive) {
        try { const bookmarkedIds = updated.filter(p => p.bookmarked).map(p => p.id); localStorage.setItem('xbee_bookmarks', JSON.stringify(bookmarkedIds)); } catch {}
      }
      return updated;
    });
  }, [isLive, authUser]);

  const voteOnPoll = useCallback((postId: string, optionIndex: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId || !p.poll || p.poll.voted) return p;
      const newOptions = p.poll.options.map((opt, i) => ({ ...opt, votes: i === optionIndex ? opt.votes + 1 : opt.votes }));
      const totalVotes = newOptions.reduce((sum, o) => sum + o.votes, 0);
      return { ...p, poll: { ...p.poll, options: newOptions.map(o => ({ ...o, percentage: Math.round((o.votes / totalVotes) * 100) })), totalVotes, voted: true, votedOption: optionIndex } };
    }));
  }, []);

  const [viewedPostIds] = useState<Set<string>>(new Set());
  const viewPost = useCallback(async (postId: string) => {
    if (viewedPostIds.has(postId)) return;
    viewedPostIds.add(postId);
    if (isLive) {
      const supabase = getSupabase();
      await supabase.from('post_views').insert({ user_id: authUser?.id || '', post_id: postId }).select().maybeSingle();
      await supabase.rpc('increment_post_views', { p_id: postId });
    }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: p.views + 1 } : p));
  }, [viewedPostIds, isLive, authUser]);

  const getMessages = useCallback((convId: string) => messageStore[convId] || [], [messageStore]);

  const sendMessage = useCallback(async (convId: string, content: string, ghostConfig?: { enabled: boolean; expiresIn: number }) => {
    if (isLive) {
      const supabase = getSupabase();
      await supabase.from('messages').insert({ conversation_id: convId, sender_id: authUser?.id || '', content, type: 'text', ghost_expires_at: ghostConfig?.enabled ? new Date(Date.now() + ghostConfig.expiresIn * 1000).toISOString() : null });
    } else {
      const msg: Message = {
        id: `msg-${Date.now()}`, senderId: currentUser.id, content, type: 'text', createdAt: new Date().toISOString(), read: false, encrypted: true,
        ...(ghostConfig?.enabled ? { ghost: { enabled: true, expiresIn: ghostConfig.expiresIn, expiresAt: new Date(Date.now() + ghostConfig.expiresIn * 1000).toISOString() } } : {}),
      };
      setMessageStore(prev => ({ ...prev, [convId]: [...(prev[convId] || []), msg] }));
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, lastMessage: msg } : c));
    }
  }, [isLive, authUser, currentUser]);

  const addReply = useCallback((convId: string, reply: Message) => {
    setMessageStore(prev => ({ ...prev, [convId]: [...(prev[convId] || []), reply] }));
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, lastMessage: reply, unreadCount: 0 } : c));
  }, []);

  const searchUsers = useCallback((query: string): User[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allUsers.filter(u =>
      u.id !== currentUser.id &&
      (u.displayName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [allUsers, currentUser.id]);

  const addSystemUser = useCallback((user: User) => { setAllUsers(prev => { if (prev.find(u => u.id === user.id)) return prev; return [...prev, user]; }); }, []);
  const deleteSystemUser = useCallback((userId: string) => { setAllUsers(prev => prev.filter(u => u.id !== userId)); setPosts(prev => prev.filter(p => p.author.id !== userId)); if (!isLive) { try { const authUsers = JSON.parse(localStorage.getItem('xbee_users') || '[]'); localStorage.setItem('xbee_users', JSON.stringify(authUsers.filter((u: any) => u.username !== userId))); } catch {} } }, [isLive]);
  const updateUserInSystem = useCallback((userId: string, updates: Partial<User>) => { setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u)); setPosts(prev => prev.map(p => p.author.id === userId ? { ...p, author: { ...p.author, ...updates } } : p)); }, []);
  const updatePostEngagement = useCallback((postId: string, updates: Partial<{ likes: number; reposts: number; replies: number; views: number }>) => { setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p)); }, []);
  const deletePostById = useCallback(async (postId: string) => { if (isLive) { const supabase = getSupabase(); await supabase.from('posts').delete().eq('id', postId); } setPosts(prev => prev.filter(p => p.id !== postId)); }, [isLive]);
  const addPostAsUser = useCallback(async (authorId: string, content: string, createdAt?: string, media?: Post['media']) => {
    if (isLive) {
      const supabase = getSupabase();
      const insertData: any = { author_id: authorId, content, media: media ? JSON.parse(JSON.stringify(media)) : [] };
      if (createdAt) insertData.created_at = createdAt;
      const { data, error } = await supabase.from('posts').insert(insertData).select('*').single();
      if (error || !data) return;
      const author = allUsers.find(u => u.id === authorId);
      if (data && author) {
        const newPost: Post = { id: data.id, author, content: data.content, media: (data.media as unknown as Post['media']) || [], likes: 0, reposts: 0, replies: 0, views: 0, liked: false, reposted: false, bookmarked: false, createdAt: data.created_at, credibility: { authorTrust: author.trust.score, contentScore: 80, engagementQuality: 1.0, viralityBrake: false } };
        setPosts(prev => [newPost, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } else {
      const author = allUsers.find(u => u.id === authorId) || currentUser;
      const newPost: Post = { id: generateId(), author, content, media, likes: 0, reposts: 0, replies: 0, views: 0, liked: false, reposted: false, bookmarked: false, createdAt: createdAt || new Date().toISOString(), credibility: { authorTrust: author.trust.score, contentScore: 80, engagementQuality: 1.0, viralityBrake: false } };
      setPosts(prev => [newPost, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [isLive, authUser, currentUser, allUsers]);

  const addNotification = useCallback((notif: any) => {
    setNotifications(prev => [{
      id: notif.id || `notif-${Date.now()}`, type: notif.type || 'like', content: notif.content || '',
      createdAt: new Date().toISOString(), read: false,
      actor: notif.actor || { id: 'system', displayName: 'Xbee', username: 'xbee', avatar: notif.avatar || '', bio: '', verified: false, trust: { score: 100, tier: 'established' as const }, verification: 'none' as const },
      actionUrl: notif.actionUrl,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    if (isLive) { const supabase = getSupabase(); await supabase.from('notifications').update({ read: true }).eq('id', id); }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [isLive]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Supabase: Load conversations
  const loadConversations = useCallback(async () => {
    if (!isLive || !authUser) return;
    const supabase = getSupabase();
    const { data: participations } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', authUser.id);
    if (!participations || participations.length === 0) { setConversations([]); return; }
    const convIds = participations.map(p => p.conversation_id);
    const { data: convos } = await supabase.from('conversations').select('*').in('id', convIds).order('updated_at', { ascending: false });
    if (!convos) return;
    const { data: allParticipants } = await supabase.from('conversation_participants').select('conversation_id, user_id, profiles!conversation_participants_user_id_fkey(*)').in('conversation_id', convIds) as unknown as { data: ParticipantWithProfile[] | null };
    const appConvos: Conversation[] = await Promise.all(convos.map(async (c) => {
      const participants = (allParticipants || []).filter(p => p.conversation_id === c.id).map(p => p.profiles ? profileToUser(p.profiles as any) : currentUser);
      const { data: lastMsg } = await supabase.from('messages').select('*').eq('conversation_id', c.id).order('created_at', { ascending: false }).limit(1).single();
      const lastMessage: Message = lastMsg ? { id: lastMsg.id, senderId: lastMsg.sender_id, content: lastMsg.content, type: lastMsg.type as any, createdAt: lastMsg.created_at, read: true, encrypted: true } : { id: 'empty', senderId: '', content: 'No messages yet', type: 'system', createdAt: c.created_at, read: true, encrypted: false };
      return { id: c.id, participants, lastMessage, unreadCount: 0, pinned: false, muted: false, encrypted: true, safeMode: false, riskLevel: 'safe' as const, scamAlerts: [] };
    }));
    setConversations(appConvos);
  }, [isLive, authUser, currentUser]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Supabase: Real-time messages
  useEffect(() => {
    if (!isLive || !activeConvId) return;
    const supabase = getSupabase();
    const convId = activeConvId;
    async function loadMessages() {
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true }).limit(100);
      if (data) {
        const msgs: Message[] = data.map(m => ({ id: m.id, senderId: m.sender_id, content: m.content, type: m.type as any, createdAt: m.created_at, read: true, encrypted: true, ghost: m.ghost_expires_at ? { enabled: true, expiresIn: Math.max(0, Math.floor((new Date(m.ghost_expires_at).getTime() - new Date(m.created_at).getTime()) / 1000)), expiresAt: m.ghost_expires_at } : undefined }));
        setMessageStore(prev => ({ ...prev, [convId]: msgs }));
      }
    }
    loadMessages();
    const channel = supabase.channel(`messages-${convId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, (payload) => {
      const m = payload.new; const msg: Message = { id: m.id, senderId: m.sender_id, content: m.content, type: m.type as any, createdAt: m.created_at, read: true, encrypted: true };
      setMessageStore(prev => ({ ...prev, [convId]: [...(prev[convId] || []), msg] }));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLive, activeConvId]);

  // Supabase: Load following
  useEffect(() => {
    if (!isLive) return;
    const supabase = getSupabase();
    async function loadConnections() {
      const { data } = await supabase.from('follows').select('following_id').eq('follower_id', authUser?.id || '');
      if (data) setConnections(new Set(data.map(f => f.following_id)));
    }
    loadConnections();
  }, [isLive, authUser]);

  // Supabase: Load notifications
  useEffect(() => {
    if (!isLive) return;
    const supabase = getSupabase();
    async function loadNotifications() {
      const { data } = await supabase.from('notifications').select('*, actor:profiles!notifications_actor_id_fkey(*)').eq('user_id', authUser?.id || '').order('created_at', { ascending: false }).limit(50) as unknown as { data: NotifWithActor[] | null };
      if (data) {
        const appNotifs: Notification[] = data.map(n => ({ id: n.id, type: n.type as any, actor: n.actor ? profileToUser(n.actor) : currentUser, content: n.content, postId: n.post_id || undefined, read: n.read, createdAt: n.created_at }));
        setNotifications(appNotifs);
      }
    }
    loadNotifications();
    const channel = supabase.channel('notifications-realtime').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${authUser?.id || ''}` }, async (payload) => {
      const { data: full } = await supabase.from('notifications').select('*, actor:profiles!notifications_actor_id_fkey(*)').eq('id', payload.new.id).single() as unknown as { data: NotifWithActor | null };
      if (full) { const notif: Notification = { id: full.id, type: full.type as any, actor: full.actor ? profileToUser(full.actor) : currentUser, content: full.content, postId: full.post_id || undefined, read: full.read, createdAt: full.created_at }; setNotifications(prev => [notif, ...prev]); }
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLive, authUser, currentUser]);

  // Local persistence
  useEffect(() => { if (isLive) return; try { localStorage.setItem('xbee_posts', JSON.stringify(posts.slice(0, 100))); } catch {} }, [posts, isLive]);
  useEffect(() => { if (isLive) return; try { localStorage.setItem('xbee_notifications', JSON.stringify(notifications.slice(0, 200))); } catch {} }, [notifications, isLive]);
  useEffect(() => { if (isLive) return; try { localStorage.setItem('xbee_system_users', JSON.stringify(allUsers)); } catch {} }, [allUsers, isLive]);
  useEffect(() => { if (isLive) return; try { localStorage.setItem('xbee_connection_requests', JSON.stringify(connectionRequests)); } catch {} }, [connectionRequests, isLive]);
  useEffect(() => { if (isLive) return; try { localStorage.setItem('xbee_message_requests', JSON.stringify(messageRequests)); } catch {} }, [messageRequests, isLive]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { posts: [], users: [] };
    const q = searchQuery.toLowerCase();
    return {
      posts: posts.filter(p => p.content?.toLowerCase().includes(q) || p.author?.displayName?.toLowerCase().includes(q) || p.author?.username?.toLowerCase().includes(q)),
      users: allUsers.filter(u => u.displayName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q)),
    };
  }, [searchQuery, posts, allUsers]);

  return (
    <AppContext.Provider value={{
      currentUser, updateProfile,
      posts, addPost, likePost, repostPost, bookmarkPost, voteOnPoll, viewPost,
      loadMorePosts, hasMorePosts, isLoadingMorePosts,

      getConnectionStatus, sendConnectionRequest, acceptConnectionRequest,
      declineConnectionRequest, removeConnection,
      connectionRequests, connections, pendingSent, pendingReceived, connectionHeat,

      messageRequests, sendMessageRequest, acceptMessageRequest, dismissMessageRequest, messageRequestUnread,

      followUser, unfollowUser, isFollowingUser, following: connections,

      conversations, addConversation, loadConversations, getMessages, sendMessage, addReply, activeConvId, setActiveConvId, canSendMessage,

      verifiedChanges, isVerifiedChange, toggleVerifiedChange,

      notifications, addNotification, markNotificationRead, unreadCount,

      searchQuery, setSearchQuery, searchResults, searchUsers,

      allUsers, addSystemUser, deleteSystemUser, updateUserInSystem,
      updatePostEngagement, deletePostById, setPosts, addPostAsUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
