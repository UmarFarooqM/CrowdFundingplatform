import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  
   apiKey: "AIzaSyCdgygMrFsyEK0h0mGYcShcZ2wMwMQW8dg",
  authDomain: "crowdfundingapp-1d8da.firebaseapp.com",
  projectId: "crowdfundingapp-1d8da",
  storageBucket: "crowdfundingapp-1d8da.firebasestorage.app",
  messagingSenderId: "304936288438",
  appId: "1:304936288438:web:7ab723fca0715b1039a617",
  measurementId: "G-BQ436SKTR5"

  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;