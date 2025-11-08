import { Platform } from "react-native";

let baseURL = "http://localhost:4000"; // default for web

if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:4000"; // Android emulator
}

// 👉 fallback for real devices
if (Platform.OS !== "web" && !__DEV__) {
  baseURL = "http://192.168.29.100:4000"; // your LAN IP
}

export const API_BASE_URL = baseURL;
