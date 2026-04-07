'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Repeat2, MessageCircle, Share, Bookmark, MoreHorizontal,
  Sparkles, Eye, Info, DollarSign, Flag, ShieldAlert, AlertTriangle, CheckCircle,
  Link as LinkIcon, Check, Copy, X, Send, ChevronDown, ChevronUp,
  Reply, Smile, UserPlus, UserMinus, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { Post, FeedMode, Comment } from '@/types';
import { formatNumber, formatTimeAgo, cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { BASE_URL } from '@/lib/config';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface PostCardProps {
  post: Post;
  index?: number;
  feedMode?: FeedMode;
}

// Social share helpers
const sharePlatforms = [
  { name: 'Copy link', icon: 'copy', color: 'text-theme-secondary' },
  { name: 'WhatsApp', icon: 'whatsapp', color: 'text-[#25D366]' },
  { name: 'Twitter/X', icon: 'twitter', color: 'text-theme-primary' },
  { name: 'Facebook', icon: 'facebook', color: 'text-[#1877F2]' },
  { name: 'Telegram', icon: 'telegram', color: 'text-[#0088cc]' },
  { name: 'LinkedIn', icon: 'linkedin', color: 'text-[#0A66C2]' },
  { name: 'Reddit', icon: 'reddit', color: 'text-[#FF4500]' },
  { name: 'Email', icon: 'email', color: 'text-theme-secondary' },
];

function SocialIcon({ type, className }: { type: string; className?: string }) {
  const c = className || 'w-4 h-4';
  switch (type) {
    case 'copy': return <Copy className={c} />;
    case 'email': return <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
    case 'whatsapp': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    case 'twitter': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'facebook': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'telegram': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>;
    case 'linkedin': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'reddit': return <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>;
    default: return null;
  }
}

function CommentItem({ comment, onLike, onReply, depth = 0 }: { comment: Comment; onLike: (id: string) => void; onReply: (parentId: string, content: string) => void; depth?: number }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(depth < 1);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const replies = comment.replies || [];

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className={cn('flex gap-2', depth > 0 && 'ml-8 mt-2')}>
      <Link href={`/profile?user=${comment.author.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0 mt-0.5">
        <Avatar name={comment.author.displayName} src={comment.author.avatar} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="bg-theme-hover/60 rounded-2xl px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Link href={`/profile?user=${comment.author.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-[13px] text-theme-primary hover:underline">
              {comment.author.displayName}
            </Link>
            <TrustBadge score={comment.author.trust.score} tier={comment.author.trust.tier} size="sm" verification={comment.author.verification} />
            <span className="text-[11px] text-theme-tertiary">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-[13px] text-theme-primary mt-0.5 leading-relaxed">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 ml-2">
          <button
            className={cn('flex items-center gap-1 text-xs transition-colors', comment.liked ? 'text-pink-500' : 'text-theme-tertiary hover:text-pink-500')}
            onClick={(e) => { e.stopPropagation(); onLike(comment.id); }}
          >
            <Heart className={cn('w-3 h-3', comment.liked && 'fill-current')} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          <button
            className="flex items-center gap-1 text-xs text-theme-tertiary hover:text-xbee-primary transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowReplyInput(!showReplyInput); if (!showReplyInput) setTimeout(() => replyInputRef.current?.focus(), 100); }}
          >
            <Reply className="w-3 h-3" /> Reply
          </button>
          {replies.length > 0 && (
            <button
              className="flex items-center gap-1 text-xs text-xbee-primary hover:text-xbee-primary/80 transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowReplies(!showReplies); }}
            >
              {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
        <AnimatePresence>
          {showReplyInput && (
            <motion.div className="flex gap-2 items-center mt-2 ml-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex-1 flex items-center gap-2 bg-theme-hover rounded-full px-3 py-1.5">
                <input ref={replyInputRef} type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitReply(); }} placeholder={`Reply to ${comment.author.displayName}...`} className="flex-1 bg-transparent text-xs text-theme-primary placeholder:text-theme-tertiary outline-none" />
                <motion.button className={cn('p-1 rounded-full transition-colors', replyText.trim() ? 'text-xbee-primary' : 'text-theme-tertiary')} onClick={handleSubmitReply} whileTap={{ scale: 0.85 }} disabled={!replyText.trim()}>
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showReplies && replies.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {replies.map((r) => (
                <CommentItem key={r.id} comment={r} onLike={onLike} onReply={onReply} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PostCard({ post, index = 0, feedMode = 'trusted' }: PostCardProps) {
  const { currentUser, likePost, repostPost, bookmarkPost, followUser, unfollowUser, isFollowing: checkFollowing, voteOnPoll, viewPost } = useApp();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.reposted);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [showWhy, setShowWhy] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showMediaViewer, setShowMediaViewer] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipSent, setTipSent] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const isOwnPost = post.author.id === currentUser.id;
  const isFollowingAuthor = checkFollowing ? checkFollowing(post.author.id) : false;
  const hasVoted = post.poll?.voted;

  // Track views on mount
  useEffect(() => {
    viewPost?.(post.id);
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click-outside and Escape to close dropdowns
  useEffect(() => {
    if (!showMenu && !showShareMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
      if (showShareMenu && shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) setShowShareMenu(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowMenu(false); setShowShareMenu(false); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [showMenu, showShareMenu]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    likePost?.(post.id);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
    repostPost?.(post.id);
  };

  const getShareUrl = () => `${BASE_URL}/post/${post.id}`;
  const getShareText = () => `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}  shared from Xbee`;

  const handleShare = (platform: string) => {
    const url = getShareUrl();
    const text = getShareText();
    let shareUrl = '';
    switch (platform) {
      case 'copy': navigator.clipboard?.writeText(url); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
      case 'reddit': shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`; break;
      case 'email': shareUrl = `mailto:?subject=${encodeURIComponent('Check this out on Xbee')}&body=${encodeURIComponent(text + '\n\n' + url)}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = { id: `c-${Date.now()}`, author: currentUser, content: commentText.trim(), createdAt: new Date().toISOString(), likes: 0, liked: false, replies: [] };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    commentInputRef.current?.blur();
  };

  const handleLikeComment = useCallback((commentId: string) => {
    const toggleLike = (items: Comment[]): Comment[] => items.map(c => {
      if (c.id === commentId) return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      if (c.replies?.length) return { ...c, replies: toggleLike(c.replies) };
      return c;
    });
    setComments(prev => toggleLike(prev));
  }, []);

  const handleReplyToComment = useCallback((parentId: string, content: string) => {
    const newReply: Comment = { id: `r-${Date.now()}`, author: currentUser, content, createdAt: new Date().toISOString(), likes: 0, liked: false, replies: [], replyTo: parentId };
    const addReply = (items: Comment[]): Comment[] => items.map(c => {
      if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newReply] };
      if (c.replies?.length) return { ...c, replies: addReply(c.replies) };
      return c;
    });
    setComments(prev => addReply(prev));
  }, [currentUser]);

  const totalComments = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
  const isLowTrust = post.author.trust.score < 50;
  const isReachLimited = post.reachLimited;

  return (
    <>
      <motion.article className={cn('px-4 py-3 border-b border-theme hover:bg-theme-hover/50 transition-colors', isReachLimited && feedMode === 'trusted' && 'opacity-75')} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.05, duration: reduceMotion ? 0 : 0.3 }}>
        {isReachLimited && feedMode === 'trusted' && (
          <div className="flex items-center gap-1.5 ml-12 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">Reach limited  low trust score</span>
          </div>
        )}
        {post.aiEnhanced && (
          <div className="flex items-center gap-1.5 ml-12 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-xbee-secondary" />
            <span className="text-xs text-xbee-secondary font-medium">AI Enhanced</span>
          </div>
        )}

        <div className="flex gap-3">
          <Link href={`/profile?user=${post.author.id}`} onClick={(e) => e.stopPropagation()}>
            <Avatar name={post.author.displayName} src={post.author.avatar} verified={post.author.verified} size="md" />
          </Link>
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <Link href={`/profile?user=${post.author.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-[15px] text-theme-primary truncate hover:underline">
                  {post.author.displayName}
                </Link>
                <TrustBadge score={post.author.trust.score} tier={post.author.trust.tier} size="sm" verification={post.author.verification} />
                <span className="text-theme-tertiary text-sm shrink-0 max-sm:hidden">@{post.author.username}</span>
                <span className="text-theme-tertiary shrink-0"></span>
                <span className="text-theme-tertiary text-sm shrink-0 hover:underline">{formatTimeAgo(post.createdAt)}</span>
                {!isOwnPost && !isFollowingAuthor && (
                  <motion.button className="text-xbee-primary text-xs font-bold hover:text-xbee-primary/80 ml-1" onClick={(e) => { e.stopPropagation(); e.preventDefault(); followUser?.(post.author.id); }} whileTap={{ scale: 0.9 }}>
                     Follow
                  </motion.button>
                )}
              </div>
              <div className="relative" ref={menuRef}>
                <motion.button className="p-1.5 rounded-full hover:bg-xbee-primary/10 text-theme-tertiary hover:text-xbee-primary transition-colors" whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} aria-expanded={showMenu} aria-haspopup="true">
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div className="absolute right-0 top-8 glass-card w-56 py-1 z-20" role="menu" initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
                      {!isOwnPost && (
                        <button role="menuitem" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => { isFollowingAuthor ? unfollowUser?.(post.author.id) : followUser?.(post.author.id); setShowMenu(false); }}>
                          {isFollowingAuthor ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          {isFollowingAuthor ? `Unfollow @${post.author.username}` : `Follow @${post.author.username}`}
                        </button>
                      )}
                      <button role="menuitem" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => { setShowStats(!showStats); setShowMenu(false); }}>
                        <BarChart3 className="w-4 h-4" /> Post analytics
                      </button>
                      {post.whyShowing && (
                        <button role="menuitem" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => { setShowWhy(!showWhy); setShowMenu(false); }}>
                          <Info className="w-4 h-4" /> Why am I seeing this?
                        </button>
                      )}
                      <button role="menuitem" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors" onClick={() => { setShowTip(true); setShowMenu(false); }}>
                        <DollarSign className="w-4 h-4" /> Tip creator
                      </button>
                      <button role="menuitem" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-xbee-danger hover:bg-theme-hover transition-colors" onClick={() => { setShowReport(true); setShowMenu(false); }}>
                        <Flag className="w-4 h-4" /> Report post
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Content */}
            <div className="mt-1">
              <p className="text-[15px] text-theme-primary leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
            </div>

            {/* Media Grid (clickable for viewer) */}
            {post.media && post.media.length > 0 && (
              <div className={cn('mt-3 rounded-2xl overflow-hidden', post.media.length === 2 ? 'grid grid-cols-2 gap-0.5' : post.media.length >= 3 ? 'grid grid-cols-2 grid-rows-2 gap-0.5' : '')}>
                {post.media.slice(0, 4).map((media, i) => (
                  <div key={media.id} className={cn('relative overflow-hidden bg-theme-hover cursor-pointer', post.media!.length === 1 ? 'max-h-[500px]' : 'max-h-[280px]', post.media!.length === 3 && i === 0 ? 'row-span-2 max-h-[564px]' : '')} onClick={(e) => { e.stopPropagation(); setShowMediaViewer(i); }}>
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.alt || ''} className="w-full h-full object-cover hover:opacity-90 transition-opacity" loading="lazy" />
                    ) : (
                      <video src={media.url} className="w-full h-full object-cover" controls preload="metadata" />
                    )}
                    {post.media!.length > 4 && i === 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-2xl font-bold">+{post.media!.length - 4}</span></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Post analytics inline */}
            <AnimatePresence>
              {showStats && (
                <motion.div className="mt-2 p-3 rounded-xl bg-theme-hover/80 border border-theme" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div><p className="text-lg font-bold text-theme-primary">{formatNumber(post.views)}</p><p className="text-[10px] text-theme-tertiary">Impressions</p></div>
                    <div><p className="text-lg font-bold text-pink-500">{formatNumber(likeCount)}</p><p className="text-[10px] text-theme-tertiary">Likes</p></div>
                    <div><p className="text-lg font-bold text-xbee-success">{formatNumber(repostCount)}</p><p className="text-[10px] text-theme-tertiary">Reposts</p></div>
                    <div><p className="text-lg font-bold text-xbee-primary">{formatNumber(totalComments || post.replies)}</p><p className="text-[10px] text-theme-tertiary">Comments</p></div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-theme flex items-center justify-between">
                    <span className="text-[10px] text-theme-tertiary">Engagement rate: {((likeCount + repostCount + totalComments) / Math.max(post.views, 1) * 100).toFixed(1)}%</span>
                    <span className="text-[10px] text-emerald-400">Credibility: {post.credibility.contentScore}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Credibility bar */}
            {feedMode === 'trusted' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {post.credibility.factCheckStatus === 'verified' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-2.5 h-2.5" /> Verified</span>
                  )}
                  {post.credibility.factCheckStatus === 'unverified' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><AlertTriangle className="w-2.5 h-2.5" /> Unverified</span>
                  )}
                </div>
                <div className="flex-1 h-1 rounded-full bg-theme-tertiary overflow-hidden max-w-[100px]">
                  <div className={cn('h-full rounded-full transition-all', post.credibility.contentScore >= 80 ? 'bg-emerald-400' : post.credibility.contentScore >= 60 ? 'bg-blue-400' : 'bg-yellow-500')} style={{ width: `${post.credibility.contentScore}%` }} />
                </div>
                <span className="text-[10px] text-theme-tertiary">{post.credibility.contentScore}% credibility</span>
              </div>
            )}

            {/* Why showing */}
            <AnimatePresence>
              {showWhy && post.whyShowing && (
                <motion.div className="mt-2 p-3 rounded-xl bg-xbee-primary/5 border border-xbee-primary/20" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex items-center gap-2"><Info className="w-4 h-4 text-xbee-primary shrink-0" /><p className="text-sm text-xbee-primary">{post.whyShowing}</p></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll */}
            {post.poll && (
              <div className="mt-3 space-y-2">
                {post.poll.options.map((option, optIdx) => (
                  <motion.div key={option.id} className={cn('relative overflow-hidden rounded-xl border p-3 transition-colors', hasVoted ? 'border-theme cursor-default' : 'border-theme cursor-pointer hover:border-xbee-primary/50')} whileHover={hasVoted ? {} : { scale: 1.01 }} whileTap={hasVoted ? {} : { scale: 0.99 }} onClick={(e) => { e.stopPropagation(); if (!hasVoted) voteOnPoll?.(post.id, optIdx); }}>
                    <div className="absolute inset-0 bg-xbee-primary/10 rounded-xl transition-all" style={{ width: hasVoted ? `${option.percentage}%` : '0%' }} />
                    <div className="relative flex items-center justify-between">
                      <span className={cn('text-sm font-medium', post.poll!.votedOption === optIdx ? 'text-xbee-primary font-bold' : 'text-theme-primary')}>{option.text}</span>
                      {hasVoted && <span className="text-sm font-bold text-theme-primary">{option.percentage}%</span>}
                    </div>
                  </motion.div>
                ))}
                <p className="text-xs text-theme-tertiary mt-1">{formatNumber(post.poll.totalVotes)} votes{!hasVoted && ' · Vote to see results'}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-3 -ml-2 max-w-md">
              <motion.button className={cn('post-action', showComments && 'text-xbee-primary')} whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); if (!showComments) setTimeout(() => commentInputRef.current?.focus(), 100); }}>
                <div className={cn('p-2 rounded-full transition-colors', showComments ? 'bg-xbee-primary/10' : 'group-hover:bg-xbee-primary/10')}><MessageCircle className="w-[18px] h-[18px]" /></div>
                <span className="text-[13px]">{formatNumber(totalComments > 0 ? totalComments : post.replies)}</span>
              </motion.button>
              <motion.button className={cn('post-action', reposted && 'text-xbee-success')} onClick={(e) => { e.stopPropagation(); handleRepost(); }} whileTap={{ scale: 0.85 }}>
                <div className={cn('p-2 rounded-full transition-colors', reposted ? 'bg-xbee-success/10' : 'group-hover:bg-xbee-success/10')}><Repeat2 className="w-[18px] h-[18px]" /></div>
                <span className="text-[13px]">{formatNumber(repostCount)}</span>
              </motion.button>
              <motion.button className={cn('post-action', liked && 'text-pink-500')} onClick={(e) => { e.stopPropagation(); handleLike(); }} whileTap={{ scale: 0.85 }}>
                <div className={cn('p-2 rounded-full transition-colors', liked ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10')}><Heart className={cn('w-[18px] h-[18px]', liked && 'fill-current')} /></div>
                <span className="text-[13px]">{formatNumber(likeCount)}</span>
              </motion.button>
              <motion.button className="post-action" whileTap={{ scale: 0.85 }}>
                <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors"><Eye className="w-[18px] h-[18px]" /></div>
                <span className="text-[13px]">{formatNumber(post.views)}</span>
              </motion.button>
              <div className="flex items-center">
                <motion.button className={cn('post-action', bookmarked && 'text-xbee-primary')} onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); bookmarkPost?.(post.id); }} whileTap={{ scale: 0.85 }}>
                  <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors"><Bookmark className={cn('w-[18px] h-[18px]', bookmarked && 'fill-current')} /></div>
                </motion.button>
                <div className="relative" ref={shareMenuRef}>
                  <motion.button className={cn('post-action', showShareMenu && 'text-xbee-primary')} onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }} whileTap={{ scale: 0.85 }} aria-expanded={showShareMenu} aria-haspopup="true">
                    <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors"><Share className="w-[18px] h-[18px]" /></div>
                  </motion.button>
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div className="absolute right-0 bottom-10 glass-card w-56 py-1 z-30" role="menu" initial={{ opacity: 0, scale: 0.95, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 5 }} onClick={(e) => e.stopPropagation()}>
                        <div className="px-3 py-2 border-b border-theme"><span className="text-xs font-bold text-theme-tertiary">SHARE TO</span></div>
                        {sharePlatforms.map((p) => (
                          <button key={p.name} role="menuitem" className={cn('flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-theme-hover transition-colors', p.color)} onClick={() => handleShare(p.icon)}>
                            <SocialIcon type={p.icon} />
                            {p.name === 'Copy link' && copiedLink ? 'Copied!' : p.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && (
                <motion.div className="mt-3 border-t border-theme pt-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  {comments.length > 0 && (
                    <div className="space-y-3 mb-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                      {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onLike={handleLikeComment} onReply={handleReplyToComment} />
                      ))}
                    </div>
                  )}
                  {comments.length === 0 && (
                    <div className="text-center py-4 mb-3">
                      <MessageCircle className="w-8 h-8 text-theme-tertiary mx-auto mb-2 opacity-40" />
                      <p className="text-xs text-theme-tertiary">No comments yet. Be the first!</p>
                    </div>
                  )}
                  <div className="flex gap-2.5 items-center" onClick={(e) => e.stopPropagation()}>
                    <Avatar name={currentUser.displayName} src={currentUser.avatar} size="sm" />
                    <div className="flex-1 flex items-center gap-2 bg-theme-hover rounded-full px-3 py-1.5">
                      <input ref={commentInputRef} type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }} placeholder="Write a comment..." className="flex-1 bg-transparent text-sm text-theme-primary placeholder:text-theme-tertiary outline-none" />
                      <motion.button className={cn('p-1 rounded-full transition-colors', commentText.trim() ? 'text-xbee-primary' : 'text-theme-tertiary')} onClick={handleAddComment} whileTap={{ scale: 0.85 }} disabled={!commentText.trim()}>
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.article>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {showMediaViewer !== null && post.media && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Media viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMediaViewer(null)}>
            <motion.button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10" whileTap={{ scale: 0.9 }} onClick={() => setShowMediaViewer(null)}>
              <X className="w-6 h-6" />
            </motion.button>
            <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {post.media[showMediaViewer]?.type === 'image' ? (
                <motion.img src={post.media[showMediaViewer]?.url} alt={post.media[showMediaViewer]?.alt || 'Post media'} className="max-w-full max-h-[90vh] object-contain rounded-lg" initial={{ scale: 0.8 }} animate={{ scale: 1 }} />
              ) : (
                <video src={post.media[showMediaViewer]?.url} className="max-w-full max-h-[90vh]" controls autoPlay />
              )}
            </div>
            {post.media.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {post.media.map((_, i) => (
                  <button key={i} className={cn('w-2.5 h-2.5 rounded-full transition-colors', i === showMediaViewer ? 'bg-white' : 'bg-white/30')} onClick={(e) => { e.stopPropagation(); setShowMediaViewer(i); }} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Report post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowReport(false); setReportSubmitted(false); setReportReason(''); }}>
            <motion.div className="glass-card w-full max-w-sm p-5" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              {reportSubmitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-lg font-bold text-theme-primary">Report Submitted</p>
                  <p className="text-sm text-theme-tertiary mt-1">Our team will review this post. Thank you for keeping Xbee safe.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2"><Flag className="w-5 h-5 text-red-400" /> Report Post</h3>
                    <button onClick={() => setShowReport(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  <p className="text-sm text-theme-tertiary mb-3">Why are you reporting this post?</p>
                  <div className="space-y-2 mb-4">
                    {['Spam or scam', 'Harassment or bullying', 'Misinformation', 'Hate speech', 'Violence or threats', 'Inappropriate content', 'Copyright violation', 'Other'].map((reason) => (
                      <button key={reason} className={cn('w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors', reportReason === reason ? 'bg-xbee-primary/20 text-xbee-primary font-bold border border-xbee-primary/30' : 'bg-theme-tertiary text-theme-primary hover:bg-theme-hover')} onClick={() => setReportReason(reason)}>{reason}</button>
                    ))}
                  </div>
                  <motion.button className="w-full py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-50" disabled={!reportReason} onClick={() => setReportSubmitted(true)} whileTap={{ scale: 0.98 }}>Submit Report</motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip Modal */}
      <AnimatePresence>
        {showTip && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Tip creator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowTip(false); setTipSent(false); setTipAmount(''); }}>
            <motion.div className="glass-card w-full max-w-sm p-5" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              {tipSent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-lg font-bold text-theme-primary">Tip Sent!</p>
                  <p className="text-sm text-theme-tertiary mt-1">${tipAmount} sent to @{post.author.username}. They&apos;ll love this!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Tip @{post.author.username}</h3>
                    <button onClick={() => setShowTip(false)}><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  <p className="text-sm text-theme-tertiary mb-4">Show appreciation for great content</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['1', '2', '5', '10'].map(a => (
                      <button key={a} className={cn('py-3 rounded-xl text-sm font-bold transition-colors', tipAmount === a ? 'bg-emerald-500 text-white' : 'bg-theme-tertiary text-theme-primary hover:bg-theme-hover')} onClick={() => setTipAmount(a)}>${a}</button>
                    ))}
                  </div>
                  <div className="relative mb-4">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
                    <input type="number" min="1" className="xbee-input w-full py-2.5 pl-9" placeholder="Custom amount" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} />
                  </div>
                  <motion.button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2" disabled={!tipAmount || parseFloat(tipAmount) < 1} onClick={() => setTipSent(true)} whileTap={{ scale: 0.98 }}>
                    <DollarSign className="w-4 h-4" /> Send ${tipAmount || '0'} Tip
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}