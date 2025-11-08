import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/(tabs)');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.illustrationBox}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png' }}
          style={styles.illustration}
        />
        <Text style={styles.tagline}>Welcome Back 👋</Text>
        <Text style={styles.caption}>Sign in to continue your task journey</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={16} color={Colors.placeholder} style={styles.icon} />
          <TextInput
            placeholder="Email address"
            placeholderTextColor={Colors.placeholder}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={16} color={Colors.placeholder} style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.switch}>
            Don't have an account? <Text style={styles.link}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 13,
    color: Colors.placeholder,
    marginTop: 2,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: '#FDFDFD',
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 38,
    fontSize: 13,
    color: Colors.black,
  },
  button: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  switch: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.placeholder,
  },
  link: {
    color: Colors.black,
    fontWeight: '600',
  },
});
