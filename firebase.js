// Import the functions you need from the SDKs you need
import { getApp, initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDd2WrGT0bni7qmJRX85mt5_Tnr1GAnH0I",
    authDomain: "i-can-be-abc-for-stem-96094.firebaseapp.com",
    projectId: "i-can-be-abc-for-stem-96094",
    storageBucket: "i-can-be-abc-for-stem-96094.firebasestorage.app",
    messagingSenderId: "454375777733",
    appId: "1:454375777733:web:e21f7e9bf276c22d0ed7ac",
    measurementId: "G-WST71ZXSZB"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) :  getApp();
// const analytics = getAnalytics(app);
const auth = getAuth(app)
auth.useDeviceLanguage();

export {auth};