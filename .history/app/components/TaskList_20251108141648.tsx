import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import CompletedModal from './CompletedModal';
import CompletedFolder from './CompletedFolder';
import { Task, useTasks } from '@/hooks/useTasks';
import { Ionicons } from '@expo/vector-icons';

// ⚙️ Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TaskList() {
  const {
    tasks,
    completedTasks,
    markComplete,
    restoreTask,
    removeCompleted,
    animationTrigger,
  } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string | undefined) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleComplete = (task: Task) => markComplete(task);
  const handleDelete = (task: Task) => removeCompleted(task);

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

  const renderTask = ({ item }: { item: Task }) => {
    const expanded = expandedId === item._id;
    const hasSchedule = !!item.dueDate;
    const scheduleTime = item.dueDate
      ? new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;

    return (
      <Animated.View style={styles.taskCard}>
        {/* Collapsed header */}
        <TouchableOpacity onPress={() => handleToggleExpand(item._id)}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{item.title}</Text>

            <View style={styles.actions}>
              <View style={[styles.priorityTag, getPriorityStyle(item.priority)]}>
                <Text style={styles.priorityText}>
                  {item.priority ? item.priority.toUpperCase() : 'NORMAL'}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleComplete(item)} style={{ marginLeft: 8 }}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.light.tint} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 8 }}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded details */}
        {expanded && (
          <View style={styles.detailsBox}>
            {item.description ? (
              <Text style={styles.taskDesc}>{item.description}</Text>
            ) : (
              <Text style={styles.noDesc}>No description provided.</Text>
            )}

            <View style={styles.taskFooter}>
              <Text style={styles.taskDate}>
                📅 {new Date(item.dueDate || new Date()).toLocaleDateString()}
                {hasSchedule && ` ⏰ ${scheduleTime}`}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
    );
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

      {/* ✅ Folder for completed tasks */}
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
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  detailsBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    paddingTop: 10,
  },
  taskDesc: {
    fontSize: 13,
    color: Colors.placeholder,
    lineHeight: 18,
    marginBottom: 6,
  },
  noDesc: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 6,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: Colors.placeholder,
  },
  empty: {
    textAlign: 'center',
    color: Colors.placeholder,
    marginTop: 60,
    fontSize: 13,
  },
});
