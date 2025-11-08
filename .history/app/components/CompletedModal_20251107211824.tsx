import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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

export default function CompletedModal({ visible, onClose, completedTasks, onRestore, onDelete }: Props) {
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
                  <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
                  <Text style={styles.text}>{item.title}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onRestore(item)}>
                      <Ionicons name="arrow-undo-outline" size={18} color="#4B7BEC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item)}>
                      <Ionicons name="trash-outline" size={18} color="#FF5252" />
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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: Colors.light.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  text: { flex: 1, marginLeft: 10, fontSize: 13, color: '#333' },
  actions: { flexDirection: 'row', gap: 10 },
  closeBtn: { backgroundColor: '#000', borderRadius: 8, padding: 10, marginTop: 10 },
  closeText: { color: '#fff', textAlign: 'center' },
  empty: { textAlign: 'center', color: Colors.placeholder, marginTop: 20 },
});
