import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import SideMenu from '@/components/SideMenu';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() => setMenuOpen(true)}
            >
              <Ionicons
                name="menu"
                size={22}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Tasks' }} />
      </Stack>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
