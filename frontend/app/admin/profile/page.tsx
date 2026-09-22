'use client';

import React from 'react';
import { Shield, Mail, User, Key, CheckCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <AdminLayout
      title="Admin Profile & Security"
      subtitle="View administrative role credentials and hostel privileges"
    >
      <div className="max-w-3xl space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/20">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                Hostel Administrator / Chief Warden
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Account Email</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
                  {user?.email}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Access Role</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-1 block">
                  ADMIN (Full Authority)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  Administrative Privileges Active
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Authorized to perform student registration, room allocations, room deletions,
                  and maintenance grievance resolutions across all hostel wings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
