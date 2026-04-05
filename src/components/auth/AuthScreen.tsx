'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Fingerprint,
  Smartphone, ChevronLeft, Check, User, AtSign
} from 'lucide-react';

type AuthMode = 'welcome' | 'login' | 'signup' | 'verify';

export default function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);

  // ── Dormant test account (remove after testing) ──
  const TEST_EMAIL = 'test@xbee.com';
  const TEST_PASS = 'test1234';
  const fillTestAccount = () => {
    console.log('[Xbee Auth] Filling test account credentials');
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASS);
    setMode('login');
  };
  const handleLogin = () => {
    console.log('[Xbee Auth] Login attempt:', { email, rememberMe });
    if (rememberMe) {
      try {
        localStorage.setItem('xbee_remembered', 'true');
        console.log('[Xbee Auth] Remember me saved to localStorage');
      } catch (e) {
        console.warn('[Xbee Auth] Failed to save remember me:', e);
      }
    } else {
      try {
        localStorage.removeItem('xbee_remembered');
        console.log('[Xbee Auth] Remember me cleared');
      } catch {}
    }
    onAuth();
  };

  const handleVerifyInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);
    // Auto-focus next input
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
            <motion.div
              key="welcome"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo */}
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-8 relative overflow-hidden"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="relative z-10">
                  <path d="M10 8L21 22.5L10 38H14L23 27L31 38H38L26.5 22L37 8H33L24.5 18.5L17 8H10Z" fill="white" />
                </svg>
              </motion.div>

              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Welcome to Xbee</h1>
              <p className="text-sm text-white/30 tracking-[0.2em] uppercase font-medium mb-2">Messenger</p>
              <p className="text-sm text-white/40 text-center mb-10 max-w-[260px] leading-relaxed">
                Where real people have real conversations — without noise, scams, or manipulation.
              </p>

              {/* Trust pillars */}
              <div className="grid grid-cols-3 gap-3 w-full mb-10">
                {[
                  { icon: Shield, label: 'Trusted', desc: 'Verified identities' },
                  { icon: Fingerprint, label: 'Private', desc: 'E2E encrypted' },
                  { icon: Smartphone, label: 'Intelligent', desc: 'AI-powered safety' },
                ].map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    className="flex flex-col items-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Icon className="w-5 h-5 text-blue-400/60 mb-2" />
                    <span className="text-xs font-bold text-white/70">{label}</span>
                    <span className="text-[10px] text-white/25 mt-0.5">{desc}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.button
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-shadow"
                onClick={() => setMode('signup')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                className="w-full py-3.5 rounded-xl border border-white/10 text-white/70 font-medium text-sm mt-3 hover:bg-white/[0.03] transition-colors"
                onClick={() => setMode('login')}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>

              {/* Test Account (remove after testing) */}
              <button
                className="mt-6 text-[11px] text-white/15 hover:text-white/30 transition-colors underline underline-offset-2"
                onClick={fillTestAccount}
              >
                Use test account
              </button>

              {/* Company */}
              <div className="mt-6 flex flex-col items-center gap-1.5">
                <p className="text-[10px] text-white/[0.1] tracking-[0.25em] uppercase font-medium">
                  Xbee Technologies
                </p>
                <p className="text-[9px] text-white/[0.08]">
                  Est. 1996 &bull; Trusted by millions worldwide
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== LOGIN SCREEN ==================== */}
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <button
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8"
                onClick={() => setMode('welcome')}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
              <p className="text-sm text-white/30 mb-8">Sign in to your Xbee account</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Email or Username</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="alex@xbee.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <p className="text-center text-xs text-white/20 mt-6">
                Don&apos;t have an account?{' '}
                <button className="text-blue-400/70 hover:text-blue-400" onClick={() => setMode('signup')}>Create one</button>
              </p>
            </motion.div>
          )}

          {/* ==================== SIGNUP SCREEN ==================== */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <button
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8"
                onClick={() => setMode('welcome')}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-2xl font-black text-white mb-1">Create Your Account</h2>
              <p className="text-sm text-white/30 mb-8">Join the trusted communication network</p>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="Alex Chen"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="alexchen"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      placeholder="alex@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2"
                  onClick={() => setMode('verify')}
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
                <button className="text-blue-400/70 hover:text-blue-400" onClick={() => setMode('login')}>Sign in</button>
              </p>
            </motion.div>
          )}

          {/* ==================== VERIFY SCREEN ==================== */}
          {mode === 'verify' && (
            <motion.div
              key="verify"
              className="flex flex-col items-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <button
                className="self-start flex items-center gap-1.5 text-sm text-white/30 hover:text-white/50 transition-colors mb-8"
                onClick={() => setMode('signup')}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-black text-white mb-1">Verify Your Email</h2>
              <p className="text-sm text-white/30 mb-8 text-center">
                We sent a 6-digit code to <span className="text-white/50">{email || 'your email'}</span>
              </p>

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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                onClick={onAuth}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Verify & Join Xbee <Check className="w-4 h-4" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
