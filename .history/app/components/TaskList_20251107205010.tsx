import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/hooks/useTasks';

type Props = {
  tasks: Task[];
  toggleDone: (task: Task) => void;
  removeTask: (task: Task) => void;
};

function TaskItem({ item, toggleDone, removeTask }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    toggleDone(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[styles.taskCard, item.done && styles.taskDone]}
      >
        <View style={styles.taskContent}>
          <TouchableOpacity onPress={onToggle}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={item.done ? '#2ECC71' : Colors.light.text}
              style={styles.icon}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.taskTitle,
                item.done && styles.taskTitleDone,
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
          <Ionicons name="trash-outline" size={18} color="#FF5252" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TaskList({ tasks, toggleDone, removeTask }: Props) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item, i) => item._id ?? item.title + i}
      renderItem={({ item }) => (
        <TaskItem item={item} toggleDone={toggleDone} removeTask={removeTask} />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-done-circle-outline" size={54} color={Colors.placeholder} />
          <Text style={styles.emptyText}>No tasks yet — add one!</Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
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
  taskDone: {
    backgroundColor: '#F1FFF4',
    borderColor: '#C8E6C9',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: { marginRight: 10 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.placeholder,
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
  emptyText: {
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
