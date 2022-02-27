// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/auth';
import "firebase/firestore";
import 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvA1ekvsM5dg1q_mnrOj0c3ozwxHsr9OQ",
    authDomain: "reels-ea095.firebaseapp.com",
    projectId: "reels-ea095",
    storageBucket: "gs://reels-ea095.appspot.com/",
    messagingSenderId: "450072159320",
    appId: "1:450072159320:web:fbfe2fa551112ec388962d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const firestore = firebase.firestore();
export const database = {
    users: firestore.collection('users'),
    posts: firestore.collection('posts'),
    getTimeStamp: firebase.firestore.FieldValue.serverTimestamp()
}

export const storage = firebase.storage()