// app/(auth)/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword]=useState('');
  const router = useRouter();

  const onLogin = async () => {
    try {
      const res = await axios.post('http://<YOUR_DEV_HOST>:4000/api/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/(tabs)');
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <TextInput placeholder="Email" placeholderTextColor={Colors.placeholder} style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" placeholderTextColor={Colors.placeholder} secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={onLogin} />
      <Text style={styles.switch} onPress={()=>router.push('/(auth)/register')}>Create account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor: Colors.white, justifyContent:'center' },
  title: { fontSize:24, marginBottom:12, color: Colors.black },
  input: { borderWidth:1, borderColor: Colors.placeholder, padding:12, marginBottom:10, color: Colors.black },
  switch: { marginTop:12, color: Colors.placeholder }
});
