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
                  outputRange: [1, 1.25], // smoother & slightly more noticeable pulse
                }),
              },
            ],
            shadowOpacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.35], // gives a glowing effect on pulse
            }),
          },
        ]}
      >
        <Ionicons
          name="folder-outline"
          size={22}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.text}>Completed</Text>

        {count > 0 && (
          <Animated.View
            style={[
              styles.badge,
              {
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3], // badge slightly pops too
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.badgeText}>{count}</Text>
          </Animated.View>
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
    shadowColor: Colors.light.tint,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.tint,
  },
});
