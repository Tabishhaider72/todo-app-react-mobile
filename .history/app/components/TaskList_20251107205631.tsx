import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/hooks/useTasks';

type Props = {
  tasks: Task[];
  toggleDone: (task: Task) => void;
  removeTask: (task: Task) => void;
};

function TaskItem({ item, toggleDone, removeTask, onCompleteAnimation }: any) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleComplete = () => {
    if (item.done) return;

    // Start throw animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 180, // throw down
        duration: 400,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      toggleDone(item);
      onCompleteAnimation && onCompleteAnimation();
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={[
          styles.taskCard,
          item.done && styles.taskDone,
        ]}
      >
        <View style={styles.taskContent}>
          <TouchableOpacity onPress={handleComplete}>
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

        {!item.done && (
          <TouchableOpacity onPress={() => removeTask(item)}>
            <Ionicons name="trash-outline" size={18} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

export default function TaskList({ tasks, toggleDone, removeTask }: Props) {
  const [showFolderAnim] = useState(new Animated.Value(0));

  const animateFolder = () => {
    Animated.sequence([
      Animated.timing(showFolderAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(showFolderAnim, { toValue: 0, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks.filter(t => !t.done)}
        keyExtractor={(item, i) => item._id ?? item.title + i}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            toggleDone={toggleDone}
            removeTask={removeTask}
            onCompleteAnimation={animateFolder}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle-outline" size={54} color={Colors.placeholder} />
            <Text style={styles.emptyText}>No tasks yet — add one!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 130 }}
      />

      {/* Floating Completed Folder */}
      <Animated.View
        style={[
          styles.completedFolder,
          {
            transform: [
              {
                scale: showFolderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.folderText}>.completed</Text>
      </Animated.View>
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  completedFolder: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: 40,
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  folderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
