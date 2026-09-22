import { fetchApi } from './api';
import { Student, Allocation, Complaint } from '../types';

export const studentService = {
  async getAllStudents(params: {
    search?: string;
    department?: string;
    year?: number;
    gender?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ students: Student[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department) query.append('department', params.department);
    if (params.year) query.append('year', params.year.toString());
    if (params.gender) query.append('gender', params.gender);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await fetchApi<Student[]>(`/students?${query.toString()}`);
    return {
      students: res.data || [],
      pagination: res.pagination,
    };
  },

  async getStudentById(id: string): Promise<{
    student: Student;
    allocations: Allocation[];
    complaints: Complaint[];
  }> {
    const res = await fetchApi<{
      student: Student;
      allocations: Allocation[];
      complaints: Complaint[];
    }>(`/students/${id}`);
    return res.data!;
  },

  async getMyProfile(): Promise<{
    student: Student;
    allocations: Allocation[];
    complaints: Complaint[];
  }> {
    const res = await fetchApi<{
      student: Student;
      allocations: Allocation[];
      complaints: Complaint[];
    }>('/students/profile/me');
    return res.data!;
  },

  async createStudent(data: {
    studentId: string;
    name: string;
    email: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
    department: string;
    year: number;
    address: string;
    guardianName: string;
    guardianPhone: string;
    password?: string;
  }): Promise<Student> {
    const res = await fetchApi<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const res = await fetchApi<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  },

  async deleteStudent(id: string): Promise<{ message: string }> {
    const res = await fetchApi<{ message: string }>(`/students/${id}`, {
      method: 'DELETE',
    });
    return res.data!;
  },
};
