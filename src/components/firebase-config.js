import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDC0rP4L1PMDwfxhOwl9QtlSwms50cLdzE",
    authDomain: "giftshop-25de0.firebaseapp.com",
    projectId: "giftshop-25de0",
    storageBucket: "giftshop-25de0.appspot.com",
    messagingSenderId: "197132983845",
    appId: "1:197132983845:web:8a281e6ebca95ee53829cc"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app);

setPersistence(auth, browserSessionPersistence);

export { auth, provider, database, collection, doc, setDoc, getDoc };