import { fetchApi } from './api';
import { Allocation } from '../types';

export const allocationService = {
  async getAllAllocations(params: {
    status?: 'ACTIVE' | 'VACATED';
    search?: string;
  } = {}): Promise<Allocation[]> {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const res = await fetchApi<Allocation[]>(`/allocations?${query.toString()}`);
    return res.data || [];
  },

  async allocateRoom(data: {
    studentId: string;
    roomId: string;
    notes?: string;
  }): Promise<Allocation> {
    const res = await fetchApi<Allocation>('/allocations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async vacateAllocation(allocationId: string): Promise<{ message: string; allocation: Allocation }> {
    const res = await fetchApi<{ message: string; allocation: Allocation }>(
      `/allocations/${allocationId}/vacate`,
      { method: 'POST' }
    );
    return res.data!;
  },

  async reassignRoom(
    allocationId: string,
    data: { newRoomId: string; notes?: string }
  ): Promise<any> {
    const res = await fetchApi<any>(`/allocations/${allocationId}/reassign`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  },
};
