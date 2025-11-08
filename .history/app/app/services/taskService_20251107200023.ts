// services/taskService.ts
import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';

export const taskService = {
  getTasks: (token: string) =>
    axios.get(`${API_BASE_URL}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
  createTask: (token: string, task: any) =>
    axios.post(`${API_BASE_URL}/api/tasks`, task, { headers: { Authorization: `Bearer ${token}` } }),
  updateTask: (token: string, id: string, data: any) =>
    axios.put(`${API_BASE_URL}/api/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  deleteTask: (token: string, id: string) =>
    axios.delete(`${API_BASE_URL}/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};
