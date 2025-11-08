import { Platform } from "react-native";

let baseURL = "http://192.168.29.100:4000"; // 👈 this is your correct IP address

if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:4000";
}

// baseURL = "http://192.168.29.100:4000";

export const API_BASE_URL = baseURL;
