import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/config';
import AuthPromptModal from '@/components/AuthPromptModal';
import { useIsFocused } from '@react-navigation/native';

type Task = { _id?: string; title: string; done?: boolean; };

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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
      // load local-only tasks or show empty list
      const local = await AsyncStorage.getItem('local_tasks');
      setTasks(local ? JSON.parse(local) : []);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.warn(err);
    }
  }

  async function addTask() {
    if (!text.trim()) return;
    const newTask: Task = { title: text.trim(), done: false };

    const token = await getToken();
    setText('');
    Keyboard.dismiss();

    // if user logged in -> save remotely
    if (token) {
      try {
        setSaving(true);
        const res = await axios.post(`${API_BASE_URL}/api/tasks`, newTask, { headers: { Authorization: `Bearer ${token}` } });
        setTasks(prev => [res.data, ...prev]);
      } catch (err) {
        alert('Failed to save. Saved locally.');
        await saveLocally(newTask);
      } finally {
        setSaving(false);
      }
      return;
    }

    // not logged in -> save locally (pending) and prompt login
    await savePending(newTask);
    setModalVisible(true);
  }

  async function savePending(task: Task) {
    const pendingRaw = await AsyncStorage.getItem('pending_tasks');
    const pending = pendingRaw ? JSON.parse(pendingRaw) : [];
    pending.unshift(task);
    await AsyncStorage.setItem('pending_tasks', JSON.stringify(pending));
    // show local list immediately
    const localRaw = await AsyncStorage.getItem('local_tasks');
    const local = localRaw ? JSON.parse(localRaw) : [];
    local.unshift(task);
    await AsyncStorage.setItem('local_tasks', JSON.stringify(local));
    setTasks(prev => [task, ...prev]);
  }

  async function saveLocally(task: Task) {
    const localRaw = await AsyncStorage.getItem('local_tasks');
    const local = localRaw ? JSON.parse(localRaw) : [];
    local.unshift(task);
    await AsyncStorage.setItem('local_tasks', JSON.stringify(local));
    setTasks(prev => [task, ...prev]);
  }

  // After login, read pending_tasks and push them to server, then clear pending
  async function flushPendingTasksIfLoggedIn() {
    const token = await getToken();
    if (!token) return;
    const pendingRaw = await AsyncStorage.getItem('pending_tasks');
    if (!pendingRaw) return;
    const pending = JSON.parse(pendingRaw) as Task[];
    if (!pending.length) return;

    try {
      for (const t of pending.reverse()) {
        await axios.post(`${API_BASE_URL}/api/tasks`, { title: t.title }, { headers: { Authorization: `Bearer ${token}` }});
      }
      // clear pending and local tasks
      await AsyncStorage.removeItem('pending_tasks');
      await AsyncStorage.removeItem('local_tasks');
      fetchTasks(); // reload from server
    } catch (err) {
      console.warn('Failed to flush pending tasks', err);
    }
  }

  const toggleDone = async (item: Task) => {
    const token = await getToken();
    if (!token) {
      alert('Please login to change task state.');
      return;
    }
    try {
      const res = await axios.put(`${API_BASE_URL}/api/tasks/${item._id}`, { done: !item.done }, { headers: { Authorization: `Bearer ${token}` }});
      setTasks(prev => prev.map(p => (p._id === res.data._id ? res.data : p)));
    } catch (err) {
      console.warn(err);
    }
  };

  const removeTask = async (item: Task) => {
    const token = await getToken();
    if (!token) {
      // remove locally
      const localRaw = await AsyncStorage.getItem('local_tasks');
      const local = localRaw ? JSON.parse(localRaw) : [];
      const filtered = local.filter((l: Task) => l.title !== item.title);
      await AsyncStorage.setItem('local_tasks', JSON.stringify(filtered));
      setTasks(prev => prev.filter(p => p !== item));
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${item._id}`, { headers: { Authorization: `Bearer ${token}` }});
      setTasks(prev => prev.filter(p => p._id !== item._id));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <View style={styles.addRow}>
        <TextInput
          placeholder="Add a task..."
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addTask} style={styles.addBtn} disabled={saving}>
          <Text style={styles.addBtnText}>{saving ? '...' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => toggleDone(item)} style={{ flex: 1 }}>
              <Text style={[styles.taskText, item.done && { textDecorationLine: 'line-through', color: Colors.placeholder }]}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeTask(item)} style={styles.del}>
              <Text style={styles.delText}>Del</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet — add one.</Text>}
      />

      <AuthPromptModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: Colors.light.background },
  header: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 13,
    color: Colors.light.text,
    height: 38,
  },
  addBtn: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.light.background, fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  taskText: { fontSize: 13, color: Colors.light.text },
  del: { paddingHorizontal: 8, paddingVertical: 4 },
  delText: { fontSize: 12, color: '#FF5252' },
  empty: { color: Colors.placeholder, textAlign: 'center', marginTop: 28, fontSize: 13 },
});
