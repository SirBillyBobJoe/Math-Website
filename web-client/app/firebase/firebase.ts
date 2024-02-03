// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWoVZ2nMQiXGUl3VbO8ISvnai9ZMOwVK0",
    authDomain: "mathwebsite-74c12.firebaseapp.com",
    projectId: "mathwebsite-74c12",
    storageBucket: "mathwebsite-74c12.appspot.com",
    messagingSenderId: "178356743416",
    appId: "1:178356743416:web:ef113477131d56fbe31f0d",
    measurementId: "G-DZLVHHXCV1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const functions = getFunctions();
export function createUser(email: string, password: string, displayName: string, Success: any, onError: any) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Profile updated successfully!");
            console.log(userCredential.user);
            Success(userCredential.user.uid)
        })
        .catch((error) => {

            onError(error.message)
        });
}

export function signInWithEmail(email: string, password: string, onError: any, onSuccess: any) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            console.log("logged In");
            onSuccess();
        })
        .catch((error) => {
            console.log(error.code);
            onError(error.message);
        });
}

export function signOut() {
    console.log("logged out")
    return auth.signOut();
}



/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (uid: string | null) => void) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {

            callback(user.uid);
        } else {

            callback(null);
        }
    });
}
