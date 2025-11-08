// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

type Task = { _id: string; title: string; done: boolean; };

export default function Home(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const router = useRouter();

  useEffect(()=>{ fetchTasks(); }, []);

  const getToken = async () => await AsyncStorage.getItem('token');

  const fetchTasks = async () => {
    const token = await getToken();
    if(!token){ router.replace('/(auth)/login'); return; }
    const res = await axios.get('http://<YOUR_DEV_HOST>:4000/api/tasks', { headers: { Authorization: `Bearer ${token}` }});
    setTasks(res.data);
  };

  const addTask = async () => {
    if(!text) return;
    const token = await getToken();
    const res = await axios.post('http://<YOUR_DEV_HOST>:4000/api/tasks', { title: text }, { headers: { Authorization: `Bearer ${token}` }});
    setTasks(prev=>[res.data, ...prev]);
    setText('');
  };

  const toggle = async (t: Task) => {
    const token = await getToken();
    const res = await axios.put(`http://<YOUR_DEV_HOST>:4000/api/tasks/${t._id}`, { done: !t.done }, { headers: { Authorization: `Bearer ${token}` }});
    setTasks(prev => prev.map(x => x._id === t._id ? res.data : x));
  };

  const remove = async (t: Task) => {
    const token = await getToken();
    await axios.delete(`http://<YOUR_DEV_HOST>:4000/api/tasks/${t._id}`, { headers: { Authorization: `Bearer ${token}` }});
    setTasks(prev => prev.filter(x => x._id !== t._id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo</Text>
      <View style={styles.addRow}>
        <TextInput placeholder="Add a task" placeholderTextColor={Colors.placeholder} style={styles.input} value={text} onChangeText={setText} />
        <Button title="Add" onPress={addTask} />
      </View>
      <FlatList data={tasks} keyExtractor={i=>i._id} renderItem={({item}) => (
        <View style={styles.row}>
          <TouchableOpacity onPress={()=>toggle(item)} style={{flex:1}}>
            <Text style={[styles.taskText, item.done && { textDecorationLine: 'line-through', color: Colors.placeholder }]}>{item.title}</Text>
          </TouchableOpacity>
          <Button title="Del" onPress={()=>remove(item)} />
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: Colors.white },
  title: { fontSize:28, marginBottom:12, color: Colors.black },
  addRow: { flexDirection:'row', gap:8, marginBottom:12 },
  input: { flex:1, borderWidth:1, borderColor: Colors.placeholder, padding:10, color: Colors.black },
  row: { flexDirection:'row', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderColor: '#EFEFEF' },
  taskText: { color: Colors.black }
});
