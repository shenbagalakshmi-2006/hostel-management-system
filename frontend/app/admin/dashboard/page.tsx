'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Bed,
  BedDouble,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Building,
  Activity,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboardService';
import { DashboardStats } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: toastError } = useToast();

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout
      title="Hostel Administration Dashboard"
      subtitle="Real-time occupancy statistics, resident metrics, and pending maintenance"
    >
      {isLoading ? (
        <LoadingSpinner size="lg" label="Computing real-time MongoDB statistics..." />
      ) : stats ? (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <DashboardCard
              title="Total Students"
              value={stats.totalStudents}
              subtitle="Enrolled hostel residents"
              icon={<Users className="w-6 h-6" />}
              iconBgColor="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
            />
            <DashboardCard
              title="Total Rooms"
              value={stats.totalRooms}
              subtitle={`Total Capacity: ${stats.totalCapacity} beds`}
              icon={<Building2 className="w-6 h-6" />}
              iconBgColor="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
            />
            <DashboardCard
              title="Occupied Beds"
              value={stats.occupiedBeds}
              subtitle={`${stats.occupancyPercentage}% overall occupancy`}
              icon={<BedDouble className="w-6 h-6" />}
              iconBgColor="bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
            />
            <DashboardCard
              title="Available Beds"
              value={stats.availableBeds}
              subtitle="Ready for allocation"
              icon={<Bed className="w-6 h-6" />}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            />
            <DashboardCard
              title="Pending Complaints"
              value={stats.pendingComplaints}
              subtitle={`${stats.inProgressComplaints} currently in-progress`}
              icon={<AlertTriangle className="w-6 h-6" />}
              iconBgColor="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            />
            <DashboardCard
              title="Resolved Issues"
              value={stats.resolvedComplaints}
              subtitle={`Out of ${stats.totalComplaints} total logged`}
              icon={<CheckCircle2 className="w-6 h-6" />}
              iconBgColor="bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400"
            />
          </div>

          {/* Occupancy Progress Visualizer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hostel Capacity & Occupancy Visualizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculated dynamically from live Room occupancy counts
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {stats.occupancyPercentage}%
                </span>
                <span className="text-xs text-slate-500">
                  ({stats.occupiedBeds} / {stats.totalCapacity} beds)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.occupancyPercentage, 100)}%` }}
              />
            </div>

            {/* Block Breakdown */}
            {stats.roomsByBlock && stats.roomsByBlock.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.roomsByBlock.map((blk) => (
                  <div
                    key={blk.block}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {blk.block}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Block {blk.block}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {blk.rooms} Rooms • {blk.capacity} Total Beds
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {blk.occupied} Occupied
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {blk.available} Available
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/students" className="block">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Manage Students
                </span>
              </div>
            </Link>
            <Link href="/admin/rooms" className="block">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3">
                <Building className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Add / View Rooms
                </span>
              </div>
            </Link>
            <Link href="/admin/allocations" className="block">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3">
                <BedDouble className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Room Allocation
                </span>
              </div>
            </Link>
            <Link href="/admin/complaints" className="block">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Review Complaints
                </span>
              </div>
            </Link>
          </div>

          {/* 2-Column Tables: Recent Allocations & Recent Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Allocations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recent Allocations
                </h3>
                <Link
                  href="/admin/allocations"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats.recentAllocations && stats.recentAllocations.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.recentAllocations.map((alloc) => (
                    <div
                      key={alloc._id}
                      className="py-3 flex items-center justify-between text-xs gap-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {alloc.student?.name || 'Student'}
                        </p>
                        <p className="text-slate-500">
                          ID: {alloc.student?.studentId} • Dept: {alloc.student?.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60">
                          Room {alloc.room?.roomNumber} (Block {alloc.room?.block})
                        </span>
                        <div className="mt-1">
                          <StatusBadge status={alloc.status} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No allocations recorded yet.</p>
              )}
            </div>

            {/* Recent Complaints */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recent Complaints
                </h3>
                <Link
                  href="/admin/complaints"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats.recentComplaints && stats.recentComplaints.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.recentComplaints.map((cmp) => (
                    <div
                      key={cmp._id}
                      className="py-3 flex items-start justify-between text-xs gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {cmp.complaintId}
                          </span>
                          <span className="text-slate-500">• {cmp.category}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 truncate mt-0.5">
                          {cmp.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={cmp.status} size="sm" />
                        <StatusBadge status={cmp.priority} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No complaints recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
