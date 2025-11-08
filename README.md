# 📱 Todo App – React Native + Node.js (Full-Stack Project)

A modern **full-stack productivity app** built with **React Native (Expo)** for the frontend and **Node.js + Express + MongoDB** for the backend.  
It allows users to **create, schedule, prioritize, and complete tasks** — even in **offline mode**.

---

## ✨ Features

✅ Create, edit, and delete tasks  
✅ Set **priority** (High / Medium / Low) and **due dates / time**  
✅ Works in **offline mode** (local storage via AsyncStorage)  
✅ Syncs with backend when online  
✅ Animated **Completed Folder** with pulse effect  
✅ Authentication (Login / Register / JWT Token)  
✅ Smooth transitions, modals, and theme consistency  
✅ Expo EAS Build ready (Android APK / AAB)  

---

## 🗂 Folder Structure

todo-app-react-mobile/
│
├── app/ # Frontend (React Native + Expo)
│ ├── components/ # Reusable UI components
│ ├── hooks/ # Custom hooks (e.g. useTasks)
│ ├── constants/ # Theme, Config (API URLs, Colors)
│ ├── (auth)/ # Login & Register screens
│ ├── (tabs)/ # Home & navigation setup
│ └── assets/ # Images and icons
│
├── server/ # Backend (Node.js + Express + MongoDB)
│ ├── routes/ # Auth & Task routes
│ ├── models/ # MongoDB schemas
│ ├── index.js # Server entry point
│ └── .env # Environment variables (not uploaded)
│
└── README.md # You're reading this


---

## 🧠 Tech Stack

### Frontend
- ⚛️ React Native (Expo SDK 51+)
- 🧭 Expo Router
- 💅 Animated API
- 💾 AsyncStorage (Offline caching)
- 🎨 Custom Theme + Vector Icons

### Backend
- 🟢 Node.js + Express
- 🍃 MongoDB Atlas (Mongoose v8+)
- 🔐 JWT Authentication
- 🔄 CORS + dotenv + bcryptjs

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Tabishhaider72/todo-app-react-mobile.git
cd todo-app-react-mobile
```
cd server
npm install
