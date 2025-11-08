import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

type Props = {
  count: number;
  onPress: () => void;
  anim: Animated.Value;
};

export default function CompletedFolder({ count, onPress, anim }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.text}>.completed</Text>
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
    backgroundColor: '#000',
    borderRadius: 40,
    width: 130,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '600' },
  badge: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 6, marginLeft: 6 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#000' },
});
