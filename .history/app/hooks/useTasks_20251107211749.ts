// hooks/useTasks.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';
import { useIsFocused } from '@react-navigation/native';

export type Task = { _id?: string; title: string; done?: boolean; description?: string; dueDate?: string; priority?: string };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      fetchTasks();
    }
  }, [focused]);

  const getToken = async () => await AsyncStorage.getItem('token');

  async function fetchTasks() {
    const token = await getToken();
    if (!token) {
      const local = await AsyncStorage.getItem('local_tasks');
      const completed = await AsyncStorage.getItem('completed_tasks');
      setTasks(local ? JSON.parse(local) : []);
      setCompletedTasks(completed ? JSON.parse(completed) : []);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTasks = res.data;
      setTasks(allTasks.filter((t: Task) => !t.done));
      setCompletedTasks(allTasks.filter((t: Task) => t.done));
    } catch (err) {
      console.warn(err);
    }
  }

  async function markComplete(task: Task) {
    const updated = { ...task, done: true };
    const token = await getToken();
    if (token) {
      await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, { done: true }, { headers: { Authorization: `Bearer ${token}` } });
    }
    setTasks(prev => prev.filter(t => t._id !== task._id));
    setCompletedTasks(prev => [...prev, updated]);
    await AsyncStorage.setItem('completed_tasks', JSON.stringify([...completedTasks, updated]));
  }

  async function restoreTask(task: Task) {
    const restored = { ...task, done: false };
    const token = await getToken();
    if (token) {
      await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, { done: false }, { headers: { Authorization: `Bearer ${token}` } });
    }
    setCompletedTasks(prev => prev.filter(t => t._id !== task._id));
    setTasks(prev => [restored, ...prev]);
    await AsyncStorage.setItem('completed_tasks', JSON.stringify(completedTasks.filter(t => t._id !== task._id)));
  }

  async function removeCompleted(task: Task) {
    const token = await getToken();
    if (token) {
      await axios.delete(`${API_BASE_URL}/api/tasks/${task._id}`, { headers: { Authorization: `Bearer ${token}` } });
    }
    setCompletedTasks(prev => prev.filter(t => t._id !== task._id));
    await AsyncStorage.setItem('completed_tasks', JSON.stringify(completedTasks.filter(t => t._id !== task._id)));
  }

  return { tasks, completedTasks, setTasks, markComplete, restoreTask, removeCompleted, saving };
}
