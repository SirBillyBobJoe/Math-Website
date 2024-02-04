'use client'
import { useState } from "react";
import styles from "./signin.module.css";
import { signInWithEmail, signInWithProvider } from "../../firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (event: any) => {
        event.preventDefault();
        signInWithEmail(email, password,

            (error: any) => {
                setErrorMessage(error);
            },

            () => {
                setEmail("");
                setPassword("");
                setErrorMessage("")
                router.push('/landing')
                console.log("Logged in successfully");
            }
        );
    };

    const onSignInGoogle = () => {
        signInWithProvider('Google').then(()=>{
            router.push('/landing')
        })    .catch((error) => {

        console.error("Error logging in with Google", error);
        setErrorMessage(error.message || "Failed to log in with Google.");
    });
        
    }

    const onChangeEmail = (event: any) => {
        setEmail(event.target.value)
    }
    const onChangePassword = (event: any) => {
        setPassword(event.target.value)
    }
    return (
        <>
            <form className={styles.form} onSubmit={onSubmit}>
                <input placeholder="Email..." className={styles.input} type='email' onChange={onChangeEmail} value={email} required />
                <input placeholder="Password..." className={styles.input} type='password' onChange={onChangePassword} value={password} required />
                <p className={styles.error}>{errorMessage}</p>
                <button className={styles.button} type="submit">Login</button>
                <Link href="/SignUp" className={styles.signUp}>Sign Up</Link>
            </form>
            <button className={styles.button} type="button" onClick={onSignInGoogle}>Sign in With Google</button>
        </>
    )
}