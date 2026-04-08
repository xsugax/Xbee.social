'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, Check, LogOut, UserPlus, X, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import TrustBadge from '@/components/trust/TrustBadge';

interface SavedAccount {
  userId: string;
  email: string;
  displayName: string;
  username: string;
  avatar: string;
}

const MAX_ACCOUNTS = 5;
const STORAGE_KEY = 'xbee_saved_accounts';

function getSavedAccounts(): SavedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveAccounts(accounts: SavedAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {}
}

export default function AccountSwitcher({ compact = false }: { compact?: boolean }) {
  const { user, profile, signIn, signOut, isSupabaseConfigured } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved accounts and ensure current account is in the list
  useEffect(() => {
    const saved = getSavedAccounts();
    if (user && profile) {
      const currentAccount: SavedAccount = {
        userId: user.id,
        email: user.email || '',
        displayName: profile.displayName,
        username: profile.username,
        avatar: profile.avatar,
      };
      const exists = saved.find(a => a.userId === user.id);
      if (!exists) {
        const updated = [currentAccount, ...saved].slice(0, MAX_ACCOUNTS);
        saveAccounts(updated);
        setAccounts(updated);
      } else {
        // Update details for current account
        const updated = saved.map(a => a.userId === user.id ? currentAccount : a);
        saveAccounts(updated);
        setAccounts(updated);
      }
    } else {
      setAccounts(saved);
    }
  }, [user, profile]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  if (!isSupabaseConfigured || !user || !profile) return null;

  const otherAccounts = accounts.filter(a => a.userId !== user.id);

  const handleSwitchAccount = async (account: SavedAccount) => {
    setShowAddForm(true);
    setLoginEmail(account.email);
    setLoginPassword('');
    setLoginError('');
  };

  const handleAddAccount = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setIsLoading(true);
    setLoginError('');

    // Sign out current user first
    await signOut();

    // Sign in with new credentials
    const result = await signIn(loginEmail.trim(), loginPassword.trim());

    if (result.error) {
      setLoginError(result.error);
      setIsLoading(false);
      return;
    }

    // Account will be added via the useEffect when user/profile change
    setShowAddForm(false);
    setIsOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    setIsLoading(false);
  };

  const handleRemoveAccount = (userId: string) => {
    const updated = accounts.filter(a => a.userId !== userId);
    saveAccounts(updated);
    setAccounts(updated);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <motion.button
        className={cn(
          'flex items-center gap-3 w-full rounded-full hover:bg-theme-hover transition-colors cursor-pointer',
          compact ? 'p-2 justify-center' : 'p-3'
        )}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
      >
        {compact ? (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-xbee-primary/30">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-xs">
                {profile.displayName.charAt(0)}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xbee-primary to-xbee-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 relative overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                profile.displayName.charAt(0)
              )}
              <div className="absolute -bottom-0.5 -right-0.5">
                <TrustBadge score={profile.trust.score} tier={profile.trust.tier} size="sm" verification={profile.verification} />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-theme-primary truncate">{profile.displayName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-theme-secondary">@{profile.username}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{profile.trust.score}</span>
              </div>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-theme-tertiary transition-transform', isOpen && 'rotate-180')} />
          </>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-[100] w-72 glass-card shadow-2xl border border-theme overflow-hidden',
              compact ? 'bottom-full right-0 mb-2' : 'bottom-full left-0 mb-2'
            )}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Current account */}
            <div className="p-3 border-b border-theme">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Avatar name={profile.displayName} src={profile.avatar} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-theme-primary truncate">{profile.displayName}</p>
                  <p className="text-xs text-theme-secondary truncate">@{profile.username}</p>
                </div>
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            </div>

            {/* Other accounts */}
            {otherAccounts.length > 0 && (
              <div className="border-b border-theme">
                {otherAccounts.map(account => (
                  <div
                    key={account.userId}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-theme-hover transition-colors cursor-pointer group"
                    onClick={() => handleSwitchAccount(account)}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <Avatar name={account.displayName} src={account.avatar} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-theme-primary truncate">{account.displayName}</p>
                      <p className="text-xs text-theme-tertiary truncate">@{account.username}</p>
                    </div>
                    <button
                      className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                      onClick={(e) => { e.stopPropagation(); handleRemoveAccount(account.userId); }}
                      title="Remove account"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add account form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  className="p-3 border-b border-theme bg-theme-hover/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-xs font-bold text-theme-tertiary uppercase tracking-wider mb-2">
                    {loginEmail ? 'Enter password to switch' : 'Add account'}
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Email or username"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-theme-primary border border-theme text-theme-primary outline-none focus:border-xbee-primary transition-colors"
                      autoFocus={!loginEmail}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-theme-primary border border-theme text-theme-primary outline-none focus:border-xbee-primary transition-colors"
                      autoFocus={!!loginEmail}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
                    />
                    {loginError && (
                      <p className="text-xs text-red-400">{loginError}</p>
                    )}
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 text-sm rounded-lg bg-xbee-primary text-white font-medium disabled:opacity-50"
                        onClick={handleAddAccount}
                        disabled={isLoading || !loginEmail.trim() || !loginPassword.trim()}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign in'}
                      </motion.button>
                      <motion.button
                        className="px-3 py-2 text-sm rounded-lg border border-theme text-theme-secondary font-medium"
                        onClick={() => { setShowAddForm(false); setLoginEmail(''); setLoginPassword(''); setLoginError(''); }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="p-1.5">
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-hover transition-colors text-left"
                onClick={() => { router.push('/profile'); setIsOpen(false); }}
              >
                <User className="w-4 h-4 text-theme-secondary" />
                <span className="text-sm font-medium text-theme-primary">View Profile</span>
              </button>
              {accounts.length < MAX_ACCOUNTS && !showAddForm && (
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-theme-hover transition-colors text-left"
                  onClick={() => { setShowAddForm(true); setLoginEmail(''); setLoginPassword(''); setLoginError(''); }}
                >
                  <UserPlus className="w-4 h-4 text-xbee-primary" />
                  <span className="text-sm font-medium text-theme-primary">Add another account</span>
                  <span className="text-[10px] text-theme-tertiary ml-auto">{accounts.length}/{MAX_ACCOUNTS}</span>
                </button>
              )}
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                onClick={async () => { await signOut(); setIsOpen(false); }}
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Log out @{profile.username}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
