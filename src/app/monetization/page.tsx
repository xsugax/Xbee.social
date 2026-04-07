'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Users, CreditCard, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Gift, Star, BarChart3, Sparkles,
  Shield, Target, Lock, Award, X, CheckCircle2, Loader2,
  Copy, Check, Wallet
} from 'lucide-react';
import { mockMonetization, mockPosts } from '@/lib/mockData';
import PostCard from '@/components/feed/PostCard';
import { cn } from '@/lib/utils';
import DemoBadge from '@/components/ui/DemoBadge';
import { useApp } from '@/context/AppContext';

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
  const { currentUser } = useApp();
  const [showModal, setShowModal] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [tiers, setTiers] = useState(mockMonetization.tiers);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [storeItems, setStoreItems] = useState([
    { id: '1', name: 'Ultimate Dev Toolkit', price: 29, sales: 156, type: 'Template' },
    { id: '2', name: 'Social Media Growth Guide', price: 19, sales: 89, type: 'E-book' },
    { id: '3', name: 'UI Component Library', price: 49, sales: 42, type: 'Code' },
  ]);
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [tipLink, setTipLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10) return;
    setWithdrawProcessing(true);
    setTimeout(() => {
      setWithdrawProcessing(false);
      setWithdrawSuccess(true);
      setTimeout(() => { setShowModal(null); setWithdrawSuccess(false); setWithdrawAmount(''); }, 2000);
    }, 2000);
  };

  const copyTipLink = () => {
    const link = `https://xbee.social/tip/${currentUser.username}`;
    setTipLink(link);
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <DemoBadge />
      <div className="sticky top-0 z-30 glass border-b border-theme">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Monetization</h1>
            <p className="text-sm text-theme-secondary">Predictable creator income</p>
          </div>
          <motion.button className="xbee-button-primary text-sm" whileTap={{ scale: 0.95 }} onClick={() => setShowModal('withdraw')}>
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
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.positive ? 'text-xbee-success' : 'text-xbee-danger'}`}>
                    {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}{stat.change}
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
                    {p.actual > 0 && <div className="absolute top-0 left-0 h-full bg-emerald-400 rounded-full" style={{ width: `${(p.actual / 1400) * 100}%` }} />}
                  </div>
                  <span className="text-xs font-bold text-theme-primary w-14 text-right">${p.actual > 0 ? p.actual : p.projected}</span>
                  {variance !== null ? <span className={cn('text-[10px] font-bold w-10 text-right', variance >= 0 ? 'text-emerald-400' : 'text-orange-400')}>{variance >= 0 ? '+' : ''}{variance}%</span> : <span className="text-[10px] w-10 text-right text-theme-tertiary">est.</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Subscription Tiers */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-xbee-secondary" /><h2 className="text-lg font-bold text-theme-primary">Subscription Tiers</h2></div>
          <div className="space-y-3">
            {mockMonetization.tiers.map((tier) => (
              <div key={tier.id} className="p-3 rounded-xl bg-theme-tertiary border border-theme">
                <div className="flex items-center justify-between mb-2"><span className="font-bold text-sm text-theme-primary">{tier.name}</span><span className="text-sm font-bold text-xbee-primary">${tier.price}/mo</span></div>
                <div className="flex items-center gap-2 mb-2"><Users className="w-3 h-3 text-theme-tertiary" /><span className="text-xs text-theme-tertiary">{tier.subscribers} subscribers</span><span className="text-xs font-bold text-emerald-400">${(tier.price * tier.subscribers).toFixed(0)}/mo</span></div>
                <div className="flex flex-wrap gap-1">{tier.benefits.map((b) => <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-xbee-primary/10 text-xbee-primary">{b}</span>)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-xbee-primary" /><h2 className="text-lg font-bold text-theme-primary">Revenue Breakdown</h2></div>
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            {revenueBreakdown.map((item) => <div key={item.label} className={`${item.color} transition-all duration-500`} style={{ width: `${item.percent}%` }} />)}
          </div>
          <div className="space-y-3">
            {revenueBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${item.color}`} /><span className="text-sm text-theme-primary">{item.label}</span></div>
                <div className="flex items-center gap-3"><span className="text-sm font-bold text-theme-primary">${item.amount.toFixed(2)}</span><span className="text-xs text-theme-tertiary w-8 text-right">{item.percent}%</span></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust-Gated Monetization */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-bold text-theme-primary">Trust-Gated Features</h2></div>
          <div className="space-y-2">
            {[{ label: 'Basic Tipping', trust: 30 }, { label: 'Ad Revenue Share', trust: 60 }, { label: 'Subscription Tiers', trust: 75 }, { label: 'Paid Communities', trust: 80 }, { label: 'Promoted Posts', trust: 90 }, { label: 'Revenue Analytics Pro', trust: 95 }].map((feat) => {
              const meetsReq = currentUser.trust.score >= feat.trust;
              return (
                <div key={feat.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">{meetsReq ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-theme-tertiary" />}<span className={cn('text-sm', meetsReq ? 'text-theme-primary' : 'text-theme-tertiary')}>{feat.label}</span></div>
                  <span className={cn('text-xs font-bold', meetsReq ? 'text-emerald-400' : 'text-theme-tertiary')}>{meetsReq ? ' Unlocked' : `${feat.trust}+ required`}</span>
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
              { icon: Star, label: 'Manage Tiers', desc: 'Edit subscription plans', modal: 'tiers' },
              { icon: ShoppingBag, label: 'Digital Store', desc: 'Sell digital products', modal: 'store' },
              { icon: Gift, label: 'Smart Tipping', desc: 'AI-suggested support', modal: 'tipping' },
              { icon: Sparkles, label: 'Growth Insights', desc: 'AI-powered analytics', modal: 'insights' },
            ].map(({ icon: Icon, label, desc, modal }) => (
              <motion.div key={label} className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover transition-colors cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(modal)}>
                <Icon className="w-5 h-5 text-xbee-primary mb-2" /><p className="text-sm font-medium text-theme-primary">{label}</p><p className="text-xs text-theme-tertiary">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Posts */}
        <div>
          <h2 className="text-lg font-bold text-theme-primary mb-3 px-1">Top Earning Posts</h2>
          {mockPosts.slice(0, 2).map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Withdraw funds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowModal(null); setWithdrawSuccess(false); }}>
            <motion.div className="glass-card w-full max-w-md max-h-[80vh] overflow-y-auto" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>

              {/* Withdraw Modal */}
              {showModal === 'withdraw' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-400" /> Withdraw Funds</h3>
                    <button onClick={() => { setShowModal(null); setWithdrawSuccess(false); }}><X className="w-5 h-5 text-theme-secondary" /></button>
                  </div>
                  {withdrawSuccess ? (
                    <div className="text-center py-6" role="status" aria-live="polite">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <p className="text-lg font-bold text-theme-primary">Withdrawal Initiated!</p>
                      <p className="text-sm text-theme-tertiary mt-1">${withdrawAmount} will be sent to your {withdrawMethod === 'bank' ? 'bank account' : withdrawMethod === 'paypal' ? 'PayPal' : 'crypto wallet'} within 2-3 business days.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <p className="text-xs text-emerald-400 mb-1">Available Balance</p>
                        <p className="text-3xl font-black text-emerald-400">$4,523.87</p>
                      </div>
                      <div>
                        <label className="text-xs text-theme-tertiary mb-1 block">Amount (min $10)</label>
                        <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" /><input type="number" min="10" className="xbee-input w-full py-2.5 pl-9" placeholder="Enter amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} /></div>
                        <div className="flex gap-2 mt-2">{['100', '500', '1000', 'All'].map(a => <button key={a} className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-theme-tertiary hover:bg-theme-hover text-theme-primary transition-colors" onClick={() => setWithdrawAmount(a === 'All' ? '4523.87' : a)}>{a === 'All' ? 'Max' : `$${a}`}</button>)}</div>
                      </div>
                      <div>
                        <label className="text-xs text-theme-tertiary mb-1 block">Withdraw To</label>
                        <div className="grid grid-cols-3 gap-2">{[{ id: 'bank', label: 'Bank' }, { id: 'paypal', label: 'PayPal' }, { id: 'crypto', label: 'Crypto' }].map(m => <button key={m.id} className={cn('py-2 rounded-xl text-xs font-bold transition-colors', withdrawMethod === m.id ? 'bg-xbee-primary text-white' : 'bg-theme-tertiary text-theme-primary')} onClick={() => setWithdrawMethod(m.id)}>{m.label}</button>)}</div>
                      </div>
                      <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50" onClick={handleWithdraw} disabled={withdrawProcessing || !withdrawAmount || parseFloat(withdrawAmount) < 10} whileTap={{ scale: 0.98 }}>
                        {withdrawProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Withdraw ${withdrawAmount || '0'}</>}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Tiers Modal */}
              {showModal === 'tiers' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-theme-primary">Manage Tiers</h3><button onClick={() => setShowModal(null)}><X className="w-5 h-5 text-theme-secondary" /></button></div>
                  <div className="space-y-3">
                    {tiers.map((tier) => (
                      <div key={tier.id} className="p-4 rounded-xl bg-theme-tertiary border border-theme">
                        <div className="flex items-center justify-between mb-2"><span className="font-bold text-theme-primary">{tier.name}</span><span className="text-xbee-primary font-bold">${tier.price}/mo</span></div>
                        <div className="flex items-center gap-2 mb-3"><Users className="w-3 h-3 text-theme-tertiary" /><span className="text-xs text-theme-tertiary">{tier.subscribers} subscribers</span><span className="text-xs font-bold text-emerald-400">${(tier.price * tier.subscribers).toFixed(0)}/mo revenue</span></div>
                        <div className="flex flex-wrap gap-1 mb-3">{tier.benefits.map(b => <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-xbee-primary/10 text-xbee-primary">{b}</span>)}</div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-xbee-primary/10 text-xbee-primary hover:bg-xbee-primary/20" onClick={() => { setEditingTier(editingTier === tier.id ? null : tier.id); }}>
                            {editingTier === tier.id ? 'Cancel' : 'Edit Tier'}
                          </button>
                          <button className="py-1.5 px-3 rounded-lg text-xs font-bold text-theme-tertiary hover:text-red-400 transition-colors" onClick={() => { if (confirm(`Remove "${tier.name}" tier?`)) setTiers(prev => prev.filter(t => t.id !== tier.id)); }}>Remove</button>
                        </div>
                        {editingTier === tier.id && (
                          <motion.div className="mt-3 p-3 rounded-lg bg-theme-hover border border-theme space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <input className="xbee-input text-sm" defaultValue={tier.name} placeholder="Tier name" onBlur={(e) => setTiers(prev => prev.map(t => t.id === tier.id ? { ...t, name: e.target.value } : t))} />
                            <input className="xbee-input text-sm" type="number" defaultValue={tier.price} placeholder="Price" onBlur={(e) => setTiers(prev => prev.map(t => t.id === tier.id ? { ...t, price: Number(e.target.value) } : t))} />
                            <button className="xbee-button-primary text-xs w-full py-2" onClick={() => setEditingTier(null)}>Save Changes</button>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  <motion.button className="w-full py-2.5 rounded-xl border border-dashed border-theme text-theme-tertiary text-sm font-bold mt-4 hover:border-xbee-primary hover:text-xbee-primary transition-colors" whileTap={{ scale: 0.98 }} onClick={() => { setTiers(prev => [...prev, { id: `tier-${Date.now()}`, name: 'New Tier', price: 5, subscribers: 0, benefits: ['Custom benefit'] }]); }}>+ Add New Tier</motion.button>
                </div>
              )}

              {/* Digital Store Modal */}
              {showModal === 'store' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-theme-primary">Digital Store</h3><button onClick={() => setShowModal(null)}><X className="w-5 h-5 text-theme-secondary" /></button></div>
                  <div className="space-y-3">
                    {storeItems.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-theme-tertiary border border-theme">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-theme-primary text-sm">{item.name}</span>
                          <span className="text-xbee-primary font-bold text-sm">${item.price}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-xbee-primary/10 text-xbee-primary">{item.type}</span>
                          <span className="text-xs text-theme-tertiary">{item.sales} sales</span>
                          <span className="text-xs font-bold text-emerald-400">${item.price * item.sales} earned</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-xbee-primary/10 text-xbee-primary hover:bg-xbee-primary/20">Edit</button>
                          <button className="py-1.5 px-3 rounded-lg text-xs font-bold text-theme-tertiary hover:text-red-400 transition-colors" onClick={() => setStoreItems(prev => prev.filter(i => i.id !== item.id))}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <motion.button className="w-full py-2.5 rounded-xl border border-dashed border-theme text-theme-tertiary text-sm font-bold mt-2 hover:border-xbee-primary hover:text-xbee-primary transition-colors" whileTap={{ scale: 0.98 }} onClick={() => setStoreItems(prev => [...prev, { id: `store-${Date.now()}`, name: 'New Product', price: 9, sales: 0, type: 'Digital' }])}>+ Add Product</motion.button>
                  </div>
                </div>
              )}

              {/* Smart Tipping Modal */}
              {showModal === 'tipping' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-theme-primary">Smart Tipping</h3><button onClick={() => setShowModal(null)}><X className="w-5 h-5 text-theme-secondary" /></button></div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
                      <p className="text-xs text-pink-400 mb-1">Tips This Month</p>
                      <p className="text-2xl font-black text-pink-400">${mockMonetization.tips.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-theme-primary mb-2">Your Tip Link</p>
                      <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 rounded-xl bg-theme-tertiary text-xs text-theme-primary truncate">xbee.social/tip/{currentUser.username}</div>
                        <motion.button className="px-3 py-2 rounded-xl bg-xbee-primary/10 text-xbee-primary text-xs font-bold flex items-center gap-1" onClick={copyTipLink} whileTap={{ scale: 0.95 }}>
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied!' : 'Copy'}
                        </motion.button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-theme-primary mb-2">Quick Tip Amounts</p>
                      <div className="grid grid-cols-4 gap-2">{['$2', '$5', '$10', '$25'].map(a => <div key={a} className="py-2 rounded-xl bg-theme-tertiary text-center text-sm font-bold text-theme-primary">{a}</div>)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Growth Insights Modal */}
              {showModal === 'insights' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-theme-primary">Growth Insights</h3><button onClick={() => setShowModal(null)}><X className="w-5 h-5 text-theme-secondary" /></button></div>
                  <div className="space-y-3">
                    {[
                      { tip: 'Post between 6-8 PM for 3x more engagement', impact: 'High', color: 'text-emerald-400' },
                      { tip: 'Your tech content gets 2.5x more tips than other topics', impact: 'High', color: 'text-emerald-400' },
                      { tip: 'Engage with comments within 30 min to boost algorithmic reach', impact: 'Medium', color: 'text-amber-400' },
                      { tip: 'Create a $3/mo tier  68% of your audience prefers low-cost support', impact: 'High', color: 'text-emerald-400' },
                      { tip: 'Collaborate with @marcus_design for cross-audience growth', impact: 'Medium', color: 'text-amber-400' },
                    ].map((insight, i) => (
                      <div key={i} className="p-3 rounded-xl bg-theme-tertiary border border-theme">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-xbee-primary shrink-0 mt-0.5" />
                          <div className="flex-1"><p className="text-sm text-theme-primary">{insight.tip}</p><span className={`text-[10px] font-bold ${insight.color}`}>{insight.impact} Impact</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}