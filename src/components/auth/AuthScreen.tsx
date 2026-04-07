'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Fingerprint,
  Smartphone, ChevronLeft, Check, User, AtSign, AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'welcome' | 'login' | 'signup' | 'verify';

interface RegisteredUser {
  email: string;
  username: string;
  displayName: string;
  password: string;
  createdAt: string;
}

// Legacy localStorage helpers (fallback when Supabase not configured)
function getRegisteredUsers(): RegisteredUser[] {
  try {
    return JSON.parse(localStorage.getItem('xbee_users') || '[]');
  } catch { return []; }
}

function saveRegisteredUsers(users: RegisteredUser[]) {
  localStorage.setItem('xbee_users', JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'xbee_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function ensureDefaultUsers() {
  const users = getRegisteredUsers();
  const defaults: RegisteredUser[] = [
    { email: 'test@xbee.com', username: 'testuser', displayName: 'Test User', password: 'test1234', createdAt: '2024-01-01' },
    { email: 'alex@xbee.com', username: 'alexchen', displayName: 'Alex Chen', password: 'alex1234', createdAt: '2024-01-01' },
    { email: 'demo@xbee.com', username: 'demo', displayName: 'Demo Account', password: 'demo1234', createdAt: '2024-06-01' },
  ];
  let changed = false;
  for (const d of defaults) {
    if (!users.find(u => u.email === d.email)) {
      users.push(d);
      changed = true;
    }
  }
  if (changed) saveRegisteredUsers(users);
  return users;
}

export default function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const { signIn, signUp, isSupabaseConfigured } = useAuth();
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState(''); // email OR username
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => { if (!isSupabaseConfigured) ensureDefaultUsers(); }, [isSupabaseConfigured]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const id = loginId.trim().toLowerCase();
    const pass = password;

    if (!id || !pass) {
      setError('Please enter your email/username and password');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured) {
      // Supabase Auth
      const { error: err } = await signIn(id, pass);
      setLoading(false);
      if (err) {
        setError(err);
        return;
      }
      onAuth();
    } else {
      // Legacy localStorage auth
      setTimeout(async () => {
        const users = getRegisteredUsers();
        const user = users.find(u =>
          u.email.toLowerCase() === id || u.username.toLowerCase() === id
        );
        if (!user) { setError('Account not found. Check your email or username.'); setLoading(false); return; }
        const hashedPass = await hashPassword(pass);
        if (user.password !== hashedPass && user.password !== pass) { setError('Incorrect password. Try again.'); setLoading(false); return; }
        localStorage.setItem('xbee_session', JSON.stringify({ email: user.email, username: user.username, displayName: user.displayName, loggedInAt: new Date().toISOString() }));
        if (rememberMe) localStorage.setItem('xbee_remembered', 'true');
        else localStorage.removeItem('xbee_remembered');
        try {
          const existing = JSON.parse(localStorage.getItem('xbee_profile') || '{}');
          if (!existing.displayName || existing.displayName === 'Alex Chen') {
            localStorage.setItem('xbee_profile', JSON.stringify({ ...existing, displayName: user.displayName, username: user.username }));
          }
        } catch {}
        setLoading(false);
        onAuth();
      }, 800);
    }
  };

  const handleSignup = async () => {
    setError('');
    const trimEmail = email.trim().toLowerCase();
    const trimUsername = username.trim().toLowerCase();
    const trimName = displayName.trim();

    if (!trimName || trimName.length < 2) { setError('Display name must be at least 2 characters'); return; }
    if (!trimUsername || trimUsername.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!/^[a-z0-9_]+$/.test(trimUsername)) { setError('Username can only contain letters, numbers, and underscores'); return; }
    if (!trimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) { setError('Please enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    if (isSupabaseConfigured) {
      // Supabase signup — go straight through
      setLoading(true);
      const { error: err } = await signUp(trimEmail, password, trimUsername, trimName);
      setLoading(false);
      if (err) { setError(err); return; }
      setSignupSuccess(true);
      setMode('verify');
      setTimeout(() => onAuth(), 1500);
    } else {
      // Legacy signup with verification code
      const users = getRegisteredUsers();
      if (users.find(u => u.email.toLowerCase() === trimEmail)) { setError('An account with this email already exists'); return; }
      if (users.find(u => u.username.toLowerCase() === trimUsername)) { setError('This username is already taken'); return; }
      const code = String(100000 + Math.floor(Math.random() * 900000));
      setGeneratedCode(code);
      setMode('verify');
    }
  };

  const handleVerify = () => {
    setError('');
    const entered = verifyCode.join('');
    if (entered.length < 6) { setError('Please enter the full 6-digit code'); return; }

    // Accept any 6-digit code or the generated code (demo-friendly)
    if (entered !== generatedCode && entered !== '123456') {
      // For demo: accept any 6 digits
    }

    setLoading(true);
    setTimeout(async () => {
      const users = getRegisteredUsers();
      const hashedPw = await hashPassword(password);
      users.push({
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        password: hashedPw,
        createdAt: new Date().toISOString(),
      });
      saveRegisteredUsers(users);

      // Auto-login
      localStorage.setItem('xbee_session', JSON.stringify({
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        loggedInAt: new Date().toISOString(),
      }));
      localStorage.setItem('xbee_remembered', 'true');

      try {
        localStorage.setItem('xbee_profile', JSON.stringify({
          displayName: displayName.trim(),
          username: username.trim().toLowerCase(),
        }));
      } catch {}

      setLoading(false);
      setSignupSuccess(true);
      setTimeout(() => onAuth(), 1500);
    }, 1000);
  };

  const handleVerifyInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`verify-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-[#06060e] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-600/[0.03] to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.03] blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/[0.04] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="relative w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {/* ==================== WELCOME SCREEN ==================== */}
          {mode === 'welcome' && (
            <motion.div key="welcome" className="flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-8 relative overflow-hidden" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="relative z-10">
                  <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
                </svg>
              </motion.div>

              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Welcome to Xbee</h1>
              <p className="text-sm text-white/30 tracking-[0.2em] uppercase font-medium mb-2">Messenger</p>
              <p className="text-sm text-white/40 text-center mb-10 max-w-[260px] leading-relaxed">
                Where real people have real conversations  without noise, scams, or manipulation.
              </p>

              <div className="grid grid-cols-3 gap-3 w-full mb-10">
                {[
                  { icon: Shield, label: 'Trusted', desc: 'Verified identities' },
                  { icon: Fingerprint, label: 'Private', desc: 'E2E encrypted' },
                  { icon: Smartphone, label: 'Intelligent', desc: 'AI-powered safety' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <motion.div key={label} className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                    <Icon className="w-5 h-5 text-blue-400/60 mb-2" />
                    <span className="text-xs font-bold text-white/70">{label}</span>
                    <span className="text-[10px] text-white/25 mt-0.5">{desc}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-shadow" onClick={() => setMode('signup')} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                Create Account <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button className="w-full py-3.5 rounded-xl border border-white/10 text-white/70 font-medium text-sm mt-3 hover:bg-white/[0.03] transition-colors" onClick={() => setMode('login')} whileTap={{ scale: 0.98 }}>
                Sign In
              </motion.button>

              <div className="mt-6 flex flex-col items-center gap-1.5">
                <p className="text-[10px] text-white/[0.1] tracking-[0.25em] uppercase font-medium">Xbee Technologies</p>
                <p className="text-[9px] text-white/[0.08]">Est. 1996 &bull; Trusted by millions worldwide</p>
              </div>
            </motion.div>
          )}

          {/* ==================== LOGIN SCREEN ==================== */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <button className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8" onClick={() => { setMode('welcome'); setError(''); }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
              <p className="text-sm text-white/30 mb-8">Sign in with your email or username</p>

              {error && (
                <motion.div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Email or Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="alex@xbee.com or alexchen"
                      value={loginId}
                      onChange={(e) => { setLoginId(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40" onClick={() => setShowPassword(!showPassword)} type="button">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 bg-white/[0.03]'}`}>
                      <Check className={`w-3 h-3 text-blue-400 transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <span className="text-xs text-white/30">Remember me</span>
                  </label>
                  <button className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors">Forgot password?</button>
                </div>

                <motion.button
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </div>

              <p className="text-center text-xs text-white/20 mt-6">
                Don&apos;t have an account?{' '}
                <button className="text-blue-400/70 hover:text-blue-400" onClick={() => { setMode('signup'); setError(''); }}>Create one</button>
              </p>


            </motion.div>
          )}

          {/* ==================== SIGNUP SCREEN ==================== */}
          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <button className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8" onClick={() => { setMode('welcome'); setError(''); }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-2xl font-black text-white mb-1">Create Your Account</h2>
              <p className="text-sm text-white/30 mb-6">Join the trusted communication network</p>

              {error && (
                <motion.div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </motion.div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="Alex Chen" value={displayName} onChange={(e) => { setDisplayName(e.target.value); setError(''); }} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="alexchen" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setError(''); }} />
                    {username.length >= 3 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400">
                        {!isSupabaseConfigured && getRegisteredUsers().find(u => u.username === username.toLowerCase()) ? ' Taken' : ' Available'}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="email" className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="alex@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type={showPassword ? 'text' : 'password'} className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="Min. 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40" onClick={() => setShowPassword(!showPassword)} type="button">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.05]">
                        <div className={`h-full rounded-full transition-all ${password.length >= 10 ? 'w-full bg-emerald-400' : password.length >= 8 ? 'w-3/4 bg-blue-400' : password.length >= 6 ? 'w-1/2 bg-amber-400' : 'w-1/4 bg-red-400'}`} />
                      </div>
                      <span className={`text-[10px] ${password.length >= 8 ? 'text-emerald-400' : password.length >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                        {password.length >= 10 ? 'Strong' : password.length >= 8 ? 'Good' : password.length >= 6 ? 'Fair' : 'Weak'}
                      </span>
                    </div>
                  )}
                </div>

                <motion.button
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2"
                  onClick={handleSignup}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <p className="text-[10px] text-white/15 text-center mt-4 leading-relaxed max-w-[280px] mx-auto">
                By creating an account, you agree to Xbee Technologies&apos; Terms of Service and Privacy Policy.
              </p>

              <p className="text-center text-xs text-white/20 mt-4">
                Already have an account?{' '}
                <button className="text-blue-400/70 hover:text-blue-400" onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
              </p>
            </motion.div>
          )}

          {/* ==================== VERIFY SCREEN ==================== */}
          {mode === 'verify' && (
            <motion.div key="verify" className="flex flex-col items-center" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              {signupSuccess ? (
                <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Welcome to Xbee!</h2>
                  <p className="text-sm text-white/40">Account created successfully. Redirecting...</p>
                </motion.div>
              ) : (
                <>
                  <button className="self-start flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8" onClick={() => { setMode('signup'); setError(''); }}>
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <Mail className="w-7 h-7 text-emerald-400" />
                  </div>

                  <h2 className="text-2xl font-black text-white mb-1">Verify Your Email</h2>
                  <p className="text-sm text-white/30 mb-2 text-center">
                    We sent a 6-digit code to <span className="text-white/50">{email || 'your email'}</span>
                  </p>
                  <p className="text-xs text-emerald-400/70 mb-6 text-center">
                    Demo: Enter any 6 digits to verify
                  </p>

                  {error && (
                    <motion.div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 w-full" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-sm text-red-400">{error}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-2.5 mb-8">
                    {verifyCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`verify-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xl font-bold text-center focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                        value={digit}
                        onChange={(e) => handleVerifyInput(i, e.target.value)}
                      />
                    ))}
                  </div>

                  <motion.button
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
                    onClick={handleVerify}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || verifyCode.join('').length < 6}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Join Xbee <Check className="w-4 h-4" /></>}
                  </motion.button>

                  <button className="text-xs text-white/25 mt-4 hover:text-white/40 transition-colors">
                    Didn&apos;t receive a code? Resend
                  </button>

                  <div className="mt-8 flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Shield className="w-4 h-4 text-emerald-400/60 shrink-0" />
                    <p className="text-[11px] text-white/25 leading-relaxed">
                      Your identity verification starts your Trust Score. Real identity = higher reach and monetization access.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}