import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Task } from '@/hooks/useTasks';

type Props = {
  visible: boolean;
  onClose: () => void;
  completedTasks: Task[];
  onRestore: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function CompletedModal({
  visible,
  onClose,
  completedTasks,
  onRestore,
  onDelete,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Completed Tasks</Text>

          {completedTasks.length > 0 ? (
            <FlatList
              data={completedTasks}
              keyExtractor={(item, i) => item._id ?? item.title + i}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    {item.description ? (
                      <Text style={styles.taskDesc}>{item.description}</Text>
                    ) : null}
                    <Text style={styles.taskDate}>
                      📅 {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <View style={[styles.priorityTag, getPriorityStyle(item.priority)]}>
                      <Text style={styles.priorityText}>
                        {item.priority ? item.priority.toUpperCase() : 'NORMAL'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onRestore(item)}>
                      <Ionicons name="arrow-undo-outline" size={20} color="#4B7BEC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item)}>
                      <Ionicons name="trash-outline" size={20} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.empty}>No completed tasks yet.</Text>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    color: Colors.light.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text },
  taskDesc: { fontSize: 12, color: Colors.placeholder, marginTop: 2 },
  taskDate: { fontSize: 11, color: Colors.placeholder, marginTop: 4 },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  priorityText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  actions: { justifyContent: 'space-around', marginLeft: 10 },
  closeBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  closeText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  empty: { textAlign: 'center', color: Colors.placeholder, marginTop: 20 },
});
