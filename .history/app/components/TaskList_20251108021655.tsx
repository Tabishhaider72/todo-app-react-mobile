// components/TaskList.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/theme';
import CompletedModal from './CompletedModal';
import CompletedFolder from './CompletedFolder';
import { Task } from '@/hooks/useTasks';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  tasks: Task[];
  completedTasks: Task[];
  markComplete: (task: Task) => void;
  restoreTask: (task: Task) => void;
  removeCompleted: (task: Task) => void;
};

export default function TaskList({
  tasks,
  completedTasks,
  markComplete,
  restoreTask,
  removeCompleted,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const folderAnim = useRef(new Animated.Value(0)).current;

  const animateFolder = () => {
    Animated.sequence([
      Animated.timing(folderAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(folderAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleComplete = (task: Task) => {
    markComplete(task);
    animateFolder();
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Animated.View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleComplete(item)}>
          <Ionicons name="checkmark-circle-outline" size={22} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      {item.description ? (
        <Text style={styles.taskDesc}>{item.description}</Text>
      ) : null}

      <View style={styles.taskFooter}>
        <Text style={styles.taskDate}>📅 {new Date(item.date).toLocaleDateString()}</Text>
        <View style={[styles.priorityTag, getPriorityStyle(item.priority)]}>
          <Text style={styles.priorityText}>
            {item.priority ? item.priority.toUpperCase() : 'NORMAL'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { backgroundColor: '#ff6b6b' };
      case 'medium':
        return { backgroundColor: '#feca57' };
      case 'low':
        return { backgroundColor: '#1dd1a1' };
      default:
        return { backgroundColor: Colors.light.tint };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <FlatList
        data={tasks}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet — add one!</Text>}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
      />

      <CompletedFolder
        count={completedTasks.length}
        onPress={() => setModalVisible(true)}
        anim={folderAnim}
      />

      <CompletedModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        completedTasks={completedTasks}
        onRestore={restoreTask}
        onDelete={removeCompleted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  taskDesc: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.placeholder,
    lineHeight: 18,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  taskDate: {
    fontSize: 12,
    color: Colors.placeholder,
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: Colors.placeholder,
    marginTop: 60,
    fontSize: 13,
  },
});
