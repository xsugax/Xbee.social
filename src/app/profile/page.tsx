'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Link as LinkIcon,
  Shield, Flame, Award, Edit3, Copy, Check, Users, Ticket, Camera, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import TrustScoreCard from '@/components/trust/TrustScoreCard';
import PostCard from '@/components/feed/PostCard';
import { currentUser, mockPosts, mockInviteCodes, mockUsers } from '@/lib/mockData';
import { formatNumber, cn } from '@/lib/utils';

type ProfileTab = 'posts' | 'replies' | 'media' | 'likes';

function ProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');

  const displayUser = useMemo(() => {
    if (!userId || userId === currentUser.id) return currentUser;
    return mockUsers.find(u => u.id === userId) || currentUser;
  }, [userId]);

  const isOwnProfile = displayUser.id === currentUser.id;

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(displayUser.avatar || null);
  const [isFollowing, setIsFollowing] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const userPosts = mockPosts.filter(p => p.author.id === displayUser.id);
  const displayPosts = userPosts.length > 0 ? userPosts : mockPosts.slice(0, 3);
  const activeInvites = mockInviteCodes.filter(c => c.active);
  const usedInvites = mockInviteCodes.filter(c => !c.active);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  return (
    <div>
      {/* Back button for other profiles */}
      {!isOwnProfile && (
        <div className="sticky top-0 z-30 glass flex items-center gap-4 px-4 py-2.5 border-b border-theme">
          <Link href="/">
            <motion.button
              className="p-1.5 rounded-full hover:bg-theme-hover transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-theme-primary" />
            </motion.button>
          </Link>
          <div>
            <h2 className="font-bold text-theme-primary">{displayUser.displayName}</h2>
            <p className="text-xs text-theme-tertiary">{displayPosts.length} posts</p>
          </div>
        </div>
      )}

      {/* Banner */}
      <div
        className={cn(
          'relative h-48 bg-gradient-to-r from-xbee-primary via-xbee-secondary to-xbee-accent group',
          isOwnProfile && 'cursor-pointer'
        )}
        onClick={() => isOwnProfile && coverInputRef.current?.click()}
      >
        {coverImage && (
          <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        {isOwnProfile && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 rounded-full bg-black/60 text-white">
              <Camera className="w-6 h-6" />
            </div>
          </div>
        )}
        {isOwnProfile && (
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="flex items-end justify-between -mt-16 mb-3">
          <div
            className={cn('border-4 border-theme-primary rounded-full relative group', isOwnProfile && 'cursor-pointer')}
            onClick={() => isOwnProfile && avatarInputRef.current?.click()}
          >
            <Avatar name={displayUser.displayName} src={avatarImage || displayUser.avatar || undefined} size="xl" />
            {isOwnProfile && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
            {isOwnProfile && (
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            )}
          </div>
          {isOwnProfile ? (
            <motion.button className="xbee-button-secondary text-sm mt-16" whileTap={{ scale: 0.95 }}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </motion.button>
          ) : (
            <motion.button
              className={cn(
                'text-sm mt-16 px-5 py-2 rounded-full font-bold transition-colors',
                isFollowing
                  ? 'border border-theme text-theme-primary hover:border-red-500 hover:text-red-500'
                  : 'bg-xbee-primary text-white hover:bg-xbee-primary/90'
              )}
              onClick={() => setIsFollowing(!isFollowing)}
              whileTap={{ scale: 0.95 }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-theme-primary">{displayUser.displayName}</h1>
            <TrustBadge score={displayUser.trust.score} tier={displayUser.trust.tier} size="md" showScore showLabel verification={displayUser.verification} />
          </div>
          <p className="text-theme-secondary">@{displayUser.username}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-xbee-success/10 border border-xbee-success/20">
              <Shield className="w-3.5 h-3.5 text-xbee-success" />
              <span className="text-xs font-medium text-xbee-success">Trust: {displayUser.trust.score}/100</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-medium text-orange-500">{displayUser.streak}-day streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-xbee-primary/10 border border-xbee-primary/20">
              <Users className="w-3.5 h-3.5 text-xbee-primary" />
              <span className="text-xs font-medium text-xbee-primary">Reach: {displayUser.trust.reachMultiplier}x</span>
            </div>
          </div>
        </div>

        <p className="text-theme-primary text-[15px] mt-3 leading-relaxed">{displayUser.bio}</p>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-theme-tertiary">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Joined {new Date(displayUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-5 mt-3">
          <span className="text-sm">
            <span className="font-bold text-theme-primary">{formatNumber(displayUser.following)}</span>
            {' '}<span className="text-theme-tertiary">Following</span>
          </span>
          <span className="text-sm">
            <span className="font-bold text-theme-primary">{formatNumber(displayUser.followers)}</span>
            {' '}<span className="text-theme-tertiary">Followers</span>
          </span>
        </div>

        {displayUser.badges.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Award className="w-4 h-4 text-xbee-warning" />
            <span className="text-sm font-medium text-theme-primary">Badges:</span>
            {displayUser.badges.map(badge => (
              <span key={badge.id} className="px-2.5 py-1 rounded-full bg-xbee-warning/10 text-xs font-medium text-xbee-warning border border-xbee-warning/20" title={badge.description}>
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <TrustScoreCard trust={displayUser.trust} />
      </div>

      {isOwnProfile && (
        <div className="px-4 pb-4">
          <motion.div className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-xbee-primary" />
                <span className="text-sm font-bold text-theme-primary">Invite Codes</span>
              </div>
              <span className="text-xs text-theme-tertiary">{currentUser.invitesRemaining} remaining</span>
            </div>
            <div className="space-y-2">
              {activeInvites.map((inv) => (
                <div key={inv.code} className="flex items-center justify-between p-2 rounded-lg bg-theme-tertiary">
                  <code className="text-xs font-mono text-xbee-primary">{inv.code}</code>
                  <motion.button
                    className={cn('p-1.5 rounded-lg transition-colors', copiedCode === inv.code ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-theme-hover text-theme-secondary')}
                    onClick={() => copyCode(inv.code)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedCode === inv.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
              ))}
            </div>
            {usedInvites.length > 0 && (
              <div className="mt-3 pt-3 border-t border-theme">
                <span className="text-[11px] text-theme-tertiary uppercase tracking-wider">Used</span>
                <div className="space-y-1 mt-1.5">
                  {usedInvites.map((inv) => (
                    <div key={inv.code} className="flex items-center justify-between text-xs text-theme-tertiary">
                      <code className="font-mono opacity-50">{inv.code}</code>
                      <span>Used {inv.usedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-theme">
        {(['posts', 'replies', 'media', 'likes'] as ProfileTab[]).map((tab) => (
          <button
            key={tab}
            className="flex-1 py-3 relative transition-colors hover:bg-theme-hover"
            onClick={() => setActiveTab(tab)}
          >
            <span className={`text-sm font-medium capitalize ${activeTab === tab ? 'text-theme-primary font-bold' : 'text-theme-tertiary'}`}>
              {tab}
            </span>
            {activeTab === tab && (
              <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xbee-primary rounded-full" layoutId="profileTab" />
            )}
          </button>
        ))}
      </div>

      <div>
        {displayPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
        {displayPosts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-theme-tertiary">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-xbee-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
