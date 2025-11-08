import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const router = useRouter();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) setPasswordHint('At least 8 characters');
    else if (!/[A-Z]/.test(pass)) setPasswordHint('Include at least one uppercase letter');
    else if (!/\d/.test(pass)) setPasswordHint('Include at least one number');
    else setPasswordHint('');
  };

  const onRegister = async () => {
    if (!email || !password) {
      alert('Please enter all fields');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
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
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3858/3858970.png' }}
          style={styles.illustration}
        />
        <Text style={styles.tagline}>Create Your Account 📝</Text>
        <Text style={styles.caption}>Join now and make your day productive</Text>
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
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
        </View>

        {passwordHint ? <Text style={styles.hint}>{passwordHint}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.switch}>
            Already have an account? <Text style={styles.link}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  caption: {
    fontSize: 13,
    color: Colors.placeholder,
    marginTop: 4,
  },
  form: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: { marginRight: 6 },
  input: {
    flex: 1,
    height: 38,
    fontSize: 13,
    color: Colors.light.text,
  },
  hint: {
    color: '#D9534F',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.button,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: Colors.buttonText,
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
    color: Colors.light.text,
    fontWeight: '600',
  },
});
