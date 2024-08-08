// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { serverConfig} from './serverConfig.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: serverConfig.FIREBASE_API_KEY,
  authDomain: serverConfig.FIREBASE_AUTH_DOMAIN,
  projectId: serverConfig.FIREBASE_PROJECT_ID,
  storageBucket: serverConfig.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: serverConfig.FIREBASE_MESSAGING_SENDER_ID,
  appId: serverConfig.FIREBASE_APP_ID,
  measurementId: serverConfig.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { firebaseApp, storage };
