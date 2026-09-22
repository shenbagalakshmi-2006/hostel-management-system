import { fetchApi } from './api';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types';

export const complaintService = {
  async getAllComplaints(params: {
    search?: string;
    category?: ComplaintCategory;
    priority?: ComplaintPriority;
    status?: ComplaintStatus;
    studentId?: string;
  } = {}): Promise<Complaint[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.priority) query.append('priority', params.priority);
    if (params.status) query.append('status', params.status);
    if (params.studentId) query.append('studentId', params.studentId);

    const res = await fetchApi<Complaint[]>(`/complaints?${query.toString()}`);
    return res.data || [];
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const res = await fetchApi<Complaint>(`/complaints/${id}`);
    return res.data!;
  },

  async createComplaint(data: {
    category: ComplaintCategory;
    priority: ComplaintPriority;
    description: string;
    studentId?: string;
  }): Promise<Complaint> {
    const res = await fetchApi<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async updateComplaint(
    id: string,
    data: {
      status?: ComplaintStatus;
      adminRemarks?: string;
    }
  ): Promise<Complaint> {
    const res = await fetchApi<Complaint>(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async deleteComplaint(id: string): Promise<{ message: string }> {
    const res = await fetchApi<{ message: string }>(`/complaints/${id}`, {
      method: 'DELETE',
    });
    return res.data!;
  },
};
