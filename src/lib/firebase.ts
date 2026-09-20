import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnAdDCtSufm4C8iCwuajXGFMoXnDjzcvU",
  authDomain: "wsr-connect-c0541.firebaseapp.com",
  projectId: "wsr-connect-c0541",
  storageBucket: "wsr-connect-c0541.firebasestorage.app",
  messagingSenderId: "129451603355",
  appId: "1:129451603355:web:0cd1c479e59fb188109d3e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const authPersistence = setPersistence(
  auth,
  browserSessionPersistence,
);

export const db = getFirestore(app);