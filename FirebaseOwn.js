import * as firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCeHub6cyDb6dRTm5e4z9-tJMinDrnozUg",
    authDomain: "mybudget-614b1.firebaseapp.com",
    databaseURL: "https://mybudget-614b1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mybudget-614b1",
    storageBucket: "mybudget-614b1.appspot.com",
    messagingSenderId: "680055665761",
    appId: "1:680055665761:web:9a9a8e5c06d6faadc76620"
};

export default firebase.initializeApp(firebaseConfig);