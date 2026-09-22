'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareWarning,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { complaintService } from '@/services/complaintService';
import { Complaint, ComplaintCategory, ComplaintPriority } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [priority, setPriority] = useState<ComplaintPriority>('MEDIUM');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { success: toastSuccess, error: toastError } = useToast();

  const loadComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const openModal = () => {
    setCategory('Electrical');
    setPriority('MEDIUM');
    setDescription('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) {
      errs.description = 'Please provide a detailed description of the issue';
    } else if (description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newComplaint = await complaintService.createComplaint({
        category,
        priority,
        description,
      });
      toastSuccess(`Grievance ticket ${newComplaint.complaintId} submitted to Warden!`);
      setIsModalOpen(false);
      loadComplaints();
    } catch (err: any) {
      toastError(err.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Complaint>[] = [
    {
      header: 'Ticket ID',
      cell: (row) => (
        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
          {row.complaintId}
        </span>
      ),
    },
    {
      header: 'Category',
      cell: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Issue Description',
      cell: (row) => (
        <div className="max-w-md">
          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {row.description}
          </p>
          {row.adminRemarks && (
            <div className="mt-1.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-[11px] text-indigo-700 dark:text-indigo-300">
              <strong>Warden Update:</strong> {row.adminRemarks}
            </div>
          )}
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
      header: 'Submitted On',
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.date || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <StudentLayout
      title="Hostel Grievances & Maintenance"
      subtitle="Report room faults, mess feedback, or electrical issues directly to the warden desk"
    >
      <div className="space-y-6">
        {/* Top Action */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              My Submitted Tickets ({complaints.length})
            </h3>
          </div>
          <Button onClick={openModal} leftIcon={<Plus className="w-4 h-4" />}>
            File New Complaint
          </Button>
        </div>

        {/* Complaints Table */}
        <DataTable
          columns={columns}
          data={complaints}
          isLoading={isLoading}
          emptyTitle="No complaints filed"
          emptyDescription="You have no active maintenance complaints. Click 'File New Complaint' if you need any repairs."
        />
      </div>

      {/* Submit Complaint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File Maintenance Grievance"
        description="Submit a repair request to the hostel administration."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Grievance Category"
            options={[
              'Electrical',
              'Plumbing',
              'Cleanliness',
              'Food',
              'Internet',
              'Room',
              'Security',
              'Maintenance',
              'Other',
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            required
          />

          <Select
            label="Priority Level"
            options={[
              { value: 'LOW', label: 'Low - Routine observation' },
              { value: 'MEDIUM', label: 'Medium - Needs fix within 2-3 days' },
              { value: 'HIGH', label: 'High - Urgent attention needed' },
              { value: 'URGENT', label: 'Urgent - Safety or water/power outage' },
            ]}
            value={priority}
            onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
            required
          />

          <Textarea
            label="Problem Description"
            placeholder="Please detail the issue clearly (e.g. Tap leaking under sink in room, ceiling fan vibrating loudly)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={formErrors.description}
            required
            rows={4}
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Grievance
            </Button>
          </div>
        </form>
      </Modal>
    </StudentLayout>
  );
}
