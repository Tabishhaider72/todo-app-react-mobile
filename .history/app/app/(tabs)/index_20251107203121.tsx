import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useTasks, Task } from '@/hooks/useTasks';
import AddTaskInput from '@/components/AddTaskInput';
import AuthPromptModal from '@/components/AuthPromptModal';
import TaskModal from '@/components/TaskModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { tasks, addTask, toggleDone, removeTask, saving, lastAction } = useTasks();
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lastAction?.type === 'added') {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, delay: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [lastAction]);

  const renderItem = ({ item }: { item: Task }) => (
    <Animated.View
      style={{
        opacity: item.done ? 0.8 : 1,
        transform: [{ scale: item.done ? 0.98 : 1 }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleDone(item)}
        style={[styles.taskCard, item.done && { backgroundColor: '#EFEFEF' }]}
      >
        <View style={styles.taskContent}>
          <Ionicons
            name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={item.done ? '#2ECC71' : Colors.light.text}
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.taskTitle,
                item.done && { textDecorationLine: 'line-through', color: Colors.placeholder },
              ]}
            >
              {item.title}
            </Text>

            {item.dueDate && (
              <Text style={styles.dueText}>
                📅 {new Date(item.dueDate).toLocaleDateString()} {item.priority && `• ${item.priority}`}
              </Text>
            )}
            {item.description ? (
              <Text style={styles.descText}>{item.description}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity onPress={() => removeTask(item)}>
          <Ionicons name="trash-outline" size={16} color="#FF5252" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      {/* When user clicks Add → Open Task Modal */}
      <AddTaskInput
        value={text}
        onChange={setText}
        onAdd={() => setTaskModalVisible(true)}
        saving={saving}
      />

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item, i) => item._id ?? item.title + i}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-done-circle-outline" size={54} color={Colors.placeholder} />
          <Text style={styles.empty}>No tasks yet — add one!</Text>
        </View>
      )}

      {/* ✅ Animated Toast Feedback */}
      <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
        <Text style={styles.toastText}>✅ Task added!</Text>
      </Animated.View>

      {/* 🔒 Auth Prompt */}
      <AuthPromptModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* 📝 Task Modal for detailed add */}
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
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: { marginRight: 8 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  dueText: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  descText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  empty: {
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
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
