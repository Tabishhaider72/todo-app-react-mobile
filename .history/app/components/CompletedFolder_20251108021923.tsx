import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  count: number;
  onPress: () => void;
  anim: Animated.Value;
};

export default function CompletedFolder({ count, onPress, anim }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="folder-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.text}>Completed</Text>
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 40,
    width: 150,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: Colors.light.tint },
});
