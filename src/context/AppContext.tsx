'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Post, Conversation, Message, Notification } from '@/types';
import { currentUser as defaultUser, mockPosts, mockConversations, mockMessages, mockScamMessages, mockUsers, mockNotifications } from '@/lib/mockData';
import { generateId } from '@/lib/utils';

interface AppState {
  // Current user (editable)
  currentUser: User;
  updateProfile: (updates: Partial<User>) => void;

  // Posts (synced globally)
  posts: Post[];
  addPost: (content: string, media?: Post['media']) => void;
  likePost: (postId: string) => void;
  repostPost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;

  // Poll voting
  voteOnPoll: (postId: string, optionIndex: number) => void;

  // View tracking
  viewPost: (postId: string) => void;

  // Follow system
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  following: Set<string>;

  // Conversations & Messages (synced)
  conversations: Conversation[];
  getMessages: (convId: string) => Message[];
  sendMessage: (convId: string, content: string, ghostConfig?: { enabled: boolean; expiresIn: number }) => void;
  addReply: (convId: string, reply: Message) => void;
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notif: any) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: { posts: Post[]; users: User[]; };
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('xbee_posts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return mockPosts;
  });
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messageStore, setMessageStore] = useState<Record<string, Message[]>>({
    'conv-1': mockMessages,
    'conv-4': mockScamMessages,
  });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [following, setFollowing] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('xbee_following');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(['user-1', 'user-3', 'user-4', 'user-7', 'user-8']);
  });

  // Persist posts to localStorage
  useEffect(() => {
    try { localStorage.setItem('xbee_posts', JSON.stringify(posts.slice(0, 100))); } catch {}
  }, [posts]);

  // Persist following to localStorage
  useEffect(() => {
    try { localStorage.setItem('xbee_following', JSON.stringify(Array.from(following))); } catch {}
  }, [following]);

  const followUser = useCallback((userId: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
    // Add notification
    const target = mockUsers.find(u => u.id === userId);
    if (target) {
      setNotifications(prev => [{
        id: `notif-follow-${Date.now()}`,
        type: 'follow' as const,
        actor: currentUser,
        content: 'started following',
        createdAt: new Date().toISOString(),
        read: true,
      }, ...prev]);
    }
  }, [currentUser]);

  const unfollowUser = useCallback((userId: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  const isFollowingUser = useCallback((userId: string) => {
    return following.has(userId);
  }, [following]);

  // Persist user profile changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xbee_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      try { localStorage.setItem('xbee_profile', JSON.stringify({ displayName: updated.displayName, username: updated.username, bio: updated.bio, avatar: updated.avatar })); } catch {}
      // Update author on existing posts
      setPosts(prevPosts => prevPosts.map(p =>
        p.author.id === prev.id ? { ...p, author: updated } : p
      ));
      return updated;
    });
  }, []);

  const addPost = useCallback((content: string, media?: Post['media']) => {
    const newPost: Post = {
      id: generateId(),
      author: currentUser,
      content,
      media,
      likes: 0, reposts: 0, replies: 0, views: 0,
      liked: false, reposted: false, bookmarked: false,
      createdAt: new Date().toISOString(),
      credibility: {
        authorTrust: currentUser.trust.score,
        contentScore: 80,
        engagementQuality: 1.0,
        viralityBrake: false,
      },
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const likePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }, []);

  const repostPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, reposted: !p.reposted, reposts: p.reposted ? p.reposts - 1 : p.reposts + 1 } : p
    ));
  }, []);

  const bookmarkPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
    ));
  }, []);

  const voteOnPoll = useCallback((postId: string, optionIndex: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId || !p.poll || p.poll.voted) return p;
      const newOptions = p.poll.options.map((opt, i) => ({
        ...opt,
        votes: i === optionIndex ? opt.votes + 1 : opt.votes,
      }));
      const totalVotes = newOptions.reduce((sum, o) => sum + o.votes, 0);
      return {
        ...p,
        poll: {
          ...p.poll,
          options: newOptions.map(o => ({ ...o, percentage: Math.round((o.votes / totalVotes) * 100) })),
          totalVotes,
          voted: true,
          votedOption: optionIndex,
        },
      };
    }));
  }, []);

  const viewPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, views: p.views + 1 } : p
    ));
  }, []);

  const getMessages = useCallback((convId: string) => {
    return messageStore[convId] || [];
  }, [messageStore]);

  const sendMessage = useCallback((convId: string, content: string, ghostConfig?: { enabled: boolean; expiresIn: number }) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      type: 'text',
      createdAt: new Date().toISOString(),
      read: false,
      encrypted: true,
      ...(ghostConfig?.enabled ? {
        ghost: {
          enabled: true,
          expiresIn: ghostConfig.expiresIn,
          expiresAt: new Date(Date.now() + ghostConfig.expiresIn * 1000).toISOString(),
        },
      } : {}),
    };
    setMessageStore(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), msg],
    }));
    // Update conversation lastMessage
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, lastMessage: msg } : c
    ));
  }, [currentUser.id]);

  const addReply = useCallback((convId: string, reply: Message) => {
    setMessageStore(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), reply],
    }));
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, lastMessage: reply, unreadCount: 0 } : c
    ));
  }, []);

  const addNotification = useCallback((notif: any) => {
    setNotifications(prev => [{
      id: notif.id || `notif-${Date.now()}`,
      type: notif.type || 'like',
      content: notif.content || '',
      createdAt: new Date().toISOString(),
      read: false,
      actor: notif.actor || { id: 'system', displayName: notif.content?.split(' ')?.[0] || 'Xbee', username: 'xbee', avatar: notif.avatar || '', bio: '', verified: false, trust: { score: 100, tier: 'established' as const }, verification: 'none' as const },
      actionUrl: notif.actionUrl,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { posts: [], users: [] };
    const q = searchQuery.toLowerCase();
    return {
      posts: posts.filter(p =>
        p.content.toLowerCase().includes(q) ||
        p.author.displayName.toLowerCase().includes(q) ||
        p.author.username.toLowerCase().includes(q)
      ),
      users: mockUsers.filter(u =>
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, posts]);

  return (
    <AppContext.Provider value={{
      currentUser, updateProfile,
      posts, addPost, likePost, repostPost, bookmarkPost, voteOnPoll, viewPost,
      followUser, unfollowUser, isFollowing: isFollowingUser, following,
      conversations, getMessages, sendMessage, addReply, activeConvId, setActiveConvId,
      notifications, addNotification, markNotificationRead, unreadCount,
      searchQuery, setSearchQuery, searchResults,
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
