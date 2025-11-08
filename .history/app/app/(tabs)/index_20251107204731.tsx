import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/hooks/useTasks';
import AddTaskInput from '@/components/AddTaskInput';
import TaskList from '@/components/TaskList'; // ✅ imported new modular list
import AuthPromptModal from '@/components/AuthPromptModal';
import TaskModal from '@/components/TaskModal';

export default function HomeScreen() {
  const { tasks, addTask, toggleDone, removeTask, saving, lastAction } = useTasks();
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Toast Animation for Added Task
  useEffect(() => {
    if (lastAction?.type === 'added') {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, delay: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [lastAction]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      {/* ➕ Add Task Button / Input */}
      <AddTaskInput
        value={text}
        onChange={setText}
        onAdd={() => setTaskModalVisible(true)}
        saving={saving}
      />

      {/* 📋 Modular Task List */}
      <TaskList
        tasks={tasks}
        toggleDone={toggleDone}
        removeTask={removeTask}
      />

      {/* ✅ Animated Toast Feedback */}
      <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
        <Text style={styles.toastText}>✅ Task added!</Text>
      </Animated.View>

      {/* 🔒 Login/Register Prompt */}
      <AuthPromptModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* 📝 Task Detail Modal */}
      <TaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onSave={(title, description, dueDate, priority) => {
          addTask(title, description, dueDate, priority);
          setTaskModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.light.background },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#0B0B0B',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toastText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
