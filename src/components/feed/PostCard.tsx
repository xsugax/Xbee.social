'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Repeat2, MessageCircle, Share, Bookmark, MoreHorizontal,
  Sparkles, Eye, Info, DollarSign, Flag, ShieldAlert, AlertTriangle, CheckCircle,
  Link as LinkIcon, Check, Copy, X, Send
} from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';
import { Post, FeedMode, Comment } from '@/types';
import { formatNumber, formatTimeAgo, cn } from '@/lib/utils';
import { currentUser } from '@/lib/mockData';

interface PostCardProps {
  post: Post;
  index?: number;
  feedMode?: FeedMode;
}

export default function PostCard({ post, index = 0, feedMode = 'trusted' }: PostCardProps) {
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
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`;
    const text = `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''} — shared from Xbee`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + link)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: currentUser,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        : c
    ));
  };

  const isLowTrust = post.author.trust.score < 50;
  const isReachLimited = post.reachLimited;

  return (
    <motion.article
      className={cn(
        'px-4 py-3 border-b border-theme hover:bg-theme-hover/50 transition-colors cursor-pointer',
        isReachLimited && feedMode === 'trusted' && 'opacity-75',
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      {/* Reach limited warning */}
      {isReachLimited && feedMode === 'trusted' && (
        <div className="flex items-center gap-1.5 ml-12 mb-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-orange-400 font-medium">Reach limited — low trust score</span>
        </div>
      )}

      {/* AI Enhanced badge */}
      {post.aiEnhanced && (
        <div className="flex items-center gap-1.5 ml-12 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-xbee-secondary" />
          <span className="text-xs text-xbee-secondary font-medium">AI Enhanced</span>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/profile?user=${post.author.id}`} onClick={(e) => e.stopPropagation()}>
          <Avatar
            name={post.author.displayName}
            src={post.author.avatar}
            verified={post.author.verified}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link href={`/profile?user=${post.author.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-[15px] text-theme-primary truncate hover:underline">
                {post.author.displayName}
              </Link>
              <TrustBadge
                score={post.author.trust.score}
                tier={post.author.trust.tier}
                size="sm"
                verification={post.author.verification}
              />
              <span className="text-theme-tertiary text-sm shrink-0">@{post.author.username}</span>
              <span className="text-theme-tertiary shrink-0">·</span>
              <span className="text-theme-tertiary text-sm shrink-0 hover:underline">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            <div className="relative">
              <motion.button
                className="p-1.5 rounded-full hover:bg-xbee-primary/10 text-theme-tertiary hover:text-xbee-primary transition-colors"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>
              {showMenu && (
                <motion.div
                  className="absolute right-0 top-8 glass-card w-56 py-1 z-20"
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  {post.whyShowing && (
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors"
                      onClick={(e) => { e.stopPropagation(); setShowWhy(!showWhy); setShowMenu(false); }}
                    >
                      <Info className="w-4 h-4" /> Why am I seeing this?
                    </button>
                  )}
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors">
                    <DollarSign className="w-4 h-4" /> Tip creator
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-xbee-danger hover:bg-theme-hover transition-colors">
                    <Flag className="w-4 h-4" /> Report post
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-1">
            <p className="text-[15px] text-theme-primary leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>

          {/* Media Grid */}
          {post.media && post.media.length > 0 && (
            <div className={cn(
              'mt-3 rounded-2xl overflow-hidden',
              post.media.length === 1 ? '' :
              post.media.length === 2 ? 'grid grid-cols-2 gap-0.5' :
              post.media.length === 3 ? 'grid grid-cols-2 grid-rows-2 gap-0.5' :
              'grid grid-cols-2 grid-rows-2 gap-0.5'
            )}>
              {post.media.slice(0, 4).map((media, i) => (
                <div
                  key={media.id}
                  className={cn(
                    'relative overflow-hidden bg-theme-hover',
                    post.media!.length === 1 ? 'max-h-[500px]' : 'max-h-[280px]',
                    post.media!.length === 3 && i === 0 ? 'row-span-2 max-h-[564px]' : '',
                  )}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.alt || ''}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    </div>
                  )}
                  {post.media!.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{post.media!.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Credibility bar (trusted feed only) */}
          {feedMode === 'trusted' && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {post.credibility.factCheckStatus === 'verified' && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
                {post.credibility.factCheckStatus === 'unverified' && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <AlertTriangle className="w-2.5 h-2.5" /> Unverified
                  </span>
                )}
              </div>
              <div className="flex-1 h-1 rounded-full bg-theme-tertiary overflow-hidden max-w-[100px]">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    post.credibility.contentScore >= 80 ? 'bg-emerald-400' :
                    post.credibility.contentScore >= 60 ? 'bg-blue-400' : 'bg-yellow-500'
                  )}
                  style={{ width: `${post.credibility.contentScore}%` }}
                />
              </div>
              <span className="text-[10px] text-theme-tertiary">
                {post.credibility.contentScore}% credibility
              </span>
            </div>
          )}

          {/* Why showing */}
          {showWhy && post.whyShowing && (
            <motion.div
              className="mt-2 p-3 rounded-xl bg-xbee-primary/5 border border-xbee-primary/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-xbee-primary shrink-0" />
                <p className="text-sm text-xbee-primary">{post.whyShowing}</p>
              </div>
            </motion.div>
          )}

          {/* Poll */}
          {post.poll && (
            <div className="mt-3 space-y-2">
              {post.poll.options.map((option) => (
                <motion.div
                  key={option.id}
                  className="relative overflow-hidden rounded-xl border border-theme p-3 cursor-pointer hover:border-xbee-primary/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className="absolute inset-0 bg-xbee-primary/10 rounded-xl"
                    style={{ width: `${option.percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium text-theme-primary">{option.text}</span>
                    <span className="text-sm font-bold text-theme-primary">{option.percentage}%</span>
                  </div>
                </motion.div>
              ))}
              <p className="text-xs text-theme-tertiary mt-1">
                {formatNumber(post.poll.totalVotes)} votes
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 -ml-2 max-w-md">
            {/* Reply - toggles comment section */}
            <motion.button
              className={cn('post-action', showComments && 'text-xbee-primary')}
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                setShowComments(!showComments);
                if (!showComments) setTimeout(() => commentInputRef.current?.focus(), 100);
              }}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                showComments ? 'bg-xbee-primary/10' : 'group-hover:bg-xbee-primary/10'
              )}>
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[13px]">{formatNumber(comments.length > 0 ? comments.length : post.replies)}</span>
            </motion.button>

            {/* Repost */}
            <motion.button
              className={cn('post-action', reposted && 'text-xbee-success')}
              onClick={handleRepost}
              whileTap={{ scale: 0.85 }}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                reposted ? 'bg-xbee-success/10' : 'group-hover:bg-xbee-success/10'
              )}>
                <Repeat2 className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[13px]">{formatNumber(repostCount)}</span>
            </motion.button>

            {/* Like */}
            <motion.button
              className={cn('post-action', liked && 'text-pink-500')}
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
            >
              <div className={cn(
                'p-2 rounded-full transition-colors',
                liked ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'
              )}>
                <Heart className={cn('w-[18px] h-[18px]', liked && 'fill-current')} />
              </div>
              <span className="text-[13px]">{formatNumber(likeCount)}</span>
            </motion.button>

            {/* Views */}
            <motion.button className="post-action" whileTap={{ scale: 0.85 }}>
              <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors">
                <Eye className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[13px]">{formatNumber(post.views)}</span>
            </motion.button>

            {/* Bookmark & Share */}
            <div className="flex items-center">
              <motion.button
                className={cn('post-action', bookmarked && 'text-xbee-primary')}
                onClick={() => setBookmarked(!bookmarked)}
                whileTap={{ scale: 0.85 }}
              >
                <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors">
                  <Bookmark className={cn('w-[18px] h-[18px]', bookmarked && 'fill-current')} />
                </div>
              </motion.button>
              <div className="relative">
                <motion.button
                  className={cn('post-action', showShareMenu && 'text-xbee-primary')}
                  onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
                  whileTap={{ scale: 0.85 }}
                >
                  <div className="p-2 rounded-full group-hover:bg-xbee-primary/10 transition-colors">
                    <Share className="w-[18px] h-[18px]" />
                  </div>
                </motion.button>
                {/* Share dropdown */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      className="absolute right-0 bottom-10 glass-card w-52 py-1 z-30"
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-primary hover:bg-theme-hover transition-colors"
                        onClick={handleCopyLink}
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copiedLink ? 'Link copied!' : 'Copy link'}
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-emerald-500 hover:bg-theme-hover transition-colors"
                        onClick={handleWhatsAppShare}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Share to WhatsApp
                      </button>
                      <button
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-tertiary hover:bg-theme-hover transition-colors"
                        onClick={(e) => { e.stopPropagation(); setShowShareMenu(false); }}
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                className="mt-3 border-t border-theme pt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Existing comments */}
                {comments.length > 0 && (
                  <div className="space-y-3 mb-3 max-h-[300px] overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5">
                        <Link href={`/profile?user=${comment.author.id}`} onClick={(e) => e.stopPropagation()} className="shrink-0">
                          <Avatar name={comment.author.displayName} src={comment.author.avatar} size="sm" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Link href={`/profile?user=${comment.author.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-[13px] text-theme-primary hover:underline">
                              {comment.author.displayName}
                            </Link>
                            <TrustBadge score={comment.author.trust.score} tier={comment.author.trust.tier} size="sm" verification={comment.author.verification} />
                            <span className="text-xs text-theme-tertiary">{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-[13px] text-theme-primary mt-0.5 leading-relaxed">{comment.content}</p>
                          <button
                            className={cn('flex items-center gap-1 mt-1 text-xs transition-colors', comment.liked ? 'text-pink-500' : 'text-theme-tertiary hover:text-pink-500')}
                            onClick={(e) => { e.stopPropagation(); handleToggleCommentLike(comment.id); }}
                          >
                            <Heart className={cn('w-3 h-3', comment.liked && 'fill-current')} />
                            {comment.likes > 0 && <span>{comment.likes}</span>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex gap-2.5 items-center" onClick={(e) => e.stopPropagation()}>
                  <Avatar name={currentUser.displayName} src={currentUser.avatar} size="sm" />
                  <div className="flex-1 flex items-center gap-2 bg-theme-hover rounded-full px-3 py-1.5">
                    <input
                      ref={commentInputRef}
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent text-sm text-theme-primary placeholder:text-theme-tertiary outline-none"
                    />
                    <motion.button
                      className={cn('p-1 rounded-full transition-colors', commentText.trim() ? 'text-xbee-primary' : 'text-theme-tertiary')}
                      onClick={handleAddComment}
                      whileTap={{ scale: 0.85 }}
                      disabled={!commentText.trim()}
                    >
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
  );
}
