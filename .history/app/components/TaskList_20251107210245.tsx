import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Modal,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/hooks/useTasks';

type Props = {
  tasks: Task[];
  toggleDone: (task: Task) => void;
  removeTask: (task: Task) => void;
};

function TaskItem({ item, onComplete }: any) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) translateX.setValue(gesture.dx); // swipe left only
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -100) {
          Animated.timing(translateX, {
            toValue: -300,
            duration: 250,
            useNativeDriver: true,
          }).start(() => onComplete(item));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.taskCard, { transform: [{ translateX }] }]}
    >
      <View style={styles.taskContent}>
        <Ionicons name="ellipse-outline" size={20} color={Colors.light.text} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
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
      <TouchableOpacity onPress={() => onComplete(item)}>
        <Ionicons name="checkmark-done-outline" size={18} color="#2ECC71" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TaskList({ tasks, toggleDone, removeTask }: Props) {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [folderAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);

  const handleComplete = (task: Task) => {
    toggleDone(task);
    setCompletedTasks(prev => [...prev, { ...task, done: true }]);

    Animated.sequence([
      Animated.timing(folderAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(folderAnim, { toValue: 0, duration: 300, delay: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks.filter(t => !t.done)}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={({ item }) => <TaskItem item={item} onComplete={handleComplete} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle-outline" size={54} color={Colors.placeholder} />
            <Text style={styles.emptyText}>No tasks yet — add one!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* 🟤 Floating Completed Folder */}
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.completedFolder,
            {
              transform: [
                {
                  scale: folderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.folderText}>.completed</Text>
          {completedTasks.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{completedTasks.length}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* 📦 Completed Tasks Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Completed Tasks</Text>

            {completedTasks.length > 0 ? (
              <FlatList
                data={completedTasks}
                keyExtractor={(item, i) => item._id ?? item.title + i}
                renderItem={({ item }) => (
                  <View style={styles.completedItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
                    <Text style={styles.completedText}>{item.title}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setCompletedTasks(prev => prev.filter(t => t._id !== item._id))
                      }
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>No completed tasks yet.</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: { marginRight: 10 },
  taskTitle: { fontSize: 14, fontWeight: '500', color: Colors.light.text },
  dueText: { fontSize: 11, color: '#777', marginTop: 2 },
  descText: { fontSize: 12, color: '#888', marginTop: 2 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { color: Colors.placeholder, textAlign: 'center', marginTop: 10, fontSize: 14 },

  completedFolder: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: 40,
    width: 130,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  folderText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#000' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 12 },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  completedText: { flex: 1, marginLeft: 8, fontSize: 13, color: '#333' },
  closeBtn: {
    marginTop: 14,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
