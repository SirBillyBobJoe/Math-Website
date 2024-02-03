'use client'
import { useState } from "react";
import styles from "./signin.module.css";
import { signInWithEmail } from "../../firebase/firebase";
import Link from "next/link";

export default function SignIn() {
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
                window.location.href = '/landing';
                console.log("Logged in successfully");
            }
        );
    };
    const onChangeEmail = (event: any) => {
        setEmail(event.target.value)
    }
    const onChangePassword = (event: any) => {
        setPassword(event.target.value)
    }
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <input placeholder="Email..." className={styles.input} type='email' onChange={onChangeEmail} value={email}required />
            <input placeholder="Password..." className={styles.input} type='password' onChange={onChangePassword} value={password}required />
            <p className={styles.error}>{errorMessage}</p>
            <button className={styles.button} type="submit">Login</button>
            <Link href="/SignUp" className={styles.signUp}>Sign Up</Link>
        </form>
    )
}