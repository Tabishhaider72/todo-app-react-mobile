import { Platform } from "react-native";

// Detect platform and set correct base URL
// Change "192.168.x.x" to your computer's local IP if testing on a real device

let baseURL = "http://localhost:4000"; // default for web & iOS

if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:4000"; // Android emulator
}

// Optional: Uncomment and replace if using Expo Go on physical device
// baseURL = "http://192.168.x.x:4000";

export const API_BASE_URL = baseURL;
