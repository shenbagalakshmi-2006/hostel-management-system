'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  MapPin,
  Save,
  Building2,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { studentService } from '@/services/studentService';
import { Student } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editable form fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const { success: toastSuccess, error: toastError } = useToast();

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getMyProfile();
      setStudent(data.student);
      setPhone(data.student.phone || '');
      setAddress(data.student.address || '');
      setGuardianName(data.student.guardianName || '');
      setGuardianPhone(data.student.guardianPhone || '');
    } catch (err: any) {
      toastError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    try {
      await studentService.updateStudent(student._id, {
        phone,
        address,
        guardianName,
        guardianPhone,
      });
      toastSuccess('Profile updated successfully!');
      loadProfile();
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const room = student?.room && typeof student.room === 'object' ? student.room : null;

  return (
    <StudentLayout
      title="My Resident Profile"
      subtitle="View your student credentials and update emergency contact information"
    >
      {isLoading ? (
        <LoadingSpinner size="lg" label="Loading resident profile..." />
      ) : student ? (
        <div className="max-w-4xl space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/20">
                  {student.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {student.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                      ID: {student.studentId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {student.department} • Year {student.year}
                    </span>
                  </div>
                </div>
              </div>

              {room ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">
                    Current Room
                  </span>
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                    Room {room.roomNumber} (Block {room.block})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">No room allocated</span>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              Contact & Guardian Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Read Only Academic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Student ID (Fixed)"
                  value={student.studentId}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                />
                <Input
                  label="Department (Fixed)"
                  value={student.department}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                />
                <Input
                  label="Academic Year (Fixed)"
                  value={`Year ${student.year}`}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address (Fixed)"
                  value={student.email}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your mobile number"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Guardian Name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Parent / Guardian full name"
                  required
                />
                <Input
                  label="Guardian Phone Number"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="Emergency contact number"
                  required
                />
              </div>

              <Textarea
                label="Permanent Home Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Complete postal address"
                required
                rows={3}
              />

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="submit"
                  size="md"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </StudentLayout>
  );
}
