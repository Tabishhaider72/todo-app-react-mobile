import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => void;
};

export default function TaskModal({ visible, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animate modal slide from bottom
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    onSave(title, description, date ? date.toISOString() : undefined, priority);
    setTitle('');
    setDescription('');
    setDate(null);
    setPriority('low');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalBox, { transform: [{ translateY }] }]}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Task title..."
            placeholderTextColor={Colors.placeholder}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor={Colors.placeholder}
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {['low', 'medium', 'high'].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[
                    styles.priorityBtn,
                    priority === lvl && styles.priorityActive,
                  ]}
                  onPress={() => setPriority(lvl as any)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === lvl && styles.priorityTextActive,
                    ]}
                  >
                    {lvl.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="calendar-outline" size={16} color={Colors.light.text} />
              <Text style={styles.dateText}>
                {date ? date.toLocaleDateString() : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Task</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 18,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 13,
    color: Colors.light.text,
  },
  section: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: Colors.light.tint,
  },
  priorityText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  priorityTextActive: {
    color: '#fff',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.light.text,
  },
  saveBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 14,
  },
});
