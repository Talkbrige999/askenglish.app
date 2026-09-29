import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// تنظیمات اتصال به دیتابیس آنلاین TalkBridge
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyTalkBridge2026",
  authDomain: "talkbridge-live.firebaseapp.com",
  databaseURL: "https://talkbridge-live-default-rtdb.firebaseio.com",
  projectId: "talkbridge-live",
  storageBucket: "talkbridge-live.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// جلوگیری از ساخت مجدد نمونه Firebase در Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);