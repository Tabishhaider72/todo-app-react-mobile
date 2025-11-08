import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';
import { useIsFocused } from '@react-navigation/native';

// 🧩 Extended Task type with richer info for UI/UX
export type Task = {
  _id?: string;
  title: string;
  description?: string;
  done?: boolean;
  createdAt?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
};

type LastAction = {
  type: 'added' | 'deleted' | 'toggled' | null;
  task?: Task | null;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastAction, setLastAction] = useState<LastAction>({ type: null, task: null });
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      fetchTasks();
      flushPendingTasksIfLoggedIn();
    }
  }, [focused]);

  const getToken = async () => await AsyncStorage.getItem('token');

  // 🧠 Fetch all tasks (online or offline)
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
      console.warn('⚠️ Fetch tasks failed:', err);
    }
  }

  // ➕ Add new task with animation-friendly delay
  async function addTask(title: string, description?: string, dueDate?: string, priority: 'low' | 'medium' | 'high' = 'low') {
    if (!title.trim()) return;
    const newTask: Task = {
      title: title.trim(),
      description,
      dueDate,
      priority,
      done: false,
      createdAt: new Date().toISOString(),
    };

    const token = await getToken();

    if (token) {
      try {
        setSaving(true);
        await new Promise((res) => setTimeout(res, 120)); // 🕒 Soft delay for animation
        const res = await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => [res.data, ...prev]);
        setLastAction({ type: 'added', task: res.data });
      } catch {
        await saveLocally(newTask);
        setLastAction({ type: 'added', task: newTask });
      } finally {
        setSaving(false);
      }
    } else {
      await savePending(newTask);
      await saveLocally(newTask);
      setLastAction({ type: 'added', task: newTask });
    }
  }

  // ✅ Toggle done/undone
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
      setLastAction({ type: 'toggled', task: res.data });
    } catch (err) {
      console.warn('⚠️ Toggle task failed:', err);
    }
  }

  // 🗑️ Delete task
  async function removeTask(item: Task) {
    const token = await getToken();

    if (!token) {
      const local = JSON.parse((await AsyncStorage.getItem('local_tasks')) || '[]');
      const filtered = local.filter((l: Task) => l.title !== item.title);
      await AsyncStorage.setItem('local_tasks', JSON.stringify(filtered));
      setTasks((prev) => prev.filter((t) => t !== item));
      setLastAction({ type: 'deleted', task: item });
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 120)); // 🕒 for smooth fade animation
      await axios.delete(`${API_BASE_URL}/api/tasks/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== item._id));
      setLastAction({ type: 'deleted', task: item });
    } catch (err) {
      console.warn('⚠️ Delete task failed:', err);
    }
  }

  // 💾 Store unsynced task locally when offline
  async function savePending(task: Task) {
    const pending = JSON.parse((await AsyncStorage.getItem('pending_tasks')) || '[]');
    pending.unshift(task);
    await AsyncStorage.setItem('pending_tasks', JSON.stringify(pending));
  }

  // 💾 Store local task immediately (offline mode)
  async function saveLocally(task: Task) {
    const local = JSON.parse((await AsyncStorage.getItem('local_tasks')) || '[]');
    local.unshift(task);
    await AsyncStorage.setItem('local_tasks', JSON.stringify(local));
    setTasks((prev) => [task, ...prev]);
  }

  // ☁️ Sync pending tasks once user logs in
  async function flushPendingTasksIfLoggedIn() {
    const token = await getToken();
    if (!token) return;

    const pending = JSON.parse((await AsyncStorage.getItem('pending_tasks')) || '[]');
    if (!pending.length) return;

    try {
      for (const t of pending.reverse()) {
        await axios.post(`${API_BASE_URL}/api/tasks`, t, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await AsyncStorage.removeItem('pending_tasks');
      await AsyncStorage.removeItem('local_tasks');
      fetchTasks();
    } catch (err) {
      console.warn('⚠️ Failed to sync pending tasks:', err);
    }
  }

  return { tasks, addTask, toggleDone, removeTask, saving, lastAction };
}
