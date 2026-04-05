'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Film, Mic, BarChart3, Smile, MapPin, Globe, Sparkles,
  X, Wand2, Zap, Camera, Plus
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { MediaAttachment } from '@/types';

const MAX_CHARS = 25000;

interface PostComposerProps {
  onPost?: (content: string, media?: MediaAttachment[]) => void;
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const charCount = content.length;
  const charPercent = (charCount / MAX_CHARS) * 100;

  const handlePost = () => {
    if (content.trim() || mediaFiles.length > 0) {
      const mediaAttachments: MediaAttachment[] = mediaFiles.map((mf, i) => ({
        id: `upload-${Date.now()}-${i}`,
        type: mf.type,
        url: mf.preview,
        alt: `Uploaded ${mf.type}`,
      }));
      onPost?.(content, mediaAttachments.length > 0 ? mediaAttachments : undefined);
      setContent('');
      setMediaFiles([]);
      setIsFocused(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.slice(0, 4 - mediaFiles.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'image' as const,
    }));
    setMediaFiles(prev => [...prev, ...newMedia].slice(0, 4));
    e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files[0] && mediaFiles.length < 4) {
      setMediaFiles(prev => [...prev, {
        file: files[0],
        preview: URL.createObjectURL(files[0]),
        type: 'video' as const,
      }].slice(0, 4));
    }
    e.target.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleEnhance = () => {
    setAiEnhancing(true);
    setTimeout(() => {
      setContent(prev => prev + '\n\n✨ [AI Enhanced for clarity and engagement]');
      setAiEnhancing(false);
    }, 1500);
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
            className="w-full bg-transparent text-theme-primary text-lg placeholder:text-theme-tertiary resize-none outline-none min-h-[52px] max-h-[300px] py-2"
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
                    key={i}
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
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* AI Enhancement Bar */}
          <AnimatePresence>
            {isFocused && content.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 py-2 border-t border-theme mt-2"
              >
                <motion.button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-xbee-secondary/10 text-xbee-secondary hover:bg-xbee-secondary/20 transition-colors"
                  onClick={handleEnhance}
                  whileTap={{ scale: 0.95 }}
                  disabled={aiEnhancing}
                >
                  {aiEnhancing ? (
                    <div className="w-3 h-3 border-2 border-xbee-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  {aiEnhancing ? 'Enhancing...' : 'Enhance Post'}
                </motion.button>
                <motion.button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-xbee-primary/10 text-xbee-primary hover:bg-xbee-primary/20 transition-colors"
                  onClick={() => setShowAI(!showAI)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-3 h-3" />
                  Xbee AI
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoSelect}
          />

          {/* Actions bar */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 -ml-2">
              <motion.button
                className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                title="Upload Image"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                whileTap={{ scale: 0.9 }}
                title="Upload Video"
                onClick={() => videoInputRef.current?.click()}
              >
                <Film className="w-5 h-5" />
              </motion.button>
              {[
                { icon: Mic, label: 'Voice' },
                { icon: BarChart3, label: 'Poll' },
                { icon: Smile, label: 'Emoji' },
                { icon: MapPin, label: 'Location' },
              ].map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  className="p-2 rounded-full hover:bg-xbee-primary/10 transition-colors text-xbee-primary"
                  whileTap={{ scale: 0.9 }}
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
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
                  !content.trim() && mediaFiles.length === 0 && 'opacity-50 pointer-events-none'
                )}
                onClick={handlePost}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!content.trim() && mediaFiles.length === 0}
              >
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
