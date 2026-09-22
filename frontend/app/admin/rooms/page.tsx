'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Building2,
  Bed,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Users,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { roomService } from '@/services/roomService';
import { Room, RoomType, RoomStatus } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RoomStatus | ''>('');
  const [block, setBlock] = useState('');
  const [roomType, setRoomType] = useState<RoomType | ''>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    block: 'A',
    floor: 1,
    roomType: 'Double' as RoomType,
    capacity: 2,
    status: 'AVAILABLE' as RoomStatus,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { success: toastSuccess, error: toastError } = useToast();

  const loadRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getAllRooms({
        search,
        status: status || undefined,
        block: block || undefined,
        roomType: roomType || undefined,
      });
      setRooms(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, block, roomType, toastError]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleRoomTypeChange = (type: RoomType) => {
    let cap = 2;
    if (type === 'Single') cap = 1;
    if (type === 'Double') cap = 2;
    if (type === 'Triple') cap = 3;
    if (type === 'Four Sharing') cap = 4;
    setFormData({ ...formData, roomType: type, capacity: cap });
  };

  const openAddModal = () => {
    setFormData({
      roomNumber: '',
      block: 'A',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      status: 'AVAILABLE',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      roomType: room.roomType,
      capacity: room.capacity,
      status: room.status,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.roomNumber) errors.roomNumber = 'Room number is required';
    if (!formData.block) errors.block = 'Block name is required';
    if (formData.floor < 0) errors.floor = 'Floor cannot be negative';
    if (formData.capacity < 1) errors.capacity = 'Capacity must be at least 1';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await roomService.createRoom(formData);
      toastSuccess(`Room ${formData.roomNumber} created successfully!`);
      setIsAddModalOpen(false);
      loadRooms();
    } catch (err: any) {
      toastError(err.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await roomService.updateRoom(selectedRoom._id, formData);
      toastSuccess(`Room ${formData.roomNumber} updated successfully!`);
      setIsEditModalOpen(false);
      setSelectedRoom(null);
      loadRooms();
    } catch (err: any) {
      toastError(err.message || 'Failed to update room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    setIsSubmitting(true);
    try {
      await roomService.deleteRoom(selectedRoom._id);
      toastSuccess(`Room ${selectedRoom.roomNumber} deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setSelectedRoom(null);
      loadRooms();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Room>[] = [
    {
      header: 'Room',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
            {row.roomNumber}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Block {row.block}</p>
            <p className="text-xs text-slate-400">Floor {row.floor}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Capacity',
      cell: (row) => (
        <div>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
            {row.roomType}
          </span>
          <span className="text-xs text-slate-400">{row.capacity} Total Beds</span>
        </div>
      ),
    },
    {
      header: 'Live Occupancy',
      cell: (row) => {
        const percent = Math.round((row.occupiedCount / row.capacity) * 100);
        return (
          <div className="w-44 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {row.occupiedCount} / {row.capacity} beds
              </span>
              <span className="text-slate-500">{percent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  percent >= 100
                    ? 'bg-rose-500'
                    : percent > 0
                    ? 'bg-indigo-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Available Beds',
      cell: (row) => (
        <span
          className={`font-bold text-xs ${
            row.availableBeds > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400'
          }`}
        >
          {row.availableBeds} {row.availableBeds === 1 ? 'Bed' : 'Beds'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
            title="Edit Room"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(row)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600"
            title="Delete Room"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Hostel Room Inventory"
      subtitle="Manage blocks, capacities, maintenance status, and bed allocations"
    >
      <div className="space-y-6">
        {/* Filter / Actions Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchInput
              placeholder="Search by room or block..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Select
              options={[
                { value: '', label: 'All Blocks' },
                { value: 'A', label: 'Block A' },
                { value: 'B', label: 'Block B' },
                { value: 'C', label: 'Block C' },
              ]}
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-full sm:w-36"
            />
            <Select
              options={[
                { value: '', label: 'All Types' },
                { value: 'Single', label: 'Single' },
                { value: 'Double', label: 'Double' },
                { value: 'Triple', label: 'Triple' },
                { value: 'Four Sharing', label: 'Four Sharing' },
              ]}
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as any)}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'PARTIALLY_OCCUPIED', label: 'Partial' },
                { value: 'FULL', label: 'Full' },
                { value: 'MAINTENANCE', label: 'Maintenance' },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full sm:w-40"
            />
          </div>

          <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Room
          </Button>
        </div>

        {/* Rooms Table */}
        <DataTable
          columns={columns}
          data={rooms}
          isLoading={isLoading}
          emptyTitle="No rooms found"
          emptyDescription="Try adjusting your block/status filters or add a new room."
        />
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Room"
        description="Register a new room and its bed capacity."
        maxWidth="md"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Number"
              placeholder="e.g. A-301"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              error={formErrors.roomNumber}
              required
            />
            <Input
              label="Block"
              placeholder="e.g. A"
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              error={formErrors.block}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Floor"
              type="number"
              min={0}
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              error={formErrors.floor}
              required
            />
            <Select
              label="Room Type"
              options={['Single', 'Double', 'Triple', 'Four Sharing']}
              value={formData.roomType}
              onChange={(e) => handleRoomTypeChange(e.target.value as RoomType)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity (Beds)"
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              error={formErrors.capacity}
              required
            />
            <Select
              label="Status"
              options={[
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'MAINTENANCE', label: 'Maintenance' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
              required
            />
          </div>

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
              Create Room
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Room"
        description="Update room parameters or toggle maintenance status."
        maxWidth="md"
      >
        <form onSubmit={handleUpdateRoom} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              error={formErrors.roomNumber}
              required
            />
            <Input
              label="Block"
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              error={formErrors.block}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Floor"
              type="number"
              min={0}
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              error={formErrors.floor}
              required
            />
            <Select
              label="Room Type"
              options={['Single', 'Double', 'Triple', 'Four Sharing']}
              value={formData.roomType}
              onChange={(e) => handleRoomTypeChange(e.target.value as RoomType)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity (Beds)"
              type="number"
              min={selectedRoom?.occupiedCount || 1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              error={formErrors.capacity}
              helperText={`Currently has ${selectedRoom?.occupiedCount || 0} occupants`}
              required
            />
            <Select
              label="Status"
              options={[
                { value: 'AVAILABLE', label: 'Normal / Available' },
                { value: 'MAINTENANCE', label: 'Maintenance' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
              required
            />
          </div>

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
              Save Room Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Room Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRoom}
        title="Delete Room?"
        message={`Are you sure you want to delete Room ${selectedRoom?.roomNumber}? This room currently has ${selectedRoom?.occupiedCount || 0} occupants.`}
        confirmText="Delete Room"
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
