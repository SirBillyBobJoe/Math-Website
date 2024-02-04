// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const functions = getFunctions();

export function createUser(email: string, password: string, Success: any, onError: any) {
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

/**
 * 
 * @param providerName - type of sign in we do either google, facebook or github
 * @returns a promise that resolves with the user's credentials.
 */
export function signInWithProvider(providerName: string) {
    let provider

    switch (providerName) {
        case 'Google':
            provider = new GoogleAuthProvider();
            break;
        default:
            throw new Error(`Unsupported provider: ${providerName}`);
    }
    return signInWithPopup(auth, provider);
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
