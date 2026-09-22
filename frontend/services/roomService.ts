import { fetchApi } from './api';
import { Room, Student, Allocation, RoomType, RoomStatus } from '../types';

export const roomService = {
  async getAllRooms(params: {
    search?: string;
    status?: RoomStatus;
    block?: string;
    floor?: number;
    roomType?: RoomType;
    availableOnly?: boolean;
  } = {}): Promise<Room[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.block) query.append('block', params.block);
    if (params.floor !== undefined) query.append('floor', params.floor.toString());
    if (params.roomType) query.append('roomType', params.roomType);
    if (params.availableOnly) query.append('availableOnly', 'true');

    const res = await fetchApi<Room[]>(`/rooms?${query.toString()}`);
    return res.data || [];
  },

  async getRoomById(id: string): Promise<{
    room: Room;
    occupants: Partial<Student>[];
    allocations: Allocation[];
  }> {
    const res = await fetchApi<{
      room: Room;
      occupants: Partial<Student>[];
      allocations: Allocation[];
    }>(`/rooms/${id}`);
    return res.data!;
  },

  async createRoom(data: {
    roomNumber: string;
    block: string;
    floor: number;
    roomType: RoomType;
    capacity: number;
    status?: RoomStatus;
  }): Promise<Room> {
    const res = await fetchApi<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const res = await fetchApi<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async deleteRoom(id: string): Promise<{ message: string }> {
    const res = await fetchApi<{ message: string }>(`/rooms/${id}`, {
      method: 'DELETE',
    });
    return res.data!;
  },
};
