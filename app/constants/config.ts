import { Platform } from "react-native";

// 💡 Detect device type and set correct base URL
let baseURL = "http://localhost:4000"; // Default for web or iOS simulator

if (Platform.OS === "android") {
  // For Android emulator → maps "localhost" to 10.0.2.2
  baseURL = "http://10.0.2.2:4000";
}

// 👇 For physical devices (Android or iPhone), use your Wi-Fi IPv4
// Make sure both phone and computer are on the same Wi-Fi network.
if (!__DEV__) {
  baseURL = "http://192.168.29.100:4000";
}

export const API_BASE_URL = baseURL;
