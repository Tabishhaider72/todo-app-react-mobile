import React, { useState, useRef } from 'react';
import { View, FlatList, Animated, PanResponder, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { Task, useTasks } from '@/hooks/useTasks';
import CompletedModal from './CompletedModal';
import CompletedFolder from './CompletedFolder';

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

  const renderItem = ({ item }: { item: Task }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
        onPanResponderMove: (_, g) => {
          if (g.dx < 0) translateX.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx < -100) {
            Animated.timing(translateX, {
              toValue: -300,
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              markComplete(item);
              animateFolder();
            });
          } else {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          }
        },
      })
    ).current;

    return (
      <Animated.View {...panResponder.panHandlers} style={[styles.taskCard, { transform: [{ translateX }] }]}>
        <Text style={styles.taskTitle}>{item.title}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={renderItem}
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
  taskCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  taskTitle: { fontSize: 14, color: Colors.light.text },
  empty: { textAlign: 'center', color: Colors.placeholder, marginTop: 40 },
});
