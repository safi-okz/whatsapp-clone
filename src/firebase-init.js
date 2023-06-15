import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8HmeGzZ7XXGPy3KKyeCLCcbhM_eb2siE",
    authDomain: "whatsapp-clone-389119.firebaseapp.com",
    projectId: "whatsapp-clone-389119",
    storageBucket: "whatsapp-clone-389119.appspot.com",
    messagingSenderId: "1035980481337",
    appId: "1:1035980481337:web:f6ac554b7ed2f5924fbee8"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db};