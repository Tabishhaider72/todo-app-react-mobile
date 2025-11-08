import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

const SCREEN_H = Dimensions.get('window').height;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-SCREEN_H)).current; // Start hidden (top)
  const backdropAnim = useRef(new Animated.Value(0)).current; // Backdrop fade

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_H,
          duration: 400,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Animated Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerHandle} />
        <Text style={styles.title}>Menu</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            onClose();
            router.push('/(tabs)/modal'); // Example: link to settings
          }}
        >
          <Ionicons name="settings-outline" size={18} color={Colors.light.text} style={styles.icon} />
          <Text style={styles.rowText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { marginTop: 12 }]}
          onPress={() => {
            onClose();
          }}
        >
          <Ionicons name="information-circle-outline" size={18} color={Colors.light.text} style={styles.icon} />
          <Text style={styles.rowText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { marginTop: 16 }]}
          onPress={() => {
            onClose();
            AsyncStorage.clear();
            router.replace('/(auth)/login');
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={'#E74C3C'} style={styles.icon} />
          <Text style={[styles.rowText, { color: '#E74C3C' }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.55, // Half of screen height
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  headerHandle: {
    width: 45,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 18,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  rowText: {
    fontSize: 13,
    color: Colors.light.text,
  },
});
