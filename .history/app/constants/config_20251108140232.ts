import { Platform } from "react-native";

// ✅ Use your local IP so your phone can reach your computer’s backend
let baseURL = "http://192.168.29.100:4000"; // 👈 this is your correct IP address

// Keep emulator fallback if ever using Android Studio
if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:4000";
}

// Optionally: You can override it manually when running on real device
// baseURL = "http://192.168.29.100:4000";

export const API_BASE_URL = baseURL;
