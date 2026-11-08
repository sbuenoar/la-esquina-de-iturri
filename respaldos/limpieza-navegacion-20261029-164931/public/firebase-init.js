import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeGXVxVoRAUeg4V1HoGdPzP7_pt-ppV0s",
  authDomain: "la-esquina-de-iturri-tu-4ead7.firebaseapp.com",
  projectId: "la-esquina-de-iturri-tu-4ead7",
  storageBucket: "la-esquina-de-iturri-tu-4ead7.firebasestorage.app",
  messagingSenderId: "214069820325",
  appId: "1:214069820325:web:42cd0d44aeab421a58464c",
  measurementId: "G-5TC2EQ2XSC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function conectarUsuario() {
  if (auth.currentUser) return auth.currentUser;

  const resultado = await signInAnonymously(auth);
  return resultado.user;
}
