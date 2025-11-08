import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AddTaskInput({ value, onChange, onAdd, saving }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleAdd = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start(() => onAdd());
  };

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E6E6E6', Colors.light.tint],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <Ionicons name="create-outline" size={18} color={Colors.placeholder} style={styles.icon} />
        <TextInput
          placeholder="Add a task..."
          placeholderTextColor={Colors.placeholder}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={handleAdd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="done"
        />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handleAdd}
          style={[styles.addBtn, saving && { opacity: 0.6 }]}
          disabled={saving}
        >
          <Ionicons name="add" size={18} color={Colors.light.background} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    height: 40,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
  },
  addBtn: {
    backgroundColor: Colors.light.tint,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
