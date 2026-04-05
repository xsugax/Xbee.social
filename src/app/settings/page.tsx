'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Palette, Globe, Eye, Database,
  Fingerprint, Smartphone, Key, ChevronRight, Languages, WifiOff,
  Crown, CreditCard, Building2, Scale, FileText, HelpCircle,
  ExternalLink, Heart
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

const settingSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Account Information', desc: 'Username, email, phone' },
      { icon: Key, label: 'Change Password', desc: 'Update your password' },
      { icon: Fingerprint, label: 'Two-Factor Authentication', desc: 'Add extra security', badge: 'Enabled' },
      { icon: Smartphone, label: 'Biometric Login', desc: 'Face ID / Fingerprint' },
    ],
  },
  {
    title: 'Privacy & Safety',
    items: [
      { icon: Shield, label: 'Privacy Settings', desc: 'Control who sees your content' },
      { icon: Eye, label: 'Shadow Ban Transparency', desc: 'Check your content visibility' },
      { icon: Database, label: 'Data & Storage', desc: 'Manage downloaded data' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', desc: 'Customize alert preferences' },
      { icon: Languages, label: 'Language', desc: 'Auto-detect enabled', badge: 'Auto' },
      { icon: WifiOff, label: 'Low Data Mode', desc: 'Reduce data usage' },
      { icon: Globe, label: 'Content Preferences', desc: 'Topics, languages, region' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-theme-primary">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Xbee Pro Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-600/10 border border-amber-500/15 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-theme-primary">Xbee Pro</h3>
              <p className="text-xs text-theme-secondary">Premium membership</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/20">
              $9.99/mo
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['Higher Trust multiplier', 'Priority reach', 'Verified badge', 'Advanced analytics', 'Ad-free experience', 'Early features'].map((perk) => (
              <div key={perk} className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-400" />
                <span className="text-xs text-theme-secondary">{perk}</span>
              </div>
            ))}
          </div>
          <motion.button
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <CreditCard className="w-4 h-4" /> Upgrade to Pro
          </motion.button>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-xbee-primary" />
              <div>
                <h3 className="font-medium text-theme-primary">Appearance</h3>
                <p className="text-sm text-theme-secondary">Choose your theme</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sIdx) => (
          <motion.div
            key={section.title}
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + sIdx * 0.05 }}
          >
            <div className="px-5 py-3 border-b border-theme">
              <h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">{section.title}</h2>
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme last:border-0"
                  whileTap={{ scale: 0.99 }}
                >
                  <Icon className="w-5 h-5 text-theme-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-theme-primary">{item.label}</p>
                    <p className="text-xs text-theme-tertiary">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-xbee-success/10 text-xbee-success">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-theme-tertiary" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* AI Settings */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" className="relative z-10">
                <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-theme-primary">Xbee AI</h3>
              <p className="text-sm text-theme-secondary">Intelligence layer settings</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'AI Post Enhancement', desc: 'Suggest improvements to your posts', on: true },
              { label: 'Smart Replies', desc: 'AI-suggested message replies', on: true },
              { label: 'Content Recommendations', desc: 'AI-curated feed personalization', on: true },
              { label: 'Scam Detection', desc: 'Alert on suspicious messages & users', on: true },
              { label: 'Trust Score Insights', desc: 'AI tips to improve your trust score', on: true },
              { label: 'Auto-translate', desc: 'Translate foreign posts automatically', on: false },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-theme-primary">{setting.label}</p>
                  <p className="text-xs text-theme-tertiary">{setting.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                  setting.on ? 'bg-xbee-primary' : 'bg-theme-tertiary'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    setting.on ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* About Xbee Technologies */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="px-5 py-3 border-b border-theme">
            <h2 className="text-sm font-bold text-theme-tertiary uppercase tracking-wider">About</h2>
          </div>

          {[
            { icon: Building2, label: 'About Xbee Technologies', desc: 'Our mission & company' },
            { icon: FileText, label: 'Terms of Service', desc: 'Legal terms' },
            { icon: Shield, label: 'Privacy Policy', desc: 'How we protect your data' },
            { icon: Scale, label: 'Content Policy', desc: 'Community guidelines' },
            { icon: HelpCircle, label: 'Help Center', desc: 'FAQs & support' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-theme-hover transition-colors cursor-pointer border-b border-theme last:border-0"
                whileTap={{ scale: 0.99 }}
              >
                <Icon className="w-5 h-5 text-theme-secondary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-primary">{item.label}</p>
                  <p className="text-xs text-theme-tertiary">{item.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-theme-tertiary" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Company Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" className="relative z-10">
                <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-theme-primary">Xbee Technologies</p>
              <p className="text-[10px] text-theme-tertiary">Est. 1996</p>
            </div>
          </div>
          <p className="text-xs text-theme-tertiary italic max-w-[300px] mx-auto">
            &ldquo;To restore trust, intelligence, and real human value in digital communication.&rdquo;
          </p>
          <p className="text-xs text-theme-tertiary">Xbee Messenger v2.0.0</p>
          <p className="text-[11px] text-theme-tertiary flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-xbee-danger" fill="currentColor" /> by Xbee Technologies
          </p>
          <p className="text-[10px] text-theme-tertiary">
            &copy; 1996–2026 Xbee Technologies, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
