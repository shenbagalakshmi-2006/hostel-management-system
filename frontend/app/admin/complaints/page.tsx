'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareWarning,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { complaintService } from '@/services/complaintService';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [priority, setPriority] = useState<ComplaintPriority | ''>('');
  const [status, setStatus] = useState<ComplaintStatus | ''>('');

  // Modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [updatedStatus, setUpdatedStatus] = useState<ComplaintStatus>('PENDING');
  const [adminRemarks, setAdminRemarks] = useState('');

  const { success: toastSuccess, error: toastError } = useToast();

  const loadComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await complaintService.getAllComplaints({
        search,
        category: category || undefined,
        priority: priority || undefined,
        status: status || undefined,
      });
      setComplaints(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  }, [search, category, priority, status, toastError]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const openUpdateModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setUpdatedStatus(c.status);
    setAdminRemarks(c.adminRemarks || '');
    setIsUpdateModalOpen(true);
  };

  const openDeleteDialog = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      await complaintService.updateComplaint(selectedComplaint._id, {
        status: updatedStatus,
        adminRemarks,
      });
      toastSuccess(`Complaint ${selectedComplaint.complaintId} updated successfully`);
      setIsUpdateModalOpen(false);
      setSelectedComplaint(null);
      loadComplaints();
    } catch (err: any) {
      toastError(err.message || 'Failed to update complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      await complaintService.deleteComplaint(selectedComplaint._id);
      toastSuccess(`Complaint ${selectedComplaint.complaintId} removed.`);
      setIsDeleteDialogOpen(false);
      setSelectedComplaint(null);
      loadComplaints();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Complaint>[] = [
    {
      header: 'Complaint ID',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
          {row.complaintId}
        </span>
      ),
    },
    {
      header: 'Resident / Student',
      cell: (row) => {
        const studentObj = typeof row.student === 'object' ? row.student : null;
        return (
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white">
              {studentObj?.name || 'Unknown'}
            </p>
            <p className="text-[11px] text-slate-400">
              ID: {studentObj?.studentId}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Category & Details',
      cell: (row) => (
        <div className="max-w-xs">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            {row.category}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      header: 'Priority',
      cell: (row) => <StatusBadge status={row.priority} size="sm" />,
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Logged Date',
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.date || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openUpdateModal(row)}
            className="text-xs py-1.5 px-2.5 gap-1 text-indigo-600 border-indigo-200 dark:border-indigo-800"
          >
            <Edit2 className="w-3.5 h-3.5" /> Resolve / Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(row)}
            className="p-1.5 text-slate-400 hover:text-rose-600"
            title="Delete Complaint"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Maintenance & Complaints Desk"
      subtitle="Track resident grievance tickets, assign technicians, and log resolutions"
    >
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Search complaints or student..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Select
              options={[
                { value: '', label: 'All Categories' },
                { value: 'Electrical', label: 'Electrical' },
                { value: 'Plumbing', label: 'Plumbing' },
                { value: 'Cleanliness', label: 'Cleanliness' },
                { value: 'Food', label: 'Food & Mess' },
                { value: 'Internet', label: 'Internet / Wi-Fi' },
                { value: 'Room', label: 'Room Carpentry' },
                { value: 'Security', label: 'Security' },
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Other', label: 'Other' },
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full sm:w-36"
            />
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'RESOLVED', label: 'Resolved' },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full sm:w-36"
            />
          </div>
        </div>

        {/* Complaints Table */}
        <DataTable
          columns={columns}
          data={complaints}
          isLoading={isLoading}
          emptyTitle="No complaints found"
          emptyDescription="There are no complaint tickets matching your filters."
        />
      </div>

      {/* Update Complaint Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Review Complaint: ${selectedComplaint?.complaintId}`}
        description={`Category: ${selectedComplaint?.category} • Priority: ${selectedComplaint?.priority}`}
        maxWidth="lg"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-2">
            <div>
              <span className="text-slate-400 block font-semibold">Resident Issue Description</span>
              <p className="text-slate-800 dark:text-slate-200 mt-1 text-sm">
                {selectedComplaint?.description}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-slate-500">
              <span>Date: {new Date(selectedComplaint?.date || '').toLocaleDateString()}</span>
              <span>Priority: {selectedComplaint?.priority}</span>
            </div>
          </div>

          <Select
            label="Complaint Status"
            options={[
              { value: 'PENDING', label: 'Pending - Under Review' },
              { value: 'IN_PROGRESS', label: 'In Progress - Technician Assigned' },
              { value: 'RESOLVED', label: 'Resolved - Fix Completed' },
            ]}
            value={updatedStatus}
            onChange={(e) => setUpdatedStatus(e.target.value as ComplaintStatus)}
            required
          />

          <Textarea
            label="Warden / Admin Remarks"
            placeholder="e.g. Electrician Rajesh dispatched. Issue rectified on 22nd Sep."
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            rows={3}
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update Complaint
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Complaint Record?"
        message={`Are you sure you want to delete ticket ${selectedComplaint?.complaintId}? This action cannot be undone.`}
        confirmText="Delete Complaint"
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
