// hooks/useTasks.ts
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // 🟢 New: animation trigger
  const [animationTrigger] = useState(new Animated.Value(0));

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

  // ✅ Add task
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

  // ✅ Mark as complete (instant + animate)
  async function markComplete(task: Task) {
    const updated = { ...task, done: true };
    const token = await getToken();

    // 🔥 trigger quick pulse animation
    Animated.sequence([
      Animated.timing(animationTrigger, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(animationTrigger, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    // instant UI update
    setTasks(prev => prev.filter(t => t._id !== task._id));
    setCompletedTasks(prev => {
      const updatedCompleted = [...prev, updated];
      AsyncStorage.setItem('completed_tasks', JSON.stringify(updatedCompleted));
      return updatedCompleted;
    });

    // background API call
    try {
      if (token && task._id) await taskService.updateTask(token, task._id, { done: true });
    } catch (err) {
      console.warn('Update complete failed:', err);
    }
  }

  // ✅ Restore task (instant + animate)
  async function restoreTask(task: Task) {
    const restored = { ...task, done: false };
    const token = await getToken();

    Animated.sequence([
      Animated.timing(animationTrigger, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(animationTrigger, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    setCompletedTasks(prev => {
      const filtered = prev.filter(t => t._id !== task._id);
      AsyncStorage.setItem('completed_tasks', JSON.stringify(filtered));
      return filtered;
    });
    setTasks(prev => [restored, ...prev]);

    try {
      if (token && task._id) await taskService.updateTask(token, task._id, { done: false });
    } catch (err) {
      console.warn('Restore task failed:', err);
    }
  }

  // ✅ Delete completed task
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
    animationTrigger, // exported to link with CompletedFolder pulse
  };
}
