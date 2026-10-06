'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Film, Smile, X
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { MediaAttachment } from '@/types';
import { removeUserMedia, uploadUserMedia, validateImageFile, validateVideoFile } from '@/lib/mediaUpload';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

const MAX_CHARS = 25000;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

interface PostComposerProps {
  onPost?: (content: string, media?: MediaAttachment[]) => void | Promise<void>;
}

const EMOJI_SET = ['😀','😂','🥹','❤️','🔥','👏','🎉','💡','🚀','✨','😍','🤔','👀','💪','🙌','😎','🤝','💯','⭐','🎯','✅','🐝','💛','🙃','😤','🫡','🥳','💀','🤡','🫶'];

export default function PostComposer({ onPost }: PostComposerProps) {
  const { currentUser } = useApp();
  const { showToast } = useToast();
  const { isSupabaseConfigured, user: authUser } = useAuth();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef(new Set<string>());
  const [lastPostTime, setLastPostTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xbee_lastPostTime');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const charCount = content.length;
  const charPercent = (charCount / MAX_CHARS) * 100;

  useEffect(() => () => {
    previewsRef.current.forEach(URL.revokeObjectURL);
    previewsRef.current.clear();
  }, []);

  const createPreview = (file: File) => {
    const preview = URL.createObjectURL(file);
    previewsRef.current.add(preview);
    return preview;
  };

  const handlePost = async () => {
    if (content.trim() || mediaFiles.length > 0) {
      if (isPosting) return;
      if (mediaFiles.length > 0 && (!isSupabaseConfigured || !authUser)) {
        showToast('Sign in to attach photos or videos to a post.', 'error');
        return;
      }
      const now = Date.now();
      if (now - lastPostTime < 5000) {
        const remaining = Math.ceil((5000 - (now - lastPostTime)) / 1000);
        setCooldownSeconds(remaining);
        setCooldownActive(true);
        const countdown = setInterval(() => {
          setCooldownSeconds(s => {
            if (s <= 1) { clearInterval(countdown); setCooldownActive(false); return 0; }
            return s - 1;
          });
        }, 1000);
        return;
      }
      setIsPosting(true);
      const uploadedUrls: string[] = [];
      try {
        const mediaAttachments: MediaAttachment[] = [];
        for (const mf of mediaFiles) {
          const url = await uploadUserMedia('post-media', currentUser.id, mf.file, 'posts');
          uploadedUrls.push(url);
          mediaAttachments.push({ id: crypto.randomUUID(), type: mf.type, url, alt: `Uploaded ${mf.type}` });
        }
        await onPost?.(content, mediaAttachments.length > 0 ? mediaAttachments : undefined);
        setLastPostTime(now);
        try { localStorage.setItem('xbee_lastPostTime', now.toString()); } catch {}
        mediaFiles.forEach(mf => {
          URL.revokeObjectURL(mf.preview);
          previewsRef.current.delete(mf.preview);
        });
        setContent('');
        setMediaFiles([]);
        setIsFocused(false);
      } catch (error) {
        console.error('Failed to publish post:', error);
        for (const url of uploadedUrls) {
          try {
            await removeUserMedia('post-media', url);
          } catch (cleanupError) {
            console.error('Failed to clean up an unpublished post upload:', cleanupError);
          }
        }
        showToast(error instanceof Error ? error.message : 'Your post could not be published.', 'error');
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!isSupabaseConfigured || !authUser) {
      showToast('Sign in to attach photos or videos to a post.', 'error');
      e.target.value = '';
      return;
    }
    const availableSlots = 4 - mediaFiles.length;
    if (files.length > availableSlots) showToast('A post can include up to four media files.', 'error');
    const accepted: { file: File; preview: string; type: 'image' }[] = [];
    for (const file of files) {
      if (accepted.length >= availableSlots) break;
      const validationError = validateImageFile(file, MAX_IMAGE_SIZE);
      if (validationError) {
        showToast(validationError, 'error');
        continue;
      }
      accepted.push({ file, preview: createPreview(file), type: 'image' });
    }
    setMediaFiles(prev => [...prev, ...accepted]);
    e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!isSupabaseConfigured || !authUser) {
      showToast('Sign in to attach photos or videos to a post.', 'error');
      e.target.value = '';
      return;
    }
    if (files[0] && mediaFiles.length >= 4) {
      showToast('A post can include up to four media files.', 'error');
    } else if (files[0]) {
      const validationError = validateVideoFile(files[0], MAX_VIDEO_SIZE);
      if (validationError) {
        showToast(validationError, 'error');
        e.target.value = '';
        return;
      }
      setMediaFiles(prev => [...prev, {
        file: files[0],
        preview: createPreview(files[0]),
        type: 'video' as const,
      }].slice(0, 4));
    }
    e.target.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      previewsRef.current.delete(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setContent(value);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className={cn(
      'border-b border-theme px-4 pt-3 pb-2 transition-colors',
      isFocused && 'bg-theme-secondary/30'
    )}>
      <div className="flex gap-3">
        <Avatar src={currentUser.avatar} name={currentUser.displayName} verified={currentUser.verified} />
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            placeholder="What's buzzing?"
            className="w-full bg-transparent text-theme-primary text-base sm:text-lg placeholder:text-theme-tertiary resize-none outline-none min-h-[52px] max-h-[200px] sm:max-h-[300px] overflow-y-auto py-2"
            rows={1}
          />

          {/* Media Preview Grid */}
          <AnimatePresence>
            {mediaFiles.length > 0 && (
              <motion.div
                className={cn(
                  'mt-2 gap-2 rounded-2xl overflow-hidden',
                  mediaFiles.length === 1 ? 'grid grid-cols-1' :
                  mediaFiles.length === 2 ? 'grid grid-cols-2' :
                  mediaFiles.length === 3 ? 'grid grid-cols-2 grid-rows-2' :
                  'grid grid-cols-2 grid-rows-2'
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {mediaFiles.map((mf, i) => (
                  <motion.div
                    key={mf.preview}
                    className={cn(
                      'relative group',
                      mediaFiles.length === 1 ? 'max-h-[400px]' : 'max-h-[200px]',
                      mediaFiles.length === 3 && i === 0 ? 'row-span-2 max-h-[408px]' : '',
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {mf.type === 'image' ? (
                      <img
                        src={mf.preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <video
                        src={mf.preview}
                        className="w-full h-full object-cover rounded-xl"
                        controls={false}
                        muted
                      />
                    )}
                    {mf.type === 'video' && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold flex items-center gap-1">
                        <Film className="w-3 h-3" /> Video
                      </div>
                    )}
                    <motion.button
                      type="button"
                      aria-label={`Remove ${mf.type}`}
                      className="absolute top-2 right-2 w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center"
                      onClick={() => removeMedia(i)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleVideoSelect}
          />

          {/* Actions bar */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 -ml-2">
              <motion.button
                type="button"
                className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                aria-label="Add photos"
                title="Add photos"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="w-5 h-5" />
              </motion.button>
              <motion.button
                type="button"
                className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                aria-label="Add video"
                title="Add video"
                onClick={() => videoInputRef.current?.click()}
              >
                <Film className="w-5 h-5" />
              </motion.button>
              <motion.button
                type="button"
                className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                aria-label="Add emoji"
                title="Add emoji"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <Smile className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5">
                    <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor"
                        className="text-theme-tertiary/30" strokeWidth="2" />
                      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor"
                        className={cn(
                          charPercent > 90 ? 'text-xbee-danger' : charPercent > 75 ? 'text-xbee-warning' : 'text-xbee-primary'
                        )}
                        strokeWidth="2"
                        strokeDasharray={`${charPercent * 0.5} 100`}
                      />
                    </svg>
                  </div>
                  {charCount > MAX_CHARS * 0.9 && (
                    <span className={cn(
                      'text-xs font-medium',
                      charPercent > 100 ? 'text-xbee-danger' : 'text-xbee-warning'
                    )}>
                      {MAX_CHARS - charCount}
                    </span>
                  )}
                  <div className="w-px h-6 bg-theme-tertiary/30" />
                </div>
              )}
              <motion.button
                className={cn(
                  'xbee-button-primary py-2 px-5',
                  ((!content.trim() && mediaFiles.length === 0) || cooldownActive || isPosting) && 'opacity-50 pointer-events-none'
                )}
                onClick={handlePost}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={(!content.trim() && mediaFiles.length === 0) || cooldownActive || isPosting}
              >
                {isPosting ? 'Uploading…' : cooldownActive ? `Wait (${cooldownSeconds}s)` : 'Post'}
              </motion.button>
            </div>
          </div>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div className="grid grid-cols-10 gap-1 py-2 border-t border-theme mt-1" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {EMOJI_SET.map((e) => (
                  <button key={e} className="text-xl hover:bg-theme-hover rounded p-1 transition-colors" onClick={() => { setContent(prev => prev + e); textareaRef.current?.focus(); }}>
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
