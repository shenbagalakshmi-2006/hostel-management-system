'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const router = useRouter();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email || !email.trim()) {
      errs.email = 'Email address is required';
    } else if (!email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const pwd = password.trim() ? password : 'Demo@123';
    try {
      const user = await login(email, pwd);
      toastSuccess(`Welcome back, ${user.name}!`);
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (err: any) {
      toastError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@hostel.com');
      setPassword('Admin@123');
    } else {
      setEmail('rahul.kumar@hostel.com');
      setPassword('Student@123');
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-white mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Building className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hostel Management System
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your administrative or resident portal
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="mt-6 bg-indigo-950/60 border border-indigo-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>1-Click Demo Accounts</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-normal normal-case flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Any Email Accepted
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-indigo-700/50 hover:border-indigo-400 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Warden</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('student')}
              className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-indigo-700/50 hover:border-indigo-400 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Resident</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-center text-indigo-300/80">
            Tip: Emails containing &ldquo;admin&rdquo; sign in as Warden; all other emails sign in as Student.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. admin@hostel.com or student@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="•••••••• (defaults to Demo@123 if empty)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
