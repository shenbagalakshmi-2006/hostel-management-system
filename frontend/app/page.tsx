'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building,
  ShieldCheck,
  Users,
  Bed,
  MessageSquareWarning,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  const dashboardUrl = isAuthenticated
    ? isAdmin
      ? '/admin/dashboard'
      : '/student/dashboard'
    : '/login';

  const features = [
    {
      title: 'Student Directory & Records',
      description:
        'Comprehensive student registration, contact details, academic info, guardian profiles, and room history.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Smart Room Allocation',
      description:
        'Instant room assignments with automatic bed counts, capacity validation, and one-click vacating/reassignment.',
      icon: Bed,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Complaint Redressal System',
      description:
        'End-to-end complaint ticketing with category tagging, priority levels, live status updates, and warden remarks.',
      icon: MessageSquareWarning,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Role-Based Access Control',
      description:
        'Secure JWT authentication with dedicated portals and granular permissions for Wardens and Students.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const techStack = [
    { name: 'Next.js 14 App Router', type: 'Frontend Framework' },
    { name: 'TypeScript', type: 'Type Safety' },
    { name: 'Tailwind CSS', type: 'UI & Styling' },
    { name: 'Node.js & Express', type: 'REST Backend' },
    { name: 'MongoDB & Mongoose', type: 'Database Persistence' },
    { name: 'JWT & Bcrypt', type: 'Auth & Security' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">HOSTEL MS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href={dashboardUrl}>
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {isAuthenticated ? 'Go to Dashboard' : 'Portal Login'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Full-Stack College Hostel Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Smart Hostel Management. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
              Simple. Organized. Efficient.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            A complete enterprise-grade hostel administration system
            featuring room allocations, automated bed availability calculations, student records, and
            complaint tracking.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-indigo-600/25">
                Sign In to System
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#architecture" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-4 border-slate-700 hover:bg-slate-900 text-slate-200">
                View Project Specs
              </Button>
            </a>
          </div>

          {/* Highlights Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400 mt-1">Live Database Powered</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-bold text-white">2 Roles</p>
              <p className="text-xs text-slate-400 mt-1">Admin Warden & Student</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-bold text-white">Auto</p>
              <p className="text-xs text-slate-400 mt-1">Bed & Capacity Logic</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-bold text-white">JWT</p>
              <p className="text-xs text-slate-400 mt-1">Secure bcrypt Auth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Core Modules
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything Needed for Seamless Hostel Operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/40 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-5 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Architecture Section for Viva */}
      <section id="architecture" className="py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Technical Design
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Full-Stack Monorepo Architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Frontend Layer</h4>
                  <p className="text-xs text-slate-400">Next.js 14 App Router</p>
                </div>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  TypeScript & Strict Types
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tailwind CSS Responsive Design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Context API (Auth & Toast)
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">REST API Backend</h4>
                  <p className="text-xs text-slate-400">Node.js + Express</p>
                </div>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  JWT Auth & Role Middlewares
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Service & Controller Architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Atomic Allocation Business Rules
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Database Layer</h4>
                  <p className="text-xs text-slate-400">MongoDB + Mongoose</p>
                </div>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Mongoose Relationships & Indexing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Pre-save hooks for Bed Calculation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Aggregate Pipeline Stats
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Hostel Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">
              Student Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
