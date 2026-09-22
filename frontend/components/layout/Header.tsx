'use client';

import React from 'react';
import { Menu, Bell, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {user?.role === 'ADMIN' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Admin Warden</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Student ({user?.studentId || 'Resident'})</span>
            </>
          )}
        </div>

        {/* User avatar indicator */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <span className="hidden md:inline text-xs font-medium text-slate-700 dark:text-slate-300">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};
