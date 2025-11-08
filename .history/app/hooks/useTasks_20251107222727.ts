// hooks/useTasks.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';
import { useIsFocused } from '@react-navigation/native';
import { taskService } from '@/services/taskService';

export type Task = {
  _id?: string;
  title: string;
  done?: boolean;
  description?: string;
  dueDate?: string;
  priority?: string;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) fetchTasks();
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
      const res = await taskService.getTasks(token);
      const allTasks = res.data;
      setTasks(allTasks.filter((t: Task) => !t.done));
      setCompletedTasks(allTasks.filter((t: Task) => t.done));
    } catch (err) {
      console.warn('Fetch error:', err);
    }
  }

  // ✅ Fixed addTask (now supports full TaskModal)
  async function addTask(title: string, description?: string, dueDate?: string, priority?: string) {
    if (!title.trim()) return;
    const newTask: Task = { title: title.trim(), done: false, description, dueDate, priority };
    const token = await getToken();

    setSaving(true);
    try {
      if (token) {
        const res = await taskService.createTask(token, newTask);
        setTasks(prev => [res.data, ...prev]);
      } else {
        const local = JSON.parse((await AsyncStorage.getItem('local_tasks')) || '[]');
        local.unshift(newTask);
        await AsyncStorage.setItem('local_tasks', JSON.stringify(local));
        setTasks(prev => [newTask, ...prev]);
      }
    } catch (err) {
      console.warn('Add task failed:', err);
    } finally {
      setSaving(false);
    }
  }

  async function markComplete(task: Task) {
    const updated = { ...task, done: true };
    const token = await getToken();

    if (token && task._id) {
      await taskService.updateTask(token, task._id, { done: true });
    }

    setTasks(prev => prev.filter(t => t._id !== task._id));
    setCompletedTasks(prev => {
      const updatedCompleted = [...prev, updated];
      AsyncStorage.setItem('completed_tasks', JSON.stringify(updatedCompleted));
      return updatedCompleted;
    });
  }

  async function restoreTask(task: Task) {
    const restored = { ...task, done: false };
    const token = await getToken();

    if (token && task._id) {
      await taskService.updateTask(token, task._id, { done: false });
    }

    setCompletedTasks(prev => {
      const filtered = prev.filter(t => t._id !== task._id);
      AsyncStorage.setItem('completed_tasks', JSON.stringify(filtered));
      return filtered;
    });
    setTasks(prev => [restored, ...prev]);
  }

  async function removeCompleted(task: Task) {
    const token = await getToken();
    if (token && task._id) {
      await taskService.deleteTask(token, task._id);
    }

    setCompletedTasks(prev => {
      const filtered = prev.filter(t => t._id !== task._id);
      AsyncStorage.setItem('completed_tasks', JSON.stringify(filtered));
      return filtered;
    });
  }

  return {
    tasks,
    completedTasks,
    addTask,
    markComplete,
    restoreTask,
    removeCompleted,
    saving,
  };
}
