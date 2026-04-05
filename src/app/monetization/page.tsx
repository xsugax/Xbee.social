'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, Users, CreditCard, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Gift, Star, BarChart3, Sparkles,
  Shield, Target, Lock, Award
} from 'lucide-react';
import { mockMonetization, currentUser, mockPosts } from '@/lib/mockData';
import PostCard from '@/components/feed/PostCard';
import { cn } from '@/lib/utils';

const statCards = [
  { label: 'Total Earnings', value: '$4,523.87', change: '+24.5%', positive: true, icon: DollarSign, gradient: 'from-emerald-500 to-green-600' },
  { label: 'Monthly Revenue', value: '$1,234.56', change: '+12.3%', positive: true, icon: TrendingUp, gradient: 'from-xbee-primary to-blue-600' },
  { label: 'Subscribers', value: '234', change: '+18', positive: true, icon: Users, gradient: 'from-xbee-secondary to-purple-600' },
  { label: 'Stability Score', value: `${mockMonetization.stabilityScore}%`, change: 'Predictable', positive: true, icon: Shield, gradient: 'from-emerald-400 to-teal-600' },
];

const revenueBreakdown = [
  { label: 'Tips', amount: mockMonetization.tips, percent: 35, color: 'bg-pink-500' },
  { label: 'Subscriptions', amount: mockMonetization.subscriptions, percent: 23, color: 'bg-xbee-secondary' },
  { label: 'Ad Revenue', amount: mockMonetization.adRevenue, percent: 15, color: 'bg-xbee-primary' },
  { label: 'Paid Communities', amount: mockMonetization.paidCommunities, percent: 10, color: 'bg-emerald-500' },
  { label: 'Digital Products', amount: mockMonetization.digitalProducts, percent: 6, color: 'bg-xbee-accent' },
];

export default function MonetizationPage() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Monetization</h1>
            <p className="text-sm text-theme-secondary">Predictable creator income</p>
          </div>
          <motion.button className="xbee-button-primary text-sm" whileTap={{ scale: 0.95 }}>
            <CreditCard className="w-4 h-4" /> Withdraw
          </motion.button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} className="glass-card p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.positive ? 'text-xbee-success' : 'text-xbee-danger'}`}>
                    {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-theme-primary">{stat.value}</p>
                <p className="text-xs text-theme-tertiary mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Income Projections */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-theme-primary">Income Projections</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">PREDICTABLE</span>
          </div>
          <div className="space-y-2">
            {mockMonetization.projections.map((p) => {
              const variance = p.actual > 0 ? Math.round(((p.actual - p.projected) / p.projected) * 100) : null;
              return (
                <div key={p.month} className="flex items-center gap-3">
                  <span className="text-xs text-theme-tertiary w-20 shrink-0">{p.month.slice(0, 3)} {p.month.slice(-2)}</span>
                  <div className="flex-1 h-4 rounded-full bg-theme-tertiary overflow-hidden relative">
                    <div className="h-full bg-xbee-primary/30 rounded-full" style={{ width: `${(p.projected / 1400) * 100}%` }} />
                    {p.actual > 0 && (
                      <div className="absolute top-0 left-0 h-full bg-emerald-400 rounded-full" style={{ width: `${(p.actual / 1400) * 100}%` }} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-theme-primary w-14 text-right">
                    ${p.actual > 0 ? p.actual : p.projected}
                  </span>
                  {variance !== null && (
                    <span className={cn('text-[10px] font-bold w-10 text-right', variance >= 0 ? 'text-emerald-400' : 'text-orange-400')}>
                      {variance >= 0 ? '+' : ''}{variance}%
                    </span>
                  )}
                  {variance === null && <span className="text-[10px] w-10 text-right text-theme-tertiary">est.</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Subscription Tiers */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-xbee-secondary" />
            <h2 className="text-lg font-bold text-theme-primary">Subscription Tiers</h2>
          </div>
          <div className="space-y-3">
            {mockMonetization.tiers.map((tier) => (
              <div key={tier.id} className="p-3 rounded-xl bg-theme-tertiary border border-theme">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-theme-primary">{tier.name}</span>
                  <span className="text-sm font-bold text-xbee-primary">${tier.price}/mo</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-3 h-3 text-theme-tertiary" />
                  <span className="text-xs text-theme-tertiary">{tier.subscribers} subscribers</span>
                  <span className="text-xs font-bold text-emerald-400">${(tier.price * tier.subscribers).toFixed(0)}/mo</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tier.benefits.map((b) => (
                    <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-xbee-primary/10 text-xbee-primary">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-xbee-primary" />
            <h2 className="text-lg font-bold text-theme-primary">Revenue Breakdown</h2>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            {revenueBreakdown.map((item) => (
              <div key={item.label} className={`${item.color} transition-all duration-500`} style={{ width: `${item.percent}%` }} />
            ))}
          </div>
          <div className="space-y-3">
            {revenueBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-theme-primary">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-theme-primary">${item.amount.toFixed(2)}</span>
                  <span className="text-xs text-theme-tertiary w-8 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust-Gated Monetization */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-theme-primary">Trust-Gated Features</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Basic Tipping', trust: 30, unlocked: true },
              { label: 'Ad Revenue Share', trust: 60, unlocked: true },
              { label: 'Subscription Tiers', trust: 75, unlocked: true },
              { label: 'Paid Communities', trust: 80, unlocked: true },
              { label: 'Promoted Posts', trust: 90, unlocked: true },
              { label: 'Revenue Analytics Pro', trust: 95, unlocked: true },
            ].map((feat) => {
              const meetsReq = currentUser.trust.score >= feat.trust;
              return (
                <div key={feat.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    {meetsReq ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-theme-tertiary" />}
                    <span className={cn('text-sm', meetsReq ? 'text-theme-primary' : 'text-theme-tertiary')}>{feat.label}</span>
                  </div>
                  <span className={cn('text-xs font-bold', meetsReq ? 'text-emerald-400' : 'text-theme-tertiary')}>
                    {meetsReq ? '✓ Unlocked' : `${feat.trust}+ required`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Monetization Tools */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-bold text-theme-primary mb-4">Monetization Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Star, label: 'Manage Tiers', desc: 'Edit subscription plans' },
              { icon: ShoppingBag, label: 'Digital Store', desc: 'Sell digital products' },
              { icon: Gift, label: 'Smart Tipping', desc: 'AI-suggested support' },
              { icon: Sparkles, label: 'Growth Insights', desc: 'AI-powered analytics' },
            ].map(({ icon: Icon, label, desc }) => (
              <motion.div key={label} className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover transition-colors cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Icon className="w-5 h-5 text-xbee-primary mb-2" />
                <p className="text-sm font-medium text-theme-primary">{label}</p>
                <p className="text-xs text-theme-tertiary">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Posts */}
        <div>
          <h2 className="text-lg font-bold text-theme-primary mb-3 px-1">Top Earning Posts</h2>
          {mockPosts.slice(0, 2).map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
