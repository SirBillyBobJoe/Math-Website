'use client'

import { signOut } from "../firebase/firebase";
import styles from "./page.module.css";

export default function Landing() {
    const onSignOut=()=>{
        window.location.href="/";
        signOut()
    }
    return (
        <p className={styles.signOut}onClick={onSignOut}>SignOut</p>
    )
}