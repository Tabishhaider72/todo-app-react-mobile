// hooks/useTasks.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';
import { useIsFocused } from '@react-navigation/native';

export type Task = { _id?: string; title: string; done?: boolean };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      fetchTasks();
      flushPendingTasksIfLoggedIn();
    }
  }, [focused]);

  const getToken = async () => await AsyncStorage.getItem('token');

  async function fetchTasks() {
    const token = await getToken();
    if (!token) {
      const local = await AsyncStorage.getItem('local_tasks');
      setTasks(local ? JSON.parse(local) : []);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.warn(err);
    }
  }

  async function addTask(title: string) {
    if (!title.trim()) return;
    const newTask: Task = { title: title.trim(), done: false };
    const token = await getToken();

    if (token) {
      try {
        setSaving(true);
        const res = await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => [res.data, ...prev]);
      } catch {
        await saveLocally(newTask);
      } finally {
        setSaving(false);
      }
    } else {
      await savePending(newTask);
      await saveLocally(newTask);
    }
  }

  async function toggleDone(item: Task) {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/tasks/${item._id}`,
        { done: !item.done },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
    } catch (err) {
      console.warn(err);
    }
  }

  async function removeTask(item: Task) {
    const token = await getToken();
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== item._id));
    } catch (err) {
      console.warn(err);
    }
  }

  async function savePending(task: Task) {
    const pending = JSON.parse((await AsyncStorage.getItem('pending_tasks')) || '[]');
    pending.unshift(task);
    await AsyncStorage.setItem('pending_tasks', JSON.stringify(pending));
  }

  async function saveLocally(task: Task) {
    const local = JSON.parse((await AsyncStorage.getItem('local_tasks')) || '[]');
    local.unshift(task);
    await AsyncStorage.setItem('local_tasks', JSON.stringify(local));
    setTasks((prev) => [task, ...prev]);
  }

  async function flushPendingTasksIfLoggedIn() {
    const token = await getToken();
    if (!token) return;
    const pending = JSON.parse((await AsyncStorage.getItem('pending_tasks')) || '[]');
    if (!pending.length) return;
    try {
      for (const t of pending.reverse()) {
        await axios.post(`${API_BASE_URL}/api/tasks`, { title: t.title }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await AsyncStorage.removeItem('pending_tasks');
      await AsyncStorage.removeItem('local_tasks');
      fetchTasks();
    } catch (err) {
      console.warn('Failed to flush pending tasks', err);
    }
  }

  return { tasks, addTask, toggleDone, removeTask, saving };
}
