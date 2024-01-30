'use client'
import { useState } from "react";
import styles from "./page.module.css";
import { createUser, signInWithEmail } from "../firebase/firebase";
import Link from "next/link";
import { setUserName } from "../firebase/functions";


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false)

    const onSubmit = (event: any) => {
        event.preventDefault()
        createUser(email, password, username, (uid: string) => {
            setErrorMessage("Signed Up Successfully");
            setSuccess(true);
            setUserName(username, uid)
        },
            (error: any) => {
                console.log(`error: ${error}`)
                setErrorMessage(error)
                setSuccess(false)
            });

    }

    const onChangeEmail = (event: any) => {
        setEmail(event.target.value)
    }
    const onChangePassword = (event: any) => {
        setPassword(event.target.value)
    }
    const onChangeUsername = (event: any) => {
        setUsername(event.target.value)
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <input placeholder="Username..." className={styles.input} type='text' onChange={onChangeUsername} value={username} required />
            <input placeholder="Email..." className={styles.input} type='email' onChange={onChangeEmail} value={email} required />
            <input placeholder="Password..." className={styles.input} type='password' onChange={onChangePassword} value={password} required />
            <p className={success ? styles.success : styles.fail}>{errorMessage}</p>
            <button className={styles.button} type="submit">SignUp</button>
            <Link href="/" className={styles.signUp}>Sign in?</Link>
        </form>
    )
}