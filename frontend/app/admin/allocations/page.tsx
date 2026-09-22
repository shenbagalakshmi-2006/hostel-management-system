'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BedDouble,
  UserCheck,
  RotateCcw,
  LogOut,
  Plus,
  Building2,
  Calendar,
  Search,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { allocationService } from '@/services/allocationService';
import { studentService } from '@/services/studentService';
import { roomService } from '@/services/roomService';
import { Allocation, Student, Room } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminAllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [unallocatedStudents, setUnallocatedStudents] = useState<Student[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'VACATED' | ''>('ACTIVE');

  // Modals
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isVacateDialogOpen, setIsVacateDialogOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [notes, setNotes] = useState('');
  const [newRoomId, setNewRoomId] = useState('');

  const { success: toastSuccess, error: toastError } = useToast();

  const loadAllocations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await allocationService.getAllAllocations({
        status: statusFilter || undefined,
        search,
      });
      setAllocations(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load allocations');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, toastError]);

  const loadEligibleData = async () => {
    try {
      // 1. Get students who do not have an active room
      const stuRes = await studentService.getAllStudents({ limit: 100 });
      const unallocated = stuRes.students.filter((s) => !s.room);
      setUnallocatedStudents(unallocated);

      // 2. Get rooms with available beds
      const rms = await roomService.getAllRooms({ availableOnly: true });
      setAvailableRooms(rms);
    } catch (err: any) {
      console.error('Failed to load eligible students/rooms:', err);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, [loadAllocations]);

  const openAllocateModal = () => {
    setSelectedStudentId('');
    setSelectedRoomId('');
    setNotes('');
    loadEligibleData();
    setIsAllocateModalOpen(true);
  };

  const openVacateDialog = (alloc: Allocation) => {
    setSelectedAllocation(alloc);
    setIsVacateDialogOpen(true);
  };

  const openReassignModal = (alloc: Allocation) => {
    setSelectedAllocation(alloc);
    setNewRoomId('');
    setNotes('');
    loadEligibleData();
    setIsReassignModalOpen(true);
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedRoomId) {
      toastError('Please select both a student and an available room');
      return;
    }

    setIsSubmitting(true);
    try {
      await allocationService.allocateRoom({
        studentId: selectedStudentId,
        roomId: selectedRoomId,
        notes,
      });
      toastSuccess('Room allocated successfully!');
      setIsAllocateModalOpen(false);
      loadAllocations();
    } catch (err: any) {
      toastError(err.message || 'Failed to allocate room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVacate = async () => {
    if (!selectedAllocation) return;

    setIsSubmitting(true);
    try {
      await allocationService.vacateAllocation(selectedAllocation._id);
      toastSuccess(
        `Room ${selectedAllocation.room?.roomNumber} vacated for ${selectedAllocation.student?.name}`
      );
      setIsVacateDialogOpen(false);
      setSelectedAllocation(null);
      loadAllocations();
    } catch (err: any) {
      toastError(err.message || 'Failed to vacate room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation || !newRoomId) {
      toastError('Please select a new room');
      return;
    }

    setIsSubmitting(true);
    try {
      await allocationService.reassignRoom(selectedAllocation._id, {
        newRoomId,
        notes,
      });
      toastSuccess(`Resident successfully reassigned to new room!`);
      setIsReassignModalOpen(false);
      setSelectedAllocation(null);
      loadAllocations();
    } catch (err: any) {
      toastError(err.message || 'Failed to reassign room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Allocation>[] = [
    {
      header: 'Resident Student',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            {row.student?.name ? row.student.name.substring(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight">
              {row.student?.name || 'Unknown Student'}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              {row.student?.studentId} • {row.student?.department}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Allocated Room',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            Room {row.room?.roomNumber}
          </span>
          <p className="text-xs text-slate-400">
            Block {row.room?.block} • Floor {row.room?.floor} ({row.room?.roomType})
          </p>
        </div>
      ),
    },
    {
      header: 'Allocation Timeline',
      cell: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="text-slate-700 dark:text-slate-300">
            Allocated: {new Date(row.allocatedAt).toLocaleDateString()}
          </p>
          {row.vacatedAt && (
            <p className="text-slate-400">
              Vacated: {new Date(row.vacatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => {
        if (row.status === 'ACTIVE') {
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openReassignModal(row)}
                className="text-xs py-1.5 px-2.5 gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reassign
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => openVacateDialog(row)}
                className="text-xs py-1.5 px-2.5 gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Vacate
              </Button>
            </div>
          );
        }
        return <span className="text-xs text-slate-400 italic">No actions (Vacated)</span>;
      },
    },
  ];

  return (
    <AdminLayout
      title="Room Allocation Management"
      subtitle="Allocate rooms with available beds, reassign occupants, or process vacating"
    >
      <div className="space-y-6">
        {/* Actions & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchInput
              placeholder="Search by student or room..."
              onSearch={setSearch}
              className="w-full sm:w-72"
            />
            <Select
              options={[
                { value: '', label: 'All Allocations' },
                { value: 'ACTIVE', label: 'Active Only' },
                { value: 'VACATED', label: 'Vacated History' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-44"
            />
          </div>

          <Button onClick={openAllocateModal} leftIcon={<Plus className="w-4 h-4" />}>
            Allocate Room
          </Button>
        </div>

        {/* Allocations Table */}
        <DataTable
          columns={columns}
          data={allocations}
          isLoading={isLoading}
          emptyTitle="No allocations found"
          emptyDescription="Try selecting a different filter or assign an unallocated student."
        />
      </div>

      {/* Allocate Room Modal */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title="Allocate Student to Room"
        description="Assign an enrolled student without a room to an available bed."
        maxWidth="lg"
      >
        <form onSubmit={handleAllocate} className="space-y-4">
          <Select
            label="Select Unallocated Student"
            options={unallocatedStudents.map((s) => ({
              value: s._id,
              label: `${s.name} (${s.studentId} - ${s.department} Year ${s.year})`,
            }))}
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            placeholder={
              unallocatedStudents.length > 0
                ? '-- Choose a Student --'
                : 'No unallocated students available'
            }
            required
          />

          <Select
            label="Select Room (Only rooms with available beds)"
            options={availableRooms.map((r) => ({
              value: r._id,
              label: `Room ${r.roomNumber} - Block ${r.block} (${r.roomType}, ${r.availableBeds} beds free)`,
            }))}
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            placeholder={
              availableRooms.length > 0
                ? '-- Choose an Available Room --'
                : 'No rooms with free beds'
            }
            required
          />

          <Textarea
            label="Allocation Notes (Optional)"
            placeholder="e.g. Semester 5 room assignment, medical preference..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAllocateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={unallocatedStudents.length === 0 || availableRooms.length === 0}
            >
              Confirm Allocation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reassign Room Modal */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title="Reassign Resident to New Room"
        description={`Current room: Room ${selectedAllocation?.room?.roomNumber} (Block ${selectedAllocation?.room?.block})`}
        maxWidth="md"
      >
        <form onSubmit={handleReassign} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
            Resident: <strong>{selectedAllocation?.student?.name}</strong> (
            {selectedAllocation?.student?.studentId})
          </div>

          <Select
            label="Select New Available Room"
            options={availableRooms
              .filter((r) => r._id !== selectedAllocation?.room?._id)
              .map((r) => ({
                value: r._id,
                label: `Room ${r.roomNumber} - Block ${r.block} (${r.roomType}, ${r.availableBeds} free)`,
              }))}
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
            placeholder="-- Choose New Room --"
            required
          />

          <Textarea
            label="Reassignment Reason / Remarks"
            placeholder="e.g. Requested room change due to wing transfer..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReassignModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Reassign Room
            </Button>
          </div>
        </form>
      </Modal>

      {/* Vacate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isVacateDialogOpen}
        onClose={() => setIsVacateDialogOpen(false)}
        onConfirm={handleVacate}
        title="Confirm Room Vacating"
        message={`Are you sure you want to vacate ${selectedAllocation?.student?.name} from Room ${selectedAllocation?.room?.roomNumber}? This will free up 1 bed in Room ${selectedAllocation?.room?.roomNumber} and mark the allocation as VACATED.`}
        confirmText="Vacate Resident"
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
