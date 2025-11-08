// components/TaskRow.tsx
import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text } from 'react-native';
import { Task } from '@/hooks/useTasks';
import { Colors } from '@/constants/theme';

type Props = {
  item: Task;
  onComplete: (task: Task) => void;
};

export default function TaskRow({ item, onComplete }: Props) {
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
          }).start(() => onComplete(item));
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
});
