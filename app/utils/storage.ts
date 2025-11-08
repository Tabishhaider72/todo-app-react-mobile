import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  // 🟢 Save any data (auto stringified)
  set: async (key: string, value: any) => {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (err) {
      console.warn(`❌ Storage set failed for key "${key}":`, err);
    }
  },

  // 🟢 Get any data (auto parsed)
  get: async <T = any>(key: string): Promise<T | null> => {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (err) {
      console.warn(`❌ Storage get failed for key "${key}":`, err);
      return null;
    }
  },

  // 🟢 Remove key
  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn(`❌ Storage remove failed for key "${key}":`, err);
    }
  },

  // 🟢 Clear all app storage
  clear: async () => {
    try {
      await AsyncStorage.clear();
      console.log('🧹 Storage cleared');
    } catch (err) {
      console.warn('❌ Storage clear failed:', err);
    }
  },

  // 🟢 Check if key exists
  has: async (key: string): Promise<boolean> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (err) {
      console.warn(`❌ Storage has() failed:`, err);
      return false;
    }
  },
};
