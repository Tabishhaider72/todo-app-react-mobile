import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

const SCREEN_W = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const translateX = React.useRef(new Animated.Value(-SCREEN_W)).current;

  React.useEffect(() => {
    Animated.timing(translateX, { toValue: visible ? 0 : -SCREEN_W, duration: 200, useNativeDriver: true }).start();
  }, [visible]);

  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={[styles.overlay, { transform: [{ translateX }] }]}>
      <View style={styles.menu}>
        <Text style={styles.title}>Menu</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            onClose();
            router.push('/(tabs)/modal'); // example screen; change to your settings screen path if exists
          }}>
          <Ionicons name="settings-outline" size={18} color={Colors.light.text} style={{ marginRight: 10 }} />
          <Text style={styles.rowText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { marginTop: 12 }]}
          onPress={() => {
            onClose();
            // implement other actions if wanted
          }}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.light.text} style={{ marginRight: 10 }} />
          <Text style={styles.rowText}>About</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 999,
    flexDirection: 'row',
  },
  menu: {
    width: 260,
    backgroundColor: Colors.light.background,
    paddingTop: 40,
    paddingHorizontal: 14,
    paddingBottom: 20,
    borderRightWidth: 1,
    borderColor: '#e6e6e6',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: {
    fontSize: 13,
    color: Colors.light.text,
  },
});
