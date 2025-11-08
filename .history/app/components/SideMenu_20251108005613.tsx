// components/SideMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_H = Dimensions.get('window').height;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const slideAnim = useRef(new Animated.Value(-SCREEN_H)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // 🟢 Check login status
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, [visible]);

  // 🎞️ Menu open/close animation
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

  // 🔴 Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    onClose();
    router.replace('/(auth)/login');
  };

  // 🟢 Login
  const handleLogin = () => {
    onClose();
    router.push('/(auth)/login');
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[styles.backdrop, { opacity: backdropAnim }]}
        />
      </TouchableWithoutFeedback>

      {/* Slide Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.headerHandle} />
        <Text style={styles.title}>Menu</Text>

        {/* ⚙️ Settings */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            onClose();
            router.push('/(tabs)/modal');
          }}
        >
          <Ionicons name="settings-outline" size={18} color={Colors.light.text} style={styles.icon} />
          <Text style={styles.rowText}>Settings</Text>
        </TouchableOpacity>

        {/* ℹ️ About */}
        <TouchableOpacity
          style={[styles.row, { marginTop: 12 }]}
          onPress={() => {
            onClose();
            router.push('/about');
          }}
        >
          <Ionicons name="information-circle-outline" size={18} color={Colors.light.text} style={styles.icon} />
          <Text style={styles.rowText}>About</Text>
        </TouchableOpacity>

        {/* 🔐 Login / Logout */}
        {isLoggedIn ? (
          <TouchableOpacity
            style={[styles.row, { marginTop: 16 }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={'#E74C3C'} style={styles.icon} />
            <Text style={[styles.rowText, { color: '#E74C3C' }]}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.row, { marginTop: 16 }]}
            onPress={handleLogin}
          >
            <Ionicons name="log-in-outline" size={18} color={Colors.light.text} style={styles.icon} />
            <Text style={styles.rowText}>Login</Text>
          </TouchableOpacity>
        )}
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
    height: SCREEN_H * 0.55,
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
