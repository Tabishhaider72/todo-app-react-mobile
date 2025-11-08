import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinueOffline?: () => void; // ✅ new callback
  message?: string;
};

export default function AuthPromptModal({ visible, onClose, onContinueOffline, message }: Props) {
  const router = useRouter();

  const handleContinueOffline = () => {
    onClose();
    if (onContinueOffline) onContinueOffline(); // trigger parent toast
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Sign in required</Text>
          <Text style={styles.message}>
            {message || 'You need to sign in to save tasks to cloud. Sign in now?'}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                onClose();
                router.push('/(auth)/login');
              }}>
              <Text style={styles.actionText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.secondary]}
              onPress={() => {
                onClose();
                router.push('/(auth)/register');
              }}>
              <Text style={[styles.actionText, { color: Colors.placeholder }]}>Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleContinueOffline} style={styles.skip}>
            <Text style={[styles.actionText, { color: Colors.placeholder }]}>Continue offline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  box: { width: '86%', backgroundColor: Colors.light.background, padding: 16, borderRadius: 10 },
  title: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 6 },
  message: { fontSize: 13, color: Colors.light.text, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: Colors.light.tint, alignItems: 'center' },
  actionText: { color: Colors.light.background, fontSize: 13, fontWeight: '600' },
  secondary: { backgroundColor: Colors.light.background, borderWidth: 1, borderColor: '#E0E0E0' },
  skip: { marginTop: 10, alignItems: 'center' },
});
