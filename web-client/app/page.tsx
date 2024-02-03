'use client'
import Image from "next/image";
import styles from "./page.module.css";
import SignIn from "./components/SignIn/signin";
import { setFormulas } from "./firebase/functions";
export default function Home() {
 
  return (
    <main>
      <SignIn/>
    </main>
  )
}
