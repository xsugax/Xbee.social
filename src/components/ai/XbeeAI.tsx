'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, PenLine, MessageCircle, Globe,
  Shield, Lightbulb, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const capabilities = [
  { icon: PenLine, label: 'Write a post', description: 'Create engaging content' },
  { icon: MessageCircle, label: 'Smart reply', description: 'Reply in your tone' },
  { icon: Globe, label: 'Translate', description: 'Any language instantly' },
  { icon: Shield, label: 'Scam check', description: 'Verify suspicious content' },
  { icon: Lightbulb, label: 'Get ideas', description: 'Content inspiration' },
];

export default function XbeeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [thinking, setThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      const responses: Record<string, string> = {
        default: "I can help you with writing posts, suggesting replies, translating content, detecting scams, and recommending content. What would you like to do?",
      };

      let response = responses.default;
      const lower = userMsg.toLowerCase();
      if (lower.includes('write') || lower.includes('post')) {
        response = "Here's a draft for your post:\n\n\"🚀 Just discovered an incredible approach to building scalable APIs — using event sourcing with CQRS. The separation of reads and writes changes everything.\n\nThread on what I learned 👇\"\n\nWant me to adjust the tone or add more detail?";
      } else if (lower.includes('translate')) {
        response = "I can translate content into 100+ languages. Just paste the text you'd like translated and tell me the target language!";
      } else if (lower.includes('scam') || lower.includes('suspicious')) {
        response = "🔍 I'll analyze the content for red flags. Look for:\n• Urgency tactics ('Act now!')\n• Requests for personal info\n• Unverified links\n• Too-good-to-be-true offers\n\nPaste the suspicious content for analysis.";
      } else if (lower.includes('idea') || lower.includes('suggest')) {
        response = "💡 Content ideas trending in your niche:\n\n1. \"5 underrated tools for full-stack devs in 2026\"\n2. \"Why I switched from X framework to Y\"\n3. \"My honest review after 1 year of remote work\"\n4. \"The one habit that 10x'd my productivity\"\n\nWant me to draft any of these?";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary text-white shadow-glow flex items-center justify-center lg:bottom-8"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 right-0 w-full max-w-md h-[85vh] z-50 glass-card rounded-t-3xl lg:bottom-4 lg:right-4 lg:rounded-3xl lg:h-[600px]"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-theme">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-bold text-theme-primary">Xbee AI</h3>
                    <p className="text-xs text-xbee-success">Always ready</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-theme-hover">
                  <X className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-140px)] scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-xbee-primary/20 to-xbee-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-xbee-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-theme-primary mb-1">How can I help?</h3>
                    <p className="text-sm text-theme-secondary mb-6">Your AI assistant for everything on Xbee</p>
                    <div className="grid grid-cols-2 gap-2">
                      {capabilities.map(({ icon: Icon, label, description }) => (
                        <motion.button
                          key={label}
                          className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover text-left transition-colors"
                          onClick={() => { setInput(label); }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 text-xbee-primary mb-2" />
                          <p className="text-sm font-medium text-theme-primary">{label}</p>
                          <p className="text-xs text-theme-tertiary">{description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={cn(
                        'max-w-[85%] px-4 py-3 rounded-2xl',
                        msg.role === 'user'
                          ? 'bg-xbee-primary text-white rounded-br-md'
                          : 'bg-theme-tertiary text-theme-primary rounded-bl-md'
                      )}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                {thinking && (
                  <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-theme-tertiary px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-2 text-sm text-theme-secondary">
                        <div className="w-4 h-4 border-2 border-xbee-secondary border-t-transparent rounded-full animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-theme px-4 py-3 bg-theme-primary/80 backdrop-blur-xl rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask Xbee AI..."
                    className="flex-1 bg-theme-tertiary rounded-full px-4 py-2.5 text-sm text-theme-primary placeholder:text-theme-tertiary outline-none focus:ring-2 focus:ring-xbee-primary/30"
                  />
                  <motion.button
                    className="p-2.5 rounded-full bg-xbee-primary text-white disabled:opacity-40"
                    onClick={handleSend}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
