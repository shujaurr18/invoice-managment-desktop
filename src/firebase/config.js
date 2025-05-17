import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFbX0UDFYpap4wQm_LDYHQCXisc54--fg",
  authDomain: "invoice-managment-bfb4c.firebaseapp.com",
  projectId: "invoice-managment-bfb4c",
  storageBucket: "invoice-managment-bfb4c.firebasestorage.app",
  messagingSenderId: "606507968855",
  appId: "1:606507968855:web:549e675e50d984170e7612",
  measurementId: "G-KSP5RSVP4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };