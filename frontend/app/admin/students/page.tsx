'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  UserCheck,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { studentService } from '@/services/studentService';
import { Student } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    department: 'CSE',
    year: 1,
    address: '',
    guardianName: '',
    guardianPhone: '',
    password: 'Student@123',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { success: toastSuccess, error: toastError } = useToast();

  const loadStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await studentService.getAllStudents({
        search,
        department: department || undefined,
        year: year ? Number(year) : undefined,
      });
      setStudents(res.students);
    } catch (err: any) {
      toastError(err.message || 'Failed to load students list');
    } finally {
      setIsLoading(false);
    }
  }, [search, department, year, toastError]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      department: 'CSE',
      year: 1,
      address: '',
      guardianName: '',
      guardianPhone: '',
      password: 'Student@123',
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      department: student.department,
      year: student.year,
      address: student.address,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      password: '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (isEdit = false) => {
    const errors: Record<string, string> = {};
    if (!formData.studentId) errors.studentId = 'Student ID is required';
    if (!formData.name) errors.name = 'Full name is required';
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.address) errors.address = 'Permanent address is required';
    if (!formData.guardianName) errors.guardianName = 'Guardian name is required';
    if (!formData.guardianPhone) errors.guardianPhone = 'Guardian phone is required';

    if (!isEdit && !formData.password) {
      errors.password = 'Initial password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await studentService.createStudent(formData);
      toastSuccess(`Student ${formData.name} (${formData.studentId}) registered successfully!`);
      setIsAddModalOpen(false);
      resetForm();
      loadStudents();
    } catch (err: any) {
      toastError(err.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !validateForm(true)) return;

    setIsSubmitting(true);
    try {
      await studentService.updateStudent(selectedStudent._id, formData);
      toastSuccess('Student profile updated successfully');
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (err: any) {
      toastError(err.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await studentService.deleteStudent(selectedStudent._id);
      toastSuccess(`Student record for ${selectedStudent.name} deleted.`);
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight">{row.name}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              {row.studentId}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department & Year',
      cell: (row) => (
        <div>
          <span className="inline-flex items-center gap-1 font-semibold text-xs text-slate-800 dark:text-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            {row.department}
          </span>
          <p className="text-xs text-slate-400">Year {row.year}</p>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400" /> {row.email}
          </p>
          <p className="text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" /> {row.phone}
          </p>
        </div>
      ),
    },
    {
      header: 'Allocated Room',
      cell: (row) => {
        const roomObj = typeof row.room === 'object' ? row.room : null;
        if (roomObj) {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold">
              Room {roomObj.roomNumber} (Blk {roomObj.block})
            </span>
          );
        }
        return <span className="text-xs text-slate-400 italic">Unallocated</span>;
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/admin/students/${row._id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
              title="View Complete Profile"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(row)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Student Directory"
      subtitle="Register, update, and manage hostel resident profiles"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchInput
              placeholder="Search by name, ID, or email..."
              onSearch={setSearch}
              className="w-full sm:w-72"
            />
            <Select
              options={[
                { value: '', label: 'All Departments' },
                { value: 'CSE', label: 'CSE' },
                { value: 'IT', label: 'IT' },
                { value: 'ECE', label: 'ECE' },
                { value: 'MECH', label: 'MECH' },
                { value: 'AI&DS', label: 'AI & Data Science' },
                { value: 'CIVIL', label: 'CIVIL' },
              ]}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full sm:w-44"
            />
            <Select
              options={[
                { value: '', label: 'All Years' },
                { value: '1', label: 'Year 1' },
                { value: '2', label: 'Year 2' },
                { value: '3', label: 'Year 3' },
                { value: '4', label: 'Year 4' },
              ]}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full sm:w-36"
            />
          </div>

          <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Student
          </Button>
        </div>

        {/* Students Table */}
        <DataTable
          columns={columns}
          data={students}
          isLoading={isLoading}
          emptyTitle="No students found"
          emptyDescription="Try adjusting your search criteria or add a new student using the button above."
        />
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student"
        description="Creates a student resident profile and linked user account."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student ID"
              placeholder="e.g. STU011"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              error={formErrors.studentId}
              required
            />
            <Input
              label="Full Name"
              placeholder="e.g. Anand R"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. anand@hostel.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Gender"
              options={['Male', 'Female', 'Other']}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              required
            />
            <Select
              label="Department"
              options={['CSE', 'IT', 'ECE', 'MECH', 'AI&DS', 'CIVIL']}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Select
              label="Academic Year"
              options={[
                { value: 1, label: 'Year 1' },
                { value: 2, label: 'Year 2' },
                { value: 3, label: 'Year 3' },
                { value: 4, label: 'Year 4' },
              ]}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Name"
              placeholder="e.g. Ramanathan K"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              error={formErrors.guardianName}
              required
            />
            <Input
              label="Guardian Phone"
              placeholder="e.g. 9876543299"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              error={formErrors.guardianPhone}
              required
            />
          </div>

          <Textarea
            label="Permanent Address"
            placeholder="Complete postal address..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            required
            rows={2}
          />

          <Input
            label="Initial Portal Password"
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            helperText="Default initial password for the student login."
            required
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Register Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Profile"
        description="Update contact and guardian information."
        maxWidth="xl"
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student ID (Read-only)"
              value={formData.studentId}
              disabled
              className="bg-slate-100 dark:bg-slate-800"
            />
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Gender"
              options={['Male', 'Female', 'Other']}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            />
            <Select
              label="Department"
              options={['CSE', 'IT', 'ECE', 'MECH', 'AI&DS', 'CIVIL']}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Select
              label="Academic Year"
              options={[
                { value: 1, label: 'Year 1' },
                { value: 2, label: 'Year 2' },
                { value: 3, label: 'Year 3' },
                { value: 4, label: 'Year 4' },
              ]}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Name"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              error={formErrors.guardianName}
              required
            />
            <Input
              label="Guardian Phone"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              error={formErrors.guardianPhone}
              required
            />
          </div>

          <Textarea
            label="Permanent Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            required
            rows={2}
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteStudent}
        title="Delete Student Record?"
        message={`Are you sure you want to delete ${selectedStudent?.name} (${selectedStudent?.studentId})? This will automatically vacate their allocated room bed, remove their user account, and delete related complaints.`}
        confirmText="Delete Student"
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
