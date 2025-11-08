// components/TaskList.tsx
import React, { useState, useRef } from 'react';
import { View, FlatList, Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/hooks/useTasks';
import CompletedModal from './CompletedModal';
import CompletedFolder from './CompletedFolder';
import TaskRow from './TaskRow';

export default function TaskList() {
  const { tasks, completedTasks, markComplete, restoreTask, removeCompleted } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const folderAnim = useRef(new Animated.Value(0)).current;

  const animateFolder = () => {
    Animated.sequence([
      Animated.timing(folderAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(folderAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleComplete = (task: any) => {
    markComplete(task);
    animateFolder();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={({ item }) => <TaskRow item={item} onComplete={handleComplete} />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet — add one!</Text>}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <CompletedFolder count={completedTasks.length} onPress={() => setModalVisible(true)} anim={folderAnim} />

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
  empty: { textAlign: 'center', color: Colors.placeholder, marginTop: 40 },
});
