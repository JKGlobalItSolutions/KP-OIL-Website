import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { 
  getAuth, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAVP5xuThSQeQqai17M3uZCbeUKa7yBYhg",
  authDomain: "rettaipillayarpoojastore-c171a.firebaseapp.com",
  projectId: "rettaipillayarpoojastore-c171a",
  storageBucket: "rettaipillayarpoojastore-c171a.firebasestorage.app",
  messagingSenderId: "754329199351",
  appId: "1:754329199351:web:b8c77671266ab333dc29f2",
  measurementId: "G-KQTQVQLW02" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { 
  app,
  db, 
  storage, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};