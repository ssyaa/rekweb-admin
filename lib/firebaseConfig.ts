// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWvgvILZwXSj5cOkGnJDqZ_KcGNy145rU",
  authDomain: "sisfor-11.firebaseapp.com",
  projectId: "sisfor-11",
  storageBucket: "sisfor-11.firebasestorage.app",
  messagingSenderId: "789973673383",
  appId: "1:789973673383:web:5e0718bed9865ae26bc282",
  measurementId: "G-H76GE3HR7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
isSupported().then((supported) => {
  if(supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized")
  } else {
    console.warn("Firebase analytics is not supported in this environment")
  }
});



export { db, auth, signInWithEmailAndPassword};
