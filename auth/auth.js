import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =========================
   TAB TOGGLE (THIS WAS MISSING)
========================= */
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.onclick = () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
};

signupTab.onclick = () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

/* =========================
   SIGNUP
========================= */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful 🎉");
    window.location.href = "/index.html";
  } catch (err) {
    alert(err.message);
  }
});

/* =========================
   LOGIN
========================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful ✅");
    window.location.href = "/index.html";
  } catch (err) {
    alert(err.message);
  }
});
