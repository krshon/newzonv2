import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoRY4oCGCFVnR1fQNzQV-BNMiQSLJQdIE",
  authDomain: "newzon-27caa.firebaseapp.com",
  projectId: "newzon-27caa",
  storageBucket: "newzon-27caa.appspot.com",
  messagingSenderId: "236643050450",
  appId: "1:236643050450:web:e0d55678d1612dd3e5de0b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
