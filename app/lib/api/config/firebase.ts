import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "spatial-192f8.firebaseapp.com",
  projectId: "spatial-192f8",
  storageBucket: "spatial-192f8.firebasestorage.app",
  messagingSenderId: "123153971946",
  appId: "1:123153971946:web:53a8ab64f00cee813af593",
  measurementId: "G-4G3H70P3SG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {auth,db,storage}
export default app