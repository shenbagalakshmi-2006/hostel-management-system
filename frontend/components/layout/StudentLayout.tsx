'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StudentLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children, title, subtitle }) => {
  const { user, isLoading, isAuthenticated, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isStudent) {
        router.push('/admin/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, isStudent, router]);

  if (isLoading || !isAuthenticated || !isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner size="lg" label="Loading student portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="STUDENT" />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
