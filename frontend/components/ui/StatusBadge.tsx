import React from 'react';
import { RoomStatus, ComplaintStatus, ComplaintPriority, AllocationStatus } from '@/types';

interface StatusBadgeProps {
  status: RoomStatus | ComplaintStatus | ComplaintPriority | AllocationStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let label = status;

  switch (status) {
    // Room Statuses
    case 'AVAILABLE':
      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      label = 'Available';
      break;
    case 'PARTIALLY_OCCUPIED':
      badgeStyle = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
      label = 'Partial';
      break;
    case 'FULL':
      badgeStyle = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
      label = 'Full';
      break;
    case 'MAINTENANCE':
      badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      label = 'Maintenance';
      break;

    // Complaint Statuses
    case 'PENDING':
      badgeStyle = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      label = 'Pending';
      break;
    case 'IN_PROGRESS':
      badgeStyle = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      label = 'In Progress';
      break;
    case 'RESOLVED':
      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      label = 'Resolved';
      break;

    // Complaint Priorities
    case 'LOW':
      badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      label = 'Low';
      break;
    case 'MEDIUM':
      badgeStyle = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      label = 'Medium';
      break;
    case 'HIGH':
      badgeStyle = 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
      label = 'High';
      break;
    case 'URGENT':
      badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      label = 'Urgent';
      break;

    // Allocation Statuses
    case 'ACTIVE':
      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      label = 'Active';
      break;
    case 'VACATED':
      badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      label = 'Vacated';
      break;
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${badgeStyle} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
};
