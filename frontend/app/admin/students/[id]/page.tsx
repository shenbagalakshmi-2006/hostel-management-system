'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Shield,
  Building2,
  Calendar,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { studentService } from '@/services/studentService';
import { Student, Allocation, Complaint } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function StudentDetailsPage() {
  const params = useParams();
  const studentId = params.id as string;
  const router = useRouter();
  const { error: toastError } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getStudentById(studentId);
        setStudent(data.student);
        setAllocations(data.allocations || []);
        setComplaints(data.complaints || []);
      } catch (err: any) {
        toastError(err.message || 'Failed to fetch student details');
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchDetails();
    }
  }, [studentId, toastError]);

  return (
    <AdminLayout
      title="Student 360° Profile"
      subtitle="Complete academic, resident, allocation and complaint dossier"
    >
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Student Directory
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" label="Loading student record..." />
        ) : student ? (
          <div className="space-y-6">
            {/* Header Hero Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">
                    {student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {student.name}
                      </h2>
                      <span className="px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                        {student.studentId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {student.department} • Year {student.year} • Gender: {student.gender}
                    </p>
                  </div>
                </div>

                <div>
                  {student.room && typeof student.room === 'object' ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">
                          Active Allocation
                        </p>
                        <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                          Room {student.room.roomNumber} (Block {student.room.block}, Floor {student.room.floor})
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-medium">
                      No active room allocated
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Information Grid: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact Information */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Contact Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Email Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone Number</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Permanent Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  Academic Profile
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Academic Year</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Year {student.year}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Account Created</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Guardian Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Guardian Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.guardianName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Guardian Phone</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.guardianPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Emergency Contact</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Bottom Tables: Allocation History & Complaints History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allocation History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Room Allocation History
                </h3>
                {allocations.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {allocations.map((alloc) => (
                      <div key={alloc._id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            Room {alloc.room?.roomNumber} (Block {alloc.room?.block})
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            Allocated: {new Date(alloc.allocatedAt).toLocaleDateString()}
                            {alloc.vacatedAt &&
                              ` • Vacated: ${new Date(alloc.vacatedAt).toLocaleDateString()}`}
                          </p>
                          {alloc.notes && (
                            <p className="text-slate-500 italic mt-0.5">{alloc.notes}</p>
                          )}
                        </div>
                        <StatusBadge status={alloc.status} size="sm" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No past or current allocations on record.
                  </p>
                )}
              </div>

              {/* Complaint History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquareWarning className="w-4 h-4 text-indigo-500" />
                  Resident Complaint History
                </h3>
                {complaints.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {complaints.map((c) => (
                      <div key={c._id} className="py-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.complaintId} • {c.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <StatusBadge status={c.status} size="sm" />
                            <StatusBadge status={c.priority} size="sm" />
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{c.description}</p>
                        {c.adminRemarks && (
                          <div className="mt-2 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 text-[11px] text-indigo-800 dark:text-indigo-300">
                            <strong>Warden Remarks:</strong> {c.adminRemarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No complaints registered by this resident.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Student not found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
