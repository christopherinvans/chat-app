import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRMaVHRbyD2NpeXpbXJcFasNCiJLhD1QM",
  authDomain: "chatapp-4fdcc.firebaseapp.com",
  projectId: "chatapp-4fdcc",
  storageBucket: "chatapp-4fdcc.appspot.com",
  messagingSenderId: "274539179086",
  appId: "1:274539179086:web:2ef388166f7679fab2a71f",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const auth = getAuth(app);
export default db;
