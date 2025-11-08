import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/hooks/useTasks';
import AddTaskInput from '@/components/AddTaskInput';
import AuthPromptModal from '@/components/AuthPromptModal';

export default function HomeScreen() {
  const { tasks, addTask, toggleDone, removeTask, saving } = useTasks();
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <AddTaskInput value={text} onChange={setText} onAdd={() => addTask(text)} saving={saving} />

      <FlatList
        data={tasks}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text
              onPress={() => toggleDone(item)}
              style={[styles.taskText, item.done && { textDecorationLine: 'line-through', color: Colors.placeholder }]}
            >
              {item.title}
            </Text>
            <Text onPress={() => removeTask(item)} style={styles.del}>Del</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  taskText: { fontSize: 13, color: Colors.light.text },
  del: { fontSize: 12, color: '#FF5252' },
  empty: { color: Colors.placeholder, textAlign: 'center', marginTop: 28, fontSize: 13 },
});
