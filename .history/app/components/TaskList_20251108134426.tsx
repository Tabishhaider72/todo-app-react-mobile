import React, { useState } from 'react';
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
import { Task, useTasks } from '@/hooks/useTasks';
import { Ionicons } from '@expo/vector-icons';

export default function TaskList() {
  const {
    tasks,
    completedTasks,
    markComplete,
    restoreTask,
    removeCompleted,
    animationTrigger, // ✅ from hook
  } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);

  const handleComplete = (task: Task) => {
    markComplete(task); // this automatically triggers animationTrigger
  };

  const renderTask = ({ item }: { item: Task }) => {
    const hasSchedule = !!item.dueDate;
    const scheduleTime = item.dueDate
      ? new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;

    return (
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
          <Text style={styles.taskDate}>
            📅 {new Date(item.dueDate || item.date || new Date()).toLocaleDateString()}
            {hasSchedule && ` ⏰ ${scheduleTime}`}
          </Text>

          <View style={[styles.priorityTag, getPriorityStyle(item.priority)]}>
            <Text style={styles.priorityText}>
              {item.priority ? item.priority.toUpperCase() : 'NORMAL'}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

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

      {/* ✅ Connected to animationTrigger for shared pulse */}
      <CompletedFolder
        count={completedTasks.length}
        onPress={() => setModalVisible(true)}
        anim={animationTrigger}
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
