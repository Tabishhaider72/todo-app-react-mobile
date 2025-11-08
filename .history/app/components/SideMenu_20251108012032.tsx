// app/about.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Profile Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('@/assets/images/profile.jpg')}
          style={styles.profileImg}
        />
        <Text style={styles.name}>Tabish Haider</Text>
        <Text style={styles.role}>Full Stack Developer</Text>
        <Text style={styles.intro}>
          Hi 👋 I’m Tabish, a developer passionate about crafting clean,
          scalable, and impactful applications where every line of code serves
          real user value.
        </Text>
      </Animated.View>

      {/* About App */}
      <Animated.View
        style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={styles.sectionText}>
          This To-Do mobile app is built with <Text style={styles.highlight}>React Native (Expo)</Text> for the frontend
          and <Text style={styles.highlight}>Node.js + MongoDB</Text> for the backend. It allows users to create, manage,
          and organize daily tasks — supporting descriptions, priorities, and due
          dates with smooth UI and offline capability. Data syncs securely via REST APIs.
        </Text>
      </Animated.View>

      {/* Tech Stack */}
      <Animated.View
        style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: scaleAnim }] },
        ]}
      >
        <Text style={styles.sectionTitle}>Tech Stack</Text>
        <View style={styles.techList}>
          <Text style={styles.bullet}>⚛️ React Native (Expo)</Text>
          <Text style={styles.bullet}>🟢 Node.js + Express</Text>
          <Text style={styles.bullet}>🍃 MongoDB (Mongoose)</Text>
          <Text style={styles.bullet}>🔐 JWT Authentication</Text>
          <Text style={styles.bullet}>📦 AsyncStorage (Local Persistence)</Text>
          <Text style={styles.bullet}>⚙️ Axios + Modular API Hooks</Text>
          <Text style={styles.bullet}>🎨 Animated API + Custom UI</Text>
        </View>
      </Animated.View>

      {/* Architecture */}
      <Animated.View
        style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: scaleAnim }] },
        ]}
      >
        <Text style={styles.sectionTitle}>App Architecture</Text>
        <View style={styles.archBox}>
          <Text style={styles.archLine}>📱 React Native App</Text>
          <Ionicons name="arrow-down-outline" size={16} color={Colors.light.text} />
          <Text style={styles.archLine}>🌐 REST API (Axios)</Text>
          <Ionicons name="arrow-down-outline" size={16} color={Colors.light.text} />
          <Text style={styles.archLine}>🖥️ Node.js + Express Server</Text>
          <Ionicons name="arrow-down-outline" size={16} color={Colors.light.text} />
          <Text style={styles.archLine}>🗄️ MongoDB Database</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Developed by Tabish Haider</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  role: {
    fontSize: 13,
    color: Colors.placeholder,
    marginBottom: 8,
  },
  intro: {
    textAlign: 'center',
    color: Colors.light.text,
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 20,
  },
  highlight: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  techList: {
    marginTop: 4,
    gap: 4,
  },
  bullet: {
    fontSize: 13,
    color: Colors.light.text,
  },
  archBox: {
    alignItems: 'center',
    gap: 4,
  },
  archLine: {
    fontSize: 13,
    color: Colors.light.text,
    marginVertical: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: Colors.placeholder,
  },
});
