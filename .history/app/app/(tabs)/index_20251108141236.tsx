import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/hooks/useTasks';
import AddTaskInput from '@/components/AddTaskInput';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import AuthPromptModal from '@/components/AuthPromptModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const {
    tasks,
    completedTasks,
    addTask,
    markComplete,
    restoreTask,
    removeCompleted,
    saving,
  } = useTasks();

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Toast animation when task added
  useEffect(() => {
    if (tasks.length > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, delay: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [tasks.length]);

  // ✅ Check token and decide what to show when pressing "Add"
  const handleAddTaskPress = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setTaskModalVisible(true); // user logged in → open create modal
    } else {
      setAuthModalVisible(true); // not logged in → ask login/register/offline
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      {/* ➕ Add Task Button */}
      <AddTaskInput
        value=""
        onChange={() => {}}
        onAdd={handleAddTaskPress} // 👈 changed handler
        saving={saving}
      />

      {/* 📋 Unified Task List */}
      <TaskList
        tasks={tasks}
        completedTasks={completedTasks}
        markComplete={markComplete}
        restoreTask={restoreTask}
        removeCompleted={removeCompleted}
      />

      {/* 📝 Modal for creating new task */}
      <TaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onSave={(title, description, dueDate, priority) => {
          addTask(title, description, dueDate, priority);
          setTaskModalVisible(false);
        }}
      />

      {/* 🔒 Auth Prompt (Login / Register / Offline) */}
      <AuthPromptModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />

      {/* ✅ Toast Feedback */}
      <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
        <Text style={styles.toastText}>✅ Task added!</Text>
      </Animated.View>
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
    backgroundColor: '#000',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toastText: { color: '#fff', fontSize: 12, fontWeight: '500' },
});
