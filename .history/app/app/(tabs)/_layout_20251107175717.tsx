import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import SideMenu from '@/components/SideMenu';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
          headerShown: true,
          headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
          headerTitle: '',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 12 }} onPress={() => setMenuOpen(true)}>
              <Ionicons name="menu" size={22} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{ title: 'Home' /* icon handled by tab navigator if needed */ }}
        />
        <Tabs.Screen
          name="explore"
          options={{ title: 'Explore' }}
        />
      </Tabs>

      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
