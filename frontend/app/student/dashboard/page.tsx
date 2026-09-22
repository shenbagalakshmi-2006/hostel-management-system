'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Bed,
  MessageSquareWarning,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { studentService } from '@/services/studentService';
import { Student, Allocation, Complaint } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { error: toastError } = useToast();

  const [studentData, setStudentData] = useState<{
    student: Student;
    allocations: Allocation[];
    complaints: Complaint[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getMyProfile();
        setStudentData(data);
      } catch (err: any) {
        toastError(err.message || 'Failed to load student profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentProfile();
  }, [toastError]);

  const student = studentData?.student;
  const complaints = studentData?.complaints || [];
  const room = student?.room && typeof student.room === 'object' ? student.room : null;

  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const resolvedComplaintsCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <StudentLayout
      title="Resident Student Portal"
      subtitle={`Welcome back, ${student?.name || user?.name || 'Student'}`}
    >
      {isLoading ? (
        <LoadingSpinner size="lg" label="Loading resident dashboard..." />
      ) : (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 border border-indigo-700/50 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
                <span>Academic Year {student?.year} • {student?.department}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Hello, {student?.name}!
              </h2>
              <p className="mt-2 text-sm text-indigo-100/80 leading-relaxed">
                Student ID: <span className="font-bold text-white">{student?.studentId}</span> • Registered Resident
              </p>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <DashboardCard
              title="Allocated Room"
              value={room ? `Room ${room.roomNumber}` : 'None'}
              subtitle={room ? `Block ${room.block} • Floor ${room.floor}` : 'Pending allocation'}
              icon={<Building2 className="w-6 h-6" />}
              iconBgColor="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
            />
            <DashboardCard
              title="My Open Complaints"
              value={pendingComplaintsCount}
              subtitle="Pending or In-progress"
              icon={<Clock className="w-6 h-6" />}
              iconBgColor="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            />
            <DashboardCard
              title="Resolved Issues"
              value={resolvedComplaintsCount}
              subtitle="Closed tickets"
              icon={<CheckCircle2 className="w-6 h-6" />}
              iconBgColor="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Current Room Detailed Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Hostel Room Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live occupancy and room specifications
                </p>
              </div>
              {room && <StatusBadge status={room.status} size="md" />}
            </div>

            {room ? (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Room Number
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                    {room.roomNumber}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Hostel Wing
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block">
                    Block {room.block} (Floor {room.floor})
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Room Type
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block">
                    {room.roomType}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Bed Capacity
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 block">
                    {room.occupiedCount} / {room.capacity} Occupied
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No room allocated yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Please contact your hostel warden or administrator to complete your room
                  allocation.
                </p>
              </div>
            )}
          </div>

          {/* Recent Complaints & Quick Link */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Recent Complaints & Grievances
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track progress on room maintenance and requests
                </p>
              </div>
              <Link href="/student/complaints">
                <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                  File New Complaint
                </Button>
              </Link>
            </div>

            {complaints.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.slice(0, 4).map((c) => (
                  <div key={c._id} className="py-3.5 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {c.complaintId}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          • {c.category}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{c.description}</p>
                      {c.adminRemarks && (
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                          Warden Note: {c.adminRemarks}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={c.status} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                You haven&apos;t filed any complaints yet. Everything in your room is in good order!
              </p>
            )}
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
