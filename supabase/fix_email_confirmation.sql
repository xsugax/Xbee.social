-- Fix: Confirm all existing users who haven't confirmed their email
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This resolves "Email not confirmed" errors when logging in

UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Also important: Go to Supabase Dashboard → Authentication → Providers → Email
-- and DISABLE "Confirm email" toggle so new signups don't require confirmation.
