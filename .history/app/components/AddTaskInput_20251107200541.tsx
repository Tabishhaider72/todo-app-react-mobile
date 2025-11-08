import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export default function AddTaskInput({ value, onChange, onAdd, saving }: any) {
  return (
    <View style={styles.addRow}>
      <TextInput
        placeholder="Add a task..."
        placeholderTextColor={Colors.placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />
      <TouchableOpacity onPress={onAdd} style={styles.addBtn} disabled={saving}>
        <Text style={styles.addBtnText}>{saving ? '...' : 'Add'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 13,
    color: Colors.light.text,
    height: 38,
  },
  addBtn: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.light.background, fontWeight: '700', fontSize: 13 },
});
